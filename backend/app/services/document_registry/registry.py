import io
import logging
import os
import re
from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult
from app.services.document_registry.income import INCOME_CERTIFICATE_DEFINITION
from app.services.document_registry.caste import CASTE_CERTIFICATE_DEFINITION
from app.services.document_registry.domicile import DOMICILE_CERTIFICATE_DEFINITION
from app.services.document_registry.residence import RESIDENCE_CERTIFICATE_DEFINITION
from app.services.document_registry.birth import BIRTH_CERTIFICATE_DEFINITION
from app.services.document_registry.aadhaar import AADHAAR_DEFINITION, mask_aadhaar_number
from app.services.document_registry.pan import PAN_DEFINITION, mask_pan_number
from app.services.document_registry.voter_id import VOTER_ID_DEFINITION
from app.services.document_registry.driving_license import DRIVING_LICENSE_DEFINITION
from app.services.document_registry.passport import PASSPORT_DEFINITION
from app.services.document_registry.education import EDUCATION_CERTIFICATE_DEFINITION
from app.services.document_registry.marriage import MARRIAGE_CERTIFICATE_DEFINITION
from app.services.document_registry.disability import DISABILITY_CERTIFICATE_DEFINITION
from app.services.ocr_service import parse_structured_fields

logger = logging.getLogger("govskill.registry")


def _validate_unknown(data: dict[str, Any]) -> list[RuleResult]:
    return [
        {
            "rule_name": "Document category identification",
            "passed": False,
            "field": "document_type",
            "reason": "Unable to identify the document type. The scan lacks recognized civic certificate or identity headers.",
            "severity": "critical",
            "recommended_action": "Please upload a clear scan of a supported certificate or identity document.",
        }
    ]


def _validate_unsupported(data: dict[str, Any]) -> list[RuleResult]:
    return [
        {
            "rule_name": "Document category supported",
            "passed": False,
            "field": "document_type",
            "reason": "The uploaded document belongs to an unsupported category (e.g., utility bill, bank statement, or private commercial invoice).",
            "severity": "critical",
            "recommended_action": "GovAssist pre-check supports official government civic certificates, identity cards, licenses, and vital records only.",
        }
    ]


UNKNOWN_DOCUMENT_DEFINITION = DocumentDefinition(
    type_id="unknown_document",
    display_name="Unknown Document",
    detection_keywords=[],
    required_fields=[],
    field_patterns={},
    validator=_validate_unknown,
    is_supported=False,
    description="Document type could not be confidently identified.",
)

UNSUPPORTED_DOCUMENT_DEFINITION = DocumentDefinition(
    type_id="unsupported_document",
    display_name="Unsupported Document",
    detection_keywords=[],
    required_fields=[],
    field_patterns={},
    validator=_validate_unsupported,
    is_supported=False,
    description="Identified document category is not supported by GovAssist.",
)

SUPPORTED_DOCUMENTS: dict[str, DocumentDefinition] = {
    INCOME_CERTIFICATE_DEFINITION.type_id: INCOME_CERTIFICATE_DEFINITION,
    CASTE_CERTIFICATE_DEFINITION.type_id: CASTE_CERTIFICATE_DEFINITION,
    DOMICILE_CERTIFICATE_DEFINITION.type_id: DOMICILE_CERTIFICATE_DEFINITION,
    RESIDENCE_CERTIFICATE_DEFINITION.type_id: RESIDENCE_CERTIFICATE_DEFINITION,
    BIRTH_CERTIFICATE_DEFINITION.type_id: BIRTH_CERTIFICATE_DEFINITION,
    AADHAAR_DEFINITION.type_id: AADHAAR_DEFINITION,
    PAN_DEFINITION.type_id: PAN_DEFINITION,
    VOTER_ID_DEFINITION.type_id: VOTER_ID_DEFINITION,
    DRIVING_LICENSE_DEFINITION.type_id: DRIVING_LICENSE_DEFINITION,
    PASSPORT_DEFINITION.type_id: PASSPORT_DEFINITION,
    EDUCATION_CERTIFICATE_DEFINITION.type_id: EDUCATION_CERTIFICATE_DEFINITION,
    MARRIAGE_CERTIFICATE_DEFINITION.type_id: MARRIAGE_CERTIFICATE_DEFINITION,
    DISABILITY_CERTIFICATE_DEFINITION.type_id: DISABILITY_CERTIFICATE_DEFINITION,
}

# Known categories that citizens might upload but GovAssist explicitly does not pre-check (bills, invoices, statements)
UNSUPPORTED_KEYWORDS = [
    "electricity bill",
    "water bill",
    "water supply",
    "consumption bill",
    "utility bill",
    "gas bill",
    "bank statement",
    "account statement",
    "state bank",
    "bank of",
    "credit card statement",
    "restaurant bill",
    "grocery receipt",
    "cash invoice",
    "tax invoice",
    "bill of supply",
    "shopping receipt",
    "salary slip",
    "pay slip",
]


