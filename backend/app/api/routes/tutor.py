import uuid
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.routes.modules import seed_all_default_modules
from app.models.module import Module
from app.models.user import User
from app.schemas.tutor import TutorAskRequest, TutorAskResponse
from app.services.ai_service import (
    extract_module_sections,
    find_relevant_modules,
    generate_followup_suggestions,
    generate_tutor_answer,
    score_module_relevance,
)

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/ask", response_model=TutorAskResponse)
async def ask_tutor(
    payload: TutorAskRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    all_modules = await seed_all_default_modules(db)
    is_out_of_scope = False

    # Check if explicit module selected or auto-detect mode
    if payload.module_id in ("all", "auto", "default"):
        relevant_mods = find_relevant_modules(payload.question, all_modules)
        module = relevant_mods[0] if relevant_mods else all_modules[0]

        top_score, matched_sections = score_module_relevance(payload.question, module)
        if top_score == 0:
            # Check if query has zero overlap with any training module
            any_score = max(score_module_relevance(payload.question, m)[0] for m in all_modules)
            if any_score == 0:
                is_out_of_scope = True
    else:
        try:
            mod_uuid = uuid.UUID(payload.module_id)
            result = await db.execute(select(Module).where(Module.id == mod_uuid))
            module = result.scalar_one_or_none()
            if not module:
                relevant_mods = find_relevant_modules(payload.question, all_modules)
                module = relevant_mods[0] if relevant_mods else all_modules[0]
        except ValueError:
            relevant_mods = find_relevant_modules(payload.question, all_modules)
            module = relevant_mods[0] if relevant_mods else all_modules[0]

        _, matched_sections = score_module_relevance(payload.question, module)

    all_sections = extract_module_sections(module.content)
    source_sections = matched_sections if matched_sections else all_sections[:2]
    suggested_followups = generate_followup_suggestions(module.title, source_sections)

    answer, grounding_status = await generate_tutor_answer(
        module_title=module.title,
        module_content=module.content,
        question=payload.question,
        mode=payload.mode,
        is_out_of_scope=is_out_of_scope,
    )

    return TutorAskResponse(
        answer=answer,
        matched_module_id=str(module.id) if hasattr(module, "id") else None,
        matched_module_title=module.title,
        grounding_status=grounding_status,
        suggested_followups=suggested_followups,
        source_sections=source_sections,
        mode=payload.mode,
    )
