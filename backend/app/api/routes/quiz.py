import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.routes.modules import get_or_create_default_module
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import User
from app.schemas.quiz import (
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
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222202"),
        "module_id": MODULE_1_ID,
        "question": "Which format must official certificate numbers follow?",
        "options": ["Numeric only", "Alphanumeric", "Special symbols only", "Roman numerals"],
        "correct_option_index": 1,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222203"),
        "module_id": MODULE_1_ID,
        "question": "What action should an employee take if a certificate's expiry date has passed?",
        "options": ["Approve anyway", "Reject or flag as expired", "Manually extend the date", "Ignore expiry date"],
        "correct_option_index": 1,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222204"),
        "module_id": MODULE_1_ID,
        "question": "Which of the following is a mandatory field that must be present on an Income Certificate?",
        "options": ["Applicant Full Name", "Social media handle", "Home wifi password", "Blood group"],
        "correct_option_index": 0,
    },
    # Module 2: Government Portal Operations
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222205"),
        "module_id": MODULE_2_ID,
        "question": "After how many days without resolution is an application flagged for supervisor escalation?",
        "options": ["3 business days", "5 business days", "7 business days", "14 business days"],
        "correct_option_index": 2,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222206"),
        "module_id": MODULE_2_ID,
        "question": "What is the second step in citizen application verification workflow?",
        "options": ["Delete citizen files", "Route application for departmental supervisor sign-off", "Approve immediately", "Send SMS notification"],
        "correct_option_index": 1,
    },
    # Module 3: Cybersecurity & Data Privacy Basics
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222207"),
        "module_id": MODULE_3_ID,
        "question": "What should an employee do when receiving an email with an unverified external attachment?",
        "options": ["Open attachment immediately", "Do not click link/attachment and verify sender", "Forward to all colleagues", "Reply with portal password"],
        "correct_option_index": 1,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222208"),
        "module_id": MODULE_3_ID,
        "question": "How must sensitive citizen records (e.g. Aadhaar / Bank details) be stored?",
        "options": ["Unencrypted on personal USB drives", "Encrypted at rest and in transit", "Publicly on local desktop", "Printed on paper only"],
        "correct_option_index": 1,
    },
    # Module 4: Digital Record Management
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222209"),
        "module_id": MODULE_4_ID,
        "question": "How long must Income Certificate records be retained before scheduled archive purging?",
        "options": ["1 year", "3 years", "5 years", "10 years"],
        "correct_option_index": 2,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222210"),
        "module_id": MODULE_4_ID,
        "question": "What tracks every document edit, export, and access request in government portals?",
        "options": ["Immutable system audit logs", "Manual paper ledger", "Daily browser cache", "Temporary email notes"],
        "correct_option_index": 0,
    },
]


async def seed_quiz_questions_if_needed(db: AsyncSession, module_id: uuid.UUID):
    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == module_id))
    existing = result.scalars().all()
    if not existing:
        for q_data in SEED_QUESTIONS:
            if q_data.get("module_id") == module_id:
                q = QuizQuestion(
                    id=q_data["id"],
                    module_id=module_id,
                    question=q_data["question"],
                    options=q_data["options"],
                    correct_option_index=q_data["correct_option_index"],
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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    default_mod = await get_or_create_default_module(db)
    mod_uuid = _resolve_module_id(module_id, default_mod.id)

    await seed_quiz_questions_if_needed(db, mod_uuid)

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == mod_uuid))
    questions = result.scalars().all()

    # Never return correct_option_index to client!
    questions_out = [
        QuestionOut(id=q.id, question=q.question, options=q.options) for q in questions
    ]
    return QuizQuestionsResponse(questions=questions_out)


from app.models.progress import UserProgress


@router.post("/{module_id}/submit", response_model=QuizSubmitResponse)
async def submit_quiz(
    module_id: str,
    payload: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    default_mod = await get_or_create_default_module(db)
    mod_uuid = _resolve_module_id(module_id, default_mod.id)

    await seed_quiz_questions_if_needed(db, mod_uuid)

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == mod_uuid))
    questions = {q.id: q for q in result.scalars().all()}

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "QUIZ_NOT_FOUND", "message": "No quiz questions found for this module"}},
        )

    score = 0
    total = len(questions)

    for answer in payload.answers:
        q_obj = questions.get(answer.question_id)
        if q_obj and answer.selected_option_index == q_obj.correct_option_index:
            score += 1

    # Record attempt in database
    attempt = QuizAttempt(
        user_id=current_user.id,
        module_id=mod_uuid,
        score=score,
        total=total,
    )
    db.add(attempt)

    # Upsert UserProgress for Employee Skill Tracking
    prog_res = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.module_id == mod_uuid,
        )
    )
    prog = prog_res.scalar_one_or_none()

    is_certified = (total > 0) and ((score / total) >= 0.75)

    if not prog:
        new_status = "certified" if is_certified else "in_progress"
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
        if is_certified:
            prog.status = "certified"
        elif prog.status == "not_started":
            prog.status = "in_progress"

    await db.commit()

    return QuizSubmitResponse(score=score, total=total)

