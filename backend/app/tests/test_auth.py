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
async def test_auth_security_integration_suite():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 1. Employee public registration -> PASS (role='employee')
            reg_resp = await ac.post(
                "/api/auth/register",
                json={"email": "employee@example.gov", "password": "securepassword123"},
            )
            assert reg_resp.status_code == 201
            assert reg_resp.json()["role"] == "employee"

            # 2. Public registration attempting role='admin' -> FORCED role='employee'
            hacker_resp = await ac.post(
                "/api/auth/register",
                json={
                    "email": "hacker@example.gov",
                    "password": "securepassword123",
                    "role": "admin",
                },
            )
            assert hacker_resp.status_code == 201
            assert hacker_resp.json()["role"] == "employee"

            # 3. Employee login -> PASS
            emp_login = await ac.post(
                "/api/auth/login",
                json={"email": "employee@example.gov", "password": "securepassword123"},
            )
            assert emp_login.status_code == 200
            emp_token = emp_login.json()["access_token"]
            emp_headers = {"Authorization": f"Bearer {emp_token}"}

            # 4. Insert Admin user directly into test database & test Admin login -> PASS
            async with async_session_test() as session:
                admin_user = User(
                    email="admin@example.gov",
                    password_hash=get_password_hash("adminpassword123"),
                    role="admin",
                )
                session.add(admin_user)
                await session.commit()

            admin_login = await ac.post(
                "/api/auth/login",
                json={"email": "admin@example.gov", "password": "adminpassword123"},
            )
            assert admin_login.status_code == 200
            admin_token = admin_login.json()["access_token"]
            admin_headers = {"Authorization": f"Bearer {admin_token}"}

            # 5. Admin user creating another admin via /api/auth/create-admin -> PASS (201)
            create_admin_resp = await ac.post(
                "/api/auth/create-admin",
                json={"email": "second_admin@example.gov", "password": "adminpass456!"},
                headers=admin_headers,
            )
            assert create_admin_resp.status_code == 201
            assert create_admin_resp.json()["role"] == "admin"

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
async def test_auth_self_service_password_change():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 1. Register user
            reg_resp = await ac.post(
                "/api/auth/register",
                json={"email": "change_pw_user@example.gov", "password": "initialpassword123"},
            )
            assert reg_resp.status_code == 201

            # 2. Login to get token
            login_resp = await ac.post(
                "/api/auth/login",
                json={"email": "change_pw_user@example.gov", "password": "initialpassword123"},
            )
            assert login_resp.status_code == 200
            token = login_resp.json()["access_token"]
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
