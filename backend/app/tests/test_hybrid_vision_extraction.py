import io
import json
import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.core.ai_gateway import AIGateway, MultimodalDocumentAnalysis, MultimodalExtractedField
from app.core.config import Settings, settings
from app.main import app
from app.services.document_registry import (
    INCOME_CERTIFICATE_DEFINITION,
    assess_ocr_quality,
    normalize_extracted_value,
    prepare_vision_payload,
)

# In-memory SQLite async test database
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


# =====================================================================
# Gateway Unit Tests
# =====================================================================


@pytest.mark.asyncio
async def test_multimodal_extraction_success():
    """Verify multimodal extraction succeeds and parses structured JSON via Pydantic schema."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
        AI_VISION_ENABLED=True,
    )
    gw = AIGateway(mock_settings)

    mock_analysis_dict = {
        "document_type": "income_certificate",
        "display_name": "Income Certificate",
        "classification_confidence": 0.96,
        "extracted_fields": {
            "name": "Suresh Raina",
            "certificate_number": "INC98765432",
            "expiry_date": "2029-05-20",
        },
        "field_details": {
            "name": {"value": "Suresh Raina", "confidence": 0.95, "status": "extracted"},
            "certificate_number": {
                "value": "INC98765432",
                "confidence": 0.98,
                "status": "extracted",
            },
            "expiry_date": {"value": "2029-05-20", "confidence": 0.92, "status": "extracted"},
        },
        "detected_issues": [],
    }

    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_analysis_dict)

    mock_client = MagicMock()
    mock_client.models.generate_content = MagicMock(return_value=mock_response)
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
    gw._client = mock_client

    result = await gw.extract_document_multimodal(
        image_bytes=b"\x89PNG\r\n\x1a\n\x00\x00",
        mime_type="image/png",
        document_hint="Income Certificate candidate",
    )

    assert result is not None
    assert isinstance(result, MultimodalDocumentAnalysis)
    assert result.document_type == "income_certificate"
    assert result.extracted_fields["name"] == "Suresh Raina"
    assert result.extracted_fields["certificate_number"] == "INC98765432"
    assert result.field_details["name"].status == "extracted"


@pytest.mark.asyncio
async def test_multimodal_extraction_timeout():
    """Verify multimodal extraction gracefully aborts and returns None on timeout."""
    import asyncio

    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)

    def slow_sync(*args, **kwargs):
        import time

        time.sleep(0.5)
        return MagicMock(text="{}")

    async def slow_call(*args, **kwargs):
        await asyncio.sleep(0.5)
        return MagicMock(text="{}")

    mock_client = MagicMock()
    mock_client.models.generate_content = slow_sync
    mock_client.aio.models.generate_content = slow_call
    gw._client = mock_client

    result = await gw.extract_document_multimodal(
        image_bytes=b"\x89PNG\r\n",
        mime_type="image/png",
        timeout=0.05,
    )
    assert result is None


@pytest.mark.asyncio
async def test_multimodal_extraction_malformed_json():
    """Verify multimodal extraction rejects malformed JSON / schema violations without crashing."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)

    mock_response = MagicMock()
    mock_response.text = "This is not JSON: {invalid json content"

    mock_client = MagicMock()
    mock_client.models.generate_content = MagicMock(return_value=mock_response)
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
    gw._client = mock_client

    result = await gw.extract_document_multimodal(
        image_bytes=b"\x89PNG\r\n",
        mime_type="image/png",
    )
    assert result is None


