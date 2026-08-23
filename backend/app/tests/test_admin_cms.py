import uuid
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
async def test_admin_cms_module_and_quiz_crud():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Seed admin and employee users
        async with async_session_test() as session:
            admin_user = User(
                email="admin_cms@gov.in",
                password_hash=get_password_hash("adminpass123"),
                role="admin",
            )
            emp_user = User(
                email="emp_cms@gov.in",
                password_hash=get_password_hash("emppass123"),
                role="employee",
            )
            session.add_all([admin_user, emp_user])
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Login tokens
            admin_login = await client.post(
                "/api/auth/login", json={"email": "admin_cms@gov.in", "password": "adminpass123"}
            )
            admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

            emp_login = await client.post(
                "/api/auth/login", json={"email": "emp_cms@gov.in", "password": "emppass123"}
            )
            emp_headers = {"Authorization": f"Bearer {emp_login.json()['access_token']}"}

            # 1. Non-admin employee attempting CMS route -> 403 FORBIDDEN
            forbidden_create = await client.post(
                "/api/admin/modules",
                json={"title": "Hacker Module", "content": "Sample content text"},
                headers=emp_headers,
            )
            assert forbidden_create.status_code == 403

            # 2. Admin Create Module -> 201 CREATED
            create_mod_resp = await client.post(
                "/api/admin/modules",
                json={
                    "title": "Cybersecurity Advanced Training",
                    "content": "# Lesson 1: Network Security Best Practices\nEmployees must maintain high security standards.",
                },
                headers=admin_headers,
            )
            assert create_mod_resp.status_code == 201
            mod_data = create_mod_resp.json()
            assert mod_data["title"] == "Cybersecurity Advanced Training"
            module_id = mod_data["id"]

            # 3. Employee List Modules -> includes newly created module
            list_mod_resp = await client.get("/api/modules", headers=emp_headers)
            assert list_mod_resp.status_code == 200
            modules = list_mod_resp.json()
            assert len(modules) >= 4  # 4 seeded + 1 created

            # 4. Admin Update Module -> 200 OK
            update_mod_resp = await client.put(
                f"/api/admin/modules/{module_id}",
                json={"title": "Cybersecurity & Network Defense"},
                headers=admin_headers,
            )
            assert update_mod_resp.status_code == 200
            assert update_mod_resp.json()["title"] == "Cybersecurity & Network Defense"

            # 5. Admin Create Quiz Question for Module -> 201 CREATED
            create_q_resp = await client.post(
                f"/api/admin/modules/{module_id}/questions",
                json={
                    "question": "What is the primary objective of network firewalls?",
                    "options": [
                        "To filter unauthorized traffic",
                        "To speed up internet connection",
                        "To format documents",
                        "To print pages",
                    ],
                    "correct_option_index": 0,
                },
                headers=admin_headers,
            )
            assert create_q_resp.status_code == 201
            q_data = create_q_resp.json()
            assert q_data["question"] == "What is the primary objective of network firewalls?"
            assert q_data["correct_option_index"] == 0
            question_id = q_data["id"]

            # 6. Admin List Questions (with answer key) -> 200 OK
            admin_q_list = await client.get(
                f"/api/admin/modules/{module_id}/questions", headers=admin_headers
            )
            assert admin_q_list.status_code == 200
            assert len(admin_q_list.json()) == 1
            assert admin_q_list.json()[0]["correct_option_index"] == 0

            # Employee List Questions (answer key STRIPPED) -> 200 OK
            emp_q_list = await client.get(f"/api/quiz/{module_id}", headers=emp_headers)
            assert emp_q_list.status_code == 200
            assert "correct_option_index" not in emp_q_list.json()["questions"][0]

            # 7. Admin Update Quiz Question -> 200 OK
            update_q_resp = await client.put(
                f"/api/admin/questions/{question_id}",
                json={"correct_option_index": 0, "question": "Updated Firewall Question text?"},
                headers=admin_headers,
            )
            assert update_q_resp.status_code == 200
            assert update_q_resp.json()["question"] == "Updated Firewall Question text?"

            # 8. Admin Delete Quiz Question -> 204 NO CONTENT
            del_q_resp = await client.delete(
                f"/api/admin/questions/{question_id}", headers=admin_headers
            )
            assert del_q_resp.status_code == 204

            # 9. Admin Delete Module -> 204 NO CONTENT
            del_mod_resp = await client.delete(
                f"/api/admin/modules/{module_id}", headers=admin_headers
            )
            assert del_mod_resp.status_code == 204

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_admin_reset_user_password():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        emp_id = uuid.uuid4()
        async with async_session_test() as session:
            admin_user = User(
                email="admin_reset@gov.in",
                password_hash=get_password_hash("adminpass123"),
                role="admin",
            )
            emp_user = User(
                id=emp_id,
                email="emp_reset@gov.in",
                password_hash=get_password_hash("oldpassword123"),
                role="employee",
            )
            session.add_all([admin_user, emp_user])
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            admin_login = await client.post(
                "/api/auth/login", json={"email": "admin_reset@gov.in", "password": "adminpass123"}
            )
            admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

            emp_login = await client.post(
                "/api/auth/login", json={"email": "emp_reset@gov.in", "password": "oldpassword123"}
            )
            emp_headers = {"Authorization": f"Bearer {emp_login.json()['access_token']}"}

            # 1. Non-admin cannot reset passwords -> 403 Forbidden
            forbidden_reset = await client.post(
                f"/api/admin/users/{emp_id}/reset-password",
                json={"new_password": "hackedpassword"},
                headers=emp_headers,
            )
            assert forbidden_reset.status_code == 403

            # 2. Invalid UUID -> 400 Bad Request
            bad_id_resp = await client.post(
                "/api/admin/users/not-a-uuid/reset-password",
                json={"new_password": "newpassword123"},
                headers=admin_headers,
            )
            assert bad_id_resp.status_code == 400

            # 3. Non-existent User -> 404 Not Found
            not_found_resp = await client.post(
                f"/api/admin/users/{uuid.uuid4()}/reset-password",
                json={"new_password": "newpassword123"},
                headers=admin_headers,
            )
            assert not_found_resp.status_code == 404

            # 4. Admin resets employee password -> 200 OK
            reset_resp = await client.post(
                f"/api/admin/users/{emp_id}/reset-password",
                json={"new_password": "brandnewpassword456"},
                headers=admin_headers,
            )
            assert reset_resp.status_code == 200
            assert reset_resp.json()["email"] == "emp_reset@gov.in"

            # 5. Old password no longer works -> 401 Unauthorized
            old_login = await client.post(
                "/api/auth/login", json={"email": "emp_reset@gov.in", "password": "oldpassword123"}
            )
            assert old_login.status_code == 401

            # 6. New password works successfully -> 200 OK
            new_login = await client.post(
                "/api/auth/login",
                json={"email": "emp_reset@gov.in", "password": "brandnewpassword456"},
            )
            assert new_login.status_code == 200
            assert "access_token" in new_login.json()

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
