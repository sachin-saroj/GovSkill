import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.routes.quiz import SEED_QUESTIONS
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.progress import UserProgress
from app.models.quiz import QuizAttempt

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_quiz_competency_assessment_engine():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Setup employee account & obtain token
            reg_resp = await client.post(
                "/api/auth/register",
                json={"email": "quiz_emp@gov.in", "password": "pass123456"},
            )
            assert reg_resp.status_code == 201

            login_resp = await client.post(
                "/api/auth/login",
                json={"email": "quiz_emp@gov.in", "password": "pass123456"},
            )
            token = login_resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            MODULE_1_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")
            mod1_questions = [sq for sq in SEED_QUESTIONS if sq["module_id"] == MODULE_1_ID]

            # 2. Question Retrieval & Answer Key Stripping & Competency Tags
            q_resp = await client.get("/api/quiz/default", headers=headers)
            assert q_resp.status_code == 200
            q_data = q_resp.json()
            assert "questions" in q_data
            assert len(q_data["questions"]) == len(mod1_questions)

            for q in q_data["questions"]:
                assert "id" in q
                assert "question" in q
                assert "options" in q
                assert "competency" in q
                assert q["competency"] is not None
                assert (
                    "correct_option_index" not in q
                )  # Strict security check: answer key stripped!

            # 3. Invalid Module ID Retrieval (returns 400 for bad format, 404 for unknown UUID)
            invalid_mod_resp = await client.get("/api/quiz/invalid-uuid-string", headers=headers)
            assert invalid_mod_resp.status_code == 400

            unknown_uuid = str(uuid.uuid4())
            unknown_mod_resp = await client.get(f"/api/quiz/{unknown_uuid}", headers=headers)
            assert unknown_mod_resp.status_code == 404

            # 4. Attempt 1: Submit All Correct Answers
            correct_answers = [
                {"question_id": str(sq["id"]), "selected_option_index": sq["correct_option_index"]}
                for sq in mod1_questions
            ]
            submit_correct_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": correct_answers},
                headers=headers,
            )
            assert submit_correct_resp.status_code == 200
            correct_res = submit_correct_resp.json()
            assert correct_res["score"] == len(mod1_questions)
            assert correct_res["total"] == len(mod1_questions)
            assert correct_res["percentage"] == 100
            assert correct_res["passed"] is True
            assert correct_res["attempt_number"] == 1
            assert correct_res["best_score"] == len(mod1_questions)
            assert correct_res["status"] == "certified"
            assert len(correct_res["competency_breakdown"]) >= 2
            assert len(correct_res["strengths"]) >= 2
            assert len(correct_res["weak_areas"]) == 0
            assert "Mastery achieved" in correct_res["recommended_action"]

            # Verify Score Persistence in DB
            async with async_session_test() as session:
                attempts = (await session.execute(select(QuizAttempt))).scalars().all()
                assert len(attempts) == 1
                assert attempts[0].score == len(mod1_questions)
                assert attempts[0].total == len(mod1_questions)

                prog = (await session.execute(select(UserProgress))).scalar_one()
                assert prog.best_score == len(mod1_questions)
                assert prog.status == "certified"

            # 5. Attempt 2: Partial Answers (Demonstrate attempt count & weak area identification)
            # Answer only 1 question correctly out of 4 (25%)
            partial_answers = [
                {
                    "question_id": str(mod1_questions[0]["id"]),
                    "selected_option_index": mod1_questions[0]["correct_option_index"],
                },
                {
                    "question_id": str(mod1_questions[1]["id"]),
                    "selected_option_index": (mod1_questions[1]["correct_option_index"] + 1) % 4,
                },
                {
                    "question_id": str(mod1_questions[2]["id"]),
                    "selected_option_index": (mod1_questions[2]["correct_option_index"] + 1) % 4,
                },
                {
                    "question_id": str(mod1_questions[3]["id"]),
                    "selected_option_index": (mod1_questions[3]["correct_option_index"] + 1) % 4,
                },
            ]
            submit_partial_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": partial_answers},
                headers=headers,
            )
            assert submit_partial_resp.status_code == 200
            partial_res = submit_partial_resp.json()
            assert partial_res["score"] == 1
            assert partial_res["percentage"] == 25
            assert partial_res["passed"] is False
            assert partial_res["attempt_number"] == 2
            assert partial_res["best_score"] == 4  # Preserves best historical score
            assert len(partial_res["weak_areas"]) > 0

            # 6. Security Test: Cross-module question ID injection & Duplicate Answers
            # Inject a question from Module 2 into Module 1 submission
            mod2_question = [sq for sq in SEED_QUESTIONS if sq["module_id"] != MODULE_1_ID][0]
            injected_answers = [
                {
                    "question_id": str(mod1_questions[0]["id"]),
                    "selected_option_index": mod1_questions[0]["correct_option_index"],
                },
                {
                    "question_id": str(mod1_questions[0]["id"]),
                    "selected_option_index": mod1_questions[0]["correct_option_index"],
                },  # Duplicate
                {
                    "question_id": str(mod2_question["id"]),
                    "selected_option_index": mod2_question["correct_option_index"],
                },  # Foreign question
            ]
            injected_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": injected_answers},
                headers=headers,
            )
            assert injected_resp.status_code == 200
            inj_res = injected_resp.json()
            # Foreign question is ignored; duplicate is deduplicated; score is strictly 1 / 4
            assert inj_res["score"] == 1
            assert inj_res["total"] == len(mod1_questions)

            # 7. Security Test: Unauthorized submission
            unauth_resp = await client.post("/api/quiz/default/submit", json={"answers": []})
            assert unauth_resp.status_code == 401

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
