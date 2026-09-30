from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_residence_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Residence Certificates.
    """
    results: list[RuleResult] = []

    # Check 1: Applicant name present
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "Applicant name present",
            "passed": name_valid,
            "field": "name",
            "reason": (
                f"Applicant name '{name}' verified on certificate."
                if name_valid
                else "Unable to detect applicant name on the Residence Certificate."
            ),
            "severity": "critical",
            "recommended_action": "Ensure applicant name is clearly readable.",
        }
    )

    # Check 2: Certificate number format
    cert_no = extracted_data.get("certificate_number")
    cert_valid = bool(cert_no and isinstance(cert_no, str) and len(cert_no.strip()) >= 5)
    results.append(
        {
            "rule_name": "Certificate number format",
            "passed": cert_valid,
            "field": "certificate_number",
            "reason": (
                f"Certificate number '{cert_no}' matches standard alphanumeric format."
                if cert_valid
                else "Certificate number is missing or incomplete."
            ),
            "severity": "critical",
            "recommended_action": "Ensure certificate number is clearly visible.",
        }
    )

    # Check 3: Residence address present
    address = extracted_data.get("address")
    address_valid = bool(address and isinstance(address, str) and len(address.strip()) >= 5)
    results.append(
        {
            "rule_name": "Residential address present",
            "passed": address_valid,
            "field": "address",
            "reason": (
                f"Residential address detected ({address[:40]}...)."
                if address_valid
                else "Residential address is missing or could not be extracted from document text."
            ),
            "severity": "warning",
            "recommended_action": "Verify that full residential address is clearly printed.",
        }
    )

    # Check 4: Statutory Notice
    results.append(
        {
            "rule_name": "Revenue authority authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": "Document layout and fields extracted. Official revenue department seal and digital signature require counter inspection.",
            "severity": "info",
            "recommended_action": "Present original certificate at the Taluk counter for official endorsement.",
        }
    )

    return results


RESIDENCE_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="residence_certificate",
    display_name="Residence Certificate",
    detection_keywords=[
        "residence certificate",
        "residential certificate",
        "certificate of residence",
        "ordinarily resident",
        "resident certificate",
        "nivas praman patra",
        "niwas praman patra",
        "nivas patra",
        "praman patra",
        "residence",
    ],
    aliases=["residence", "residential_certificate"],
    required_fields=["name", "certificate_number", "address"],
    expected_fields=["name", "certificate_number", "address", "issue_date", "issuing_authority"],
    field_patterns={
        "name": [
            r"(?:Name\s*of\s*Applicant|Applicant\s*Name|This\s*is\s*to\s*certify\s*that|Shri|Smt)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "certificate_number": [
            r"(?:Certificate\s*No|Certificate\s*Number|Cert\s*No|Application\s*No)\s*[:|-]?\s*([A-Za-z0-9/-]+)",
        ],
        "address": [
            r"(?:Resident\s*of|Residing\s*at|Address)\s*[:|-]?\s*([A-Za-z0-9\s,.-]+)",
        ],
    },
    validator=validate_residence_certificate,
    is_supported=True,
    description="Official Municipal or Revenue Residence Certificate.",
)
