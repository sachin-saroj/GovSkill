import os
import pytest
from app.services.ocr_service import extract_raw_text, parse_structured_fields

try:
    import fitz
except ImportError:
    fitz = None


def test_parse_structured_fields_realistic_formats():
    # Format 1: Standard Income Certificate text
    raw_1 = """
    GOVERNMENT OF MAHARASHTRA
    INCOME CERTIFICATE
    Name of Applicant: Shri Ramesh Gupta
    Income Certificate No: INC-987654321
    Valid Until: 2027-03-31
    """
    res_1 = parse_structured_fields(raw_1)
    assert res_1["name"] == "Shri Ramesh Gupta"
    assert res_1["certificate_number"] == "INC-987654321"
    assert res_1["expiry_date"] == "2027-03-31"

    # Format 2: Slash date format & alternative labels
    raw_2 = """
    DISTRICT MAGISTRATE OFFICE
    Applicant: Smt. Sunita Sharma
    Cert No: GOV12345678
    Valid Upto: 15/08/2026
    """
    res_2 = parse_structured_fields(raw_2)
    assert res_2["name"] == "Smt. Sunita Sharma"
    assert res_2["certificate_number"] == "GOV12345678"
    assert res_2["expiry_date"] == "2026-08-15"

    # Format 3: Minimal fields
    raw_3 = "Name: Anita Desai\nCertificate Number: 887766\nExpiry: 2025-11-30"
    res_3 = parse_structured_fields(raw_3)
    assert res_3["name"] == "Anita Desai"
    assert res_3["certificate_number"] == "887766"
    assert res_3["expiry_date"] == "2025-11-30"

    # Format 4: Natural language name and textual date
    raw_4 = """
    This is to certify that Shri Prakash Rao son of...
    Certificate Number: INC123999
    Valid Until: 31st Dec 2025
    """
    res_4 = parse_structured_fields(raw_4)
    assert res_4["name"] == "Prakash Rao"
    assert res_4["certificate_number"] == "INC123999"
    assert res_4["expiry_date"] == "2025-12-31"

    # Format 5: Financial year validity
    raw_5 = """
    certified that Smt Kamala Devi is a resident of...
    Cert No: GOV-888-777
    Valid for the Year 2024-25
    """
    res_5 = parse_structured_fields(raw_5)
    assert res_5["name"] == "Kamala Devi"
    assert res_5["certificate_number"] == "GOV-888-777"
    assert res_5["expiry_date"] == "2025-03-31"


def test_parse_structured_fields_dirty_ocr_text():
    dirty_text = """
    OFFICIAL CERTIFICATE DEPT
    Holder Name : Vikram Patel
    Certificate # : INC445566
    Validity : 2026-06-30
    Some extra noise lines at bottom...
    """
    res = parse_structured_fields(dirty_text)
    assert res["name"] == "Vikram Patel"
    assert res["certificate_number"] == "INC445566"
    assert res["expiry_date"] == "2026-06-30"


@pytest.mark.skipif(fitz is None, reason="PyMuPDF not installed")
def test_pdf_extraction_with_pymupdf(tmp_path):
    # Create a real simple PDF file using PyMuPDF fitz
    pdf_path = os.path.join(str(tmp_path), "test_doc.pdf")
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        fitz.Point(50, 100),
        "GOVERNMENT INCOME CERTIFICATE\nApplicant Name: Amit Verma\nCertificate No: INC778899\nValid Until: 2028-12-31",
    )
    doc.save(pdf_path)
    doc.close()

    # Test extract_raw_text on PDF
    extracted = extract_raw_text(pdf_path)
    assert "Amit Verma" in extracted
    assert "INC778899" in extracted

    # Test parse_structured_fields on PDF raw text
    fields = parse_structured_fields(extracted)
    assert fields["name"] == "Amit Verma"
    assert fields["certificate_number"] == "INC778899"
    assert fields["expiry_date"] == "2028-12-31"
