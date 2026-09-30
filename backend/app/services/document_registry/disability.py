from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_disability_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Disability Certificates (UDID).
    """
    results: list[RuleResult] = []

    # Check 1: UDID Number
    udid = extracted_data.get("udid_number") or extracted_data.get("certificate_number")
    udid_valid = bool(udid and isinstance(udid, str) and len(udid.strip()) >= 6)
    results.append(
        {
            "rule_name": "UDID / Certificate number format",
            "passed": udid_valid,
            "field": "udid_number",
            "reason": (
                f"UDID / Certificate number '{udid}' verified on document."
                if udid_valid
                else "Unable to detect valid UDID or certificate number."
            ),
            "severity": "critical",
            "recommended_action": "Ensure the 18-digit UDID number or certificate reference is clearly visible.",
        }
    )

    # Check 2: Applicant name
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "Applicant name present",
            "passed": name_valid,
            "field": "name",
            "reason": (
                f"Applicant name '{name}' verified on document."
                if name_valid
                else "Unable to detect applicant name."
            ),
            "severity": "critical",
            "recommended_action": "Ensure applicant name is clearly readable.",
        }
    )

    # Check 3: Medical Board Disclaimer
    results.append(
        {
            "rule_name": "Department of Empowerment of PwD authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": "UDID format extracted. Official Medical Authority / Swavlamban portal registration was not verified.",
            "severity": "info",
            "recommended_action": "Verify UDID card status on swavlambancard.gov.in.",
        }
    )

    return results


DISABILITY_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="disability_certificate",
    display_name="Disability Certificate (UDID)",
    detection_keywords=[
        "unique disability id",
        "udid",
        "disability certificate",
        "department of empowerment of persons with disabilities",
        "swavlamban",
    ],
    aliases=["udid_card", "handicap_certificate"],
    required_fields=["udid_number", "name"],
    expected_fields=["udid_number", "name", "disability_type", "percentage"],
    field_patterns={
        "udid_number": [
            r"(?:UDID\s*(?:No|Number)|Certificate\s*No|Disability\s*ID)\s*[:|-]?\s*([A-Za-z0-9/-]+)",
        ],
        "name": [
            r"(?:Name\s*of\s*Person\s*with\s*Disability|Name\s*of\s*Applicant|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
    },
    validator=validate_disability_certificate,
    is_supported=True,
    description="Official Unique Disability ID (UDID) Certificate issued by Competent Medical Authority.",
)
