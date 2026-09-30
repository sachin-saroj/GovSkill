from app.services.document_registry.base import DocumentDefinition, RuleResult
from app.services.document_registry.birth import BIRTH_CERTIFICATE_DEFINITION
from app.services.document_registry.caste import CASTE_CERTIFICATE_DEFINITION
from app.services.document_registry.domicile import DOMICILE_CERTIFICATE_DEFINITION
from app.services.document_registry.residence import RESIDENCE_CERTIFICATE_DEFINITION
from app.services.document_registry.aadhaar import AADHAAR_DEFINITION, mask_aadhaar_number
from app.services.document_registry.pan import PAN_DEFINITION, mask_pan_number
from app.services.document_registry.voter_id import VOTER_ID_DEFINITION
from app.services.document_registry.driving_license import DRIVING_LICENSE_DEFINITION
from app.services.document_registry.passport import PASSPORT_DEFINITION
from app.services.document_registry.education import EDUCATION_CERTIFICATE_DEFINITION
from app.services.document_registry.marriage import MARRIAGE_CERTIFICATE_DEFINITION
from app.services.document_registry.disability import DISABILITY_CERTIFICATE_DEFINITION
from app.services.document_registry.income import (
    INCOME_CERTIFICATE_DEFINITION,
    validate_income_certificate,
)
from app.services.document_registry.registry import (
    SUPPORTED_DOCUMENTS,
    UNKNOWN_DOCUMENT_DEFINITION,
    UNSUPPORTED_DOCUMENT_DEFINITION,
    assess_ocr_quality,
    classify_document,
    extract_document_fields,
    get_document_definition,
    mask_sensitive_field,
    normalize_extracted_value,
    prepare_vision_payload,
)

__all__ = [
    "DocumentDefinition",
    "RuleResult",
    "INCOME_CERTIFICATE_DEFINITION",
    "CASTE_CERTIFICATE_DEFINITION",
    "DOMICILE_CERTIFICATE_DEFINITION",
    "RESIDENCE_CERTIFICATE_DEFINITION",
    "BIRTH_CERTIFICATE_DEFINITION",
    "AADHAAR_DEFINITION",
    "PAN_DEFINITION",
    "VOTER_ID_DEFINITION",
    "DRIVING_LICENSE_DEFINITION",
    "PASSPORT_DEFINITION",
    "EDUCATION_CERTIFICATE_DEFINITION",
    "MARRIAGE_CERTIFICATE_DEFINITION",
    "DISABILITY_CERTIFICATE_DEFINITION",
    "UNKNOWN_DOCUMENT_DEFINITION",
    "UNSUPPORTED_DOCUMENT_DEFINITION",
    "SUPPORTED_DOCUMENTS",
    "classify_document",
    "get_document_definition",
    "assess_ocr_quality",
    "extract_document_fields",
    "normalize_extracted_value",
    "mask_sensitive_field",
    "mask_aadhaar_number",
    "mask_pan_number",
    "prepare_vision_payload",
    "validate_income_certificate",
]
