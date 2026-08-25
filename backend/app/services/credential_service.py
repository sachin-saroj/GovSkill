import hashlib
import hmac
import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.credential import Credential


def _canonical_timestamp(dt: datetime | str) -> str:
    """Normalizes any datetime or ISO string to canonical UTC string '%Y-%m-%dT%H:%M:%SZ'."""
    if isinstance(dt, str):
        try:
            clean_str = dt.replace("Z", "+00:00")
            dt_obj = datetime.fromisoformat(clean_str)
        except Exception:
            return dt
    else:
        dt_obj = dt

    if dt_obj.tzinfo is None:
        dt_obj = dt_obj.replace(tzinfo=timezone.utc)
    else:
        dt_obj = dt_obj.astimezone(timezone.utc)

    return dt_obj.strftime("%Y-%m-%dT%H:%M:%SZ")


def generate_credential_id() -> str:
    """Generates a non-guessable official government skill credential ID."""
    year = datetime.now(timezone.utc).year
    suffix = uuid.uuid4().hex[:12].upper()
    return f"GS-CERT-{year}-{suffix}"


def compute_credential_signature(
    credential_id: str,
    user_id: uuid.UUID,
    module_id: uuid.UUID,
    score_achieved: int,
    total_score: int,
    issued_at: datetime | str,
) -> str:
    """
    Computes a server-side HMAC-SHA256 signature for the credential.
    The secret key is stored on the server and never exposed to clients.
    """
    secret = settings.SECRET_KEY.encode("utf-8")
    canon_time = _canonical_timestamp(issued_at)
    payload = f"{credential_id}:{user_id}:{module_id}:{score_achieved}:{total_score}:{canon_time}".encode(
        "utf-8"
    )
    return hmac.new(secret, payload, hashlib.sha256).hexdigest()


def verify_credential_signature(
    credential: Credential,
) -> bool:
    """
    Verifies that the stored signature matches the expected HMAC-SHA256 signature.
    Fails closed if any field has been tampered with or if secret mismatch.
    """
    if not credential or not credential.verification_hash:
        return False

    expected_sig = compute_credential_signature(
        credential_id=credential.credential_id,
        user_id=credential.user_id,
        module_id=credential.module_id,
        score_achieved=credential.score_achieved,
        total_score=credential.total_score,
        issued_at=credential.issued_at,
    )
    return hmac.compare_digest(expected_sig, credential.verification_hash)


def mask_recipient_name(email_or_name: str) -> str:
    """
    Masks recipient identity for public verification without leaking PII.
    Example: 'sachin.saroj@gov.in' -> 'S***** S****'
             'admin@govskill.local' -> 'A****'
    """
    if not email_or_name:
        return "Certified Officer"
    username = email_or_name.split("@")[0]
    parts = [p for p in username.replace(".", " ").replace("_", " ").split() if p]
    if not parts:
        return "Certified Officer"

    masked_parts = []
    for part in parts:
        if len(part) <= 2:
            masked_parts.append(f"{part[0].upper()}*")
        else:
            masked_parts.append(f"{part[0].upper()}{'*' * (len(part) - 1)}")
    return " ".join(masked_parts)


async def issue_or_update_credential(
    db: AsyncSession,
    user_id: uuid.UUID,
    module_id: uuid.UUID,
    score_achieved: int,
    total_score: int,
) -> Credential | None:
    """
    Issues a new official credential or updates an existing one if score improved,
    computing the cryptographic HMAC-SHA256 signature.
    Requires score / total >= 75%.
    """
    if total_score <= 0:
        return None
    percentage = round((score_achieved / total_score) * 100)
    if percentage < 75:
        return None

    # Check for existing credential for user & module
    result = await db.execute(
        select(Credential).where(
            Credential.user_id == user_id,
            Credential.module_id == module_id,
        )
    )
    existing = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    if existing:
        # Update score if higher, recomputing signature with original issued_at
        if score_achieved > existing.score_achieved or total_score != existing.total_score:
            existing.score_achieved = max(existing.score_achieved, score_achieved)
            existing.total_score = total_score
            existing.verification_hash = compute_credential_signature(
                credential_id=existing.credential_id,
                user_id=user_id,
                module_id=module_id,
                score_achieved=existing.score_achieved,
                total_score=total_score,
                issued_at=existing.issued_at,
            )
            existing.updated_at = now
        return existing

    # Generate new credential
    cred_id = generate_credential_id()
    sig = compute_credential_signature(
        credential_id=cred_id,
        user_id=user_id,
        module_id=module_id,
        score_achieved=score_achieved,
        total_score=total_score,
        issued_at=now,
    )
    cred = Credential(
        credential_id=cred_id,
        user_id=user_id,
        module_id=module_id,
        score_achieved=score_achieved,
        total_score=total_score,
        verification_hash=sig,
        issued_at=now,
        updated_at=now,
    )
    db.add(cred)
    await db.flush()
    return cred
