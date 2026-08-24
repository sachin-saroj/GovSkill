import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.routes.documents import upload_limiter, lookup_limiter
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.services.rule_engine import validate_income_certificate

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.fixture(autouse=True)
def reset_rate_limiters():
    upload_limiter.reset()
    lookup_limiter.reset()
    yield
    upload_limiter.reset()
    lookup_limiter.reset()


@pytest.mark.asyncio
async def test_govassist_valid_and_invalid_document_pipeline():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Valid Document Upload
            valid_doc_content = (
                "GOVERNMENT OF KARNATAKA\n"
                "REVENUE DEPARTMENT\n"
                "INCOME CERTIFICATE\n"
                "This is to certify that Shri Rajesh Kumar son of Ramesh Kumar\n"
                "Certificate No: INC987654\n"
                "Annual Family Income: Rs. 1,20,000\n"
                "Expiry Date: 2027-12-31\n"
            ).encode("utf-8")

            upload_resp = await client.post(
                "/api/documents/upload",
                files={"file": ("income_cert.txt", valid_doc_content, "text/plain")},
            )
            assert upload_resp.status_code == 200
            data = upload_resp.json()
            assert data["overall_status"] == "PASSED"
            assert data["passed_rules_count"] == 4
            assert data["total_rules_count"] == 4
            assert data["extracted_data"]["name"] == "Rajesh Kumar"
            assert data["extracted_data"]["certificate_number"] == "INC987654"
            assert data["extracted_data"]["expiry_date"] == "2027-12-31"
            assert "All pre-submission validation checks passed" in data["recommended_next_step"]

            doc_id = data["document_id"]

            # 2. Reference Lookup of Valid Document
            lookup_resp = await client.get(f"/api/documents/{doc_id}")
            assert lookup_resp.status_code == 200
            lookup_data = lookup_resp.json()
            assert lookup_data["overall_status"] == "PASSED"
            assert lookup_data["document_id"] == doc_id

            # 3. Invalid Document Upload (Expired Certificate & Bad Number)
            invalid_doc_content = (
                "CERTIFICATE OF INCOME\n"
                "Applicant: Ramesh Gupta\n"
                "Certificate Number: 12\n"  # Too short (<6 chars)
                "Expiry Date: 2020-01-01\n"  # Expired
            ).encode("utf-8")

            upload_inv_resp = await client.post(
                "/api/documents/upload",
                files={"file": ("expired_cert.txt", invalid_doc_content, "text/plain")},
            )
            assert upload_inv_resp.status_code == 200
            inv_data = upload_inv_resp.json()
            assert inv_data["overall_status"] == "ACTION_REQUIRED"
            assert inv_data["passed_rules_count"] < 4

            # Verify that failed rules contain AI explanations and corrective actions
            failed_rules = [vr for vr in inv_data["validation_results"] if not vr["passed"]]
            assert len(failed_rules) >= 2
            for fr in failed_rules:
                assert fr["explanation"] is not None
                assert len(fr["explanation"]) > 10
                assert fr["recommended_action"] is not None

            # 4. Critical Architecture Test: Deterministic Rule Engine is Inviolable
            # Passing contradictory/malicious payload to validate_income_certificate
            # must evaluate strictly based on rules
            tampered_extracted = {
                "name": "Valid Citizen",
                "certificate_number": "12",  # invalid (<6 chars)
                "expiry_date": "2020-01-01",  # expired
            }
            results = validate_income_certificate(tampered_extracted)
            cert_rule = next(r for r in results if r["rule_name"] == "Certificate number format")
            expiry_rule = next(r for r in results if r["rule_name"] == "Certificate not expired")
            all_rule = next(r for r in results if r["rule_name"] == "All required fields extracted")

            assert cert_rule["passed"] is False
            assert expiry_rule["passed"] is False
            assert all_rule["passed"] is False

            # 5. Invalid File Type & Size Rejection
            disallowed_resp = await client.post(
                "/api/documents/upload",
                files={"file": ("malicious.exe", b"binary content", "application/octet-stream")},
            )
            assert disallowed_resp.status_code == 400

            oversized_content = b"0" * (5 * 1024 * 1024 + 10)  # > 5MB
            oversized_resp = await client.post(
                "/api/documents/upload",
                files={"file": ("big.pdf", oversized_content, "application/pdf")},
            )
            assert oversized_resp.status_code == 413

            # 6. Invalid UUID format & 404 Not Found Lookup
            bad_uuid_resp = await client.get("/api/documents/not-a-valid-uuid")
            assert bad_uuid_resp.status_code == 400

            missing_uuid = str(uuid.uuid4())
            not_found_resp = await client.get(f"/api/documents/{missing_uuid}")
            assert not_found_resp.status_code == 404

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_govassist_rate_limiting():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            upload_limiter.max_requests = 3  # Lower threshold for rapid test
            doc_content = b"Sample doc text"

            for i in range(3):
                resp = await client.post(
                    "/api/documents/upload",
                    files={"file": (f"test_{i}.txt", doc_content, "text/plain")},
                )
                assert resp.status_code == 200

            # 4th request must trigger rate limit 429
            blocked_resp = await client.post(
                "/api/documents/upload",
                files={"file": ("test_4.txt", doc_content, "text/plain")},
            )
            assert blocked_resp.status_code == 429
            assert blocked_resp.json()["detail"]["error"]["code"] == "RATE_LIMIT_EXCEEDED"

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
        upload_limiter.max_requests = 20
