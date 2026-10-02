import hashlib
import logging
import secrets
import urllib.parse
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user, get_current_user, get_db
from app.core.config import settings
from app.core.rate_limiter import InMemoryRateLimiter
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.admin_invite import AdminInvite
from app.models.email_otp import EmailOTP
from app.models.user import User
from app.schemas.user import (
    AdminInviteRequest,
    AdminInviteResponse,
    AdminRegisterRequest,
    LoginOTPVerifyRequest,
    MessageResponse,
    RegisterRequest,
    RegisterVerifyRequest,
    TokenResponse,
    UserChangePassword,
    UserLogin,
    UserResponse,
)
from app.services.notifier import (
    send_admin_invite,
    send_login_otp,
    send_registration_otp,
)

logger = logging.getLogger("govskill.auth")

router = APIRouter(prefix="/auth", tags=["auth"])

register_ip_limiter = InMemoryRateLimiter(max_requests=10, window_seconds=60, key_prefix="auth_reg")
login_ip_limiter = InMemoryRateLimiter(max_requests=15, window_seconds=60, key_prefix="auth_login_ip")
login_email_limiter = InMemoryRateLimiter(max_requests=5, window_seconds=60, key_prefix="auth_login_email")
otp_ip_limiter = InMemoryRateLimiter(max_requests=10, window_seconds=60, key_prefix="auth_otp")


@router.post("/register", response_model=MessageResponse)
async def register(
    payload: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _limiter: None = Depends(register_ip_limiter),
):
    clean_email = payload.email.strip().lower()

    existing_user = (
        await db.execute(select(User.id).where(User.email == clean_email))
    ).scalar_one_or_none()
    if existing_user:
        return MessageResponse(message="Verification code sent.")

    otp = f"{secrets.randbelow(1_000_000):06d}"
    otp_record = EmailOTP(
        email=clean_email,
        otp_hash=get_password_hash(otp),
        purpose="register_verify",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )
    db.add(otp_record)
    await db.commit()

    await send_registration_otp(clean_email, otp)
    return MessageResponse(message="Verification code sent.")


@router.post("/register/verify", response_model=TokenResponse)
async def register_verify(
    payload: RegisterVerifyRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _limiter: None = Depends(register_ip_limiter),
):
    clean_email = payload.email.strip().lower()
    now = datetime.now(timezone.utc)

    query = (
        select(EmailOTP)
        .where(
            EmailOTP.email == clean_email,
            EmailOTP.purpose == "register_verify",
            EmailOTP.consumed_at.is_(None),
            EmailOTP.expires_at > now,
        )
        .order_by(EmailOTP.created_at.desc())
        .limit(1)
    )
    otp_record = (await db.execute(query)).scalar_one_or_none()
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_VERIFICATION", "message": "Invalid or expired verification code."}},
        )

    otp_record.attempt_count += 1
    if otp_record.attempt_count > 5:
        otp_record.consumed_at = now
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_VERIFICATION", "message": "Invalid or expired verification code."}},
        )

    if not verify_password(payload.otp, otp_record.otp_hash):
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_VERIFICATION", "message": "Invalid or expired verification code."}},
        )

    otp_record.consumed_at = now

    existing = (
        await db.execute(select(User.id).where(User.email == clean_email))
    ).scalar_one_or_none()
    if existing:
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_VERIFICATION", "message": "Invalid or expired verification code."}},
        )

    user = User(
        email=clean_email,
        password_hash=get_password_hash(payload.password),
        role="employee",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(
        subject=user.id, role=user.role, token_version=user.token_version
    )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post("/register/admin", response_model=TokenResponse)
async def register_admin(
    payload: AdminRegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _limiter: None = Depends(register_ip_limiter),
):
    clean_email = payload.email.strip().lower()
    now = datetime.now(timezone.utc)

    if payload.invite_token and payload.invite_token.strip():
        token_hash = hashlib.sha256(payload.invite_token.strip().encode("utf-8")).hexdigest()
        invite_query = select(AdminInvite).where(
            AdminInvite.token_hash == token_hash,
            AdminInvite.used_at.is_(None),
            AdminInvite.expires_at > now,
        )
        invite = (await db.execute(invite_query)).scalar_one_or_none()
        if not invite or invite.email.lower() != clean_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": {"code": "INVALID_INVITE", "message": "Invite invalid or expired."}},
            )

        invite.used_at = now

        existing_user = (
            await db.execute(select(User.id).where(User.email == clean_email))
        ).scalar_one_or_none()
        if existing_user:
            await db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": {"code": "INVALID_INVITE", "message": "Invite invalid or expired."}},
            )

        user = User(
            email=clean_email,
            password_hash=get_password_hash(payload.password),
            role="admin",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        access_token = create_access_token(
            subject=user.id, role=user.role, token_version=user.token_version
        )
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )

    bootstrap_email = settings.BOOTSTRAP_ADMIN_EMAIL.strip().lower()
    if not bootstrap_email or clean_email != bootstrap_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_INVITE", "message": "Invite invalid or expired."}},
        )

    # Advisory lock key 727001 serializes concurrent bootstrap admin creations in PostgreSQL
    if db.get_bind().dialect.name == "postgresql":
        await db.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": 727001})

    admin_count = (
        await db.execute(select(func.count(User.id)).where(User.role == "admin"))
    ).scalar() or 0
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_INVITE", "message": "Invite invalid or expired."}},
        )

    user = User(
        email=clean_email,
        password_hash=get_password_hash(payload.password),
        role="admin",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    logger.info("Bootstrap admin created. Remove BOOTSTRAP_ADMIN_EMAIL from the deployment environment.")

    access_token = create_access_token(
        subject=user.id, role=user.role, token_version=user.token_version
    )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


# Returns {access_token, token_type, user} for employees or {requires_otp: true, otp_session_id} for admin 2FA
@router.post("/login")
async def login(
    credentials: UserLogin,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _limiter: None = Depends(login_ip_limiter),
):
    clean_email = credentials.email.strip().lower()
    login_email_limiter.check_key(f"login_email:{clean_email}", max_requests=5, window_seconds=60)

    result = await db.execute(select(User).where(User.email == clean_email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "ACCOUNT_DISABLED", "message": "User account has been disabled."}},
        )

    if user.role == "employee":
        access_token = create_access_token(
            subject=user.id, role=user.role, token_version=user.token_version
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user).model_dump(mode="json"),
        }

    otp = f"{secrets.randbelow(1_000_000):06d}"
    otp_record = EmailOTP(
        user_id=user.id,
        email=user.email,
        otp_hash=get_password_hash(otp),
        purpose="login_2fa",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
    )
    db.add(otp_record)
    await db.commit()

    await send_login_otp(user.email, otp)
    return {"requires_otp": True, "otp_session_id": str(otp_record.id)}


