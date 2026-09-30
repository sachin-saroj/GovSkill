from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_education_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Educational Certificates / Marksheets.
    """
    results: list[RuleResult] = []

    # Check 1: Candidate name present
    candidate_name = extracted_data.get("candidate_name") or extracted_data.get("name")
    name_valid = bool(
        candidate_name and isinstance(candidate_name, str) and len(candidate_name.strip()) >= 2
    )
    results.append(
        {
            "rule_name": "Candidate name present",
            "passed": name_valid,
            "field": "candidate_name",
            "reason": (
                f"Candidate name '{candidate_name}' verified on certificate."
                if name_valid
                else "Unable to detect candidate name on the education certificate."
            ),
            "severity": "critical",
            "recommended_action": "Ensure candidate name is clearly legible.",
        }
    )

    # Check 2: Roll or Registration Number
    roll_no = extracted_data.get("roll_number") or extracted_data.get("certificate_number")
    roll_valid = bool(roll_no and isinstance(roll_no, str) and len(roll_no.strip()) >= 4)
    results.append(
        {
            "rule_name": "Roll or Registration number present",
            "passed": roll_valid,
            "field": "roll_number",
            "reason": (
                f"Roll/Registration number '{roll_no}' detected."
                if roll_valid
                else "Roll or Registration number could not be detected."
            ),
            "severity": "critical",
            "recommended_action": "Ensure the student roll number / registration ID is visible.",
        }
    )

    # Check 3: Board or Institution Notice
    results.append(
        {
            "rule_name": "Educational institution authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": "Educational certificate format and grades extracted. Official University or Examination Board roll verification was not verified.",
            "severity": "info",
            "recommended_action": "Official verification requires original degree/marksheet presentation or National Academic Depository (NAD/DigiLocker) validation.",
        }
    )

    return results


EDUCATION_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="education_certificate",
    display_name="Educational Certificate",
    detection_keywords=[
        "board of secondary education",
        "secondary school certificate",
        "higher secondary",
        "marks statement",
        "degree certificate",
        "passing certificate",
        "university",
        "examination board",
    ],
    aliases=["degree", "marksheet", "diploma"],
    required_fields=["candidate_name", "roll_number"],
    expected_fields=["candidate_name", "roll_number", "institution", "passing_year"],
    field_patterns={
        "candidate_name": [
            r"(?:Candidate's\s*Name|Name\s*of\s*Student|Student\s*Name|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "roll_number": [
            r"(?:Roll\s*(?:No|Number|#)|Registration\s*(?:No|Number)|Enrollment\s*(?:No|Number))\s*[:|-]?\s*([A-Za-z0-9/-]+)",
        ],
    },
    validator=validate_education_certificate,
    is_supported=True,
    description="Official School Board, University Degree, or Examination Marksheet.",
)
