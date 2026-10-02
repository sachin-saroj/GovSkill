import re
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User
from app.tests.helpers import complete_admin_login, complete_staff_registration

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_auth_security_integration_suite(captured_emails):
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 1. Employee public registration -> PASS (role='employee')
            emp_data = await complete_staff_registration(
                ac, "employee@example.gov", "securepassword123", captured_emails
            )
            assert emp_data["user"]["role"] == "employee"
            emp_token = emp_data["access_token"]
            emp_headers = {"Authorization": f"Bearer {emp_token}"}

            # 2. Public registration attempting role='admin' -> FORCED role='employee'
            hacker_data = await complete_staff_registration(
                ac, "hacker@example.gov", "securepassword123", captured_emails
            )
            assert hacker_data["user"]["role"] == "employee"

            # 3. Employee login -> PASS
            emp_login = await ac.post(
                "/api/auth/login",
                json={"email": "employee@example.gov", "password": "securepassword123"},
            )
            assert emp_login.status_code == 200
            assert "access_token" in emp_login.json()

            # 4. Insert Admin user directly into test database & test Admin login -> PASS
            async with async_session_test() as session:
                admin_user = User(
                    email="admin@example.gov",
                    password_hash=get_password_hash("adminpassword123"),
                    role="admin",
                )
                session.add(admin_user)
                await session.commit()

            admin_data = await complete_admin_login(
                ac, "admin@example.gov", "adminpassword123", captured_emails
            )
            admin_token = admin_data["access_token"]
            admin_headers = {"Authorization": f"Bearer {admin_token}"}

            # 5. Admin invites second admin and second admin registers via invite token
            invite_resp = await ac.post(
                "/api/auth/invites",
                json={"email": "second_admin@example.gov"},
                headers=admin_headers,
            )
            assert invite_resp.status_code == 200

            invite_email = [b for (t, s, b) in captured_emails if t == "second_admin@example.gov"][-1]
            token_match = re.search(r"token=([A-Za-z0-9_-]+)", invite_email)
            assert token_match is not None
            invite_token = token_match.group(1)

            create_admin_resp = await ac.post(
                "/api/auth/register/admin",
                json={
                    "email": "second_admin@example.gov",
                    "password": "adminpass456!",
                    "invite_token": invite_token,
                },
            )
            assert create_admin_resp.status_code == 200
            assert create_admin_resp.json()["user"]["role"] == "admin"

            # 6. Employee accessing admin endpoint (/api/admin/attempts) -> 403 FORBIDDEN
            emp_admin_resp = await ac.get("/api/admin/attempts", headers=emp_headers)
            assert emp_admin_resp.status_code == 403
            assert emp_admin_resp.json()["detail"]["error"]["code"] == "FORBIDDEN"

            # Admin accessing admin endpoint -> 200 OK
            admin_attempts_resp = await ac.get("/api/admin/attempts", headers=admin_headers)
            assert admin_attempts_resp.status_code == 200

            # 7. Invalid Token Access -> 401 UNAUTHORIZED
            invalid_token_resp = await ac.get(
                "/api/auth/me",
                headers={"Authorization": "Bearer invalid.jwt.token.here"},
            )
            assert invalid_token_resp.status_code == 401
            assert invalid_token_resp.json()["detail"]["error"]["code"] == "UNAUTHORIZED"

            # 8. Missing Authorization Header -> 403 FORBIDDEN / 401 UNAUTHORIZED
            no_header_resp = await ac.get("/api/auth/me")
            assert no_header_resp.status_code in [401, 403]

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_auth_self_service_password_change(captured_emails):
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 1. Register user
            user_data = await complete_staff_registration(
                ac, "change_pw_user@example.gov", "initialpassword123", captured_emails
            )
            token = user_data["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 3. Wrong current password rejected -> 400 Bad Request
            wrong_pw_resp = await ac.post(
                "/api/auth/change-password",
                json={"current_password": "wrongpassword999", "new_password": "updatedpassword456"},
                headers=headers,
            )
            assert wrong_pw_resp.status_code == 400
            assert wrong_pw_resp.json()["detail"]["error"]["code"] == "INVALID_CURRENT_PASSWORD"

            # 4. Correct current password + valid new password -> 200 OK
            success_pw_resp = await ac.post(
                "/api/auth/change-password",
                json={
                    "current_password": "initialpassword123",
                    "new_password": "updatedpassword456",
                },
                headers=headers,
            )
            assert success_pw_resp.status_code == 200
            assert success_pw_resp.json()["email"] == "change_pw_user@example.gov"

            # 5. Old password no longer works -> 401 Unauthorized
            old_login = await ac.post(
                "/api/auth/login",
                json={"email": "change_pw_user@example.gov", "password": "initialpassword123"},
            )
            assert old_login.status_code == 401

            # 6. New password logs in successfully -> 200 OK
            new_login = await ac.post(
                "/api/auth/login",
                json={"email": "change_pw_user@example.gov", "password": "updatedpassword456"},
            )
            assert new_login.status_code == 200
            assert "access_token" in new_login.json()

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_staff_registration_single_step_and_duplicate():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            reg_resp = await ac.post(
                "/api/auth/register",
                json={"email": "single_step@example.gov", "password": "securepassword123", "age": 28},
            )
            assert reg_resp.status_code == 201
            reg_data = reg_resp.json()
            assert "access_token" in reg_data
            assert reg_data["user"]["email"] == "single_step@example.gov"
            assert reg_data["user"]["role"] == "employee"
            assert reg_data["user"]["age"] == 28

            no_age_resp = await ac.post(
                "/api/auth/register",
                json={"email": "no_age@example.gov", "password": "securepassword123"},
            )
            assert no_age_resp.status_code == 201
            assert no_age_resp.json()["user"]["age"] is None

            dup_resp = await ac.post(
                "/api/auth/register",
                json={"email": "single_step@example.gov", "password": "anotherpassword123"},
            )
            assert dup_resp.status_code == 400
            assert dup_resp.json()["detail"]["error"]["code"] == "EMAIL_EXISTS"
            assert dup_resp.json()["detail"]["error"]["message"] == "Email already registered."

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
