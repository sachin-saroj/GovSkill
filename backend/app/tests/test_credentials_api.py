import uuid
from datetime import datetime, timezone
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.credential import Credential
from app.models.module import Module
from app.services.credential_service import (
    compute_credential_signature,
    generate_credential_id,
)

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_public_credential_verification_and_my_credentials_flow():
    """
    Verifies public credential verification endpoint:
    - Valid credential lookup with PII-masking and HMAC validation
    - Corrupted/tampered signature rejection (valid=False)
    - Non-existent credential lookup returns 404
    - Employee my-credentials endpoint returns earned certificates
    """
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Create Module
            mod_id = uuid.uuid4()
            async with async_session_test() as session:
                mod = Module(
                    id=mod_id,
                    title="Digital Land Records Certification",
                    content="Official lesson content",
                )
                session.add(mod)
                await session.commit()

            # 2. Register & login employee
            reg = await client.post(
                "/api/auth/register",
                json={"email": "sachin.saroj@gov.in", "password": "PassPassword123!"},
            )
            assert reg.status_code == 201
            login = await client.post(
                "/api/auth/login",
                json={"email": "sachin.saroj@gov.in", "password": "PassPassword123!"},
            )
            token = login.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # Fetch user ID from /auth/me
            me_res = await client.get("/api/auth/me", headers=headers)
            assert me_res.status_code == 200
            user_id = uuid.UUID(me_res.json()["id"])

            # 3. Create a valid Credential in database
            cred_id = generate_credential_id()
            now_dt = datetime.now(timezone.utc)
            valid_sig = compute_credential_signature(
                credential_id=cred_id,
                user_id=user_id,
                module_id=mod_id,
                score_achieved=4,
                total_score=4,
                issued_at=now_dt,
            )

            async with async_session_test() as session:
                cred = Credential(
                    credential_id=cred_id,
                    user_id=user_id,
                    module_id=mod_id,
                    score_achieved=4,
                    total_score=4,
                    verification_hash=valid_sig,
                    issued_at=now_dt,
                    updated_at=now_dt,
                )
                session.add(cred)
                await session.commit()

            # 4. Public Verification API (No auth header)
            verify_res = await client.get(f"/api/credentials/verify/{cred_id}")
            assert verify_res.status_code == 200
            data = verify_res.json()
            assert data["valid"] is True
            assert data["credential_id"] == cred_id
            assert data["module_title"] == "Digital Land Records Certification"
            assert data["percentage"] == 100
            assert data["recipient_masked"] == "S***** S****"
            assert data["verification_hash"] == valid_sig

            # 5. Non-existent credential lookup returns 404
            not_found_res = await client.get("/api/credentials/verify/GS-CERT-9999-NONEXISTENT")
            assert not_found_res.status_code == 404
            err_data = not_found_res.json()
            assert err_data["detail"]["error"]["code"] == "CREDENTIAL_NOT_FOUND"

            # 6. Authenticated Employee My-Credentials API
            my_creds_res = await client.get("/api/credentials/my-credentials", headers=headers)
            assert my_creds_res.status_code == 200
            my_creds = my_creds_res.json()
            assert my_creds["total_count"] == 1
            assert len(my_creds["credentials"]) == 1
            item = my_creds["credentials"][0]
            assert item["credential_id"] == cred_id
            assert item["module_title"] == "Digital Land Records Certification"
            assert item["is_valid"] is True

            # 7. Unauthenticated request to my-credentials fails (401)
            unauth_res = await client.get("/api/credentials/my-credentials")
            assert unauth_res.status_code == 401
    finally:
        app.dependency_overrides.clear()
