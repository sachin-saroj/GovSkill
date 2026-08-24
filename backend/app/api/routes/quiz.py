import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.routes.modules import get_or_create_default_module
from app.models.module import Module
from app.models.progress import UserProgress
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import User
from app.schemas.quiz import (
    AdaptiveMeta,
    CompetencyScoreItem,
    QuestionOut,
    QuizQuestionsResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
)

router = APIRouter(prefix="/quiz", tags=["quiz"])

MODULE_1_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")
MODULE_2_ID = uuid.UUID("11111111-1111-1111-1111-111111111112")
MODULE_3_ID = uuid.UUID("11111111-1111-1111-1111-111111111113")
MODULE_4_ID = uuid.UUID("11111111-1111-1111-1111-111111111114")

SEED_QUESTIONS = [
    # Module 1: Digital Document Handling
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222201"),
        "module_id": MODULE_1_ID,
        "question": "What is the minimum required length for a valid Income Certificate number?",
        "options": ["4 characters", "6 characters", "8 characters", "10 characters"],
        "correct_option_index": 1,
        "competency": "Document Formatting & Standards",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222202"),
        "module_id": MODULE_1_ID,
        "question": "Which format must official certificate numbers follow?",
        "options": ["Numeric only", "Alphanumeric", "Special symbols only", "Roman numerals"],
        "correct_option_index": 1,
        "competency": "Document Formatting & Standards",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222203"),
        "module_id": MODULE_1_ID,
        "question": "What action should an employee take if a certificate's expiry date has passed?",
        "options": [
            "Approve anyway",
            "Reject or flag as expired",
            "Manually extend the date",
            "Ignore expiry date",
        ],
        "correct_option_index": 1,
        "competency": "Verification Rules & Expiry Validation",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222204"),
        "module_id": MODULE_1_ID,
        "question": "Which of the following is a mandatory field that must be present on an Income Certificate?",
        "options": [
            "Applicant Full Name",
            "Social media handle",
            "Home wifi password",
            "Blood group",
        ],
        "correct_option_index": 0,
        "competency": "Mandatory Data Integrity",
    },
    # Module 2: Government Portal Operations
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222205"),
        "module_id": MODULE_2_ID,
        "question": "After how many days without resolution is an application flagged for supervisor escalation?",
        "options": ["3 business days", "5 business days", "7 business days", "14 business days"],
        "correct_option_index": 2,
        "competency": "SLA Compliance & Escalation",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222206"),
        "module_id": MODULE_2_ID,
        "question": "What is the second step in citizen application verification workflow?",
        "options": [
            "Delete citizen files",
            "Route application for departmental supervisor sign-off",
            "Approve immediately",
            "Send SMS notification",
        ],
        "correct_option_index": 1,
        "competency": "Workflow Routing & Sign-off",
    },
    # Module 3: Cybersecurity & Data Privacy Basics
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222207"),
        "module_id": MODULE_3_ID,
        "question": "What should an employee do when receiving an email with an unverified external attachment?",
        "options": [
            "Open attachment immediately",
            "Do not click link/attachment and verify sender",
            "Forward to all colleagues",
            "Reply with portal password",
        ],
        "correct_option_index": 1,
        "competency": "Phishing Prevention & Incident Response",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222208"),
        "module_id": MODULE_3_ID,
        "question": "How must sensitive citizen records (e.g. Aadhaar / Bank details) be stored?",
        "options": [
            "Unencrypted on personal USB drives",
            "Encrypted at rest and in transit",
            "Publicly on local desktop",
            "Printed on paper only",
        ],
        "correct_option_index": 1,
        "competency": "PII Protection & Data Privacy",
    },
    # Module 4: Digital Record Management
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222209"),
        "module_id": MODULE_4_ID,
        "question": "How long must Income Certificate records be retained before scheduled archive purging?",
        "options": ["1 year", "3 years", "5 years", "10 years"],
        "correct_option_index": 2,
        "competency": "Archival Retention Policies",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222210"),
        "module_id": MODULE_4_ID,
        "question": "What tracks every document edit, export, and access request in government portals?",
        "options": [
            "Immutable system audit logs",
            "Manual paper ledger",
            "Daily browser cache",
            "Temporary email notes",
        ],
        "correct_option_index": 0,
        "competency": "System Audit Trail & Compliance",
    },
]


