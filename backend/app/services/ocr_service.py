import os
import re
from PIL import Image
import pytesseract

try:
    import fitz  # PyMuPDF for PDF rendering & text extraction
except ImportError:
    fitz = None

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


def _extract_pdf_text(file_path: str) -> str:
    """
    Extracts raw text from PDF files using PyMuPDF (direct text extraction + OCR fallback).
    """
    if not fitz:
        return ""

    try:
        doc = fitz.open(file_path)
        extracted_pages = []

        for page in doc:
            page_text = page.get_text()
            if page_text and len(page_text.strip()) > 15:
                extracted_pages.append(page_text.strip())
            else:
                # Scanned image PDF page -> render pixmap and run Tesseract OCR
                pix = page.get_pixmap(dpi=150)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                ocr_text = pytesseract.image_to_string(img)
                if ocr_text:
                    extracted_pages.append(ocr_text.strip())

        doc.close()
        return "\n".join(extracted_pages).strip()
    except Exception:
        return ""


def extract_raw_text(file_path: str) -> str:
    """
    Extracts raw text from an uploaded file (images, PDFs, text samples).
    """
    ext = os.path.splitext(file_path)[1].lower()

    # 1. PDF File Processing
    if ext == ".pdf":
        pdf_text = _extract_pdf_text(file_path)
        if pdf_text:
            return pdf_text

    # 2. Image File OCR Processing (JPG, PNG)
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        if text and text.strip():
            return text.strip()
    except Exception:
        pass

    # 3. Fallback to reading plain text / sample files
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    except Exception:
        return ""


def _normalize_date(date_str: str) -> str | None:
    date_str = date_str.strip()
    # YYYY-MM-DD format
    if re.match(r"^\d{4}-\d{2}-\d{2}$", date_str):
        return date_str
    # DD/MM/YYYY or DD-MM-YYYY format
    m = re.match(r"^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$", date_str)
    if m:
        day, month, year = m.groups()
        return f"{year}-{int(month):02d}-{int(day):02d}"
    return None


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
    name_patterns = [
        r"(?:Name\s*of\s*Applicant|Applicant\s*Name|Holder\s*Name|Applicant|Holder|Name)\s*[:|-]\s*([A-Za-z\s.]+)",
        r"(?:Shri|Smt|Kumari|Mr|Mrs|Ms)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)",
    ]
    for pat in name_patterns:
        name_match = re.search(pat, raw_text, re.IGNORECASE)
        if name_match:
            candidate = name_match.group(1).split("\n")[0].strip()
            # Cleanup noise words
            candidate = re.sub(r"\b(?:is|has|been|verified|certified)\b.*$", "", candidate, flags=re.IGNORECASE).strip()
            if len(candidate) >= 2:
                data["name"] = candidate
                break

    # 2. Extract Certificate Number
    cert_patterns = [
        r"(?:Income\s*Certificate\s*(?:No|Number|#)|Certificate\s*(?:No|Number|#)|Cert\s*(?:No|#))\s*[:|-|#]\s*([A-Za-z0-9/-]+)",
        r"\b(INC[A-Za-z0-9/-]{3,})\b",
        r"\b(GOV[A-Za-z0-9/-]{3,})\b",
        r"Certificate\s*[:|-]\s*([A-Za-z0-9/-]+)",
    ]
    for pat in cert_patterns:
        cert_match = re.search(pat, raw_text, re.IGNORECASE)
        if cert_match:
            cert_val = cert_match.group(1).strip()
            if len(cert_val) >= 3 and cert_val.upper() not in ["DEPT", "OFFICE", "GOVERNMENT", "APPLICANT"]:
                data["certificate_number"] = cert_val
                break


    # 3. Extract Expiry Date
    date_patterns = [
        r"(?:Expiry\s*Date|Valid\s*Until|Valid\s*Thru|Valid\s*Upto|Expires|Validity)\s*[:|-]?\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[/.-]\d{1,2}[/.-]\d{4})",
        r"\b(20\d{2}-\d{2}-\d{2})\b",
        r"\b(\d{1,2}[/.-]\d{1,2}[/.-]20\d{2})\b",
    ]
    for pat in date_patterns:
        date_match = re.search(pat, raw_text, re.IGNORECASE)
        if date_match:
            normalized = _normalize_date(date_match.group(1))
            if normalized:
                data["expiry_date"] = normalized
                break

    return data

