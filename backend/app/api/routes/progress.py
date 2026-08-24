import uuid
from datetime import datetime, timezone
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
    AssessmentHistoryItem,
    CompetencySummary,
    EmployeeSkillItem,
    EmployeeSkillStatusResponse,
    LearningActivityItem,
    NextActionRecommendation,
    SkillGapItem,
    UpdateSectionProgressRequest,
)

router = APIRouter(prefix="/progress", tags=["progress"])


def Math_pct(score: int, total: int) -> int:
    if total <= 0:
        return 0
    return round((score / total) * 100)


@router.get("/my-skills", response_model=EmployeeSkillStatusResponse)
async def get_my_skill_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    modules = await seed_all_default_modules(db)
    mod_map = {m.id: m.title for m in modules}

    # Fetch user progress records
    prog_result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    user_progress_list = prog_result.scalars().all()
    progress_map = {p.module_id: p for p in user_progress_list}

    # Fetch all quiz attempts for current user ordered chronologically
    attempts_result = await db.execute(
        select(QuizAttempt)
        .where(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.submitted_at.asc())
    )
    user_attempts = attempts_result.scalars().all()

    # Group attempts by module
    module_attempts_map: dict[uuid.UUID, list[QuizAttempt]] = {}
    for att in user_attempts:
        module_attempts_map.setdefault(att.module_id, []).append(att)

    skill_items: list[EmployeeSkillItem] = []
    certified_count = 0

    for mod in modules:
        prog = progress_map.get(mod.id)
        mod_attempts = module_attempts_map.get(mod.id, [])
        attempts_count = len(mod_attempts)

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

        # Calculate proficiency level
        if p_status == "certified" or pct >= 75:
            proficiency = "Strong"
        elif pct >= 40 or (lessons_comp and attempts_count == 0):
            proficiency = "Developing"
        elif attempts_count > 0 and pct < 40:
            proficiency = "Needs Attention"
        else:
            proficiency = "Not Started"

        # Calculate deterministic module readiness state
        if p_status == "certified" or pct >= 75:
            readiness_state = "Certified"
        elif pct >= 50:
            readiness_state = "Operational"
        elif attempts_count > 0 and pct < 50:
            readiness_state = "Needs Improvement"
        elif lessons_comp:
            readiness_state = "Assessment Pending"
        elif p_status == "in_progress" or (prog and prog.last_accessed_section > 0):
            readiness_state = "In Progress"
        else:
            readiness_state = "Not Started"

        # Determine last activity timestamp
        if mod_attempts:
            last_att = mod_attempts[-1]
            last_activity_str = (
                last_att.submitted_at.isoformat()
                if hasattr(last_att.submitted_at, "isoformat")
                else str(last_att.submitted_at)
            )
        elif prog and prog.updated_at:
            last_activity_str = (
                prog.updated_at.isoformat()
                if hasattr(prog.updated_at, "isoformat")
                else str(prog.updated_at)
            )
        else:
            last_activity_str = "No activity"

        initial_score = mod_attempts[0].score if mod_attempts else None
        if len(mod_attempts) >= 2:
            first_pct = Math_pct(mod_attempts[0].score, mod_attempts[0].total)
            growth = pct - first_pct
            improvement_delta = growth if growth > 0 else 0
        else:
            improvement_delta = None

        skill_items.append(
            EmployeeSkillItem(
                module_id=mod.id,
                module_title=mod.title,
                lessons_completed=lessons_comp,
                best_score=b_score,
                total_questions=t_questions,
                score_percentage=pct,
                status=p_status,
                readiness_state=readiness_state,
                updated_at=updated_str,
                proficiency=proficiency,
                attempts_count=attempts_count,
                initial_score=initial_score,
                score_improvement_delta=improvement_delta,
                last_activity_at=last_activity_str,
                last_accessed_section=prog.last_accessed_section if prog else 0,
                started_at=(
                    prog.started_at.isoformat()
                    if (prog and prog.started_at and hasattr(prog.started_at, "isoformat"))
                    else str(prog.started_at)
                    if (prog and prog.started_at)
                    else None
                ),
                completed_at=(
                    prog.completed_at.isoformat()
                    if (prog and prog.completed_at and hasattr(prog.completed_at, "isoformat"))
                    else str(prog.completed_at)
                    if (prog and prog.completed_at)
                    else None
                ),
            )
        )

    total_mods = len(modules)
    overall_score = round((certified_count / total_mods) * 100) if total_mods > 0 else 0
    modules_completed_count = sum(
        1 for s in skill_items if s.lessons_completed or s.status == "certified"
    )
    modules_remaining_count = max(0, total_mods - certified_count)

    # Learning Status
    if certified_count == total_mods and total_mods > 0:
        learning_status = "Certified"
    elif certified_count > 0 or any(
        s.lessons_completed or s.attempts_count > 0 for s in skill_items
    ):
        learning_status = "In Progress"
    else:
        learning_status = "Getting Started"

    # Readiness Level
    if overall_score == 100:
        readiness_level = "Full Operational Readiness"
    elif overall_score >= 50:
        readiness_level = "Substantial Readiness"
    elif overall_score > 0 or modules_completed_count > 0:
        readiness_level = "Developing Competency"
    else:
        readiness_level = "Initial Onboarding"

    # Strongest and Weakest Competency Analysis
    attempted_skills = [s for s in skill_items if s.attempts_count > 0 or s.lessons_completed]
    strongest_comp: str | None = None
    weakest_comp: str | None = None

    if attempted_skills:
        # Highest score
        sorted_by_score = sorted(
            attempted_skills, key=lambda s: (s.score_percentage, 1 if s.status == "certified" else 0), reverse=True
        )
        if sorted_by_score[0].score_percentage > 0 or sorted_by_score[0].status == "certified":
            top_s = sorted_by_score[0]
            strongest_comp = f"{top_s.module_title} ({top_s.score_percentage}%)"

        # Weakest score among non-certified or lowest scoring
        uncertified_attempted = [s for s in attempted_skills if s.status != "certified"]
        if uncertified_attempted:
            lowest_s = sorted(uncertified_attempted, key=lambda s: s.score_percentage)[0]
            weakest_comp = f"{lowest_s.module_title} ({lowest_s.score_percentage}%)"
        elif any(s.score_percentage < 100 for s in attempted_skills):
            lowest_s = sorted(attempted_skills, key=lambda s: s.score_percentage)[0]
            if lowest_s.score_percentage < 100:
                weakest_comp = f"{lowest_s.module_title} ({lowest_s.score_percentage}%)"

    # Average Assessment Score
    if user_attempts:
        valid_scores = [Math_pct(a.score, a.total) for a in user_attempts if a.total > 0]
        avg_score = round(sum(valid_scores) / len(valid_scores)) if valid_scores else 0
    else:
        avg_score = 0

    readiness_criteria = [
        "Passing Standard: 75% or higher on end-of-module assessment to earn verified certification.",
        "Initial Onboarding (0-24%): Getting started with assigned departmental curriculum.",
        "Developing Competency (25-49%): At least 1 module certified or multiple lessons completed.",
        "Substantial Readiness (50-74%): At least 50% of required local government modules certified.",
        "Full Operational Readiness (75-100%): All prescribed administrative skill modules certified.",
    ]

    if overall_score == 100:
        readiness_explanation = (
            "You have achieved verified certification across all 4 operational modules. Full administrative compliance certified."
        )
    elif overall_score >= 50:
        readiness_explanation = (
            f"You have certified {certified_count} of {total_mods} modules ({overall_score}%). "
            f"Complete the remaining {modules_remaining_count} module{'s' if modules_remaining_count > 1 else ''} to achieve Full Operational Readiness."
        )
    elif overall_score > 0 or modules_completed_count > 0:
        readiness_explanation = (
            f"You have completed {modules_completed_count} curriculum guide{'s' if modules_completed_count > 1 else ''} and certified {certified_count}. "
            "Attempt assessments to progress toward Substantial Readiness."
        )
    else:
        readiness_explanation = (
            "You are currently at the Initial Onboarding stage. Begin your assigned curriculum to build foundational digital competencies."
        )

    summary = CompetencySummary(
        overall_score=overall_score,
        modules_completed=modules_completed_count,
        certified_modules=certified_count,
        total_modules=total_mods,
        modules_remaining=modules_remaining_count,
        learning_status=learning_status,
        readiness_level=readiness_level,
        strongest_competency=strongest_comp,
        weakest_competency=weakest_comp,
        average_assessment_score=avg_score,
        readiness_criteria=readiness_criteria,
        readiness_explanation=readiness_explanation,
    )

    # Identify Skill Gaps
    skill_gaps: list[SkillGapItem] = []
    for s in skill_items:
        if s.status != "certified":
            gap_pct = max(0, 75 - s.score_percentage)
            if s.attempts_count > 0 and s.score_percentage < 75:
                gap_prof = "Needs Attention" if s.score_percentage < 50 else "Developing"
                skill_gaps.append(
                    SkillGapItem(
                        module_id=s.module_id,
                        skill=s.module_title,
                        proficiency=gap_prof,
                        current_score_pct=s.score_percentage,
                        target_threshold=75,
                        gap_percentage=gap_pct,
                        evidence=f"Scored {s.score_percentage}% ({s.best_score}/{s.total_questions}) on assessment — 75% required for certification (gap: {gap_pct}%).",
                        recommended_action="Review lesson notes and retake assessment to clear the competency gap.",
                    )
                )
            elif s.lessons_completed and s.attempts_count == 0:
                skill_gaps.append(
                    SkillGapItem(
                        module_id=s.module_id,
                        skill=s.module_title,
                        proficiency="Developing",
                        current_score_pct=0,
                        target_threshold=75,
                        gap_percentage=75,
                        evidence="Lesson curriculum completed, but mandatory certification assessment has not been attempted.",
                        recommended_action="Take the module assessment to achieve verified certification.",
                    )
                )
            elif not s.lessons_completed and s.status == "in_progress":
                skill_gaps.append(
                    SkillGapItem(
                        module_id=s.module_id,
                        skill=s.module_title,
                        proficiency="Needs Attention",
                        current_score_pct=0,
                        target_threshold=75,
                        gap_percentage=75,
                        evidence=f"Module started (Section {s.last_accessed_section + 1}), but official lesson reading is not completed.",
                        recommended_action="Read official lesson guidelines and mark curriculum as completed.",
                    )
                )
            elif s.status == "not_started":
                skill_gaps.append(
                    SkillGapItem(
                        module_id=s.module_id,
                        skill=s.module_title,
                        proficiency="Developing",
                        current_score_pct=0,
                        target_threshold=75,
                        gap_percentage=75,
                        evidence="Curriculum has not been started.",
                        recommended_action="Begin reading official module guidelines.",
                    )
                )

    # Determine Recommended Next Action (Deterministic Prioritization)
    recommended_action: NextActionRecommendation | None = None

    # Priority 1: In-progress module with incomplete lessons
    for s in skill_items:
        if s.status == "in_progress" and not s.lessons_completed:
            recommended_action = NextActionRecommendation(
                action_type="read_lesson",
                module_id=s.module_id,
                module_title=s.module_title,
                title=f"Complete Lessons: {s.module_title}",
                description="Read through all official guidelines and operational instructions for this module.",
                priority="high",
                link=f"/module?id={s.module_id}",
            )
            break

    # Priority 2: Lessons completed but no assessment attempted
    if not recommended_action:
        for s in skill_items:
            if s.lessons_completed and s.attempts_count == 0:
                recommended_action = NextActionRecommendation(
                    action_type="take_quiz",
                    module_id=s.module_id,
                    module_title=s.module_title,
                    title=f"Take Assessment: {s.module_title}",
                    description="You've completed the lesson guidelines. Take the scored assessment to earn certification.",
                    priority="high",
                    link=f"/quiz/{s.module_id}",
                )
                break

    # Priority 3: Attempted quiz but not certified (<75%)
    if not recommended_action:
        for s in skill_items:
            if s.attempts_count > 0 and s.status != "certified":
                recommended_action = NextActionRecommendation(
                    action_type="retake_quiz",
                    module_id=s.module_id,
                    module_title=s.module_title,
                    title=f"Retake Assessment: {s.module_title}",
                    description=f"Your current best score is {s.score_percentage}%. Retake the quiz to reach the 75% certification standard.",
                    priority="high",
                    link=f"/quiz/{s.module_id}",
                )
                break

    # Priority 4: Start next unstarted module
    if not recommended_action:
        for s in skill_items:
            if s.status == "not_started":
                recommended_action = NextActionRecommendation(
                    action_type="start_training",
                    module_id=s.module_id,
                    module_title=s.module_title,
                    title=f"Begin Module: {s.module_title}",
                    description="Start reading the core curriculum for this administrative skill module.",
                    priority="medium",
                    link=f"/module?id={s.module_id}",
                )
                break

    # Priority 5: All certified
    if not recommended_action:
        recommended_action = NextActionRecommendation(
            action_type="all_certified",
            module_id=None,
            module_title=None,
            title="All Core Competencies Certified",
            description="You have achieved verified certification across all required local-government digital skill modules. Maintain regular review.",
            priority="low",
            link="/progress",
        )

    # Assessment History (most recent first) with attempt numbering and improvement deltas
    assessment_history: list[AssessmentHistoryItem] = []
    # Build attempt number index and history per module
    mod_attempts_history: dict[uuid.UUID, list[QuizAttempt]] = {}
    attempt_num_map: dict[uuid.UUID, int] = {}
    improvement_map: dict[uuid.UUID, int | None] = {}

    for att in user_attempts:  # user_attempts are in asc order
        prev_list = mod_attempts_history.get(att.module_id, [])
        attempt_num = len(prev_list) + 1
        attempt_num_map[att.id] = attempt_num

        if prev_list:
            prev_att = prev_list[-1]
            prev_pct = Math_pct(prev_att.score, prev_att.total)
            curr_pct = Math_pct(att.score, att.total)
            improvement_map[att.id] = curr_pct - prev_pct
        else:
            improvement_map[att.id] = None

        mod_attempts_history.setdefault(att.module_id, []).append(att)

    for att in reversed(user_attempts):
        score_pct = Math_pct(att.score, att.total)
        passed = (att.total > 0) and ((att.score / att.total) >= 0.75)
        att_num = attempt_num_map.get(att.id, 1)
        improvement = improvement_map.get(att.id)
        sub_str = (
            att.submitted_at.isoformat()
            if hasattr(att.submitted_at, "isoformat")
            else str(att.submitted_at)
        )
        assessment_history.append(
            AssessmentHistoryItem(
                attempt_id=att.id,
                module_id=att.module_id,
                module_title=mod_map.get(att.module_id, "Training Module"),
                score=att.score,
                total=att.total,
                score_percentage=score_pct,
                attempt_number=att_num,
                passed=passed,
                improvement_from_previous=improvement,
                submitted_at=sub_str,
            )
        )

    # Learning Activity Timeline (Collated chronological events)
    raw_activities: list[dict] = []

    # Activity from lesson start and completion
    for prog in user_progress_list:
        m_title = mod_map.get(prog.module_id, "Training Module")
        if prog.started_at:
            raw_activities.append(
                {
                    "dt": prog.started_at,
                    "item": LearningActivityItem(
                        activity_type="lesson_started",
                        title="Curriculum Initiated",
                        module_title=m_title,
                        timestamp=(
                            prog.started_at.isoformat()
                            if hasattr(prog.started_at, "isoformat")
                            else str(prog.started_at)
                        ),
                        detail=f"Began reading official guidelines for {m_title}.",
                    ),
                }
            )
        if prog.lessons_completed and prog.completed_at:
            raw_activities.append(
                {
                    "dt": prog.completed_at,
                    "item": LearningActivityItem(
                        activity_type="lesson_completed",
                        title="Lessons Completed",
                        module_title=m_title,
                        timestamp=(
                            prog.completed_at.isoformat()
                            if hasattr(prog.completed_at, "isoformat")
                            else str(prog.completed_at)
                        ),
                        detail=f"Completed all prescribed lesson sections for {m_title}.",
                    ),
                }
            )

    # Activity from quiz attempts
    for att in user_attempts:
        score_pct = Math_pct(att.score, att.total)
        passed = (att.total > 0) and ((att.score / att.total) >= 0.75)
        m_title = mod_map.get(att.module_id, "Training Module")
        improvement = improvement_map.get(att.id)

        if passed:
            raw_activities.append(
                {
                    "dt": att.submitted_at,
                    "item": LearningActivityItem(
                        activity_type="certification",
                        title="Certification Standard Achieved",
                        module_title=m_title,
                        timestamp=(
                            att.submitted_at.isoformat()
                            if hasattr(att.submitted_at, "isoformat")
                            else str(att.submitted_at)
                        ),
                        detail=f"Scored {score_pct}% ({att.score}/{att.total}) on assessment.",
                    ),
                }
            )
        elif improvement is not None and improvement > 0:
            raw_activities.append(
                {
                    "dt": att.submitted_at,
                    "item": LearningActivityItem(
                        activity_type="quiz_improved",
                        title="Assessment Score Improved",
                        module_title=m_title,
                        timestamp=(
                            att.submitted_at.isoformat()
                            if hasattr(att.submitted_at, "isoformat")
                            else str(att.submitted_at)
                        ),
                        detail=f"Score improved by +{improvement}% to {score_pct}% ({att.score}/{att.total}).",
                    ),
                }
            )
        else:
            raw_activities.append(
                {
                    "dt": att.submitted_at,
                    "item": LearningActivityItem(
                        activity_type="quiz_attempt",
                        title="Assessment Attempted",
                        module_title=m_title,
                        timestamp=(
                            att.submitted_at.isoformat()
                            if hasattr(att.submitted_at, "isoformat")
                            else str(att.submitted_at)
                        ),
                        detail=f"Scored {score_pct}% ({att.score}/{att.total}).",
                    ),
                }
            )

    # Sort descending by datetime, cap to 15 items
    raw_activities.sort(key=lambda x: x["dt"], reverse=True)
    recent_activity = [a["item"] for a in raw_activities[:15]]

    return EmployeeSkillStatusResponse(
        overall_skill_score=overall_score,
        total_modules=total_mods,
        certified_modules=certified_count,
        skills=skill_items,
        summary=summary,
        skill_gaps=skill_gaps,
        recommended_action=recommended_action,
        assessment_history=assessment_history,
        recent_activity=recent_activity,
    )


