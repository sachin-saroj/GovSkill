import os
import re
from PIL import Image
import pytesseract

# Auto-detect Tesseract executable path on Windows if standard installation exists
if os.name == "nt":
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
    ]
    for p in possible_paths:
        if os.path.exists(p):
            pytesseract.pytesseract.tesseract_cmd = p
            break


def extract_raw_text(file_path: str) -> str:
    """
    Extracts raw text from an uploaded image file using Tesseract OCR.
    """
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        if text and text.strip():
            return text.strip()
    except Exception:
        pass

    # Fallback to reading file content as plain text if text/sample file
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    except Exception:
        return ""


def parse_structured_fields(raw_text: str) -> dict[str, str | None]:
    """
    Extracts structured fields (name, certificate_number, expiry_date) from raw OCR text.
    """
    data: dict[str, str | None] = {
        "name": None,
        "certificate_number": None,
        "expiry_date": None,
    }

    if not raw_text:
        return data

    # 1. Extract Name
    name_match = re.search(r"(?:Name|Applicant|Holder)\s*[:|-]\s*([A-Za-z\s.]+)", raw_text, re.IGNORECASE)
    if name_match:
        name_val = name_match.group(1).strip()
        if len(name_val) >= 2:
            data["name"] = name_val

    # 2. Extract Certificate Number
    cert_match = re.search(r"(?:Certificate\s*(?:No|Number|#)?|Cert\s*No)\s*[:|-]\s*([A-Za-z0-9]+)", raw_text, re.IGNORECASE)
    if cert_match:
        data["certificate_number"] = cert_match.group(1).strip()
    else:
        # Standalone alphanumeric pattern like INC123456
        standalone_cert = re.search(r"\b(INC[A-Za-z0-9]{4,})\b", raw_text)
        if standalone_cert:
            data["certificate_number"] = standalone_cert.group(1).strip()

    # 3. Extract Expiry Date
    date_match = re.search(r"(?:Expiry|Valid\s*Until|Valid\s*Thru|Expires)\s*[:|-]?\s*(\d{4}-\d{2}-\d{2})", raw_text, re.IGNORECASE)
    if date_match:
        data["expiry_date"] = date_match.group(1).strip()
    else:
        # Fallback date pattern YYYY-MM-DD
        any_date = re.search(r"\b(20\d{2}-\d{2}-\d{2})\b", raw_text)
        if any_date:
            data["expiry_date"] = any_date.group(1).strip()

    return data
