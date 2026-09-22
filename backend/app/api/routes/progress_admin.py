import uuid
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user, get_db
from app.api.routes.modules import seed_all_default_modules
from app.models.module import Module
from app.models.progress import UserProgress
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import User
from app.schemas.progress import (
    AdminSkillOverviewResponse,
    CompetencyHealthItem,
)

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/admin/skills-overview", response_model=AdminSkillOverviewResponse)
async def get_admin_skills_overview(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    await seed_all_default_modules(db)
    emp_stmt = select(func.count(User.id)).where(User.role == "employee")
    emp_res = await db.execute(emp_stmt)
    total_emp = emp_res.scalar() or 0

    cert_stmt = select(func.count(UserProgress.id)).where(UserProgress.status == "certified")
    cert_res = await db.execute(cert_stmt)
    total_cert = cert_res.scalar() or 0

    mod_stmt = select(func.count(Module.id))
    mod_res = await db.execute(mod_stmt)
    total_modules = mod_res.scalar() or 0

    attempt_stmt = select(func.count(QuizAttempt.id))
    attempt_res = await db.execute(attempt_stmt)
    total_attempts = attempt_res.scalar() or 0

    attempts_data_stmt = select(QuizAttempt.score, QuizAttempt.total)
    attempts_data_res = await db.execute(attempts_data_stmt)
    attempt_rows = attempts_data_res.all()

    if attempt_rows:
        valid_pcts = [(score / total * 100.0) for score, total in attempt_rows if total > 0]
        avg_score_pct = round(sum(valid_pcts) / len(valid_pcts)) if valid_pcts else 0
    else:
        avg_score_pct = 0

    max_possible_certs = (
        total_emp * total_modules if (total_emp > 0 and total_modules > 0) else (total_emp * 4)
    )
    rate = round((total_cert / max_possible_certs) * 100) if max_possible_certs > 0 else 0

    # Calculate Workforce Competency Health & lowest performing competency (P3-M5, dynamic & unassessed-aware)
    all_attempts_res = await db.execute(
        select(QuizAttempt.module_id, QuizAttempt.score, QuizAttempt.total)
    )
    all_att_rows = all_attempts_res.all()
    mod_att_pcts: dict[uuid.UUID, list[float]] = {}
    for mod_id_val, score, tot in all_att_rows:
        if tot > 0:
            mod_att_pcts.setdefault(mod_id_val, []).append((score / tot) * 100.0)

    mod_lookup_res = await db.execute(select(Module))
    all_mods = mod_lookup_res.scalars().all()

    questions_res = await db.execute(select(QuizQuestion.module_id, QuizQuestion.competency))
    mod_questions_rows = questions_res.all()
    mod_competencies_db: dict[uuid.UUID, list[str]] = {}
    for q_mod_id, q_comp in mod_questions_rows:
        if q_comp:
            comp_list = mod_competencies_db.setdefault(q_mod_id, [])
            if q_comp not in comp_list:
                comp_list.append(q_comp)

    SEED_COMPETENCY_MAP: dict[uuid.UUID, list[str]] = {
        uuid.UUID("11111111-1111-1111-1111-111111111111"): [
            "Document Formatting & Standards",
            "Verification Rules & Expiry Validation",
            "Mandatory Data Integrity",
        ],
        uuid.UUID("11111111-1111-1111-1111-111111111112"): [
            "Workflow Routing & Sign-off",
            "SLA Compliance & Escalation",
        ],
        uuid.UUID("11111111-1111-1111-1111-111111111113"): [
            "Phishing Prevention & Incident Response",
            "PII Protection & Data Privacy",
        ],
        uuid.UUID("11111111-1111-1111-1111-111111111114"): [
            "Archival Retention Policies",
            "System Audit Trail & Compliance",
        ],
    }

    competency_health: list[CompetencyHealthItem] = []
    lowest_performing_competency: str | None = None
    lowest_avg: float = 101.0

    for m in all_mods:
        m_id = m.id
        m_title = m.title
        if m_id in SEED_COMPETENCY_MAP:
            comp_names = list(SEED_COMPETENCY_MAP[m_id])
            for c in mod_competencies_db.get(m_id, []):
                if c not in comp_names:
                    comp_names.append(c)
        elif m_id in mod_competencies_db and mod_competencies_db[m_id]:
            comp_names = mod_competencies_db[m_id]
        else:
            comp_names = [f"{m_title} Core Competencies"]

        pcts = mod_att_pcts.get(m_id, [])
        if pcts:
            comp_avg = round(sum(pcts) / len(pcts))
            mastered_c = sum(1 for p in pcts if p >= 75)
            dev_c = sum(1 for p in pcts if p < 75)
            status_str = "Healthy" if comp_avg >= 75 else ("Needs Attention" if comp_avg >= 50 else "Critical")

            for comp_name in comp_names:
                if comp_avg < lowest_avg:
                    lowest_avg = comp_avg
                    lowest_performing_competency = comp_name

                competency_health.append(
                    CompetencyHealthItem(
                        competency=comp_name,
                        module_title=m_title,
                        average_mastery_pct=comp_avg,
                        employees_mastered=mastered_c,
                        employees_developing=dev_c,
                        status=status_str,
                    )
                )
        else:
            comp_avg = 0
            mastered_c = 0
            dev_c = 0
            status_str = "Unassessed"

            for comp_name in comp_names:
                competency_health.append(
                    CompetencyHealthItem(
                        competency=comp_name,
                        module_title=m_title,
                        average_mastery_pct=comp_avg,
                        employees_mastered=mastered_c,
                        employees_developing=dev_c,
                        status=status_str,
                    )
                )

    return AdminSkillOverviewResponse(
        total_employees=total_emp,
        total_certifications=total_cert,
        overall_certification_rate=rate,
        total_modules=total_modules,
        total_quiz_attempts=total_attempts,
        average_quiz_score_pct=avg_score_pct,
        lowest_performing_competency=lowest_performing_competency,
        competency_health=competency_health,
    )
