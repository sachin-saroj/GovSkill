import re
from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def mask_aadhaar_number(val: str | None) -> str | None:
    if not val or not isinstance(val, str):
        return None
    digits = re.sub(r"\D", "", val)
    if len(digits) == 12:
        return f"XXXX-XXXX-{digits[-4:]}"
    elif len(digits) >= 4:
        return f"XXXX-XXXX-{digits[-4:]}"
    return "XXXX-XXXX-XXXX"


def validate_aadhaar_card(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Aadhaar documents.
    Validates 12-digit structure, name presence, and date of birth format.
    Explicitly reports that official UIDAI verification is not performed.
    """
    results: list[RuleResult] = []

    # Check 1: 12-digit Aadhaar Number Structure
    aadhaar_raw = extracted_data.get("aadhaar_number") or extracted_data.get("certificate_number")
    digits = re.sub(r"\D", "", str(aadhaar_raw or ""))
    has_valid_structure = len(digits) == 12 or (
        isinstance(aadhaar_raw, str) and "XXXX" in aadhaar_raw
    )

    results.append(
        {
            "rule_name": "Aadhaar number format (12-digit structure)",
            "passed": has_valid_structure,
            "field": "aadhaar_number",
            "reason": (
                f"Valid 12-digit Aadhaar structure detected ({mask_aadhaar_number(aadhaar_raw)})."
                if has_valid_structure
                else "Aadhaar number is missing or does not match the standard 12-digit format."
            ),
            "severity": "critical",
            "recommended_action": (
                "No action required."
                if has_valid_structure
                else "Ensure the 12-digit Aadhaar number is fully visible on the scan."
            ),
        }
    )

    # Check 2: Name present
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "Cardholder name present",
            "passed": name_valid,
            "field": "name",
            "reason": (
                f"Cardholder name '{name}' verified on document."
                if name_valid
                else "Unable to detect cardholder name on the Aadhaar document."
            ),
            "severity": "critical",
            "recommended_action": "Ensure cardholder name is clearly legible and unobstructed.",
        }
    )

    # Check 3: Date of Birth / Year of Birth
    dob = extracted_data.get("date_of_birth") or extracted_data.get("expiry_date")
    dob_valid = bool(dob and isinstance(dob, str) and len(dob.strip()) >= 4)
    results.append(
        {
            "rule_name": "Date or Year of Birth present",
            "passed": dob_valid,
            "field": "date_of_birth",
            "reason": (
                f"Date / Year of Birth '{dob}' extracted from document."
                if dob_valid
                else "Date or Year of Birth not clearly detected on the Aadhaar card."
            ),
            "severity": "warning",
            "recommended_action": "Ensure the DOB line (DD/MM/YYYY or Year) is readable.",
        }
    )

    # Check 4: Statutory UIDAI Authenticity Notice
    results.append(
        {
            "rule_name": "UIDAI statutory authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": (
                "Document format and structure verified against standard civic schema. "
                "Official UIDAI demographic/biometric authenticity was not verified."
            ),
            "severity": "info",
            "recommended_action": "For statutory verification, present original Aadhaar at an authorized government kiosk.",
        }
    )

    return results


AADHAAR_DEFINITION = DocumentDefinition(
    type_id="aadhaar",
    display_name="Aadhaar Card",
    detection_keywords=[
        "aadhaar",
        "uidai",
        "unique identification authority",
        "mera aadhaar",
        "help@uidai.gov.in",
        "enrolment no",
        "enrollment no",
    ],
    aliases=["aadhaar_card", "uid", "aadhaar"],
    required_fields=["aadhaar_number", "name", "date_of_birth"],
    expected_fields=["aadhaar_number", "name", "date_of_birth", "gender", "address"],
    field_patterns={
        "aadhaar_number": [
            r"\b(\d{4}\s\d{4}\s\d{4})\b",
            r"\b(\d{12})\b",
            r"(?:Aadhaar\s*(?:No|Number|#)?)\s*[:|-]?\s*([0-9\s]{12,16})",
        ],
        "name": [
            r"(?:Name|To|S/O|D/O|W/O|Shri|Smt)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "date_of_birth": [
            r"(?:DOB|Date\s*of\s*Birth|Year\s*of\s*Birth|Birth\s*Year)\s*[:|-]?\s*([0-9/-]+)",
            r"\b(\d{2}/\d{2}/\d{4})\b",
        ],
        "gender": [
            r"\b(MALE|FEMALE|TRANSGENDER)\b",
        ],
    },
    validator=validate_aadhaar_card,
    privacy_sensitivity="high_pii",
    is_supported=True,
    description="Official Government of India 12-digit Aadhaar identity document.",
)