async def seed_quiz_questions_if_needed(db: AsyncSession, module_id: uuid.UUID | None = None) -> None:
    # Check if any questions exist for this specific module
    if module_id is not None:
        result = await db.execute(
            select(func.count(QuizQuestion.id)).where(QuizQuestion.module_id == module_id)
        )
        count = result.scalar()
        if count == 0:
            questions_to_seed = [q for q in SEED_QUESTIONS if q["module_id"] == module_id]
            for q_data in questions_to_seed:
                q = QuizQuestion(
                    id=q_data["id"],
                    module_id=q_data["module_id"],
                    question=q_data["question"],
                    options=q_data["options"],
                    correct_option_index=q_data["correct_option_index"],
                    competency=q_data.get("competency"),
                )
                db.add(q)
            await db.commit()
    else:
        result = await db.execute(select(func.count(QuizQuestion.id)))
        count = result.scalar()
        if count == 0:
            for q_data in SEED_QUESTIONS:
                q = QuizQuestion(
                    id=q_data["id"],
                    module_id=q_data["module_id"],
                    question=q_data["question"],
                    options=q_data["options"],
                    correct_option_index=q_data["correct_option_index"],
                    competency=q_data.get("competency"),
                )
                db.add(q)
            await db.commit()


def _resolve_module_id(module_id: str, default_mod_id: uuid.UUID) -> uuid.UUID:
    if module_id == "default":
        return default_mod_id
    try:
        return uuid.UUID(module_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_MODULE_ID", "message": "Invalid module ID format"}},
        )


