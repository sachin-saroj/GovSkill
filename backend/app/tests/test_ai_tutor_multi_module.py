import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User
from app.services.ai_service import find_relevant_modules

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


def test_find_relevant_modules_unit():
    dummy_modules = [
        {"title": "Digital Document Handling", "content": "Verifying citizen certificates and names."},
        {"title": "Government Portal Operations", "content": "Citizen request routing and 7 day SLA escalation."},
        {"title": "Cybersecurity & Data Privacy Basics", "content": "Phishing prevention, passwords, and MFA security."},
        {"title": "Digital Record Management", "content": "Archival record retention policies for income certificates and audit log tracking."},
    ]


    # Test 1: Cybersecurity query
    cyber_matched = find_relevant_modules("How do I protect against phishing emails?", dummy_modules)
    assert cyber_matched[0]["title"] == "Cybersecurity & Data Privacy Basics"

    # Test 2: SLA Escalation query
    sla_matched = find_relevant_modules("What is the SLA limit before supervisor escalation?", dummy_modules)
    assert sla_matched[0]["title"] == "Government Portal Operations"

    # Test 3: Record Retention query
    rec_matched = find_relevant_modules("How long is the retention policy for income certificates?", dummy_modules)
    assert rec_matched[0]["title"] == "Digital Record Management"


@pytest.mark.asyncio
async def test_ai_tutor_auto_routing_api():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with async_session_test() as session:
            emp_user = User(email="tutor_emp@gov.in", password_hash=get_password_hash("pass123456"), role="employee")
            session.add(emp_user)
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            login_resp = await client.post("/api/auth/login", json={"email": "tutor_emp@gov.in", "password": "pass123456"})
            token = login_resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 1. Ask cybersecurity question in Auto mode
            tutor_resp_1 = await client.post(
                "/api/tutor/ask",
                json={"module_id": "auto", "question": "What should I do if I suspect a phishing email?"},
                headers=headers,
            )
            assert tutor_resp_1.status_code == 200
            res_1 = tutor_resp_1.json()
            assert "answer" in res_1
            assert res_1["matched_module_title"] == "Cybersecurity & Data Privacy Basics"

            # 2. Ask portal SLA question in Auto mode
            tutor_resp_2 = await client.post(
                "/api/tutor/ask",
                json={"module_id": "auto", "question": "When does SLA escalation trigger?"},
                headers=headers,
            )
            assert tutor_resp_2.status_code == 200
            res_2 = tutor_resp_2.json()
            assert res_2["matched_module_title"] == "Government Portal Operations"

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
