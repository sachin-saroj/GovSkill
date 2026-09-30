import io
import os
import shutil
import uuid
from datetime import datetime, timedelta, timezone
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.deps import get_current_admin_user, get_current_user, get_db
from app.core.security import create_access_token, get_password_hash
from app.db.base import Base
from app.main import app
from app.models.document import CitizenDocument
from app.models.module import Module
from app.models.quiz import QuizQuestion
from app.models.user import User
from app.services.retention_service import purge_aged_documents

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
async def test_scenario_11_expired_jwt_rejected():
    """Scenario 11: Expired JWT is rejected with 401 UNAUTHORIZED."""
    await _init_db()
    expired_token = create_access_token(
        subject=uuid.uuid4(),
        role="employee",
        expires_delta=timedelta(seconds=-30),
    )
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get(
            "/api/auth/me", headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert resp.status_code == 401
        data = resp.json()
        assert data["detail"]["error"]["code"] == "UNAUTHORIZED"


@pytest.mark.asyncio
async def test_scenario_13_password_change_revokes_old_tokens():
    """Scenario 13: Changing password increments token_version and immediately revokes pre-change tokens."""
    await _init_db()
    user_id = uuid.uuid4()
    async with async_session_test() as db:
        user = User(
            id=user_id,
            email="revocation_test@govskill.local",
            password_hash=get_password_hash("OldPassword123!"),
            role="employee",
            token_version=1,
            is_active=True,
        )
        db.add(user)
        await db.commit()

    # Old token issued at token_version 1
    old_token = create_access_token(subject=user_id, role="employee", token_version=1)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Step 1: Old token works
        resp = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {old_token}"})
        assert resp.status_code == 200

        # Step 2: Change password using old token
        change_payload = {
            "current_password": "OldPassword123!",
            "new_password": "NewPassword456!",
        }
        change_resp = await client.post(
            "/api/auth/change-password",
            json=change_payload,
            headers={"Authorization": f"Bearer {old_token}"},
        )
        assert change_resp.status_code == 200

        # Step 3: Old token is now rejected because token_version was incremented
        check_resp = await client.get(
            "/api/auth/me", headers={"Authorization": f"Bearer {old_token}"}
        )
        assert check_resp.status_code == 401
        data = check_resp.json()
        assert data["detail"]["error"]["code"] == "TOKEN_REVOKED"


@pytest.mark.asyncio
async def test_scenario_13_disabled_account_rejected():
    """Scenario 13: Deactivated / disabled user account is immediately rejected with 401 ACCOUNT_DISABLED."""
    await _init_db()
    user_id = uuid.uuid4()
    async with async_session_test() as db:
        user = User(
            id=user_id,
            email="disabled_test@govskill.local",
            password_hash=get_password_hash("Pass123!"),
            role="employee",
            token_version=1,
            is_active=False,
        )
        db.add(user)
        await db.commit()

    token = create_access_token(subject=user_id, role="employee", token_version=1)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 401
        data = resp.json()
        assert data["detail"]["error"]["code"] == "ACCOUNT_DISABLED"


@pytest.mark.asyncio
async def test_scenario_15_disk_exhaustion_preflight(tmp_path, monkeypatch):
    """Scenario 15: Upload pre-flight disk check rejects when storage is near capacity (507 Insufficient Storage)."""
    await _init_db()
    import app.api.routes.documents as docs_route

    monkeypatch.setattr(docs_route, "UPLOAD_DIR", str(tmp_path))

    # Mock shutil.disk_usage to return 5MB free (below 20MB threshold)
    def mock_low_disk_usage(path):
        return shutil._ntuple_diskusage(1000 * 1024 * 1024, 995 * 1024 * 1024, 5 * 1024 * 1024)

    monkeypatch.setattr(shutil, "disk_usage", mock_low_disk_usage)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        file_payload = {
            "file": (
                "sample.txt",
                io.BytesIO(b"NAME: Jane Doe\nCERT: INC123456\nEXP: 2028-01-01\n"),
                "text/plain",
            )
        }
        resp = await client.post("/api/documents/upload", files=file_payload)
        assert resp.status_code == 507
        err_data = resp.json()
        assert err_data["detail"]["error"]["code"] == "STORAGE_EXHAUSTED"


@pytest.mark.asyncio
async def test_scenario_18_citizen_upload_idempotency(tmp_path, monkeypatch):
    """Scenario 18: Uploading identical file within 15 seconds returns cached response without reprocessing."""
    await _init_db()
    import app.api.routes.documents as docs_route

    monkeypatch.setattr(docs_route, "UPLOAD_DIR", str(tmp_path))
    docs_route._recent_uploads.clear()

    payload_bytes = b"NAME: Citizen Duplicate\nCERT: INC998877\nEXP: 2029-05-01\n"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        file_payload_1 = {"file": ("doc.txt", io.BytesIO(payload_bytes), "text/plain")}
        resp1 = await client.post("/api/documents/upload", files=file_payload_1)
        assert resp1.status_code == 200
        doc1 = resp1.json()

        file_payload_2 = {"file": ("doc.txt", io.BytesIO(payload_bytes), "text/plain")}
        resp2 = await client.post("/api/documents/upload", files=file_payload_2)
        assert resp2.status_code == 200
        doc2 = resp2.json()

        # Both responses return the identical document_id
        assert doc1["document_id"] == doc2["document_id"]

    # Verify only 1 physical file was created on disk
    files_on_disk = os.listdir(tmp_path)
    assert len(files_on_disk) == 1


@pytest.mark.asyncio
async def test_scenario_18_quiz_submission_debouncing():
    """Scenario 18: Rapid re-submission of identical quiz answers within 3 seconds is debounced."""
    await _init_db()
    async with async_session_test() as db:
        user = User(
            id=uuid.uuid4(),
            email="quiz_debounce@govskill.local",
            password_hash="hash",
            role="employee",
            token_version=1,
            is_active=True,
        )
        mod = Module(id=uuid.uuid4(), title="Module Debounce", content="# Lesson 1\nContent.")
        q = QuizQuestion(
            id=uuid.uuid4(),
            module_id=mod.id,
            question="Question 1?",
            options=["A", "B"],
            correct_option_index=0,
        )
        db.add_all([user, mod, q])
        await db.commit()

        app.dependency_overrides[get_current_user] = lambda: user

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        submit_payload = {"answers": [{"question_id": str(q.id), "selected_option_index": 0}]}
        resp1 = await client.post(f"/api/quiz/{mod.id}/submit", json=submit_payload)
        assert resp1.status_code == 200
        data1 = resp1.json()

        # Rapid duplicate submission
        resp2 = await client.post(f"/api/quiz/{mod.id}/submit", json=submit_payload)
        assert resp2.status_code == 200
        data2 = resp2.json()

        assert data1["score"] == data2["score"]
        assert data1["attempt_number"] == data2["attempt_number"]


@pytest.mark.asyncio
async def test_scenario_19_document_retention_purge(tmp_path):
    """Scenario 19: Retention service deletes records older than cutoff and safely unlinks disk files."""
    await _init_db()

    # Create dummy files on disk
    old_file = tmp_path / "old_doc.pdf"
    old_file.write_text("Old Document Content")
    new_file = tmp_path / "new_doc.pdf"
    new_file.write_text("New Document Content")

    now = datetime.now(timezone.utc)
    old_date = now - timedelta(days=45)
    new_date = now - timedelta(days=5)

    async with async_session_test() as db:
        doc_old = CitizenDocument(
            id=uuid.uuid4(),
            file_path=str(old_file),
            extracted_data={"name": "Old Citizen"},
            uploaded_at=old_date,
        )
        doc_new = CitizenDocument(
            id=uuid.uuid4(),
            file_path=str(new_file),
            extracted_data={"name": "New Citizen"},
            uploaded_at=new_date,
        )
        db.add_all([doc_old, doc_new])
        await db.commit()

        # Run purge with 30-day retention
        summary = await purge_aged_documents(db=db, retention_days=30)
        assert summary["records_purged"] == 1
        assert summary["files_deleted"] == 1
        assert summary["errors_count"] == 0

        # Verify old file unlinked, new file remains
        assert not old_file.exists()
        assert new_file.exists()

        # Verify database record deleted
        res = await db.execute(select(CitizenDocument).where(CitizenDocument.id == doc_old.id))
        assert res.scalar_one_or_none() is None
        res_new = await db.execute(select(CitizenDocument).where(CitizenDocument.id == doc_new.id))
        assert res_new.scalar_one_or_none() is not None


@pytest.mark.asyncio
async def test_scenario_19_admin_maintenance_purge_endpoint():
    """Scenario 19: Admin maintenance endpoint runs purge for admin users."""
    await _init_db()
    admin_user = User(
        id=uuid.uuid4(),
        email="super_admin@govskill.local",
        password_hash="hash",
        role="admin",
        token_version=1,
        is_active=True,
    )
    app.dependency_overrides[get_current_admin_user] = lambda: admin_user

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/admin/maintenance/purge-documents?retention_days=30")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert data["retention_days"] == 30
        assert "records_purged" in data
