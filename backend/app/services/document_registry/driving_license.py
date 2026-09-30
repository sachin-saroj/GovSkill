from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_driving_license(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Driving Licenses.
    """
    results: list[RuleResult] = []

    # Check 1: License Number Format
    dl_no = extracted_data.get("license_number") or extracted_data.get("certificate_number")
    dl_valid = bool(dl_no and isinstance(dl_no, str) and len(dl_no.strip()) >= 8)
    results.append(
        {
            "rule_name": "Driving License number format",
            "passed": dl_valid,
            "field": "license_number",
            "reason": (
                f"Driving license number '{dl_no}' verified on document."
                if dl_valid
                else "Unable to detect valid driving license number (e.g. DL-XXXXXXXXXXXXX)."
            ),
            "severity": "critical",
            "recommended_action": "Ensure the license number line is clearly visible.",
        }
    )

    # Check 2: License holder name present
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "License holder name present",
            "passed": name_valid,
            "field": "name",
            "reason": (
                f"License holder name '{name}' verified on document."
                if name_valid
                else "Unable to detect license holder name."
            ),
            "severity": "critical",
            "recommended_action": "Ensure driver name is clearly readable.",
        }
    )

    # Check 3: Validity / Expiry check
    valid_until = extracted_data.get("valid_until") or extracted_data.get("expiry_date")
    valid_date_present = bool(
        valid_until and isinstance(valid_until, str) and len(valid_until.strip()) >= 4
    )
    results.append(
        {
            "rule_name": "Validity / Expiry date present",
            "passed": valid_date_present,
            "field": "valid_until",
            "reason": (
                f"License validity date '{valid_until}' detected."
                if valid_date_present
                else "License validity date not detected."
            ),
            "severity": "warning",
            "recommended_action": "Ensure the validity date (Non-Transport / Transport) is visible.",
        }
    )

    # Check 4: Sarathi / MoRTH Authenticity Notice
    results.append(
        {
            "rule_name": "MoRTH statutory authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": "License format extracted. Official Ministry of Road Transport and Highways (Sarathi/Parivahan) validity was not verified.",
            "severity": "info",
            "recommended_action": "For statutory verification, check status on the official Parivahan Sewa portal (parivahan.gov.in).",
        }
    )

    return results


DRIVING_LICENSE_DEFINITION = DocumentDefinition(
    type_id="driving_license",
    display_name="Driving License",
    detection_keywords=[
        "driving licence",
        "driving license",
        "motor vehicles department",
        "union of india driving licence",
        "licence to drive",
        "license to drive",
        "parivahan",
        "transport department",
    ],
    aliases=["driving_licence", "dl"],
    required_fields=["license_number", "name"],
    expected_fields=["license_number", "name", "date_of_birth", "valid_until", "blood_group"],
    field_patterns={
        "license_number": [
            r"\b([A-Z]{2}[0-9]{2}[0-9\s-]{11,16})\b",
            r"(?:DL\s*(?:No|Number|#)?|Licence\s*No|License\s*No)\s*[:|-]?\s*([A-Za-z0-9/-]+)",
        ],
        "name": [
            r"(?:Name|Holder\s*Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "valid_until": [
            r"(?:Valid\s*(?:Upto|Till|Until)|NT\s*Valid\s*Till)\s*[:|-]?\s*([0-9/-]+)",
        ],
    },
    validator=validate_driving_license,
    is_supported=True,
    description="Official Indian State Motor Vehicles Department Driving License.",
)