@pytest.mark.asyncio
async def test_multimodal_extraction_provider_error():
    """Verify provider exception handling returns None safely."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)

    mock_client = MagicMock()
    mock_client.models.generate_content = MagicMock(
        side_effect=RuntimeError("Provider 503 Unavailable")
    )
    mock_client.aio.models.generate_content = AsyncMock(
        side_effect=RuntimeError("Provider 503 Unavailable")
    )
    gw._client = mock_client

    result = await gw.extract_document_multimodal(
        image_bytes=b"\x89PNG\r\n",
        mime_type="image/png",
    )
    assert result is None


# =====================================================================
# Quality Gate Tests
# =====================================================================


def test_quality_gate_decision_levels():
    """Verify assess_ocr_quality produces structured sufficient/insufficient/ambiguous decisions."""
    doc_def = INCOME_CERTIFICATE_DEFINITION

    # 1. Clean, sufficient extraction
    sufficient_res = assess_ocr_quality(
        raw_text="GOVERNMENT OF KARNATAKA\nINCOME CERTIFICATE\nName: Anita Desai\nCert No: INC123456\nValid Until: 2028-12-31",
        parsed_fields={
            "name": "Anita Desai",
            "certificate_number": "INC123456",
            "expiry_date": "2028-12-31",
        },
        doc_def=doc_def,
    )
    assert sufficient_res["is_sufficient"] is True
    assert sufficient_res["decision"] == "sufficient"
    assert sufficient_res["quality_grade"] == "HIGH"
    assert len(sufficient_res["missing_required_fields"]) == 0

    # 2. Corrupted / unreadable text
    corrupted_res = assess_ocr_quality(
        raw_text="!@#$%^&*()_+~`|}{[]:;?><,./",
        parsed_fields={"name": None, "certificate_number": None, "expiry_date": None},
        doc_def=doc_def,
    )
    assert corrupted_res["is_sufficient"] is False
    assert corrupted_res["decision"] == "insufficient"
    assert (
        "noise" in " ".join(corrupted_res.get("issues", [])).lower()
        or "noise" in corrupted_res.get("reason", "").lower()
    )

    # 3. Missing critical required fields
    missing_fields_res = assess_ocr_quality(
        raw_text="GOVERNMENT OF KARNATAKA INCOME CERTIFICATE Some body text without applicant name",
        parsed_fields={"name": None, "certificate_number": "INC123456", "expiry_date": None},
        doc_def=doc_def,
    )
    assert missing_fields_res["is_sufficient"] is False
    assert "name" in missing_fields_res["missing_required_fields"]


def test_prepare_vision_payload_image(tmp_path):
    """Verify prepare_vision_payload processes images safely and returns image bytes and MIME type."""
    from PIL import Image

    test_img_path = str(tmp_path / "test_doc.png")
    img = Image.new("RGB", (200, 200), color="white")
    img.save(test_img_path, format="PNG")

    result = prepare_vision_payload(test_img_path)
    assert result is not None
    img_bytes, mime = result
    assert mime == "image/png"
    assert len(img_bytes) > 0


def test_normalize_extracted_value():
    """Verify extracted field normalization for dates, whitespace, and numbers."""
    # Date formats
    assert normalize_extracted_value("expiry_date", "31/12/2029") == "2029-12-31"
    assert normalize_extracted_value("expiry_date", "2029-12-31") == "2029-12-31"
    assert normalize_extracted_value("valid_until", "15-08-2030") == "2030-08-15"

    # Whitespace cleanup
    assert normalize_extracted_value("name", "  Rajesh   Kumar  ") == "Rajesh Kumar"
    assert normalize_extracted_value("certificate_number", " INC 998877 ") == "INC998877"


# =====================================================================
# Upload Pipeline Fallback Tests
# =====================================================================


@pytest.mark.asyncio
async def test_upload_skips_vision_when_disabled(monkeypatch):
    """When AI_VISION_ENABLED=False (default), Gemini Vision is NEVER invoked even on poor OCR."""
    monkeypatch.setattr(settings, "AI_VISION_ENABLED", False)

    mock_gw = MagicMock()
    mock_gw.extract_document_multimodal = AsyncMock()
    monkeypatch.setattr("app.api.routes.documents.get_ai_gateway", lambda: mock_gw)

    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            unreadable_content = b"Corrupted bytes with no clear certificate text"
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("unreadable.txt", io.BytesIO(unreadable_content), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            # Extraction source MUST remain LOCAL_OCR
            assert data["extraction_source"] == "LOCAL_OCR"
            # Multimodal vision must NOT have been called
            mock_gw.extract_document_multimodal.assert_not_called()

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_upload_skips_vision_when_ocr_sufficient(monkeypatch):
    """When local OCR is sufficient, Gemini Vision is SKIPPED even if AI_VISION_ENABLED=True."""
    monkeypatch.setattr(settings, "AI_VISION_ENABLED", True)

    mock_gw = MagicMock()
    mock_gw.extract_document_multimodal = AsyncMock()
    monkeypatch.setattr("app.api.routes.documents.get_ai_gateway", lambda: mock_gw)

    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            clean_doc = (
                "GOVERNMENT OF KARNATAKA\n"
                "REVENUE DEPARTMENT\n"
                "INCOME CERTIFICATE\n"
                "Name of Applicant: Anita Desai\n"
                "Certificate No: INC554433\n"
                "Valid Until: 2028-10-31\n"
            ).encode("utf-8")

            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("income.txt", io.BytesIO(clean_doc), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            assert data["extraction_source"] == "LOCAL_OCR"
            mock_gw.extract_document_multimodal.assert_not_called()

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_upload_vision_fallback_when_enabled_and_insufficient(monkeypatch):
    """When local OCR is insufficient and AI_VISION_ENABLED=True, Gemini Vision fallback executes."""
    monkeypatch.setattr(settings, "AI_VISION_ENABLED", True)

    mock_analysis = MultimodalDocumentAnalysis(
        document_type="income_certificate",
        display_name="Income Certificate",
        classification_confidence=0.98,
        extracted_fields={
            "name": "Pooja Hegde",
            "certificate_number": "INC887766",
            "expiry_date": "2030-01-15",
        },
        field_details={
            "name": MultimodalExtractedField(
                value="Pooja Hegde", confidence=0.95, status="extracted"
            ),
            "certificate_number": MultimodalExtractedField(
                value="INC887766", confidence=0.98, status="extracted"
            ),
            "expiry_date": MultimodalExtractedField(
                value="2030-01-15", confidence=0.93, status="extracted"
            ),
        },
        detected_issues=["Low contrast original scan"],
    )

    mock_gw = MagicMock()
    mock_gw.extract_document_multimodal = AsyncMock(return_value=mock_analysis)
    monkeypatch.setattr("app.api.routes.documents.get_ai_gateway", lambda: mock_gw)

    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Low quality input that fails local quality gate
            poor_doc = b"GOVERNMENT OF KARNATAKA INCOME CERTIFICATE low contrast illegible body"

            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("poor.txt", io.BytesIO(poor_doc), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            # Vision fallback should have been invoked and merged
            assert data["extraction_source"] == "VISION_AI"
            assert data["extracted_data"]["name"] == "Pooja Hegde"
            assert data["extracted_data"]["certificate_number"] == "INC887766"
            assert data["extracted_data"]["expiry_date"] == "2030-01-15"
            assert data["field_details"]["name"]["status"] == "extracted"
            assert "Low contrast original scan" in data["detected_issues"]

            # Deterministic validator evaluated the merged values and passed
            assert data["overall_status"] == "PASSED"
            assert data["passed_rules_count"] == 4

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_deterministic_rules_authoritative_even_with_vision(monkeypatch):
    """Vision extraction NEVER overrides deterministic compliance rules.

    If Vision extracts an expired date or invalid certificate number, the deterministic
    rule engine must fail the document.
    """
    monkeypatch.setattr(settings, "AI_VISION_ENABLED", True)

    mock_analysis = MultimodalDocumentAnalysis(
        document_type="income_certificate",
        display_name="Income Certificate",
        classification_confidence=0.98,
        extracted_fields={
            "name": "Kiran Kumar",
            "certificate_number": "12",  # Too short (< 6 chars)
            "expiry_date": "2020-01-01",  # Expired
        },
        field_details={
            "name": MultimodalExtractedField(
                value="Kiran Kumar", confidence=0.95, status="extracted"
            ),
            "certificate_number": MultimodalExtractedField(
                value="12", confidence=0.98, status="extracted"
            ),
            "expiry_date": MultimodalExtractedField(
                value="2020-01-01", confidence=0.93, status="extracted"
            ),
        },
        detected_issues=[],
    )

    mock_gw = MagicMock()
    mock_gw.extract_document_multimodal = AsyncMock(return_value=mock_analysis)
    monkeypatch.setattr("app.api.routes.documents.get_ai_gateway", lambda: mock_gw)

    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            poor_doc = b"GOVERNMENT OF KARNATAKA INCOME CERTIFICATE low quality"
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("poor.txt", io.BytesIO(poor_doc), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            assert data["extraction_source"] == "VISION_AI"
            # Deterministic engine MUST fail the expired certificate
            assert data["overall_status"] == "ACTION_REQUIRED"
            failed_rules = [r["ruleName"] for r in data["validation_results"] if not r["passed"]]
            assert "Certificate number format" in failed_rules
            assert "Certificate not expired" in failed_rules

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
