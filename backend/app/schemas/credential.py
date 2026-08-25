import uuid
from pydantic import BaseModel


class CredentialVerifyResponse(BaseModel):
    valid: bool
    credential_id: str
    module_id: uuid.UUID
    module_title: str
    issued_at: str
    recipient_masked: str
    score_achieved: int
    total_score: int
    percentage: int
    verification_hash: str


class EmployeeCredentialItem(BaseModel):
    credential_id: str
    module_id: uuid.UUID
    module_title: str
    score_achieved: int
    total_score: int
    percentage: int
    issued_at: str
    verification_hash: str
    is_valid: bool


class EmployeeCredentialsResponse(BaseModel):
    credentials: list[EmployeeCredentialItem]
    total_count: int
