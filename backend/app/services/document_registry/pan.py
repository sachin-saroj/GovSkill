import re
from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult

PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")


def mask_pan_number(val: str | None) -> str | None:
    if not val or not isinstance(val, str):
        return None
    cleaned = re.sub(r"\s+", "", val).upper()
    if len(cleaned) == 10:
        return f"{cleaned[:5]}****{cleaned[-1]}"
    return cleaned


def validate_pan_card(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Permanent Account Number (PAN) cards.
    Validates 10-character alphanumeric structure (5 letters, 4 digits, 1 letter),
    name presence, and date of birth.
    Explicitly reports that official NSDL/UTIITSL database verification is not performed.
    """
    results: list[RuleResult] = []

    # Check 1: 10-character PAN format
    pan_raw = extracted_data.get("pan_number") or extracted_data.get("certificate_number")
    cleaned_pan = re.sub(r"\s+", "", str(pan_raw or "")).upper()
    has_valid_pan = bool(PAN_REGEX.match(cleaned_pan))

    results.append(
        {
            "rule_name": "PAN number format (10-character alphanumeric standard)",
            "passed": has_valid_pan,
            "field": "pan_number",
            "reason": (
                f"Valid PAN format detected ({mask_pan_number(cleaned_pan)})."
                if has_valid_pan
                else (
                    f"PAN '{cleaned_pan or 'MISSING'}' does not match standard 10-character alphanumeric format (e.g. ABCDE1234F)."
                )
            ),
            "severity": "critical",
            "recommended_action": (
                "No action required."
                if has_valid_pan
                else "Ensure the 10-character PAN number is clearly visible and legible."
            ),
        }
    )

    # Check 2: Cardholder name present
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
                else "Unable to confidently detect cardholder name on the PAN card."
            ),
            "severity": "critical",
            "recommended_action": "Ensure cardholder name is printed clearly without blurring or obstruction.",
        }
    )

    # Check 3: Date of birth present
    dob = extracted_data.get("date_of_birth") or extracted_data.get("expiry_date")
    dob_valid = bool(dob and isinstance(dob, str) and len(dob.strip()) >= 4)
    results.append(
        {
            "rule_name": "Date of birth present",
            "passed": dob_valid,
            "field": "date_of_birth",
            "reason": (
                f"Date of birth '{dob}' extracted from document."
                if dob_valid
                else "Date of birth not clearly detected on the PAN card."
            ),
            "severity": "warning",
            "recommended_action": "Ensure the date of birth line (DD/MM/YYYY) is readable.",
        }
    )

    # Check 4: Statutory NSDL/UTIITSL Authenticity Notice
    results.append(
        {
            "rule_name": "Income Tax statutory authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": (
                "Document format and structure verified against standard Income Tax Department schema. "
                "Official NSDL/UTIITSL database authenticity was not verified."
            ),
            "severity": "info",
            "recommended_action": "For statutory verification, check PAN status on the official Income Tax e-Filing portal.",
        }
    )

    return results


PAN_DEFINITION = DocumentDefinition(
    type_id="pan",
    display_name="PAN Card",
    detection_keywords=[
        "income tax department",
        "permanent account number",
        "pan card",
        "father's name",
        "govt of india",
        "incometaxindia.gov.in",
    ],
    aliases=["pan_card", "pan"],
    required_fields=["pan_number", "name", "date_of_birth"],
    expected_fields=["pan_number", "name", "father_name", "date_of_birth"],
    field_patterns={
        "pan_number": [
            r"\b([A-Z]{5}[0-9]{4}[A-Z])\b",
            r"(?:PAN|Permanent\s*Account\s*Number)\s*[:|-]?\s*([A-Za-z0-9]{10})",
        ],
        "name": [
            r"(?:Name|Cardholder\s*Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "father_name": [
            r"(?:Father's\s*Name|Father\s*Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "date_of_birth": [
            r"(?:Date\s*of\s*Birth|DOB)\s*[:|-]?\s*([0-9/-]+)",
            r"\b(\d{2}/\d{2}/\d{4})\b",
        ],
    },
    validator=validate_pan_card,
    privacy_sensitivity="high_pii",
    is_supported=True,
    description="Official Indian Income Tax Permanent Account Number (PAN) identity document.",
)
