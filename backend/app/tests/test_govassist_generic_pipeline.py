import io
import pytest
from unittest.mock import AsyncMock, patch
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from PIL import Image

from app.core.ai_gateway import MultimodalDocumentAnalysis, MultimodalExtractedField, ai_gateway
from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


def _create_test_image(seed: int = 1) -> bytes:
    img = Image.new(
        "RGB",
        (200 + (seed % 50), 100 + (seed % 30)),
        color=((seed * 37) % 255, (seed * 59) % 255, (seed * 83) % 255),
    )
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


async def get_test_client():
    from app.api.routes.documents import _recent_uploads

    _recent_uploads.clear()

    app.dependency_overrides[get_db] = override_get_db
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


@pytest.mark.asyncio
async def test_aadhaar_card_extraction_and_masking():
    """Test Aadhaar card recognition, masking (XXXX-XXXX-1234), and non-legal status."""
    client = await get_test_client()
    try:
        aadhaar_ocr_text = (
            "GOVERNMENT OF INDIA\n"
            "UNIQUE IDENTIFICATION AUTHORITY OF INDIA\n"
            "Name: Rameshwar Suresh Patil\n"
            "DOB: 15/08/1990\n"
            "Gender: Male\n"
            "1234 5678 9012\n"
            "Mera Aadhaar, Meri Pehchan"
        )

        with patch("app.api.routes.documents.extract_raw_text", return_value=aadhaar_ocr_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("aadhaar_test.png", _create_test_image(1), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "aadhaar"
            assert data["display_name"] == "Aadhaar Card"
            assert "SUPPORTED FOR EXTRACTION" in data["overall_status"]
            # Masking check: raw 12 digits must NEVER be present
            extracted = data["extracted_data"]
            assert "1234 5678 9012" not in str(extracted)
            assert "123456789012" not in str(extracted)
            assert extracted.get("aadhaar_number") == "XXXX-XXXX-9012"
            # Disclaimer must be present
            assert any(
                "authenticity" in (r.get("ruleName") or "").lower()
                or "authenticity" in (r.get("reason") or "").lower()
                for r in data["validation_results"]
            )
    finally:
        await client.aclose()


@pytest.mark.asyncio
async def test_pan_card_extraction_and_masking():
    """Test PAN card recognition, masking (ABCDE****F), and consistency check."""
    client = await get_test_client()
    try:
        pan_ocr_text = (
            "INCOME TAX DEPARTMENT\n"
            "GOVT. OF INDIA\n"
            "Permanent Account Number\n"
            "ABCDE1234F\n"
            "Name: VIKRAM SINGHANIA\n"
            "Father's Name: SURESH SINGHANIA\n"
            "Date of Birth: 22/04/1985"
        )

        with patch("app.api.routes.documents.extract_raw_text", return_value=pan_ocr_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("pan_test.png", _create_test_image(2), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "pan"
            assert data["display_name"] == "PAN Card"
            assert "SUPPORTED FOR EXTRACTION" in data["overall_status"]
            # Masking check: raw PAN must NOT be present
            extracted = data["extracted_data"]
            assert "ABCDE1234F" not in str(extracted)
            assert extracted.get("pan_number") == "ABCDE****F"
    finally:
        await client.aclose()


@pytest.mark.asyncio
async def test_birth_certificate_extraction():
    """Test Birth Certificate extraction with child name and registration number."""
    client = await get_test_client()
    try:
        birth_ocr_text = (
            "MUNICIPAL CORPORATION OF GREATER MUMBAI\n"
            "BIRTH CERTIFICATE\n"
            "ISSUED UNDER SECTION 12/17 OF RBD ACT 1969\n"
            "Registration No: B-2023-998877\n"
            "Name of Child: Aarav Sharma\n"
            "Date of Birth: 10-01-2023\n"
            "Place of Birth: Lilavati Hospital"
        )

        with patch("app.api.routes.documents.extract_raw_text", return_value=birth_ocr_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("birth_test.png", _create_test_image(3), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "birth_certificate"
            assert data["display_name"] == "Birth Certificate"
            assert data["overall_status"] == "ACTION_REQUIRED"
            extracted = data["extracted_data"]
            assert "Aarav Sharma" in extracted.get("name", "")
    finally:
        await client.aclose()


@pytest.mark.asyncio
async def test_domicile_and_residence_certificates():
    """Test Domicile and Residence certificates are classified and extracted."""
    client = await get_test_client()
    try:
        # 1. Domicile
        domicile_text = (
            "GOVERNMENT OF MAHARASHTRA\n"
            "OFFICE OF THE EXECUTIVE MAGISTRATE\n"
            "DOMICILE CERTIFICATE\n"
            "Name: Anjali Verma\n"
            "Certificate No: DOM/2024/5544\n"
            "This is to certify that applicant is a resident of Maharashtra."
        )
        with patch("app.api.routes.documents.extract_raw_text", return_value=domicile_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("domicile_test.png", _create_test_image(4), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "domicile_certificate"

        # 2. Residence
        residence_text = (
            "GOVERNMENT OF RAJASTHAN\n"
            "RESIDENCE CERTIFICATE / BONAFIDE CERTIFICATE\n"
            "Name: Rahul Sharma\n"
            "Certificate No: RES/2024/1122"
        )
        with patch("app.api.routes.documents.extract_raw_text", return_value=residence_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("residence_test.png", _create_test_image(5), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "residence_certificate"
    finally:
        await client.aclose()


@pytest.mark.asyncio
async def test_caste_certificate():
    """Test Caste certificate classification and extraction."""
    client = await get_test_client()
    try:
        caste_text = (
            "OFFICE OF SUB-DIVISIONAL OFFICER\n"
            "CASTE CERTIFICATE / JAATI PRAMAN PATRA\n"
            "Name: Sachin Shinde\n"
            "Certificate No: CST-2023-445566\n"
            "Belongs to SC/ST category."
        )
        with patch("app.api.routes.documents.extract_raw_text", return_value=caste_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("caste_test.png", _create_test_image(6), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "caste_certificate"
    finally:
        await client.aclose()


@pytest.mark.asyncio
async def test_income_certificate_deterministic_rules_authoritative():
    """Test Income Certificate 4-rule deterministic validation remains authoritative."""
    client = await get_test_client()
    try:
        # 1. Valid Income Certificate -> all 4 pass
        valid_income_text = (
            "GOVERNMENT OF MAHARASHTRA\n"
            "TAHSILDAR OFFICE\n"
            "INCOME CERTIFICATE\n"
            "Applicant Name: Rajesh Kumar\n"
            "Certificate No: INC987654\n"
            "Expiry Date: 2029-12-31"
        )
        with patch("app.api.routes.documents.extract_raw_text", return_value=valid_income_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("income_valid.png", _create_test_image(7), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "income_certificate"
            assert data["overall_status"] == "PASSED"
            assert all(r["passed"] for r in data["validation_results"])
            assert len(data["validation_results"]) == 4

        # 2. Expired Income Certificate -> rule 3 fails
        expired_income_text = (
            "GOVERNMENT OF MAHARASHTRA\n"
            "INCOME CERTIFICATE\n"
            "Applicant Name: Rajesh Kumar\n"
            "Certificate No: INC987654\n"
            "Expiry Date: 2020-01-01"
        )
        with patch("app.api.routes.documents.extract_raw_text", return_value=expired_income_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("income_expired.png", _create_test_image(8), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "income_certificate"
            assert data["overall_status"] == "ACTION_REQUIRED"
            assert not all(r["passed"] for r in data["validation_results"])
            expiry_rule = next(
                r for r in data["validation_results"] if r["ruleName"] == "Certificate not expired"
            )
            assert expiry_rule["passed"] is False
    finally:
        await client.aclose()


@pytest.mark.asyncio
async def test_unknown_and_unsupported_documents():
    """Test classification of unknown and unsupported document types."""
    client = await get_test_client()
    try:
        # 1. Unsupported document (e.g. utility / electricity bill)
        electricity_text = (
            "MAHARASHTRA STATE ELECTRICITY DISTRIBUTION CO. LTD.\n"
            "ELECTRICITY BILL / CONSUMPTION BILL\n"
            "Consumer No: 0012938475\n"
            "Amount Due: Rs 1450"
        )
        with patch("app.api.routes.documents.extract_raw_text", return_value=electricity_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("elec_bill.png", _create_test_image(9), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "unsupported_document"
            assert data["overall_status"] == "UNSUPPORTED_DOCUMENT"

        # 2. Unknown document (random non-document text)
        unknown_text = (
            "Some random text without civic headers or government keywords lorem ipsum sit dolor."
        )
        with patch("app.api.routes.documents.extract_raw_text", return_value=unknown_text):
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("unknown.png", _create_test_image(10), "image/png")},
            )
            assert resp.status_code == 200
            data = resp.json()
            assert data["document_type"] == "unknown_document"
            assert data["overall_status"] == "UNKNOWN_DOCUMENT"
    finally:
        await client.aclose()


@pytest.mark.asyncio
async def test_vision_fallback_on_incomplete_ocr():
    """Test Vision fallback triggers on incomplete local OCR and handles provider failure."""
    client = await get_test_client()
    try:
        # Incomplete OCR: Income certificate with missing name
        incomplete_ocr = "INCOME CERTIFICATE\nCertificate No: INC554433\nExpiry Date: 2029-05-15"

        vision_analysis = MultimodalDocumentAnalysis(
            document_type="income_certificate",
            classification_confidence=0.95,
            extracted_fields={
                "name": "Vision Extracted Citizen",
                "certificate_number": "INC554433",
                "expiry_date": "2029-05-15",
            },
            field_details={
                "name": MultimodalExtractedField(value="Vision Extracted Citizen", confidence=0.95),
                "certificate_number": MultimodalExtractedField(value="INC554433", confidence=0.95),
            },
            detected_issues=[],
        )

        with patch.object(settings, "AI_VISION_ENABLED", True):
            with patch("app.api.routes.documents.extract_raw_text", return_value=incomplete_ocr):
                with patch.object(
                    ai_gateway, "extract_document_multimodal", new_callable=AsyncMock
                ) as mock_vis:
                    mock_vis.return_value = vision_analysis
                    resp = await client.post(
                        "/api/documents/upload",
                        files={"file": ("incomplete.png", _create_test_image(11), "image/png")},
                    )
                    assert resp.status_code == 200
                    data = resp.json()
                    assert data["extraction_source"] == "VISION_AI"
                    assert data["extracted_data"]["name"] == "Vision Extracted Citizen"

                # When Vision provider fails (returns None) -> falls back to local OCR result
                with patch.object(
                    ai_gateway, "extract_document_multimodal", new_callable=AsyncMock
                ) as mock_vis_fail:
                    mock_vis_fail.return_value = None
                    resp_fail = await client.post(
                        "/api/documents/upload",
                        files={
                            "file": ("incomplete_fail.png", _create_test_image(12), "image/png")
                        },
                    )
                    assert resp_fail.status_code == 200
                    data_fail = resp_fail.json()
                    assert data_fail["extraction_source"] == "LOCAL_OCR"
    finally:
        await client.aclose()
