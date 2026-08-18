import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_employee_skill_tracking_pipeline():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Seed admin and employee users
        async with async_session_test() as session:
            admin_user = User(email="admin_skills@gov.in", password_hash=get_password_hash("adminpass123"), role="admin")
            emp_user = User(email="emp_skills@gov.in", password_hash=get_password_hash("emppass123"), role="employee")
            session.add_all([admin_user, emp_user])
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Login tokens
            admin_login = await client.post("/api/auth/login", json={"email": "admin_skills@gov.in", "password": "adminpass123"})
            admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

            emp_login = await client.post("/api/auth/login", json={"email": "emp_skills@gov.in", "password": "emppass123"})
            emp_headers = {"Authorization": f"Bearer {emp_login.json()['access_token']}"}

            # 1. Fetch initial skill progress (0% certified)
            init_prog = await client.get("/api/progress/my-skills", headers=emp_headers)
            assert init_prog.status_code == 200
            data = init_prog.json()
            assert data["overall_skill_score"] == 0
            assert data["certified_modules"] == 0
            assert len(data["skills"]) >= 4

            module_1_id = data["skills"][0]["module_id"]

            # 2. Mark module 1 lessons completed
            complete_resp = await client.post(f"/api/progress/modules/{module_1_id}/complete-lessons", headers=emp_headers)
            assert complete_resp.status_code == 200
            comp_data = complete_resp.json()
            assert comp_data["lessons_completed"] is True
            assert comp_data["status"] == "in_progress"

            # 3. Submit passing quiz for module 1 (100% correct)
            quiz_get = await client.get(f"/api/quiz/{module_1_id}", headers=emp_headers)
            assert quiz_get.status_code == 200
            questions = quiz_get.json()["questions"]

            # Get question answer indices from admin route
            admin_q = await client.get(f"/api/admin/modules/{module_1_id}/questions", headers=admin_headers)
            ans_key = {q["id"]: q["correct_option_index"] for q in admin_q.json()}

            answers = [{"question_id": q["id"], "selected_option_index": ans_key[q["id"]]} for q in questions]
            sub_resp = await client.post(f"/api/quiz/{module_1_id}/submit", json={"answers": answers}, headers=emp_headers)
            assert sub_resp.status_code == 200
            assert sub_resp.json()["score"] == len(questions)

            # 4. Verify progress updated to "certified"
            updated_prog = await client.get("/api/progress/my-skills", headers=emp_headers)
            assert updated_prog.status_code == 200
            u_data = updated_prog.json()
            assert u_data["certified_modules"] == 1
            assert u_data["overall_skill_score"] >= 25

            target_skill = next(s for s in u_data["skills"] if s["module_id"] == module_1_id)
            assert target_skill["status"] == "certified"
            assert target_skill["lessons_completed"] is True
            assert target_skill["score_percentage"] == 100

            # 5. Fetch Admin Skills Overview
            admin_overview = await client.get("/api/progress/admin/skills-overview", headers=admin_headers)
            assert admin_overview.status_code == 200
            assert admin_overview.json()["total_certifications"] == 1

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