@router.post("/modules/{module_id}/access-section", response_model=EmployeeSkillItem)
async def record_section_access(
    module_id: str,
    payload: UpdateSectionProgressRequest,
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
    now = datetime.now(timezone.utc)

    if not prog:
        prog = UserProgress(
            user_id=current_user.id,
            module_id=mod_uuid,
            lessons_completed=False,
            status="in_progress",
            started_at=now,
            last_accessed_section=max(0, payload.section_index),
        )
        db.add(prog)
    else:
        if not prog.started_at:
            prog.started_at = now
        if prog.status == "not_started":
            prog.status = "in_progress"
        prog.last_accessed_section = max(0, payload.section_index)

    await db.commit()
    await db.refresh(prog)

    pct = Math_pct(prog.best_score, prog.total_questions)
    proficiency = (
        "Strong"
        if (prog.status == "certified" or pct >= 75)
        else (
            "Developing"
            if (pct >= 40 or prog.lessons_completed)
            else ("Needs Attention" if pct > 0 else "Developing")
        )
    )

    # Calculate deterministic module readiness state
    if prog.status == "certified" or pct >= 75:
        readiness_state = "Certified"
    elif pct >= 50:
        readiness_state = "Operational"
    elif prog.best_score > 0 and pct < 50:
        readiness_state = "Needs Improvement"
    elif prog.lessons_completed:
        readiness_state = "Assessment Pending"
    elif prog.status == "in_progress" or prog.last_accessed_section > 0:
        readiness_state = "In Progress"
    else:
        readiness_state = "Not Started"

    return EmployeeSkillItem(
        module_id=module.id,
        module_title=module.title,
        lessons_completed=prog.lessons_completed,
        best_score=prog.best_score,
        total_questions=prog.total_questions,
        score_percentage=pct,
        status=prog.status,
        readiness_state=readiness_state,
        updated_at=prog.updated_at.isoformat()
        if hasattr(prog.updated_at, "isoformat")
        else str(prog.updated_at),
        proficiency=proficiency,
        last_accessed_section=prog.last_accessed_section,
        started_at=prog.started_at.isoformat()
        if (prog.started_at and hasattr(prog.started_at, "isoformat"))
        else (str(prog.started_at) if prog.started_at else None),
        completed_at=prog.completed_at.isoformat()
        if (prog.completed_at and hasattr(prog.completed_at, "isoformat"))
        else (str(prog.completed_at) if prog.completed_at else None),
    )


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
    now = datetime.now(timezone.utc)

    if not prog:
        prog = UserProgress(
            user_id=current_user.id,
            module_id=mod_uuid,
            lessons_completed=True,
            status="in_progress",
            started_at=now,
            completed_at=now,
        )
        db.add(prog)
    else:
        prog.lessons_completed = True
        prog.completed_at = now
        if not prog.started_at:
            prog.started_at = now
        if prog.status == "not_started":
            prog.status = "in_progress"

    await db.commit()
    await db.refresh(prog)

    pct = Math_pct(prog.best_score, prog.total_questions)
    proficiency = (
        "Strong"
        if (prog.status == "certified" or pct >= 75)
        else (
            "Developing"
            if (pct >= 40 or prog.lessons_completed)
            else ("Needs Attention" if pct > 0 else "Developing")
        )
    )
    updated_str = (
        prog.updated_at.isoformat()
        if hasattr(prog.updated_at, "isoformat")
        else str(prog.updated_at)
    )

    # Calculate deterministic module readiness state
    if prog.status == "certified" or pct >= 75:
        readiness_state = "Certified"
    elif pct >= 50:
        readiness_state = "Operational"
    elif prog.best_score > 0 and pct < 50:
        readiness_state = "Needs Improvement"
    elif prog.lessons_completed:
        readiness_state = "Assessment Pending"
    elif prog.status == "in_progress" or prog.last_accessed_section > 0:
        readiness_state = "In Progress"
    else:
        readiness_state = "Not Started"

    return EmployeeSkillItem(
        module_id=module.id,
        module_title=module.title,
        lessons_completed=prog.lessons_completed,
        best_score=prog.best_score,
        total_questions=prog.total_questions,
        score_percentage=pct,
        status=prog.status,
        readiness_state=readiness_state,
        updated_at=updated_str,
        proficiency=proficiency,
        last_accessed_section=prog.last_accessed_section,
        started_at=prog.started_at.isoformat()
        if (prog.started_at and hasattr(prog.started_at, "isoformat"))
        else (str(prog.started_at) if prog.started_at else None),
        completed_at=prog.completed_at.isoformat()
        if (prog.completed_at and hasattr(prog.completed_at, "isoformat"))
        else (str(prog.completed_at) if prog.completed_at else None),
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
