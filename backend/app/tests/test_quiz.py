import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.routes.quiz import SEED_QUESTIONS
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.quiz import QuizAttempt

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_quiz_full_functionality():
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

            # 2. Question Retrieval & Answer Key Stripping
            q_resp = await client.get("/api/quiz/default", headers=headers)
            assert q_resp.status_code == 200
            q_data = q_resp.json()
            assert "questions" in q_data
            assert len(q_data["questions"]) == len(mod1_questions)

            for q in q_data["questions"]:
                assert "id" in q
                assert "question" in q
                assert "options" in q
                assert (
                    "correct_option_index" not in q
                )  # Strict security check: answer key stripped!

            q_data["questions"]

            # 3. Invalid Module ID Retrieval (returns 400)
            invalid_mod_resp = await client.get("/api/quiz/invalid-uuid-string", headers=headers)
            assert invalid_mod_resp.status_code == 400
            assert invalid_mod_resp.json()["detail"]["error"]["code"] == "INVALID_MODULE_ID"

            # 4. Submit All Correct Answers
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

            # Verify Score Persistence in DB
            async with async_session_test() as session:
                attempts = (await session.execute(select(QuizAttempt))).scalars().all()
                assert len(attempts) == 1
                assert attempts[0].score == len(mod1_questions)
                assert attempts[0].total == len(mod1_questions)

            # 5. Submit All Wrong Answers
            wrong_answers = [
                {
                    "question_id": str(sq["id"]),
                    "selected_option_index": (sq["correct_option_index"] + 1) % 4,
                }
                for sq in mod1_questions
            ]

            submit_wrong_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": wrong_answers},
                headers=headers,
            )
            assert submit_wrong_resp.status_code == 200
            assert submit_wrong_resp.json()["score"] == 0

            # 6. Partial Submission (answering 3 out of 8 questions correctly)
            partial_answers = correct_answers[:3]
            partial_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": partial_answers},
                headers=headers,
            )
            assert partial_resp.status_code == 200
            assert partial_resp.json()["score"] == 3
            assert partial_resp.json()["total"] == len(mod1_questions)

            # 7. Invalid Question ID & Out-of-Bounds Option Index
            fake_q_id = str(uuid.uuid4())
            invalid_submission = [
                {"question_id": fake_q_id, "selected_option_index": 0},
                {
                    "question_id": str(SEED_QUESTIONS[0]["id"]),
                    "selected_option_index": 99,
                },  # out-of-bounds
            ]
            invalid_sub_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": invalid_submission},
                headers=headers,
            )
            assert invalid_sub_resp.status_code == 200
            assert invalid_sub_resp.json()["score"] == 0

            # 8. Empty Answers Payload
            empty_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": []},
                headers=headers,
            )
            assert empty_resp.status_code == 200
            assert empty_resp.json()["score"] == 0
            assert empty_resp.json()["total"] == len(mod1_questions)

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
