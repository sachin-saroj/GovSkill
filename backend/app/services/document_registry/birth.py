from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_birth_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Birth Certificates.
    Validates child name, registration number, and date of birth.
    Explicitly reports that municipal legal authenticity was not verified.
    """
    results: list[RuleResult] = []

    # Check 1: Child Name
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "Child name present",
            "passed": name_valid,
            "field": "name",
            "reason": f"Child name '{name}' identified on birth record."
            if name_valid
            else "Child name not detected.",
            "severity": "critical",
            "recommended_action": "Ensure child name is clearly legible.",
        }
    )

    # Check 2: Registration Number
    reg_no = extracted_data.get("registration_number") or extracted_data.get("certificate_number")
    reg_valid = bool(reg_no and isinstance(reg_no, str) and len(reg_no.strip()) >= 3)
    results.append(
        {
            "rule_name": "Registration number structure",
            "passed": reg_valid,
            "field": "registration_number",
            "reason": f"Registration number '{reg_no}' extracted."
            if reg_valid
            else "Registration number missing or unreadable.",
            "severity": "critical",
            "recommended_action": "Verify municipal registration number is clearly visible.",
        }
    )

    # Check 3: Date of Birth
    dob = extracted_data.get("date_of_birth") or extracted_data.get("expiry_date")
    dob_valid = bool(dob and isinstance(dob, str) and len(dob.strip()) >= 4)
    results.append(
        {
            "rule_name": "Date of birth present",
            "passed": dob_valid,
            "field": "date_of_birth",
            "reason": f"Date of birth '{dob}' extracted."
            if dob_valid
            else "Date of birth not detected.",
            "severity": "warning",
            "recommended_action": "Ensure date of birth is legible.",
        }
    )

    # Check 4: Statutory rule configuration warning
    results.append(
        {
            "rule_name": "Statutory rule configuration",
            "passed": False,
            "field": "document",
            "reason": (
                "Statutory pre-submission compliance rules for Birth Certificates are currently "
                "in staging and not yet enabled for automated scoring in this district."
            ),
            "severity": "warning",
            "recommended_action": (
                "Please present your original Birth Certificate directly at the Taluk / Municipal service counter."
            ),
        }
    )

    return results


BIRTH_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="birth_certificate",
    display_name="Birth Certificate",
    detection_keywords=[
        "birth certificate",
        "certificate of birth",
        "birth registration",
        "birth registration certificate",
        "date of birth",
        "registration of births",
        "registration of birth",
        "birth register",
        "place of birth",
    ],
    required_fields=["name", "registration_number", "date_of_birth"],
    field_patterns={
        "name": [
            r"(?:Name\s*of\s*Child|Child\s*Name|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "registration_number": [
            r"(?:Registration\s*(?:No|Number|#)|Reg\s*(?:No|#))\s*[:|-|#]?\s*([A-Za-z0-9/-]+)",
        ],
        "date_of_birth": [
            r"(?:Date\s*of\s*Birth|DOB)\s*[:|-]?\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[/.-]\d{1,2}[/.-]\d{4})",
        ],
    },
    validator=validate_birth_certificate,
    is_supported=True,
    description="Official vital records birth registration certificate.",
)
