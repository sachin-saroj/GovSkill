import uuid
from datetime import datetime, timezone
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.credential import Credential
from app.models.document import CitizenDocument
from app.models.module import Module
from app.models.progress import UserProgress
from app.models.user import User

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_admin_compliance_export_and_citizen_defect_telemetry():
    """
    Verifies Admin Governance Endpoints:
    1. Compliance Export JSON & CSV formats
    2. Role-based access control (Admin required)
    3. Citizen Defect Telemetry calculation across 4 validation rules
    """
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        admin_id = uuid.uuid4()
        emp_id = uuid.uuid4()
        mod_id = uuid.uuid4()

        # Seed Admin, Employee, Module, Progress, Credential, and Citizen Documents
        async with async_session_test() as session:
            admin_user = User(
                id=admin_id,
                email="admin_gov@state.gov",
                password_hash=get_password_hash("AdminSecret123!"),
                role="admin",
            )
            emp_user = User(
                id=emp_id,
                email="officer_rajesh@state.gov",
                password_hash=get_password_hash("OfficerSecret123!"),
                role="employee",
            )
            mod = Module(
                id=mod_id,
                title="Revenue Record Management",
                content="Official course content",
            )
            prog = UserProgress(
                id=uuid.uuid4(),
                user_id=emp_id,
                module_id=mod_id,
                status="completed",
                best_score=4,
                lessons_completed=True,
            )
            cred = Credential(
                credential_id="GS-CERT-2026-RAJESH123456",
                user_id=emp_id,
                module_id=mod_id,
                score_achieved=4,
                total_score=4,
                verification_hash="mock_hash_for_test",
                issued_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )

            # Document 1: All passed
            doc1 = CitizenDocument(
                id=uuid.uuid4(),
                file_path="/tmp/doc1.pdf",
                extracted_data={"name": "Sita Devi", "certificate_number": "INC987654"},
                validation_results=[
                    {"ruleName": "Name present", "passed": True},
                    {"ruleName": "Certificate number format", "passed": True},
                    {"ruleName": "Certificate not expired", "passed": True},
                    {"ruleName": "All required fields extracted", "passed": True},
                ],
                uploaded_at=datetime.now(timezone.utc),
            )

            # Document 2: Name & expiry failed
            doc2 = CitizenDocument(
                id=uuid.uuid4(),
                file_path="/tmp/doc2.pdf",
                extracted_data={"name": None, "certificate_number": "INC123456"},
                validation_results=[
                    {"ruleName": "Name present", "passed": False},
                    {"ruleName": "Certificate number format", "passed": True},
                    {"ruleName": "Certificate not expired", "passed": False},
                    {"ruleName": "All required fields extracted", "passed": False},
                ],
                uploaded_at=datetime.now(timezone.utc),
            )

            session.add_all([admin_user, emp_user, mod, prog, cred, doc1, doc2])
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Login as Admin
            admin_login = await client.post(
                "/api/auth/login",
                json={"email": "admin_gov@state.gov", "password": "AdminSecret123!"},
            )
            assert admin_login.status_code == 200
            admin_token = admin_login.json()["access_token"]
            admin_headers = {"Authorization": f"Bearer {admin_token}"}

            # Login as Employee
            emp_login = await client.post(
                "/api/auth/login",
                json={"email": "officer_rajesh@state.gov", "password": "OfficerSecret123!"},
            )
            assert emp_login.status_code == 200
            emp_token = emp_login.json()["access_token"]
            emp_headers = {"Authorization": f"Bearer {emp_token}"}

            # 1. Non-admin access to export is rejected (403)
            emp_export = await client.get("/api/admin/reports/export", headers=emp_headers)
            assert emp_export.status_code == 403

            # 2. Admin Export JSON format
            json_res = await client.get(
                "/api/admin/reports/export?format=json", headers=admin_headers
            )
            assert json_res.status_code == 200
            json_data = json_res.json()
            assert json_data["total_records"] == 1
            assert json_data["total_certified_count"] == 1
            assert json_data["compliance_rate_pct"] == 100.0
            rec = json_data["records"][0]
            assert rec["employee_email"] == "officer_rajesh@state.gov"
            assert rec["module_title"] == "Revenue Record Management"
            assert rec["certified"] is True
            assert rec["credential_id"] == "GS-CERT-2026-RAJESH123456"

            # 3. Admin Export CSV format
            csv_res = await client.get(
                "/api/admin/reports/export?format=csv", headers=admin_headers
            )
            assert csv_res.status_code == 200
            assert "text/csv" in csv_res.headers["content-type"]
            assert (
                "attachment; filename=govskill_workforce_compliance_report.csv"
                in csv_res.headers["content-disposition"]
            )
            csv_text = csv_res.text
            assert (
                "Employee Email,Department / Role,Module Title,Progress Status,Best Score,Total Score,Percentage,Certified,Credential ID,Certified Date"
                in csv_text
            )
            assert "officer_rajesh@state.gov" in csv_text
            assert "GS-CERT-2026-RAJESH123456" in csv_text

            # 4. Admin Citizen Defect Telemetry
            telemetry_res = await client.get(
                "/api/admin/governance/citizen-telemetry", headers=admin_headers
            )
            assert telemetry_res.status_code == 200
            t_data = telemetry_res.json()
            assert t_data["total_submissions"] == 2
            assert t_data["passed_count"] == 1
            assert t_data["action_required_count"] == 1
            assert t_data["pass_rate_pct"] == 50.0

            defect_map = {d["rule_name"]: d for d in t_data["defects_by_rule"]}
            assert defect_map["Name present"]["failure_count"] == 1
            assert defect_map["Certificate number format"]["failure_count"] == 0
            assert defect_map["Certificate not expired"]["failure_count"] == 1
            assert defect_map["All required fields extracted"]["failure_count"] == 1
            assert len(t_data["recent_inspections"]) == 2
    finally:
        app.dependency_overrides.clear()
