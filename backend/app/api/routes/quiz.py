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

SEED_QUESTIONS = [
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222201"),
        "question": "What is the minimum required length for a valid Income Certificate number?",
        "options": ["4 characters", "6 characters", "8 characters", "10 characters"],
        "correct_option_index": 1,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222202"),
        "question": "Which format must official certificate numbers follow?",
        "options": ["Numeric only", "Alphanumeric", "Special symbols only", "Roman numerals"],
        "correct_option_index": 1,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222203"),
        "question": "What action should an employee take if a certificate's expiry date has passed?",
        "options": ["Approve anyway", "Reject or flag as expired", "Manually extend the date", "Ignore expiry date"],
        "correct_option_index": 1,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222204"),
        "question": "Which of the following is a mandatory field that must be present on an Income Certificate?",
        "options": ["Applicant Full Name", "Social media handle", "Home wifi password", "Blood group"],
        "correct_option_index": 0,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222205"),
        "question": "What is the primary reason for strictly managing Personally Identifiable Information (PII)?",
        "options": ["To protect citizen privacy and satisfy compliance", "To reduce database file size", "To speed up printing", "To publish public records"],
        "correct_option_index": 0,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222206"),
        "question": "How should an employee handle a blurry or illegible OCR document upload?",
        "options": ["Guess the missing text", "Reject or request a clear re-upload", "Approve immediately", "Delete citizen file"],
        "correct_option_index": 1,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222207"),
        "question": "Which of the following is a common administrative data-entry error?",
        "options": ["Name spelling mismatches between application and certificate", "Automated system backups", "Clear readable scans", "Verifying stamps"],
        "correct_option_index": 0,
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222208"),
        "question": "Where is the quiz scoring evaluated in GovSkill?",
        "options": ["Client-side in browser JS", "Server-side only", "Third-party proxy", "Manual grading by supervisor"],
        "correct_option_index": 1,
    },
]


async def seed_quiz_questions_if_needed(db: AsyncSession, module_id: uuid.UUID):
    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == module_id))
    existing = result.scalars().all()
    if not existing:
        for q_data in SEED_QUESTIONS:
            q = QuizQuestion(
                id=q_data["id"],
                module_id=module_id,
                question=q_data["question"],
                options=q_data["options"],
                correct_option_index=q_data["correct_option_index"],
            )
            db.add(q)
        await db.commit()


@router.get("/{module_id}", response_model=QuizQuestionsResponse)
async def get_quiz_questions(
    module_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    default_mod = await get_or_create_default_module(db)
    mod_uuid = default_mod.id if module_id == "default" else uuid.UUID(module_id)

    await seed_quiz_questions_if_needed(db, mod_uuid)

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == mod_uuid))
    questions = result.scalars().all()

    # Never return correct_option_index to client!
    questions_out = [
        QuestionOut(id=q.id, question=q.question, options=q.options) for q in questions
    ]
    return QuizQuestionsResponse(questions=questions_out)


@router.post("/{module_id}/submit", response_model=QuizSubmitResponse)
async def submit_quiz(
    module_id: str,
    payload: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    default_mod = await get_or_create_default_module(db)
    mod_uuid = default_mod.id if module_id == "default" else uuid.UUID(module_id)

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
    await db.commit()

    return QuizSubmitResponse(score=score, total=total)
