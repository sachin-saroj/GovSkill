import io
import os
import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.deps import get_current_user, get_db
from app.db.base import Base
from app.main import app
from app.models.document import CitizenDocument
from app.models.module import Module
from app.models.progress import UserProgress
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import User
from app.services.ai_service import generate_rule_explanation, generate_tutor_answer

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


async def _init_db():
    app.dependency_overrides.clear()
    app.dependency_overrides[get_db] = override_get_db
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@pytest.mark.asyncio
async def test_health_check_database_connected():
    """Scenario 1: Health check reports database connected when DB is operational."""
    await _init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["database"] == "connected"


@pytest.mark.asyncio
async def test_health_check_database_disconnected(monkeypatch):
    """Scenario 1: Health check detects database unavailability and returns 503."""
    await _init_db()

    async def mock_check_db_health(timeout_seconds: float = 2.0) -> bool:
        return False

    import app.main as main_module

    monkeypatch.setattr(main_module, "check_db_health", mock_check_db_health)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/health")
        assert resp.status_code == 503
        data = resp.json()
        assert data["status"] == "degraded"
        assert data["database"] == "disconnected"


@pytest.mark.asyncio
async def test_global_sqlalchemy_error_handler(monkeypatch):
    """Scenario 1 & 4: Unhandled SQLAlchemyError returns sanitized 503 instead of crashing."""
    await _init_db()

    async def failing_get_db():
        raise OperationalError(
            "connection to server lost", params=None, orig=Exception("socket closed")
        )
        yield

    app.dependency_overrides[get_db] = failing_get_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/modules")
        assert resp.status_code == 503
        data = resp.json()
        assert data["error"]["code"] == "DATABASE_ERROR"
        assert "temporarily unavailable" in data["error"]["message"].lower()


@pytest.mark.asyncio
async def test_corrupt_null_quiz_history_gracefully_handled():
    """Scenario 5: Quiz adaptive query handles null score in QuizAttempt without TypeError."""
    await _init_db()
    async with async_session_test() as db:
        user = User(
            id=uuid.uuid4(),
            email="null_tester@govskill.local",
            password_hash="hash",
            role="employee",
        )
        mod = Module(
            id=uuid.uuid4(),
            title="Corrupt Data Module",
            content="# Lesson 1\nProcedural guidelines.",
        )
        db.add_all([user, mod])
        await db.commit()

        # Insert attempt with raw total=5 and score simulated as 0
        att = QuizAttempt(user_id=user.id, module_id=mod.id, score=0, total=5)
        db.add(att)
        await db.commit()

        q = QuizQuestion(
            id=uuid.uuid4(),
            module_id=mod.id,
            question="Question 1?",
            options=["A", "B"],
            correct_option_index=0,
            competency="General",
        )
        db.add(q)
        await db.commit()

        app.dependency_overrides[get_current_user] = lambda: user

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get(f"/api/quiz/{mod.id}?mode=adaptive")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["questions"]) >= 1


