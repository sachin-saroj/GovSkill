import csv
import io
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user, get_db
from app.models.credential import Credential
from app.models.document import CitizenDocument
from app.models.module import Module
from app.models.progress import UserProgress
from app.models.user import User
from app.schemas.governance import (
    CitizenDefectRuleItem,
    CitizenTelemetryResponse,
    ComplianceReportItem,
    ComplianceReportResponse,
)

router = APIRouter(prefix="/admin", tags=["reports", "governance"])


@router.get("/reports/export")
async def export_compliance_report(
    format: str = Query(default="csv", pattern="^(csv|json)$"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """
    Workforce Governance Compliance Audit Export.
    Outputs aggregated employee progress, certification records, and verification IDs in CSV or JSON.
    """
    # Fetch all employees
    users_res = await db.execute(
        select(User).where(User.role == "employee").order_by(User.email.asc())
    )
    employees = users_res.scalars().all()

    # Fetch all modules
    mods_res = await db.execute(select(Module).order_by(Module.title.asc()))
    modules = mods_res.scalars().all()

    # Fetch all progress records
    prog_res = await db.execute(select(UserProgress))
    all_progress = prog_res.scalars().all()
    progress_map = {(p.user_id, p.module_id): p for p in all_progress}

    # Fetch all credentials
    cred_res = await db.execute(select(Credential))
    all_creds = cred_res.scalars().all()
    cred_map = {(c.user_id, c.module_id): c for c in all_creds}

    records: list[ComplianceReportItem] = []
    total_certified = 0

    for emp in employees:
        for mod in modules:
            prog = progress_map.get((emp.id, mod.id))
            cred = cred_map.get((emp.id, mod.id))

            status_val = prog.status if prog else "not_started"
            best_score = prog.best_score if prog else 0
            # Total score from credential or progress
            total_score = cred.total_score if cred else 4
            pct = round((best_score / total_score) * 100) if total_score > 0 else 0
            is_certified = bool(cred and pct >= 75)

            if is_certified:
                total_certified += 1

            cert_date_str = None
            if cred and cred.issued_at:
                c_dt = cred.issued_at
                if hasattr(c_dt, "tzinfo") and c_dt.tzinfo is None:
                    c_dt = c_dt.replace(tzinfo=timezone.utc)
                cert_date_str = c_dt.isoformat() if hasattr(c_dt, "isoformat") else str(c_dt)

            records.append(
                ComplianceReportItem(
                    employee_email=emp.email,
                    department="Municipal Operations",
                    module_title=mod.title,
                    progress_status=status_val,
                    best_score=best_score,
                    total_score=total_score,
                    percentage=pct,
                    certified=is_certified,
                    credential_id=cred.credential_id if cred else None,
                    certified_date=cert_date_str,
                )
            )

    now_iso = datetime.now(timezone.utc).isoformat()
    total_records = len(records)
    compliance_rate = (
        round((total_certified / total_records) * 100, 1) if total_records > 0 else 0.0
    )

    if format == "json":
        return ComplianceReportResponse(
            generated_at=now_iso,
            total_records=total_records,
            total_certified_count=total_certified,
            compliance_rate_pct=compliance_rate,
            records=records,
        )

    # Generate CSV response
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "Employee Email",
            "Department / Role",
            "Module Title",
            "Progress Status",
            "Best Score",
            "Total Score",
            "Percentage",
            "Certified",
            "Credential ID",
            "Certified Date",
        ]
    )

    for r in records:
        writer.writerow(
            [
                r.employee_email,
                r.department,
                r.module_title,
                r.progress_status,
                r.best_score,
                r.total_score,
                f"{r.percentage}%",
                "YES" if r.certified else "NO",
                r.credential_id or "N/A",
                r.certified_date or "N/A",
            ]
        )

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=govskill_workforce_compliance_report.csv"
        },
    )


@router.get("/governance/citizen-telemetry", response_model=CitizenTelemetryResponse)
async def get_citizen_defect_telemetry(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    """
    Returns aggregated GovAssist citizen document pre-submission validation defect telemetry.
    Analyzes failure rates across 4 deterministic validation rules.
    """
    stmt = select(CitizenDocument).order_by(CitizenDocument.uploaded_at.desc())
    result = await db.execute(stmt)
    docs = result.scalars().all()

    total_submissions = len(docs)
    rule_failures: dict[str, int] = {
        "Name present": 0,
        "Certificate number format": 0,
        "Certificate not expired": 0,
        "All required fields extracted": 0,
    }
    rule_fields = {
        "Name present": "name",
        "Certificate number format": "certificate_number",
        "Certificate not expired": "expiry_date",
        "All required fields extracted": "document",
    }

    passed_count = 0
    recent_inspections = []

    for idx, doc in enumerate(docs):
        validation_results = doc.validation_results or []
        doc_failed_rules = []

        if isinstance(validation_results, list):
            doc_all_passed = True
            for r in validation_results:
                if isinstance(r, dict):
                    r_name = r.get("ruleName") or r.get("rule_name")
                    is_passed = r.get("passed", False)
                    if not is_passed:
                        doc_all_passed = False
                        if r_name in rule_failures:
                            rule_failures[r_name] += 1
                        doc_failed_rules.append(r_name or "Unknown rule")
            if doc_all_passed and len(validation_results) > 0:
                passed_count += 1
        else:
            doc_all_passed = False

        if idx < 10:
            doc_up = doc.uploaded_at
            if hasattr(doc_up, "tzinfo") and doc_up.tzinfo is None:
                doc_up = doc_up.replace(tzinfo=timezone.utc)
            up_iso = doc_up.isoformat() if hasattr(doc_up, "isoformat") else str(doc_up)

            ext_name = None
            if isinstance(doc.extracted_data, dict):
                ext_name = doc.extracted_data.get("name")

            recent_inspections.append(
                {
                    "document_id": str(doc.id),
                    "uploaded_at": up_iso,
                    "overall_status": "PASSED" if doc_all_passed else "ACTION_REQUIRED",
                    "failed_rules": doc_failed_rules,
                    "extracted_name": ext_name,
                }
            )

    action_required_count = total_submissions - passed_count
    pass_rate = (
        round((passed_count / total_submissions) * 100, 1) if total_submissions > 0 else 100.0
    )

    defects_by_rule = []
    for r_name, f_count in rule_failures.items():
        f_rate = round((f_count / total_submissions) * 100, 1) if total_submissions > 0 else 0.0
        defects_by_rule.append(
            CitizenDefectRuleItem(
                rule_name=r_name,
                field=rule_fields.get(r_name, "general"),
                failure_count=f_count,
                failure_rate_pct=f_rate,
                severity="critical",
            )
        )

    return CitizenTelemetryResponse(
        total_submissions=total_submissions,
        passed_count=passed_count,
        action_required_count=action_required_count,
        pass_rate_pct=pass_rate,
        defects_by_rule=defects_by_rule,
        recent_inspections=recent_inspections,
    )
