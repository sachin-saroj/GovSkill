import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.tests.helpers import complete_admin_login, complete_staff_registration

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_full_employee_journey(captured_emails):
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Step 1: Register employee and create admin user
            emp_data = await complete_staff_registration(
                client, "emp@gov.in", "pass12345", captured_emails
            )
            emp_token = emp_data["access_token"]
            emp_headers = {"Authorization": f"Bearer {emp_token}"}

            async with async_session_test() as session:
                from app.core.security import get_password_hash
                from app.models.user import User

                admin_user = User(
                    email="admin@gov.in",
                    password_hash=get_password_hash("adminpass123"),
                    role="admin",
                )
                session.add(admin_user)
                await session.commit()

            # Step 3: Read module
            mod_resp = await client.get("/api/modules/default", headers=emp_headers)
            assert mod_resp.status_code == 200
            mod_data = mod_resp.json()
            assert mod_data["title"] == "Digital Document Handling"
            assert "Lesson 1" in mod_data["content"]

            # Step 4: Ask AI Tutor
            tutor_resp = await client.post(
                "/api/tutor/ask",
                json={
                    "module_id": "default",
                    "question": "What is the minimum required certificate number length?",
                },
                headers=emp_headers,
            )
            assert tutor_resp.status_code == 200
            assert "answer" in tutor_resp.json()

            # Step 5: Fetch Quiz Questions (Ensure no answers are returned)
            quiz_resp = await client.get("/api/quiz/default", headers=emp_headers)
            assert quiz_resp.status_code == 200
            questions = quiz_resp.json()["questions"]
            assert len(questions) == 4
            for q in questions:
                assert "correct_option_index" not in q

            # Step 6: Submit Quiz Answers
            answers_payload = [
                {"question_id": q["id"], "selected_option_index": 1} for q in questions
            ]
            submit_resp = await client.post(
                "/api/quiz/default/submit",
                json={"answers": answers_payload},
                headers=emp_headers,
            )
            assert submit_resp.status_code == 200
            score_data = submit_resp.json()
            assert "score" in score_data
            assert score_data["total"] == 4

            # Step 7: Login Admin & View Attempt Log
            admin_data = await complete_admin_login(
                client, "admin@gov.in", "adminpass123", captured_emails
            )
            admin_token = admin_data["access_token"]
            admin_headers = {"Authorization": f"Bearer {admin_token}"}

            attempts_resp = await client.get("/api/admin/attempts", headers=admin_headers)
            assert attempts_resp.status_code == 200
            attempts_list = attempts_resp.json()
            assert len(attempts_list) == 1
            assert attempts_list[0]["user_email"] == "emp@gov.in"
            assert attempts_list[0]["module_title"] == "Digital Document Handling"
            assert attempts_list[0]["score"] == score_data["score"]

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