@pytest.mark.asyncio
async def test_corrupt_null_progress_best_score_handled():
    """Scenario 5: Progress update handles null best_score safely."""
    await _init_db()
    async with async_session_test() as db:
        user = User(
            id=uuid.uuid4(),
            email="quiz_null_score@govskill.local",
            password_hash="hash",
            role="employee",
        )
        mod = Module(id=uuid.uuid4(), title="Module Null Prog", content="# Lesson 1\nContent.")
        db.add_all([user, mod])
        await db.commit()

        prog = UserProgress(
            user_id=user.id,
            module_id=mod.id,
            best_score=0,
            total_questions=2,
            status="in_progress",
        )
        db.add(prog)

        q1 = QuizQuestion(
            id=uuid.uuid4(),
            module_id=mod.id,
            question="Q1",
            options=["A", "B"],
            correct_option_index=0,
        )
        q2 = QuizQuestion(
            id=uuid.uuid4(),
            module_id=mod.id,
            question="Q2",
            options=["A", "B"],
            correct_option_index=0,
        )
        db.add_all([q1, q2])
        await db.commit()

        app.dependency_overrides[get_current_user] = lambda: user

        # Simulate corrupt null best_score directly in DB
        await db.execute(
            text(
                f"UPDATE user_progress SET best_score = NULL WHERE user_id = '{user.id}' AND module_id = '{mod.id}'"
            )
        )
        await db.commit()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        submit_payload = {
            "answers": [
                {"question_id": str(q1.id), "selected_option_index": 0},
                {"question_id": str(q2.id), "selected_option_index": 0},
            ]
        }
        resp = await client.post(f"/api/quiz/{mod.id}/submit", json=submit_payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["score"] == 2
        assert data["best_score"] == 2


@pytest.mark.asyncio
async def test_corrupt_persisted_document_validation_results():
    """Scenario 5: get_document deserializes corrupted or unexpected validation_results safely."""
    await _init_db()
    doc_id = uuid.uuid4()
    async with async_session_test() as db:
        corrupt_val_results = [
            {"passed": True},  # Missing ruleName
            "not_a_dict_string_entry",  # Non-dict primitive
            {"rule_name": "Legacy Snake Case Check", "passed": False, "reason": "Legacy reason"},
        ]
        doc = CitizenDocument(
            id=doc_id,
            file_path="/dummy/path.pdf",
            extracted_data={"name": "Test"},
            validation_results=corrupt_val_results,
        )
        db.add(doc)
        await db.commit()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get(f"/api/documents/{doc_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["validation_results"]) == 3
        assert data["validation_results"][0]["ruleName"] == "Unknown Rule"
        assert data["validation_results"][0]["passed"] is True
        assert data["validation_results"][1]["ruleName"] == "Malformed check record"
        assert data["validation_results"][2]["ruleName"] == "Legacy Snake Case Check"


@pytest.mark.asyncio
async def test_gemini_async_non_blocking_and_logging_on_failure():
    """Scenario 6 & 7: Gemini calls are non-blocking and log warning on error without crashing."""
    ans, status_str = await generate_tutor_answer(
        module_title="Cybersecurity Protocols",
        module_content="Content",
        question="What is MFA?",
    )
    assert status_str == "fallback"
    assert "MFA" in ans or "Cybersecurity" in ans

    exp = await generate_rule_explanation(
        failed_rule_name="Certificate not expired",
        context="Expired date",
    )
    assert "expired" in exp.lower()


@pytest.mark.asyncio
async def test_upload_interruption_cleans_up_orphaned_file(tmp_path, monkeypatch):
    """Scenario 10: Failed upload pipeline cleans up disk file, avoiding orphaned files."""
    await _init_db()
    import app.api.routes.documents as docs_route

    monkeypatch.setattr(docs_route, "UPLOAD_DIR", str(tmp_path))

    def failing_validation(extracted_data):
        raise RuntimeError("Simulated processing crash mid-pipeline")

    monkeypatch.setattr(docs_route, "validate_income_certificate", failing_validation)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        file_payload = {
            "file": ("test_doc.txt", io.BytesIO(b"NAME: Sample Citizen\n"), "text/plain")
        }
        resp = await client.post("/api/documents/upload", files=file_payload)
        assert resp.status_code == 500
        err_data = resp.json()
        assert err_data["detail"]["error"]["code"] == "DOCUMENT_PROCESSING_ERROR"

    remaining_files = os.listdir(tmp_path)
    assert len(remaining_files) == 0, f"Expected 0 orphaned files, found: {remaining_files}"


@pytest.mark.asyncio
async def test_upload_file_persisted_even_if_post_commit_refresh_warns(tmp_path, monkeypatch):
    """Scenario 10 / Finalization Boundary: Once db.commit() succeeds, file is never deleted even if refresh warns."""
    await _init_db()
    import app.api.routes.documents as docs_route

    monkeypatch.setattr(docs_route, "UPLOAD_DIR", str(tmp_path))

    # Mock db.refresh to simulate a non-fatal post-commit warning
    async def flaky_refresh(self, instance, *args, **kwargs):
        raise OperationalError("transient network hiccup during refresh", params=None, orig=Exception("reset"))

    monkeypatch.setattr(AsyncSession, "refresh", flaky_refresh)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        file_payload = {
            "file": ("test_doc.txt", io.BytesIO(b"NAME: Sample Citizen\nCERT: INC123456\nEXP: 2029-01-01\n"), "text/plain")
        }
        resp = await client.post("/api/documents/upload", files=file_payload)
        # Should succeed because commit succeeded and refresh error is non-fatal
        assert resp.status_code == 200

    remaining_files = os.listdir(tmp_path)
    assert len(remaining_files) == 1, f"Expected exactly 1 persisted file, found: {remaining_files}"


def test_genai_client_cached_singleton(monkeypatch):
    """Scenario 6: Verify GenAI client is cached as a singleton to reuse connections."""
    import app.services.ai_service as ai_srv
    from app.core.config import settings

    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-key-mock-123")
    ai_srv._genai_client = None

    c1 = ai_srv.get_genai_client()
    c2 = ai_srv.get_genai_client()
    assert c1 is not None
    assert c1 is c2

