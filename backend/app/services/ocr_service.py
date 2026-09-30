import logging
import os
import re
from datetime import datetime
from PIL import Image, ImageEnhance
import pytesseract

logger = logging.getLogger("govskill.ocr")

try:
    import fitz  # PyMuPDF for PDF rendering & text extraction
except ImportError:
    fitz = None


def _ensure_tesseract_cmd() -> str:
    """Auto-detects and sets Tesseract executable path on Windows."""
    if os.name == "nt":
        possible_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
        ]
        for p in possible_paths:
            if os.path.exists(p):
                pytesseract.pytesseract.tesseract_cmd = p
                return p
    return pytesseract.pytesseract.tesseract_cmd


# Initial path check
_ensure_tesseract_cmd()


def _get_tessdata_dir() -> str | None:
    """Finds directory containing Tesseract language models (e.g. eng.traineddata)."""
    candidates = [
        os.environ.get("TESSDATA_PREFIX", ""),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "tessdata")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "tessdata")),
        os.path.abspath("tessdata"),
        "/usr/share/tesseract-ocr/5/tessdata",
        "/usr/share/tesseract-ocr/4.00/tessdata",
        "/usr/share/tessdata",
    ]
    for c in candidates:
        if c and os.path.exists(c) and os.path.isdir(c):
            return c
    return None


def _preprocess_image(img: Image.Image) -> Image.Image:
    """Enhances image quality for optimal OCR text extraction."""
    # Convert to grayscale
    img = img.convert("L")
    # Boost contrast (2.0x)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)
    # Binarization thresholding
    img = img.point(lambda x: 0 if x < 140 else 255, "1")
    return img