@router.get("/{module_id}", response_model=QuizQuestionsResponse)
async def get_quiz_questions(
    module_id: str,
    mode: str = "standard",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    default_mod = await get_or_create_default_module(db)
    mod_uuid = _resolve_module_id(module_id, default_mod.id)

    # Check module existence
    mod_result = await db.execute(select(Module).where(Module.id == mod_uuid))
    if not mod_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "MODULE_NOT_FOUND", "message": "Module not found"}},
        )

    await seed_quiz_questions_if_needed(db, mod_uuid)

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == mod_uuid))
    questions = list(result.scalars().all())

    # Check previous attempts for adaptive question prioritization
    att_res = await db.execute(
        select(QuizAttempt)
        .where(QuizAttempt.user_id == current_user.id, QuizAttempt.module_id == mod_uuid)
        .order_by(QuizAttempt.submitted_at.desc())
    )
    previous_attempts = att_res.scalars().all()

    adaptive_meta: AdaptiveMeta | None = None
    if questions:
        latest_att = previous_attempts[0] if previous_attempts else None
        is_adaptive_requested = mode.lower() == "adaptive"
        has_weak_previous = (
            latest_att is not None
            and (round((latest_att.score / latest_att.total) * 100) if latest_att.total > 0 else 0) < 75
        )

        if is_adaptive_requested or has_weak_previous:
            # Group distinct competencies in this module
            mod_competencies = list(
                dict.fromkeys(q.competency or "Core Government Procedures" for q in questions)
            )
            # Prioritize first distinct competencies as targeted focus
            focus_comps = mod_competencies[: max(1, len(mod_competencies) // 2)]

            prioritized = [
                q for q in questions if (q.competency or "Core Government Procedures") in focus_comps
            ]
            remaining = [
                q for q in questions if (q.competency or "Core Government Procedures") not in focus_comps
            ]
            questions = prioritized + remaining

            adaptive_meta = AdaptiveMeta(
                is_adaptive=True,
                focus_competencies=focus_comps,
                message=f"Assessment adapted to prioritize focus on: {', '.join(focus_comps)}",
            )
        else:
            adaptive_meta = AdaptiveMeta(
                is_adaptive=False,
                focus_competencies=[],
                message="Standard assessment sequence",
            )

    # Never return correct_option_index to client!
    questions_out = [
        QuestionOut(
            id=q.id,
            question=q.question,
            options=q.options,
            competency=q.competency,
        )
        for q in questions
    ]
    return QuizQuestionsResponse(questions=questions_out, adaptive_meta=adaptive_meta)


@router.post("/{module_id}/submit", response_model=QuizSubmitResponse)
async def submit_quiz(
    module_id: str,
    payload: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    default_mod = await get_or_create_default_module(db)
    mod_uuid = _resolve_module_id(module_id, default_mod.id)

    # Check module existence
    mod_result = await db.execute(select(Module).where(Module.id == mod_uuid))
    mod_obj = mod_result.scalar_one_or_none()
    if not mod_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "MODULE_NOT_FOUND", "message": "Module not found"}},
        )

    await seed_quiz_questions_if_needed(db, mod_uuid)

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == mod_uuid))
    questions = {q.id: q for q in result.scalars().all()}

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "code": "QUIZ_NOT_FOUND",
                    "message": "No quiz questions found for this module",
                }
            },
        )

    # Deduplicate submitted answers by question_id (keep latest)
    submitted_map: dict[uuid.UUID, int] = {}
    for answer in payload.answers:
        # Cross-module question validation: only consider questions that belong to this module
        if answer.question_id in questions:
            submitted_map[answer.question_id] = answer.selected_option_index

    # Calculate overall score strictly server-side
    score = 0
    total = len(questions)

    # Calculate competency-level breakdown
    competency_groups: dict[str, list[QuizQuestion]] = {}
    for q in questions.values():
        comp_tag = q.competency or "Core Government Procedures"
        competency_groups.setdefault(comp_tag, []).append(q)

    competency_breakdown: list[CompetencyScoreItem] = []
    strengths: list[str] = []
    weak_areas: list[str] = []

    for comp_tag, q_list in competency_groups.items():
        comp_score = 0
        comp_total = len(q_list)
        for q in q_list:
            user_opt = submitted_map.get(q.id)
            if user_opt is not None and user_opt == q.correct_option_index:
                score += 1
                comp_score += 1

        comp_pct = round((comp_score / comp_total) * 100) if comp_total > 0 else 0
        comp_passed = comp_pct >= 75

        if comp_pct >= 75:
            mastery_lvl = "Mastered"
        elif comp_pct >= 50:
            mastery_lvl = "Operational"
        else:
            mastery_lvl = "Developing"

        competency_breakdown.append(
            CompetencyScoreItem(
                competency=comp_tag,
                score=comp_score,
                total=comp_total,
                percentage=comp_pct,
                passed=comp_passed,
                mastery_level=mastery_lvl,
            )
        )
        if comp_passed:
            strengths.append(comp_tag)
        else:
            weak_areas.append(comp_tag)

    percentage = round((score / total) * 100) if total > 0 else 0
    passed = percentage >= 75

    # Determine dynamic recommended action
    if passed:
        if len(weak_areas) == 0:
            recommended_action = (
                f"Mastery achieved in {mod_obj.title}! All competencies passed. "
                "Your certified status has been updated in My Skills. Proceed to the next module in your roadmap."
            )
        else:
            recommended_action = (
                f"Passing threshold achieved ({percentage}%)! "
                f"For full mastery, review {', '.join(weak_areas)} in the lesson materials."
            )
    else:
        if weak_areas:
            recommended_action = (
                f"Score ({percentage}%) is below the 75% certification requirement. "
                f"Prioritize reviewing: {', '.join(weak_areas)}. Retake the assessment when ready."
            )
        else:
            recommended_action = (
                "Score is below the 75% certification requirement. "
                "Review the lesson guide thoroughly and retake the assessment."
            )

    # Record attempt in database
    now_utc = datetime.now(timezone.utc)
    attempt = QuizAttempt(
        user_id=current_user.id,
        module_id=mod_uuid,
        score=score,
        total=total,
        submitted_at=now_utc,
    )
    db.add(attempt)
    await db.flush()

    # Get attempt count for this user & module
    attempt_count_res = await db.execute(
        select(func.count(QuizAttempt.id)).where(
            QuizAttempt.user_id == current_user.id,
            QuizAttempt.module_id == mod_uuid,
        )
    )
    attempt_number = attempt_count_res.scalar() or 1

    # Upsert UserProgress for Employee Skill Tracking
    prog_res = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.module_id == mod_uuid,
        )
    )
    prog = prog_res.scalar_one_or_none()

    if not prog:
        new_status = "certified" if passed else "in_progress"
        prog = UserProgress(
            user_id=current_user.id,
            module_id=mod_uuid,
            lessons_completed=False,
            best_score=score,
            total_questions=total,
            status=new_status,
        )
        db.add(prog)
    else:
        prog.best_score = max(prog.best_score, score)
        prog.total_questions = total
        if passed:
            prog.status = "certified"
        elif prog.status == "not_started":
            prog.status = "in_progress"

    await db.commit()

    return QuizSubmitResponse(
        score=score,
        total=total,
        percentage=percentage,
        passed=passed,
        attempt_number=attempt_number,
        best_score=prog.best_score,
        status=prog.status,
        competency_breakdown=competency_breakdown,
        strengths=strengths,
        weak_areas=weak_areas,
        recommended_action=recommended_action,
        submitted_at=attempt.submitted_at.isoformat()
        if hasattr(attempt.submitted_at, "isoformat")
        else str(attempt.submitted_at),
    )
