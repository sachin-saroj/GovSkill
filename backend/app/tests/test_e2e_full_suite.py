import io
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_full_application_e2e():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Health check
            h_resp = await client.get("/health")
            assert h_resp.status_code == 200
            assert h_resp.json()["status"] == "ok"

            # 2. Register employee & admin
            e_reg = await client.post("/api/auth/register", json={"email": "employee@test.gov", "password": "password123", "role": "employee"})
            assert e_reg.status_code == 201

            a_reg = await client.post("/api/auth/register", json={"email": "admin@test.gov", "password": "password123", "role": "admin"})
            assert a_reg.status_code == 201

            # 3. Employee login & module read
            e_login = await client.post("/api/auth/login", json={"email": "employee@test.gov", "password": "password123"})
            e_token = e_login.json()["access_token"]
            e_hdr = {"Authorization": f"Bearer {e_token}"}

            mod_resp = await client.get("/api/modules/default", headers=e_hdr)
            assert mod_resp.status_code == 200

            # 4. Ask AI Tutor
            tutor_resp = await client.post("/api/tutor/ask", json={"module_id": "default", "question": "What is PII?"}, headers=e_hdr)
            assert tutor_resp.status_code == 200
            assert "answer" in tutor_resp.json()

            # 5. Take Quiz & Score Server-side
            q_resp = await client.get("/api/quiz/default", headers=e_hdr)
            questions = q_resp.json()["questions"]
            answers = [{"question_id": q["id"], "selected_option_index": 0} for q in questions]

            submit_resp = await client.post("/api/quiz/default/submit", json={"answers": answers}, headers=e_hdr)
            assert submit_resp.status_code == 200
            assert "score" in submit_resp.json()

            # 6. Admin Login & Check Attempts
            a_login = await client.post("/api/auth/login", json={"email": "admin@test.gov", "password": "password123"})
            a_token = a_login.json()["access_token"]
            a_hdr = {"Authorization": f"Bearer {a_token}"}

            adm_resp = await client.get("/api/admin/attempts", headers=a_hdr)
            assert adm_resp.status_code == 200
            assert len(adm_resp.json()) == 1

            # 7. Citizen GovAssist Document Pre-check (No Auth)
            sample_doc = "Income Certificate\nApplicant Name: John Citizen\nCertificate No: INC777888\nExpiry Date: 2099-12-31\n"
            doc_files = {"file": ("income.txt", io.BytesIO(sample_doc.encode("utf-8")), "text/plain")}
            doc_resp = await client.post("/api/documents/upload", files=doc_files)
            assert doc_resp.status_code == 200
            doc_data = doc_resp.json()
            assert len(doc_data["validation_results"]) == 4

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()