def classify_document(raw_text: str) -> DocumentDefinition:
    """
    Deterministically classifies a document using extracted OCR text.
    Distinguishes supported civic/identity types, unsupported non-civic categories,
    and unknown documents.
    """
    if not raw_text or not raw_text.strip():
        return UNKNOWN_DOCUMENT_DEFINITION

    text_lower = raw_text.lower()

    # 1. Check for recognized non-civic unsupported document types
    for kw in UNSUPPORTED_KEYWORDS:
        if kw in text_lower:
            return UNSUPPORTED_DOCUMENT_DEFINITION

    # 2. Score supported definitions
    scored: list[tuple[int, DocumentDefinition]] = []
    for doc_def in SUPPORTED_DOCUMENTS.values():
        score = 0
        for kw in doc_def.detection_keywords:
            if kw in text_lower:
                # Multi-word exact matches get higher weight
                score += 3 if " " in kw else 1

        # Check exact title match
        if doc_def.display_name.lower() in text_lower:
            score += 5

        # Check aliases
        for alias in doc_def.aliases:
            if alias.replace("_", " ") in text_lower:
                score += 3

        scored.append((score, doc_def))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_score, top_def = scored[0]

    # Require minimum confidence score
    if top_score >= 2:
        return top_def

    return UNKNOWN_DOCUMENT_DEFINITION


def get_document_definition(type_id: str) -> DocumentDefinition:
    """Retrieves document definition by type_id with fallback to unknown."""
    if type_id == "unsupported_document":
        return UNSUPPORTED_DOCUMENT_DEFINITION
    return SUPPORTED_DOCUMENTS.get(type_id, UNKNOWN_DOCUMENT_DEFINITION)


def mask_sensitive_field(field_name: str, value: str | None) -> str | None:
    """Safely masks highly sensitive PII values (Aadhaar, PAN) by key name or pattern."""
    if not value or not isinstance(value, str):
        return None
    fn = field_name.lower()
    val_clean = value.strip()

    # Aadhaar pattern (12 digits) or field name
    digits = re.sub(r"\D", "", val_clean)
    if "aadhaar" in fn or fn == "uid" or len(digits) == 12:
        return mask_aadhaar_number(value)

    # PAN pattern (5 uppercase letters, 4 digits, 1 letter) or field name
    pan_match = re.search(r"\b([A-Za-z]{5}[0-9]{4}[A-Za-z])\b", val_clean)
    if "pan" in fn or pan_match:
        return mask_pan_number(value)

    return value


def assess_ocr_quality(
    raw_text: str,
    parsed_fields: dict[str, Any],
    doc_def: DocumentDefinition,
) -> dict[str, Any]:
    """
    Deterministic quality evaluation interface for OCR text.
    Evaluates readability, noise ratio, and document-specific required field presence.
    Returns a structured decision: 'sufficient', 'insufficient', or 'ambiguous'.
    """
    if not raw_text or not raw_text.strip():
        return {
            "is_sufficient": False,
            "decision": "insufficient",
            "quality_grade": "UNREADABLE",
            "text_length": 0,
            "noise_ratio": 1.0,
            "missing_required_fields": doc_def.required_fields,
            "issues": ["No text detected on the document scan."],
            "reason": "Document scan is blank or OCR extraction produced no readable characters.",
        }

    text_len = len(raw_text.strip())
    alphanumeric_count = sum(1 for c in raw_text if c.isalnum() or c.isspace())
    noise_ratio = 1.0 - (alphanumeric_count / max(len(raw_text), 1))

    missing_fields = [
        f
        for f in doc_def.required_fields
        if not parsed_fields.get(f)
        or not str(parsed_fields.get(f)).strip()
        or str(parsed_fields.get(f)).upper() == "NOT DETECTED"
    ]

    issues: list[str] = []
    if text_len < 40:
        issues.append("Document text is sparse or truncated.")
    if noise_ratio > 0.35:
        issues.append("High optical noise detected in document scan.")
    if missing_fields:
        issues.append(f"Missing required fields: {', '.join(missing_fields)}.")

    # Classification & quality checks
    if doc_def.type_id in ("unknown_document", "unsupported_document"):
        decision = "insufficient"
        is_sufficient = False
        quality_grade = "LOW" if noise_ratio > 0.30 else "MEDIUM"
        reason = f"Document is classified as {doc_def.type_id}."
    elif missing_fields:
        # Missing critical required fields must NEVER be classified as HIGH quality or sufficient
        decision = (
            "ambiguous"
            if (text_len >= 40 and len(missing_fields) < len(doc_def.required_fields))
            else "insufficient"
        )
        is_sufficient = False
        quality_grade = (
            "MEDIUM"
            if (text_len >= 40 and len(missing_fields) < len(doc_def.required_fields))
            else "LOW"
        )
        reason = f"Document identified as {doc_def.display_name} but missing critical required field(s): {', '.join(missing_fields)}."
    elif (text_len >= 50) and (noise_ratio <= 0.35):
        decision = "sufficient"
        is_sufficient = True
        quality_grade = "HIGH"
        reason = (
            "Local OCR extraction contains sufficient clarity and all required certificate fields."
        )
    else:
        decision = "insufficient"
        is_sufficient = False
        quality_grade = "LOW"
        reason = "Local OCR text quality is degraded or missing critical document fields."

    return {
        "is_sufficient": is_sufficient,
        "decision": decision,
        "quality_grade": quality_grade,
        "text_length": text_len,
        "noise_ratio": round(noise_ratio, 3),
        "missing_required_fields": missing_fields,
        "issues": issues,
        "reason": reason,
    }


