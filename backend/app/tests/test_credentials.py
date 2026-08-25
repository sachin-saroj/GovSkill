import uuid
from datetime import datetime, timezone
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.routes.quiz import SEED_QUESTIONS
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.credential import Credential
from app.services.credential_service import (
    compute_credential_signature,
    generate_credential_id,
    mask_recipient_name,
    verify_credential_signature,
)

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_credential_hmac_signing_and_tamper_detection():
    """Verifies that HMAC-SHA256 signatures are computed properly and fail closed upon tampering."""
    user_id = uuid.uuid4()
    module_id = uuid.uuid4()
    cred_id = generate_credential_id()
    assert cred_id.startswith("GS-CERT-")

    issued_dt = datetime(2026, 8, 25, 14, 30, 0, tzinfo=timezone.utc)
    sig = compute_credential_signature(
        credential_id=cred_id,
        user_id=user_id,
        module_id=module_id,
        score_achieved=4,
        total_score=4,
        issued_at=issued_dt,
    )
    assert isinstance(sig, str) and len(sig) == 64

    # Build mock Credential object
    cred = Credential(
        credential_id=cred_id,
        user_id=user_id,
        module_id=module_id,
        score_achieved=4,
        total_score=4,
        verification_hash=sig,
        issued_at=issued_dt,
    )

    # Valid verification
    assert verify_credential_signature(cred) is True

    # Tampered score
    cred.score_achieved = 3
    assert verify_credential_signature(cred) is False

    # Tampered credential_id
    cred.score_achieved = 4
    cred.credential_id = "GS-CERT-2026-FORGED"
    assert verify_credential_signature(cred) is False

    # Empty verification hash
    cred.credential_id = cred_id
    cred.verification_hash = ""
    assert verify_credential_signature(cred) is False


def test_mask_recipient_name():
    """Verifies that recipient PII is masked gracefully for public display."""
    assert mask_recipient_name("sachin.saroj@gov.in") == "S***** S****"
    assert mask_recipient_name("admin@govskill.local") == "A****"
    assert mask_recipient_name("prakash_kumar@state.gov") == "P****** K****"
    assert mask_recipient_name("") == "Certified Officer"


@pytest.mark.asyncio
async def test_quiz_passing_and_failing_credential_issuance_flow():
    """
    End-to-end integration test:
    1. Passing quiz attempt (100%) -> issues credential with credential_id.
    2. Repeated passing attempt -> retains unique credential_id, updates score.
    3. Failing quiz attempt (< 75%) -> does not issue credential.
    """
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Register test employee
            reg = await client.post(
                "/api/auth/register",
                json={"email": "cred_test_emp@gov.in", "password": "PassPassword123!"},
            )
            assert reg.status_code == 201
            login = await client.post(
                "/api/auth/login",
                json={"email": "cred_test_emp@gov.in", "password": "PassPassword123!"},
            )
            token = login.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 2. Get questions for Module 1
            mod_id = "11111111-1111-1111-1111-111111111111"
            q_res = await client.get(f"/api/quiz/{mod_id}", headers=headers)
            assert q_res.status_code == 200
            q_data = q_res.json()["questions"]

            # Map question correct answers from seed
            seed_map = {q["id"]: q["correct_option_index"] for q in SEED_QUESTIONS}

            # 3. Submit failing answers (0 / 4 = 0% < 75%)
            fail_answers = [
                {
                    "question_id": q["id"],
                    "selected_option_index": (seed_map[uuid.UUID(q["id"])] + 1) % 4,
                }
                for q in q_data
            ]
            fail_submit = await client.post(
                f"/api/quiz/{mod_id}/submit",
                json={"answers": fail_answers},
                headers=headers,
            )
            assert fail_submit.status_code == 200
            fail_body = fail_submit.json()
            assert fail_body["passed"] is False
            assert fail_body["credential_id"] is None

            # Verify no credential in database
            async with async_session_test() as session:
                cred_count = await session.execute(select(Credential))
                assert len(cred_count.scalars().all()) == 0

            # 4. Submit passing answers (4 / 4 = 100% >= 75%)
            pass_answers = [
                {
                    "question_id": q["id"],
                    "selected_option_index": seed_map[uuid.UUID(q["id"])],
                }
                for q in q_data
            ]
            pass_submit = await client.post(
                f"/api/quiz/{mod_id}/submit",
                json={"answers": pass_answers},
                headers=headers,
            )
            assert pass_submit.status_code == 200
            pass_body = pass_submit.json()
            assert pass_body["passed"] is True
            assert pass_body["credential_id"] is not None
            issued_cred_id = pass_body["credential_id"]
            assert issued_cred_id.startswith("GS-CERT-")

            # Verify credential saved in database with valid HMAC
            async with async_session_test() as session:
                res = await session.execute(
                    select(Credential).where(Credential.credential_id == issued_cred_id)
                )
                saved_cred = res.scalar_one_or_none()
                assert saved_cred is not None
                assert saved_cred.score_achieved == 4
                assert saved_cred.total_score == 4
                assert verify_credential_signature(saved_cred) is True

            # 5. Submit another passing attempt -> idempotent credential (same credential_id retained)
            second_pass = await client.post(
                f"/api/quiz/{mod_id}/submit",
                json={"answers": pass_answers},
                headers=headers,
            )
            assert second_pass.status_code == 200
            second_body = second_pass.json()
            assert second_body["credential_id"] == issued_cred_id

            # Verify database still has exactly 1 credential record for this user & module
            async with async_session_test() as session:
                user_creds = await session.execute(
                    select(Credential).where(Credential.user_id == saved_cred.user_id)
                )
                assert len(user_creds.scalars().all()) == 1
    finally:
        app.dependency_overrides.clear()
