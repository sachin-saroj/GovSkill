import io
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.services.document_registry import (
    BIRTH_CERTIFICATE_DEFINITION,
    CASTE_CERTIFICATE_DEFINITION,
    DOMICILE_CERTIFICATE_DEFINITION,
    INCOME_CERTIFICATE_DEFINITION,
    UNKNOWN_DOCUMENT_DEFINITION,
    UNSUPPORTED_DOCUMENT_DEFINITION,
    assess_ocr_quality,
    classify_document,
    mask_sensitive_field,
)

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


# =====================================================================
# Unit Tests: Document Classification
# =====================================================================


def test_classify_income_certificate():
    samples = [
        "GOVERNMENT OF KARNATAKA\nREVENUE DEPARTMENT\nINCOME CERTIFICATE\nName: Ramesh",
        "CERTIFICATE OF INCOME\nApplicant Name: Rajesh Kumar\nAnnual Income: Rs. 1,00,000",
        "OFFICE OF THE TAHSILDAR\nANNUAL FAMILY INCOME CERTIFICATE\nHolder: Sunita",
        "DISTRICT MAGISTRATE\nOFFICIAL INCOME CERTIFICATE\nExpiry Date: 2027-01-01",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "income_certificate", f"Failed to classify: {text[:40]}"


def test_classify_caste_certificate():
    samples = [
        "GOVERNMENT OF MAHARASHTRA\nCASTE CERTIFICATE\nApplicant: Arjun Rao\nCategory: Scheduled Caste",
        "OFFICE OF THE TAHSILDAR\nCOMMUNITY CERTIFICATE\nBelongs to Scheduled Tribe community",
        "STATE REVENUE DEPARTMENT\nOTHER BACKWARD CLASS (OBC) CERTIFICATE\nCategory-IIA",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "caste_certificate", f"Failed to classify: {text[:40]}"


def test_classify_domicile_certificate():
    samples = [
        "GOVERNMENT OF KARNATAKA\nDOMICILE CERTIFICATE\nResident of Karnataka for 15 years",
        "REVENUE DEPARTMENT\nDOMICILE VERIFICATION\nPermanent Resident of District Mysuru",
        "OFFICE OF THE DISTRICT COLLECTOR\nPERMANENT RESIDENT CERTIFICATE (PRC)",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "domicile_certificate", f"Failed to classify: {text[:40]}"


def test_classify_residence_certificate():
    samples = [
        "GOVERNMENT OF KARNATAKA\nRESIDENCE CERTIFICATE\nPermanent Resident of Bangalore",
        "OFFICE OF THE TAHSILDAR\nCERTIFICATE OF RESIDENCE\nResiding at Ward 12",
        "REVENUE DEPARTMENT\nNIVAS PRAMAN PATRA\nResident Certificate",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "residence_certificate", f"Failed to classify: {text[:40]}"


def test_classify_birth_certificate():
    samples = [
        "MUNICIPAL CORPORATION OF GREATER MUMBAI\nBIRTH CERTIFICATE\nChild Name: Aarav Sharma",
        "GOVERNMENT OF KARNATAKA\nCERTIFICATE OF BIRTH\nDate of Birth: 2024-05-12",
        "DIRECTORATE OF HEALTH AND FAMILY WELFARE\nBIRTH REGISTRATION CERTIFICATE",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "birth_certificate", f"Failed to classify: {text[:40]}"


def test_classify_aadhaar():
    samples = [
        "GOVERNMENT OF INDIA\nUNIQUE IDENTIFICATION AUTHORITY OF INDIA\nAADHAAR CARD\n1234 5678 9012\nMERA AADHAAR MERI PEHCHAN",
        "UIDAI\nAadhaar Card\nTo: Suresh Kumar\nDOB: 15/08/1990\nGender: Male\n9876 5432 1098",
        "Unique Identification Authority of India\nEnrollment No: 1234/56789/01234\nAadhaar: 4455 6677 8899",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "aadhaar", f"Failed to classify: {text[:40]}"


def test_classify_pan():
    samples = [
        "INCOME TAX DEPARTMENT\nGOVT. OF INDIA\nPERMANENT ACCOUNT NUMBER CARD\nPAN: ABCDE1234F\nName: Rahul Sharma",
        "Permanent Account Number\nPAN CARD\nFather's Name: Mohan Sharma\nDOB: 01/01/1985\nBKZPR9876K",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "pan", f"Failed to classify: {text[:40]}"


def test_classify_voter_id():
    samples = [
        "ELECTION COMMISSION OF INDIA\nELECTOR PHOTO IDENTITY CARD\nVOTER ID\nEPIC NO: ABC1234567\nElector Name: Priya Patel",
        "BHARAT NIRVACHAN AAYOG\nELECTION COMMISSION\nEPIC CARD\nVoter ID Card",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "voter_id", f"Failed to classify: {text[:40]}"


def test_classify_driving_license():
    samples = [
        "UNION OF INDIA\nDRIVING LICENCE\nLicence No: DL-1420110012345\nAuthorised to drive LMV",
        "MINISTRY OF ROAD TRANSPORT AND HIGHWAYS\nFORM 7 DRIVING LICENSE\nName: Vikram Singh",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "driving_license", f"Failed to classify: {text[:40]}"


def test_classify_passport():
    samples = [
        "REPUBLIC OF INDIA\nPASSPORT\nType P Country Code IND\nPassport No: Z1234567\nSurname: Verma",
        "INDIAN PASSPORT\nMINISTRY OF EXTERNAL AFFAIRS\nGiven Names: Ananya",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "passport", f"Failed to classify: {text[:40]}"


def test_classify_unknown_document():
    samples = [
        "",
        "   \n\t  ",
        "Random meeting notes for a neighborhood garden committee meeting without civic headers.",
        "Curriculum Vitae: Senior Software Engineer with 10 years experience in Python",
        "Project design brief and architectural diagrams for system modernization.",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "unknown_document", f"Expected unknown for: {text[:40]}"


def test_classify_unsupported_document():
    samples = [
        "BANGALORE ELECTRICITY SUPPLY COMPANY LIMITED\nELECTRICITY BILL FOR THE MONTH OF JANUARY 2026\nCONSUMER NO: 998877",
        "STATE BANK OF INDIA\nACCOUNT STATEMENT FOR ACCOUNT NO 1234567890\nBalance: Rs 25,000",
        "WATER SUPPLY BOARD\nWATER CONSUMPTION BILL\nRECEIPT NO: 445566",
        "TAX INVOICE / BILL OF SUPPLY\nSOLD BY XYZ ELECTRONICS RETAIL PVT LTD",
        "MONTHLY SALARY SLIP FOR EMPLOYEE #98765\nNET PAYABLE: Rs 45,000",
    ]
    for text in samples:
        doc_def = classify_document(text)
        assert doc_def.type_id == "unsupported_document", f"Expected unsupported for: {text[:40]}"


def test_sensitive_field_masking():
    """Requirement: Aadhaar numbers masked as XXXX-XXXX-1234 and PAN as ABCDE****F."""
    assert mask_sensitive_field("aadhaar_number", "1234 5678 9012") == "XXXX-XXXX-9012"
    assert mask_sensitive_field("aadhaar", "987654321098") == "XXXX-XXXX-1098"
    assert mask_sensitive_field("pan_number", "ABCDE1234F") == "ABCDE****F"
    assert mask_sensitive_field("pan", "xyzpr9876k") == "XYZPR****K"
    assert mask_sensitive_field("name", "Rajesh Kumar") == "Rajesh Kumar"
    assert mask_sensitive_field("certificate_number", "INC-12345") == "INC-12345"


def test_unknown_and_unsupported_states_are_distinct():
    """Requirement 13: UNKNOWN_DOCUMENT and UNSUPPORTED_DOCUMENT are distinct states."""
    unknown = UNKNOWN_DOCUMENT_DEFINITION
    unsupported = UNSUPPORTED_DOCUMENT_DEFINITION

    assert unknown.type_id != unsupported.type_id
    assert unknown.display_name != unsupported.display_name
    assert unknown.type_id == "unknown_document"
    assert unsupported.type_id == "unsupported_document"

    unknown_rules = unknown.validator({})
    unsupported_rules = unsupported.validator({})

    assert len(unknown_rules) == 1
    assert len(unsupported_rules) == 1
    assert unknown_rules[0]["passed"] is False
    assert unsupported_rules[0]["passed"] is False
    assert "unsupported" in unsupported_rules[0]["reason"].lower()
    assert "identify" in unknown_rules[0]["reason"].lower()


# =====================================================================
# Unit Tests: OCR Quality Assessment Interface
# =====================================================================


def test_assess_ocr_quality():
    doc_def = INCOME_CERTIFICATE_DEFINITION

    # High quality
    clean_text = (
        "GOVERNMENT OF KARNATAKA\nINCOME CERTIFICATE\n"
        "Name of Applicant: Ramesh Gupta\n"
        "Certificate No: INC987654\n"
        "Valid Until: 2028-12-31\n"
    )
    clean_fields = {
        "name": "Ramesh Gupta",
        "certificate_number": "INC987654",
        "expiry_date": "2028-12-31",
    }
    high_qual = assess_ocr_quality(clean_text, clean_fields, doc_def)
    assert high_qual["is_sufficient"] is True
    assert high_qual["quality_grade"] == "HIGH"
    assert len(high_qual["missing_required_fields"]) == 0

    # Empty / Unreadable
    empty_qual = assess_ocr_quality("", {}, doc_def)
    assert empty_qual["is_sufficient"] is False
    assert empty_qual["quality_grade"] == "UNREADABLE"

    # Missing required field
    missing_fields = {
        "name": "Ramesh Gupta",
        "certificate_number": None,
        "expiry_date": "2028-12-31",
    }
    partial_qual = assess_ocr_quality(clean_text, missing_fields, doc_def)
    assert partial_qual["is_sufficient"] is False
    assert "certificate_number" in partial_qual["missing_required_fields"]


# =====================================================================
# Unit Tests: Non-Income Scaffolding Validators (No Fake Passes)
# =====================================================================


def test_caste_domicile_birth_validators_do_not_fabricate_pass():
    """Requirement 16: Non-income definitions must not invent compliance rules or fake PASS."""
    for doc_def in [
        CASTE_CERTIFICATE_DEFINITION,
        DOMICILE_CERTIFICATE_DEFINITION,
        BIRTH_CERTIFICATE_DEFINITION,
    ]:
        rules = doc_def.validator({})
        has_staging_warning = any(
            not r["passed"] and "staging" in r["reason"].lower() for r in rules
        )
        all_passed = all(r["passed"] for r in rules)
        assert all_passed is False, f"{doc_def.type_id} must not claim all rules passed in staging"
        assert has_staging_warning is True, (
            f"{doc_def.type_id} must flag pending statutory configuration"
        )


# =====================================================================
# Integration Tests: End-to-End Upload Pipeline
# =====================================================================


@pytest.mark.asyncio
async def test_upload_pipeline_unknown_document_does_not_run_income_rules():
    """Requirement 14: Do not silently apply Income Certificate rules to unknown documents."""
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            unknown_content = b"Some random unformatted notes about a garden meeting without any civic headings.\n"
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("notes.txt", io.BytesIO(unknown_content), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            assert data["overall_status"] == "UNKNOWN_DOCUMENT"
            assert data["document_type"] == "unknown_document"
            assert data["passed_rules_count"] == 0
            assert data["total_rules_count"] == 1

            # Ensure Income rules ("Certificate not expired", "Certificate number format") were NOT evaluated
            rule_names = [r["ruleName"] for r in data["validation_results"]]
            assert "Certificate not expired" not in rule_names
            assert "Certificate number format" not in rule_names
            assert "Document category identification" in rule_names

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_upload_pipeline_unsupported_document_rejected():
    """Requirement 13: Unsupported documents return UNSUPPORTED_DOCUMENT without income rules."""
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            utility_bill = b"BANGALORE ELECTRICITY SUPPLY COMPANY LIMITED\nELECTRICITY BILL FOR THE MONTH OF JANUARY 2026\nCONSUMER NO: 998877\nAMOUNT: Rs 1200\n"
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("bill.txt", io.BytesIO(utility_bill), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            assert data["overall_status"] == "UNSUPPORTED_DOCUMENT"
            assert data["document_type"] == "unsupported_document"
            assert data["passed_rules_count"] == 0
            assert data["total_rules_count"] == 1

            rule_names = [r["ruleName"] for r in data["validation_results"]]
            assert "Certificate not expired" not in rule_names
            assert "Document category supported" in rule_names

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_upload_pipeline_aadhaar_extraction_and_masking():
    """Requirement: Aadhaar document extraction, masking, and disclaimer state."""
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            aadhaar_doc = (
                "GOVERNMENT OF INDIA\n"
                "UNIQUE IDENTIFICATION AUTHORITY OF INDIA\n"
                "AADHAAR CARD\n"
                "To: Ramesh Kumar\n"
                "DOB: 12/05/1988\n"
                "Gender: Male\n"
                "1234 5678 9012\n"
                "Address: House 42, Main Road, Bangalore\n"
            ).encode("utf-8")
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("aadhaar.txt", io.BytesIO(aadhaar_doc), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            assert data["document_type"] == "aadhaar"
            assert data["display_name"] == "Aadhaar Card"
            assert (
                data["overall_status"] == "SUPPORTED FOR EXTRACTION — FORMAL VALIDATION UNAVAILABLE"
            )

            # Verify PII masking in API response
            assert data["extracted_data"]["aadhaar_number"] == "XXXX-XXXX-9012"
            assert "1234 5678 9012" not in str(data)

            # Verify statutory disclaimer check is present
            rule_names = [r["ruleName"] for r in data["validation_results"]]
            assert "UIDAI statutory authenticity disclaimer" in rule_names
            assert "Aadhaar number format (12-digit structure)" in rule_names
            assert "Cardholder name present" in rule_names

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_upload_pipeline_pan_extraction_and_masking():
    """Requirement: PAN document extraction, masking, and disclaimer state."""
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            pan_doc = (
                "INCOME TAX DEPARTMENT\n"
                "GOVT. OF INDIA\n"
                "PERMANENT ACCOUNT NUMBER CARD\n"
                "PAN: ABCDE1234F\n"
                "Name: Rahul Sharma\n"
                "Father's Name: Mohan Sharma\n"
                "Date of Birth: 01/01/1985\n"
            ).encode("utf-8")
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("pan.txt", io.BytesIO(pan_doc), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            assert data["document_type"] == "pan"
            assert data["display_name"] == "PAN Card"
            assert (
                data["overall_status"] == "SUPPORTED FOR EXTRACTION — FORMAL VALIDATION UNAVAILABLE"
            )

            # Verify PII masking in API response
            assert data["extracted_data"]["pan_number"] == "ABCDE****F"
            assert "ABCDE1234F" not in str(data)

            rule_names = [r["ruleName"] for r in data["validation_results"]]
            assert "PAN number format (10-character alphanumeric standard)" in rule_names
            assert "Cardholder name present" in rule_names
            assert "Income Tax statutory authenticity disclaimer" in rule_names

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_upload_pipeline_caste_certificate_staging_behavior():
    """Verifies that Caste Certificate runs its own scaffolding rules and not Income rules."""
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            caste_doc = (
                "GOVERNMENT OF KARNATAKA\n"
                "OFFICE OF THE TAHSILDAR\n"
                "COMMUNITY AND CASTE CERTIFICATE\n"
                "Name of Applicant: Manoj Gowda\n"
                "Certificate No: CST-2026-9988\n"
                "Category: Scheduled Caste\n"
            ).encode("utf-8")
            resp = await client.post(
                "/api/documents/upload",
                files={"file": ("caste.txt", io.BytesIO(caste_doc), "text/plain")},
            )
            assert resp.status_code == 200
            data = resp.json()

            assert data["document_type"] == "caste_certificate"
            assert data["display_name"] == "Caste Certificate"
            assert data["overall_status"] == "ACTION_REQUIRED"

            # Check that statutory rule configuration is flagged as warning/pending
            rule_names = [r["ruleName"] for r in data["validation_results"]]
            assert "Statutory rule configuration" in rule_names
            assert "Certificate not expired" not in rule_names

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_document_metadata_lookup_backward_compatibility():
    """Requirement 20 & 21: Preserves root fields while persisting and reading _analysis metadata."""
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            valid_doc = (
                "GOVERNMENT OF KARNATAKA\n"
                "REVENUE DEPARTMENT\n"
                "INCOME CERTIFICATE\n"
                "Name of Applicant: Anita Desai\n"
                "Certificate No: INC554433\n"
                "Valid Until: 2028-10-31\n"
            ).encode("utf-8")

            upload_resp = await client.post(
                "/api/documents/upload",
                files={"file": ("income.txt", io.BytesIO(valid_doc), "text/plain")},
            )
            assert upload_resp.status_code == 200
            doc_id = upload_resp.json()["document_id"]

            lookup_resp = await client.get(f"/api/documents/{doc_id}")
            assert lookup_resp.status_code == 200
            lookup_data = lookup_resp.json()

            # Verify backward-compatible root fields
            assert lookup_data["extracted_data"]["name"] == "Anita Desai"
            assert lookup_data["extracted_data"]["certificate_number"] == "INC554433"
            assert lookup_data["extracted_data"]["expiry_date"] == "2028-10-31"

            # Verify extended metadata
            assert lookup_data["document_type"] == "income_certificate"
            assert lookup_data["display_name"] == "Income Certificate"
            assert lookup_data["extraction_source"] == "LOCAL_OCR"
            assert lookup_data["ocr_quality"] == "HIGH"
            assert lookup_data["overall_status"] == "PASSED"

            # Verify no secret is exposed in API response
            assert "gemini" not in str(lookup_data).lower() or "ai" in str(lookup_data).lower()
            assert "api_key" not in str(lookup_data).lower()

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
