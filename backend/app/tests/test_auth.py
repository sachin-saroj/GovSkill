import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app

# In-memory SQLite engine for fast auth testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest.mark.asyncio
async def test_auth_flow():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Register employee
        reg_resp = await ac.post(
            "/api/auth/register",
            json={"email": "employee@example.gov", "password": "securepassword123", "role": "employee"},
        )
        assert reg_resp.status_code == 201
        reg_data = reg_resp.json()
        assert reg_data["email"] == "employee@example.gov"
        assert reg_data["role"] == "employee"
        assert "id" in reg_data

        # 2. Login
        login_resp = await ac.post(
            "/api/auth/login",
            json={"email": "employee@example.gov", "password": "securepassword123"},
        )
        assert login_resp.status_code == 200
        token_data = login_resp.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        token = token_data["access_token"]

        # 3. Hit protected route /api/auth/me
        me_resp = await ac.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me_resp.status_code == 200
        me_data = me_resp.json()
        assert me_data["email"] == "employee@example.gov"
        assert me_data["role"] == "employee"

    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