@router.post("/login/verify-otp", response_model=TokenResponse)
async def login_verify_otp(
    payload: LoginOTPVerifyRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _limiter: None = Depends(otp_ip_limiter),
):
    now = datetime.now(timezone.utc)
    query = select(EmailOTP).where(
        EmailOTP.id == payload.otp_session_id,
        EmailOTP.purpose == "login_2fa",
        EmailOTP.consumed_at.is_(None),
        EmailOTP.expires_at > now,
    )
    otp_record = (await db.execute(query)).scalar_one_or_none()
    if not otp_record or not otp_record.user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_OTP", "message": "Invalid or expired verification code."}},
        )

    otp_record.attempt_count += 1
    if otp_record.attempt_count > 5:
        otp_record.consumed_at = now
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_OTP", "message": "Invalid or expired verification code."}},
        )

    if not verify_password(payload.otp, otp_record.otp_hash):
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "INVALID_OTP", "message": "Invalid or expired verification code."}},
        )

    otp_record.consumed_at = now
    user = await db.get(User, otp_record.user_id)
    if not user or not user.is_active:
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "ACCOUNT_DISABLED", "message": "User account has been disabled."}},
        )

    await db.commit()
    access_token = create_access_token(
        subject=user.id, role=user.role, token_version=user.token_version
    )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post("/invites", response_model=MessageResponse)
async def create_invite(
    payload: AdminInviteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    clean_email = payload.email.strip().lower()
    now = datetime.now(timezone.utc)

    existing_user = (
        await db.execute(select(User.id).where(User.email == clean_email))
    ).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "EMAIL_EXISTS", "message": "Email already registered."}},
        )

    active_invites = (
        await db.execute(
            select(AdminInvite).where(
                AdminInvite.email == clean_email,
                AdminInvite.used_at.is_(None),
                AdminInvite.expires_at > now,
            )
        )
    ).scalars().all()
    for inv in active_invites:
        inv.used_at = now

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    invite = AdminInvite(
        email=clean_email,
        token_hash=token_hash,
        expires_at=now + timedelta(minutes=30),
        created_by_user_id=current_user.id,
    )
    db.add(invite)
    await db.commit()

    encoded_email = urllib.parse.quote(clean_email)
    invite_link = f"{settings.FRONTEND_URL}/register-admin?token={raw_token}&email={encoded_email}"
    await send_admin_invite(clean_email, invite_link)
    return MessageResponse(message="Invite sent.")


@router.get("/invites", response_model=list[AdminInviteResponse])
async def list_invites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    now = datetime.now(timezone.utc)
    invites = (
        await db.execute(select(AdminInvite).order_by(AdminInvite.created_at.desc()))
    ).scalars().all()

    return [
        AdminInviteResponse(
            id=inv.id,
            email=inv.email,
            created_at=inv.created_at.isoformat(),
            expires_at=inv.expires_at.isoformat(),
            created_by_user_id=inv.created_by_user_id,
            is_expired=inv.expires_at <= now,
            is_used=inv.used_at is not None,
        )
        for inv in invites
    ]


@router.delete("/invites/{invite_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_invite(
    invite_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    now = datetime.now(timezone.utc)
    invite = await db.get(AdminInvite, invite_id)
    if not invite or invite.used_at is not None or invite.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "INVITE_NOT_FOUND", "message": "Invite not found or already processed."}},
        )

    invite.used_at = now
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/change-password", response_model=UserResponse)
async def change_password(
    payload: UserChangePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_CURRENT_PASSWORD", "message": "Incorrect current password"}},
        )

    current_user.password_hash = get_password_hash(payload.new_password)
    current_user.token_version += 1
    await db.commit()
    await db.refresh(current_user)

    return current_user