def _extract_pdf_text(file_path: str) -> str:
    """
    Extracts text from PDF files using PyMuPDF (direct text extraction + OCR fallback).
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
                img = _preprocess_image(img)
                _ensure_tesseract_cmd()
                ocr_text = None
                try:
                    ocr_text = pytesseract.image_to_string(img)
                except Exception:
                    ocr_text = None
                if not ocr_text or not ocr_text.strip():
                    try:
                        tp = page.get_textpage_ocr(tessdata=_get_tessdata_dir())
                        ocr_text = page.get_text(textpage=tp)
                    except Exception:
                        ocr_text = None
                if ocr_text and ocr_text.strip():
                    extracted_pages.append(ocr_text.strip())

        doc.close()
        return "\n".join(extracted_pages).strip()
    except Exception as exc:
        logger.warning("PDF extraction failed for '%s': %s", file_path, exc)
        return ""


def extract_raw_text(file_path: str) -> str:
    """
    STAGE 1: RAW OCR
    Extracts verbatim raw text from an uploaded file (images, PDFs, text samples).
    """
    ext = os.path.splitext(file_path)[1].lower()

    # 1. PDF File Processing
    if ext == ".pdf":
        pdf_text = _extract_pdf_text(file_path)
        if pdf_text:
            return pdf_text

    # 2. Image File OCR Processing (JPG, PNG)
    # 2a. Try pytesseract first
    try:
        _ensure_tesseract_cmd()
        image = Image.open(file_path)
        # First try preprocessed image
        prep = _preprocess_image(image)
        text = pytesseract.image_to_string(prep)
        if not text or not text.strip():
            # Fallback to direct image (digital certificates often OCR best without harsh binarization)
            text = pytesseract.image_to_string(image)
        if text and text.strip():
            return text.strip()
    except Exception as exc:
        logger.warning("pytesseract image OCR failed for '%s': %s", file_path, exc)

    # 2b. Fallback to PyMuPDF embedded Tesseract engine
    if fitz:
        try:
            tessdata_dir = _get_tessdata_dir()
            img_doc = fitz.open(file_path)
            pdf_bytes = img_doc.convert_to_pdf()
            img_doc.close()
            pdf = fitz.open("pdf", pdf_bytes)
            page = pdf[0]
            tp = page.get_textpage_ocr(tessdata=tessdata_dir)
            fitz_text = page.get_text(textpage=tp)
            pdf.close()
            if fitz_text and fitz_text.strip():
                return fitz_text.strip()
        except Exception as exc:
            logger.warning("PyMuPDF embedded Tesseract OCR failed for '%s': %s", file_path, exc)

    # 3. Fallback to reading plain text / sample files (only for text files)
    if ext in [".txt", ".text"]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read().strip()
        except Exception as exc:
            logger.warning("Plain text read failed for '%s': %s", file_path, exc)
            return ""

    return ""


def _normalize_date(date_str: str) -> str | None:
    """Normalizes various textual/numerical date formats to ISO YYYY-MM-DD."""
    if not date_str or not date_str.strip():
        return None

    date_str = date_str.strip()

    # YYYY-MM-DD format
    if re.match(r"^\d{4}-\d{2}-\d{2}$", date_str):
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
            return date_str
        except ValueError:
            return None

    # DD/MM/YYYY or DD-MM-YYYY format
    m = re.match(r"^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$", date_str)
    if m:
        day, month, year = m.groups()
        try:
            iso_candidate = f"{year}-{int(month):02d}-{int(day):02d}"
            datetime.strptime(iso_candidate, "%Y-%m-%d")
            return iso_candidate
        except ValueError:
            return None

    # Textual dates like "31st Dec 2025" or "Dec 31, 2025"
    m_text = re.search(
        r"(\d{1,2})(?:st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[,]?\s+(\d{4})",
        date_str,
        re.IGNORECASE,
    )
    if m_text:
        day, month_str, year = m_text.groups()
        months = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ]
        month_idx = months.index(month_str.lower()[:3]) + 1
        try:
            iso_candidate = f"{year}-{month_idx:02d}-{int(day):02d}"
            datetime.strptime(iso_candidate, "%Y-%m-%d")
            return iso_candidate
        except ValueError:
            return None

    m_text_rev = re.search(
        r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?[,]?\s+(\d{4})",
        date_str,
        re.IGNORECASE,
    )
    if m_text_rev:
        month_str, day, year = m_text_rev.groups()
        months = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ]
        month_idx = months.index(month_str.lower()[:3]) + 1
        try:
            iso_candidate = f"{year}-{month_idx:02d}-{int(day):02d}"
            datetime.strptime(iso_candidate, "%Y-%m-%d")
            return iso_candidate
        except ValueError:
            return None

    # Year formats like "2024-25" -> Assume validity until end of financial year March 31, 2025
    m_year = re.search(r"(\d{4})-(\d{2})", date_str)
    if m_year:
        year_start, year_end_suffix = m_year.groups()
        year_end = year_start[:2] + year_end_suffix
        return f"{year_end}-03-31"

    return None


def parse_structured_fields(raw_text: str) -> dict[str, str | None]:
    """
    STAGE 2: NORMALIZATION
    Extracts structured fields (name, certificate_number, expiry_date) from raw OCR text.
    Normalizes candidate fields without silently transforming ambiguous/corrupt data.
    """
    data: dict[str, str | None] = {
        "name": None,
        "certificate_number": None,
        "expiry_date": None,
    }

    if not raw_text or not raw_text.strip():
        return data

    # 1. Extract and Normalize Name
    name_patterns = [
        r"(?:Name\s*of\s*Applicant|Applicant\s*Name|Holder\s*Name|Applicant|Holder|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        r"(?:Shri|Smt|Kumari|Mr|Mrs|Ms)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)",
        r"(?:certify that|certified that)\s+(?:Shri|Smt|Kumari|Mr|Mrs|Ms)?\.?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+(?:son|daughter|wife)\s+of",
        r"(?:certify that|certified that)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+is",
    ]
    for pat in name_patterns:
        name_match = re.search(pat, raw_text, re.IGNORECASE)
        if name_match:
            candidate = name_match.group(1).split("\n")[0].strip()
            # Strip noise words
            candidate = re.sub(
                r"\b(?:is|has|been|verified|certified|son|daughter|wife|of)\b.*$",
                "",
                candidate,
                flags=re.IGNORECASE,
            ).strip()
            # Reject if candidate is unreadable symbols or single character
            if len(candidate) >= 2 and re.search(r"[A-Za-z]{2,}", candidate):
                data["name"] = candidate
                break

    # 2. Extract and Normalize Certificate Number
    cert_patterns = [
        r"(?:Income\s*Certificate\s*(?:No|Number|#)|Certificate\s*(?:No|Number|#)|Cert\s*(?:No|#))\s*[:|-|#]?\s*([A-Za-z0-9/-]+)",
        r"\b(INC[A-Za-z0-9/-]{3,})\b",
        r"\b(GOV[A-Za-z0-9/-]{3,})\b",
        r"Certificate\s*[:|-]\s*([A-Za-z0-9/-]+)",
    ]
    for pat in cert_patterns:
        cert_match = re.search(pat, raw_text, re.IGNORECASE)
        if cert_match:
            cert_val = cert_match.group(1).strip()
            if (
                len(cert_val) >= 3
                and any(c.isdigit() for c in cert_val)
                and cert_val.upper()
                not in [
                    "DEPT",
                    "OFFICE",
                    "GOVERNMENT",
                    "APPLICANT",
                    "CERTIFICATE",
                    "INCOME",
                ]
            ):
                data["certificate_number"] = cert_val
                break

    # 3. Extract and Normalize Expiry Date
    date_patterns = [
        r"(?:Expiry\s*Date|Valid\s*Until|Valid\s*Thru|Valid\s*Upto|Expires|Validity)\s*[:|-]?\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[/.-]\d{1,2}[/.-]\d{4})",
        r"(?:Expiry\s*Date|Valid\s*Until|Valid\s*Thru|Valid\s*Upto|Expires|Validity)\s*[:|-]?\s*(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?[,]?\s+\d{4})",
        r"Valid\s*for\s*(?:the\s*)?(?:Year\s*)?(\d{4}-\d{2})",
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
