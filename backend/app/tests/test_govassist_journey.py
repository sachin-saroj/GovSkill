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
async def test_govassist_document_upload_and_rule_engine():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Sample document text simulating an expired Income Certificate
            sample_doc_content = (
                "INCOME CERTIFICATE\n"
                "Applicant Name: Sunita Sharma\n"
                "Certificate No: INC654321\n"
                "Expiry Date: 2020-01-01\n"  # Deliberately expired
            )

            files = {
                "file": ("income_cert_expired.txt", io.BytesIO(sample_doc_content.encode("utf-8")), "text/plain")
            }

            response = await client.post("/api/documents/upload", files=files)
            assert response.status_code == 200
            data = response.json()

            assert "document_id" in data
            assert data["extracted_data"]["name"] == "Sunita Sharma"
            assert data["extracted_data"]["certificate_number"] == "INC654321"
            assert data["extracted_data"]["expiry_date"] == "2020-01-01"

            # Verify Rule Engine results
            validation_results = data["validation_results"]
            assert len(validation_results) == 4

            rule_map = {r["ruleName"]: r for r in validation_results}

            assert rule_map["Name present"]["passed"] is True
            assert rule_map["Name present"]["explanation"] is None

            assert rule_map["Certificate number format"]["passed"] is True
            assert rule_map["Certificate number format"]["explanation"] is None

            # Verify Expired rule fails and AI Explanation Layer attached a plain-language explanation
            assert rule_map["Certificate not expired"]["passed"] is False
            assert rule_map["Certificate not expired"]["explanation"] is not None
            assert "expired" in rule_map["Certificate not expired"]["explanation"].lower()

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()

