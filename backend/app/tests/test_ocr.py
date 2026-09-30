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


def test_parse_karnataka_income_certificate_format():
    """Verifies extraction against the exact format of Karnataka Income Certificate."""
    sample_ocr = """
    GOVERNMENT OF KARNATAKA
    REVENUE DEPARTMENT - OFFICE OF THE TAHSILDAR

    INCOME CERTIFICATE

    Certificate Number : INC2026458321
    Name of Applicant : Sachin Saroj
    Father's / Guardian's Name : Ramesh Saroj
    Address : House No. 42, Gandhi Nagar, Mysuru, Karnataka - 570001

    Annual Income : Rs. 1,85,000 per annum
    Date of Issue : 15/01/2026
    Valid Until : 14/01/2027

    This certificate is issued based on the records available
    in this office and is valid for one year from the date of issue.

    Place: Mysuru (Signature)
    Date: 15/01/2026 Tahsildar
    """
    res = parse_structured_fields(sample_ocr)
    assert res["name"] == "Sachin Saroj"
    assert res["certificate_number"] == "INC2026458321"
    assert res["expiry_date"] == "2027-01-14"


def test_parse_missing_and_invalid_fields():
    """Verifies that missing or invalid certificate fields produce None rather than false positives."""
    # Missing name
    no_name = "Certificate Number: INC123456\nValid Until: 2028-01-01"
    assert parse_structured_fields(no_name)["name"] is None

    # Missing certificate number
    no_cert = "Name of Applicant: Rahul V\nValid Until: 2028-01-01"
    assert parse_structured_fields(no_cert)["certificate_number"] is None

    # Missing expiry date
    no_date = "Name of Applicant: Rahul V\nCertificate Number: INC123456"
    assert parse_structured_fields(no_date)["expiry_date"] is None

    # Invalid noise text
    noise = "Just some arbitrary document without any certificate labels or numbers"
    res_noise = parse_structured_fields(noise)
    assert res_noise["name"] is None
    assert res_noise["certificate_number"] is None
    assert res_noise["expiry_date"] is None


def test_extract_raw_text_binary_image_safety(tmp_path):
    """Ensures binary image files are never read as UTF-8 text if OCR fails."""
    # Write dummy binary PNG bytes
    fake_png = os.path.join(str(tmp_path), "test.png")
    with open(fake_png, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR" + b"\x00" * 100)

    # When OCR fails on fake/unsupported image, raw_text should be empty string, NOT binary strings
    raw = extract_raw_text(fake_png)
    assert raw == ""
    fields = parse_structured_fields(raw)
    assert fields == {"name": None, "certificate_number": None, "expiry_date": None}


def test_extract_raw_text_corrupt_file_handling(tmp_path):
    """Ensures corrupt files return empty string cleanly without unhandled exceptions."""
    corrupt_file = os.path.join(str(tmp_path), "corrupt.jpg")
    with open(corrupt_file, "wb") as f:
        f.write(b"NOT_A_VALID_IMAGE_DATA_12345")

    raw = extract_raw_text(corrupt_file)
    assert raw == ""
