import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core.rate_limiter import InMemoryRateLimiter, get_client_ip
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.module import Module
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import User


class DummyRequest:
    def __init__(self, client_host: str | None = None, headers: dict[str, str] | None = None):
        if client_host is not None:
            self.client = type("Client", (), {"host": client_host})()
        else:
            self.client = None
        self.headers = headers or {}


def test_proxy_aware_ip_resolution_unit():
    # 1. Direct local connection
    req1 = DummyRequest(client_host="127.0.0.1")
    assert get_client_ip(req1) == "127.0.0.1"

    # 2. Trusted proxy (Docker private bridge 172.18.0.2) with X-Forwarded-For
    req2 = DummyRequest(
        client_host="172.18.0.2",
        headers={"X-Forwarded-For": "203.0.113.195, 172.18.0.2"},
    )
    assert get_client_ip(req2) == "203.0.113.195"

    # 3. Trusted proxy with X-Real-IP
    req3 = DummyRequest(
        client_host="10.0.0.5",
        headers={"X-Real-IP": "198.51.100.42"},
    )
    assert get_client_ip(req3) == "198.51.100.42"

    # 4. Untrusted public caller attempting to spoof X-Forwarded-For
    req4 = DummyRequest(
        client_host="93.184.216.34",
        headers={"X-Forwarded-For": "1.1.1.1"},
    )
    # Must ignore spoofed header and use direct public client host
    assert get_client_ip(req4) == "93.184.216.34"

    # 5. Missing client info fallback
    req5 = DummyRequest(client_host=None)
    assert get_client_ip(req5) == "unknown_client"


@pytest.mark.asyncio
async def test_proxy_aware_rate_limiter_buckets():
    """Verify two distinct client IPs forwarded through the same trusted proxy get separate buckets."""
    limiter = InMemoryRateLimiter(max_requests=2, window_seconds=60)

    # Client A via proxy 172.18.0.2
    req_a = DummyRequest(client_host="172.18.0.2", headers={"X-Forwarded-For": "203.0.113.10"})
    # Client B via proxy 172.18.0.2
    req_b = DummyRequest(client_host="172.18.0.2", headers={"X-Forwarded-For": "203.0.113.20"})

    # Client A: 2 requests pass
    await limiter(req_a)
    await limiter(req_a)

    # Client A: 3rd request blocked
    with pytest.raises(Exception) as exc_info:
        await limiter(req_a)
    assert "429" in str(exc_info.value)

    # Client B: should still succeed because it has a distinct client IP bucket
    await limiter(req_b)
    await limiter(req_b)


@pytest.mark.asyncio
async def test_admin_skills_overview_dynamic_modules_and_unassessed_handling():
    """
    Verify:
    1. Unassessed modules/competencies are marked status="Unassessed" and NOT picked as lowest_performing_competency.
    2. Dynamically created modules and questions appear in competency_health telemetry.
    """
    engine_test = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = async_sessionmaker(
        bind=engine_test, class_=AsyncSession, expire_on_commit=False
    )

    async def override_get_db():
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        custom_mod_id = uuid.uuid4()

        async with TestingSessionLocal() as session:
            admin = User(
                email="admin_audit@govskill.local",
                password_hash=get_password_hash("AdminPass123!"),
                role="admin",
            )
            emp = User(
                email="emp_audit@govskill.local",
                password_hash=get_password_hash("EmpPass123!"),
                role="employee",
            )
            session.add_all([admin, emp])
            await session.commit()

            # Seed a custom module created via Admin CMS
            custom_mod = Module(
                id=custom_mod_id,
                title="Municipal Tax Assessment",
                content="## Lesson 1: Tax Assessment\nOverview of tax calculation.\n## Lesson 2: Collections\nCollection protocols.",
            )
            session.add(custom_mod)
            await session.commit()

            # Seed a custom question for this module with custom competency
            q_custom = QuizQuestion(
                id=uuid.uuid4(),
                module_id=custom_mod_id,
                question="What is the property tax billing cycle?",
                options=["Annual", "Weekly", "Hourly", "Per transaction"],
                correct_option_index=0,
                competency="Property Tax Evaluation Standards",
            )
            session.add(q_custom)
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            login_res = await client.post(
                "/api/auth/login",
                json={"email": "admin_audit@govskill.local", "password": "AdminPass123!"},
            )
            token = login_res.json()["access_token"]
            admin_headers = {"Authorization": f"Bearer {token}"}

            # 1. Overview before any quiz attempts: all competencies should be Unassessed, lowest_performing is None
            overview_res = await client.get("/api/progress/admin/skills-overview", headers=admin_headers)
            assert overview_res.status_code == 200
            data = overview_res.json()
            assert data["lowest_performing_competency"] is None

            # Verify the custom module's competency is dynamically represented
            health_items = data["competency_health"]
            comp_names = [h["competency"] for h in health_items]
            assert "Property Tax Evaluation Standards" in comp_names
            # All items should have status "Unassessed"
            for item in health_items:
                assert item["status"] == "Unassessed"

            # 2. Add an attempt for custom module with score 80% (Passing/Healthy)
            # and an attempt for seed module 1 with score 60% (Developing)
            async with TestingSessionLocal() as session:
                seed_mod_1_id = uuid.UUID("11111111-1111-1111-1111-111111111111")
                # Attempt 1: Custom module 80%
                att_custom = QuizAttempt(
                    user_id=emp.id,
                    module_id=custom_mod_id,
                    score=4,
                    total=5,
                )
                # Attempt 2: Seed module 1 with 60%
                att_seed1 = QuizAttempt(
                    user_id=emp.id,
                    module_id=seed_mod_1_id,
                    score=3,
                    total=5,
                )
                session.add_all([att_custom, att_seed1])
                await session.commit()

            # 3. Overview after attempts:
            # - Custom module (80%) is Healthy
            # - Seed module 1 (60%) is Needs Attention
            # - Other seed modules (0 attempts) remain "Unassessed"
            # - lowest_performing_competency should be one of Seed Module 1's competencies (60%), NOT unassessed modules (0 attempts)!
            overview_res2 = await client.get("/api/progress/admin/skills-overview", headers=admin_headers)
            assert overview_res2.status_code == 200
            data2 = overview_res2.json()

            # The lowest performing competency must be from seed module 1 (scored 60%), NOT an unassessed module
            seed1_comps = [
                "Document Formatting & Standards",
                "Verification Rules & Expiry Validation",
                "Mandatory Data Integrity",
            ]
            assert data2["lowest_performing_competency"] in seed1_comps

            # Check health status per competency
            health_map = {h["competency"]: h for h in data2["competency_health"]}
            assert health_map["Property Tax Evaluation Standards"]["status"] == "Healthy"
            assert health_map["Property Tax Evaluation Standards"]["average_mastery_pct"] == 80

            assert health_map["Document Formatting & Standards"]["status"] == "Needs Attention"
            assert health_map["Document Formatting & Standards"]["average_mastery_pct"] == 60

            # Module 2, 3, 4 competencies remain Unassessed
            assert health_map["Workflow Routing & Sign-off"]["status"] == "Unassessed"

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
