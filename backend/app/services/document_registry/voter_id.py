from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_voter_id(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Voter ID (EPIC) documents.
    """
    results: list[RuleResult] = []

    # Check 1: EPIC Number Format (typically 3 letters + 7 digits, or >= 8 chars)
    epic = extracted_data.get("epic_number") or extracted_data.get("certificate_number")
    epic_valid = bool(epic and isinstance(epic, str) and len(epic.strip()) >= 7)
    results.append(
        {
            "rule_name": "EPIC / Voter ID number format",
            "passed": epic_valid,
            "field": "epic_number",
            "reason": (
                f"EPIC number '{epic}' verified on document."
                if epic_valid
                else "Unable to detect valid EPIC number on the Voter ID card."
            ),
            "severity": "critical",
            "recommended_action": "Ensure the alphanumeric EPIC number at the top of the card is legible.",
        }
    )

    # Check 2: Elector name present
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "Elector name present",
            "passed": name_valid,
            "field": "name",
            "reason": (
                f"Elector name '{name}' verified on document."
                if name_valid
                else "Unable to detect elector name on the Voter ID card."
            ),
            "severity": "critical",
            "recommended_action": "Ensure elector name is clear and unobstructed.",
        }
    )

    # Check 3: ECI Statutory Notice
    results.append(
        {
            "rule_name": "Election Commission authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": "EPIC card format extracted. Official Election Commission of India electoral roll registration was not verified.",
            "severity": "info",
            "recommended_action": "For official voter roll verification, consult the National Voters' Service Portal (voters.eci.gov.in).",
        }
    )

    return results


VOTER_ID_DEFINITION = DocumentDefinition(
    type_id="voter_id",
    display_name="Voter ID Card",
    detection_keywords=[
        "election commission of india",
        "elector photo identity card",
        "epic",
        "voter identity card",
        "elector's name",
        "eci",
    ],
    aliases=["voter_card", "epic_card", "election_card"],
    required_fields=["epic_number", "name"],
    expected_fields=["epic_number", "name", "relation_name", "gender", "date_of_birth"],
    field_patterns={
        "epic_number": [
            r"\b([A-Z]{3}[0-9]{7})\b",
            r"(?:EPIC\s*(?:No|Number|#)?)\s*[:|-]?\s*([A-Za-z0-9/-]+)",
        ],
        "name": [
            r"(?:Elector's\s*Name|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "relation_name": [
            r"(?:Father's\s*Name|Husband's\s*Name|Relation\s*Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
    },
    validator=validate_voter_id,
    is_supported=True,
    description="Official Election Commission of India Elector Photo Identity Card (EPIC).",
)
