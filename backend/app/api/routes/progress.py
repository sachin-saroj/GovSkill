import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user, get_current_user, get_db
from app.api.routes.modules import seed_all_default_modules
from app.models.module import Module
from app.models.progress import UserProgress
from app.models.quiz import QuizAttempt
from app.models.user import User
from app.schemas.progress import (
    AdminSkillOverviewResponse,
    EmployeeSkillItem,
    EmployeeSkillStatusResponse,
)

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/my-skills", response_model=EmployeeSkillStatusResponse)
async def get_my_skill_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    modules = await seed_all_default_modules(db)

    result = await db.execute(select(UserProgress).where(UserProgress.user_id == current_user.id))
    progress_map = {p.module_id: p for p in result.scalars().all()}

    skill_items = []
    certified_count = 0

    for mod in modules:
        prog = progress_map.get(mod.id)
        if prog:
            lessons_comp = prog.lessons_completed
            b_score = prog.best_score
            t_questions = prog.total_questions
            p_status = prog.status
            updated_str = (
                prog.updated_at.isoformat()
                if hasattr(prog.updated_at, "isoformat")
                else str(prog.updated_at)
            )
        else:
            lessons_comp = False
            b_score = 0
            t_questions = 0
            p_status = "not_started"
            updated_str = "Not started"

        if p_status == "certified":
            certified_count += 1

        pct = Math_pct(b_score, t_questions)

        skill_items.append(
            EmployeeSkillItem(
                module_id=mod.id,
                module_title=mod.title,
                lessons_completed=lessons_comp,
                best_score=b_score,
                total_questions=t_questions,
                score_percentage=pct,
                status=p_status,
                updated_at=updated_str,
            )
        )

    total_mods = len(modules)
    overall_score = round((certified_count / total_mods) * 100) if total_mods > 0 else 0

    return EmployeeSkillStatusResponse(
        overall_skill_score=overall_score,
        total_modules=total_mods,
        certified_modules=certified_count,
        skills=skill_items,
    )


def Math_pct(score: int, total: int) -> int:
    if total <= 0:
        return 0
    return round((score / total) * 100)


@router.post("/modules/{module_id}/complete-lessons", response_model=EmployeeSkillItem)
async def mark_module_lessons_completed(
    module_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        mod_uuid = uuid.UUID(module_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid module UUID format"}},
        )

    mod_result = await db.execute(select(Module).where(Module.id == mod_uuid))
    module = mod_result.scalar_one_or_none()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "MODULE_NOT_FOUND", "message": "Training module not found"}},
        )

    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.module_id == mod_uuid,
        )
    )
    prog = result.scalar_one_or_none()

    if not prog:
        prog = UserProgress(
            user_id=current_user.id,
            module_id=mod_uuid,
            lessons_completed=True,
            status="in_progress",
        )
        db.add(prog)
    else:
        prog.lessons_completed = True
        if prog.status == "not_started":
            prog.status = "in_progress"

    await db.commit()
    await db.refresh(prog)

    pct = Math_pct(prog.best_score, prog.total_questions)
    updated_str = (
        prog.updated_at.isoformat()
        if hasattr(prog.updated_at, "isoformat")
        else str(prog.updated_at)
    )

    return EmployeeSkillItem(
        module_id=module.id,
        module_title=module.title,
        lessons_completed=prog.lessons_completed,
        best_score=prog.best_score,
        total_questions=prog.total_questions,
        score_percentage=pct,
        status=prog.status,
        updated_at=updated_str,
    )


@router.get("/admin/skills-overview", response_model=AdminSkillOverviewResponse)
async def get_admin_skills_overview(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
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

    return AdminSkillOverviewResponse(
        total_employees=total_emp,
        total_certifications=total_cert,
        overall_certification_rate=rate,
        total_modules=total_modules,
        total_quiz_attempts=total_attempts,
        average_quiz_score_pct=avg_score_pct,
    )