def prepare_vision_payload(file_path: str) -> tuple[bytes, str] | None:
    """
    Prepares a privacy-safe, bandwidth-optimized image payload for Gemini Vision.
    - Preserves readability without sending unnecessarily huge files.
    - Handles PDFs by converting first page to PNG.
    - Resizes excessively large images (>1600px) using high-quality downsampling.
    - Never logs image bytes or citizen PII.
    """
    if not os.path.exists(file_path):
        return None

    ext = os.path.splitext(file_path)[1].lower()

    try:
        if ext == ".pdf":
            try:
                import fitz

                doc = fitz.open(file_path)
                if len(doc) == 0:
                    doc.close()
                    return None
                page = doc[0]
                pix = page.get_pixmap(dpi=150)
                img_bytes = pix.tobytes("png")
                doc.close()
                return img_bytes, "image/png"
            except Exception as pdf_err:
                logger.warning("PDF page rendering failed: %s", type(pdf_err).__name__)
                return None
        elif ext in (".png", ".jpg", ".jpeg"):
            from PIL import Image

            with Image.open(file_path) as img:
                max_dim = max(img.width, img.height)
                if max_dim > 1600:
                    scale = 1600.0 / max_dim
                    new_size = (int(img.width * scale), int(img.height * scale))
                    img = img.resize(new_size, Image.Resampling.LANCZOS)

                buf = io.BytesIO()
                img.save(buf, format="PNG")
                return buf.getvalue(), "image/png"
        elif ext == ".txt":
            with open(file_path, "rb") as f:
                return f.read(), "text/plain"
        return None
    except Exception as exc:
        logger.warning("Failed to prepare vision payload: %s", type(exc).__name__)
        return None


def normalize_extracted_value(field_name: str, value: str | None) -> str | None:
    """
    Safely normalizes an extracted field without fabricating or guessing ambiguous data.
    """
    if not value or not isinstance(value, str):
        return None

    cleaned = value.strip()
    if not cleaned:
        return None

    # Date normalization
    if any(k in field_name.lower() for k in ("date", "until", "valid", "dob")):
        m_iso = re.match(r"^(\d{4})-(\d{2})-(\d{2})$", cleaned)
        if m_iso:
            return cleaned
        from app.services.ocr_service import _normalize_date

        norm_d = _normalize_date(cleaned)
        if norm_d:
            return norm_d

    # Certificate / ID number normalization (trim whitespace, preserve alphanumeric/hyphen)
    if any(
        k in field_name.lower()
        for k in (
            "certificate",
            "number",
            "pan",
            "aadhaar",
            "epic",
            "license",
            "passport",
            "udid",
            "roll",
        )
    ):
        cleaned = re.sub(r"\s+", "", cleaned)
        return cleaned

    # General name / text normalization (collapse multiple whitespace)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned


def extract_document_fields(raw_text: str, doc_def: DocumentDefinition) -> dict[str, Any]:
    """
    Extracts structured fields according to document definition patterns,
    falling back to standard certificate normalization for common fields.
    """
    fields: dict[str, Any] = {
        "name": None,
        "certificate_number": None,
        "expiry_date": None,
    }
    if not raw_text or not raw_text.strip():
        return fields

    # Run base certificate extraction
    base_extracted = parse_structured_fields(raw_text)
    fields.update(base_extracted)

    # Document-specific pattern extraction
    for field_name, patterns in doc_def.field_patterns.items():
        if not fields.get(field_name):
            for pat in patterns:
                m = re.search(pat, raw_text, re.IGNORECASE)
                if m:
                    candidate = m.group(1).split("\n")[0].strip()
                    if candidate:
                        fields[field_name] = candidate
                        break
            if field_name not in fields:
                fields[field_name] = None

    # Harmonize common field aliases
    if not fields.get("certificate_number"):
        for alt_key in (
            "aadhaar_number",
            "pan_number",
            "epic_number",
            "license_number",
            "passport_number",
            "registration_number",
            "roll_number",
            "udid_number",
        ):
            if fields.get(alt_key):
                fields["certificate_number"] = fields[alt_key]
                break

    if not fields.get("name"):
        for alt_key in ("child_name", "candidate_name", "husband_name"):
            if fields.get(alt_key):
                fields["name"] = fields[alt_key]
                break

    if not fields.get("expiry_date"):
        for alt_key in ("valid_until", "date_of_birth", "marriage_date", "passing_year"):
            if fields.get(alt_key):
                fields["expiry_date"] = fields[alt_key]
                break

    return fields
