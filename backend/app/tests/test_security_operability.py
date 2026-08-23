import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import Settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.module import Module
from app.models.quiz import QuizAttempt
from app.models.user import User

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


def test_insecure_secret_key_validation():
    # Attempting to use default placeholder raises ValidationError / ValueError
    with pytest.raises(ValidationError):
        Settings(SECRET_KEY="super_secret_jwt_key_change_in_production")

    with pytest.raises(ValidationError):
        Settings(SECRET_KEY="")

    # Valid secret key succeeds
    valid_s = Settings(SECRET_KEY="valid_production_secret_key_1234567890")
    assert valid_s.SECRET_KEY == "valid_production_secret_key_1234567890"


def test_cors_origins_parsing():
    s = Settings(
        SECRET_KEY="valid_secret_key_123",
        ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000",
    )
    assert s.ALLOWED_ORIGINS == ["http://localhost:5173", "http://localhost:3000"]


@pytest.mark.asyncio
async def test_admin_attempts_pagination():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Seed admin user, module, and 5 quiz attempts
        async with async_session_test() as session:
            admin = User(
                email="admin_page@gov.in",
                password_hash=get_password_hash("adminpass123"),
                role="admin",
            )
            emp = User(
                email="emp_page@gov.in",
                password_hash=get_password_hash("emppass123"),
                role="employee",
            )
            mod = Module(id=uuid.uuid4(), title="Test Module", content="Content")

            session.add_all([admin, emp, mod])
            await session.commit()

            for i in range(5):
                attempt = QuizAttempt(user_id=emp.id, module_id=mod.id, score=i + 1, total=5)
                session.add(attempt)
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Login as admin
            login_resp = await client.post(
                "/api/auth/login",
                json={"email": "admin_page@gov.in", "password": "adminpass123"},
            )
            token = login_resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 1. Fetch default page (limit 20, offset 0) -> returns all 5 attempts
            resp_all = await client.get("/api/admin/attempts", headers=headers)
            assert resp_all.status_code == 200
            assert len(resp_all.json()) == 5

            # 2. Fetch page 1 with limit=2 -> returns 2 items
            resp_p1 = await client.get("/api/admin/attempts?limit=2&offset=0", headers=headers)
            assert resp_p1.status_code == 200
            assert len(resp_p1.json()) == 2

            # 3. Fetch page 2 with limit=2 & offset=2 -> returns next 2 items
            resp_p2 = await client.get("/api/admin/attempts?limit=2&offset=2", headers=headers)
            assert resp_p2.status_code == 200
            assert len(resp_p2.json()) == 2

            # 4. Fetch page 3 with limit=2 & offset=4 -> returns 1 item
            resp_p3 = await client.get("/api/admin/attempts?limit=2&offset=4", headers=headers)
            assert resp_p3.status_code == 200
            assert len(resp_p3.json()) == 1

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
