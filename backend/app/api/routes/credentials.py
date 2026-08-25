from datetime import timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.core.rate_limiter import InMemoryRateLimiter
from app.models.credential import Credential
from app.models.module import Module
from app.models.user import User
from app.schemas.credential import (
    CredentialVerifyResponse,
    EmployeeCredentialItem,
    EmployeeCredentialsResponse,
)
from app.services.credential_service import (
    mask_recipient_name,
    verify_credential_signature,
)

router = APIRouter(prefix="/credentials", tags=["credentials"])

verify_limiter = InMemoryRateLimiter(max_requests=30, window_seconds=60)


@router.get("/verify/{credential_id}", response_model=CredentialVerifyResponse)
async def verify_credential(
    credential_id: str,
    db: AsyncSession = Depends(get_db),
    _rate_limit: None = Depends(verify_limiter),
):
    """
    Public Verification API for Official Digital Credentials.
    Rate-limited, PII-masked, and validated using server-side HMAC-SHA256 signatures.
    """
    clean_id = credential_id.strip()
    stmt = (
        select(Credential, Module.title, User.email)
        .join(Module, Credential.module_id == Module.id)
        .join(User, Credential.user_id == User.id)
        .where(Credential.credential_id == clean_id)
    )
    result = await db.execute(stmt)
    row = result.first()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "code": "CREDENTIAL_NOT_FOUND",
                    "message": "Official credential record not found or invalid credential ID.",
                }
            },
        )

    cred, module_title, user_email = row

    is_valid = verify_credential_signature(cred)
    pct = round((cred.score_achieved / cred.total_score) * 100) if cred.total_score > 0 else 0
    masked_name = mask_recipient_name(user_email)

    issued_at_dt = cred.issued_at
    if hasattr(issued_at_dt, "tzinfo") and issued_at_dt.tzinfo is None:
        issued_at_dt = issued_at_dt.replace(tzinfo=timezone.utc)
    issued_iso = (
        issued_at_dt.isoformat() if hasattr(issued_at_dt, "isoformat") else str(issued_at_dt)
    )

    return CredentialVerifyResponse(
        valid=is_valid,
        credential_id=cred.credential_id,
        module_id=cred.module_id,
        module_title=module_title,
        issued_at=issued_iso,
        recipient_masked=masked_name,
        score_achieved=cred.score_achieved,
        total_score=cred.total_score,
        percentage=pct,
        verification_hash=cred.verification_hash,
    )


@router.get("/my-credentials", response_model=EmployeeCredentialsResponse)
async def list_my_credentials(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns all verified digital credentials earned by the authenticated employee.
    """
    stmt = (
        select(Credential, Module.title)
        .join(Module, Credential.module_id == Module.id)
        .where(Credential.user_id == current_user.id)
        .order_by(Credential.issued_at.desc())
    )
    result = await db.execute(stmt)
    rows = result.all()

    items: list[EmployeeCredentialItem] = []
    for cred, module_title in rows:
        is_valid = verify_credential_signature(cred)
        pct = round((cred.score_achieved / cred.total_score) * 100) if cred.total_score > 0 else 0

        issued_at_dt = cred.issued_at
        if hasattr(issued_at_dt, "tzinfo") and issued_at_dt.tzinfo is None:
            issued_at_dt = issued_at_dt.replace(tzinfo=timezone.utc)
        issued_iso = (
            issued_at_dt.isoformat() if hasattr(issued_at_dt, "isoformat") else str(issued_at_dt)
        )

        items.append(
            EmployeeCredentialItem(
                credential_id=cred.credential_id,
                module_id=cred.module_id,
                module_title=module_title,
                score_achieved=cred.score_achieved,
                total_score=cred.total_score,
                percentage=pct,
                issued_at=issued_iso,
                verification_hash=cred.verification_hash,
                is_valid=is_valid,
            )
        )

    return EmployeeCredentialsResponse(
        credentials=items,
        total_count=len(items),
    )
