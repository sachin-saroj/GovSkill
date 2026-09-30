import re
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

GROUNDED_GREETINGS = {
    "hello",
    "hi",
    "hey",
    "namaste",
    "namaskar",
    "good morning",
    "good afternoon",
    "good evening",
}


def is_pure_greeting(text: str) -> bool:
    cleaned = re.sub(r"[^\w\s]", "", text.strip().lower())
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned in GROUNDED_GREETINGS

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/ask", response_model=TutorAskResponse)
async def ask_tutor(
    payload: TutorAskRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    is_general = payload.conversation_mode == "general_chat" or payload.mode in (
        "general_chat",
        "general",
    )

    if is_general:
        # General conversational AI assistant mode via central AIGateway
        from app.core.ai_gateway import get_ai_gateway

        gateway = get_ai_gateway()
        system_instruction = (
            "You are GovSkill Assistant, an intelligent, helpful, polite, and versatile multilingual AI assistant for civic officials, employees, and citizens.\n"
            "You can engage in natural conversation, answer technical, administrative, programming, and general questions, help draft workplace communications, "
            "brainstorm, and explain concepts clearly and concisely.\n\n"
            "CRITICAL MULTILINGUAL & REGISTER INSTRUCTION:\n"
            "- Automatically detect and respond in the exact language, dialect, script, and register used by the user:\n"
            "  * If user writes in English, reply in natural, clear English.\n"
            "  * If user writes in Hindi (in Devanagari or Latin script / Hinglish), reply in Hindi or Hinglish matching their style and script.\n"
            "  * If user writes in Marathi (in Devanagari or Latin script), reply in natural, fluent Marathi matching their style and script.\n"
            "  * If user writes in Hinglish (e.g., 'mujhe machine learning simple mein samjha' or 'hello bhai'), reply warmly in natural Hinglish (e.g., 'Haan bhai, simple words mein samjhata hoon...').\n"
            "  * If user writes in mixed English + Hindi or English + Marathi, preserve the natural code-mixed style.\n"
            "  * Do NOT translate everything to English unless the user explicitly requests English.\n"
            "  * Do NOT force a stiff bureaucratic tone in general chat.\n"
            "- MULTI-TURN CONVERSATION CONTEXT:\n"
            "  * Maintain awareness of prior messages in the conversation history.\n"
            "  * If the user asks a follow-up or uses pronouns like 'isko', 'explain this further', 'what about that', or 'can you give an example', "
            "resolve the context from the conversation history and continue smoothly.\n"
            "- Respond directly and conversationally without robotic boilerplate or artificial curriculum restrictions."
        )

        history_payload = [m.model_dump() for m in payload.history] if payload.history else None

        answer = None
        if gateway.is_configured():
            answer = await gateway.generate_text(
                prompt=payload.question,
                system_instruction=system_instruction,
                history=history_payload,
            )

        if not answer or not answer.strip():
            # Graceful fallback response when offline
            q_lower = payload.question.lower()
            if any(
                w in q_lower
                for w in ["namaste", "namaskar", "bhai", "kya", "kaise", "samjha", "kasa"]
            ):
                answer = (
                    f"नमस्ते / नमस्कार! मी/मी GovSkill Assistant आहे. तुम्ही विचारले: '{payload.question}'. "
                    "मी तंत्रज्ञान, प्रशासकीय मार्गदर्शन, मसुदा तयार करणे आणि सामान्य प्रश्नांमध्ये मदत करण्यास तयार आहे."
                )
            else:
                answer = (
                    f"Hello! I am your GovSkill Assistant. You asked: '{payload.question}'. "
                    "I'm ready to help you with general questions, administrative guidance, drafting, and technical concepts. "
                    "How else may I assist you today?"
                )
            grounding_status = "fallback"
        else:
            answer = answer.strip()
            grounding_status = "general_chat"

        suggested_followups = [
            "Explain machine learning in simple terms",
            "What are best practices for government office workflows?",
            "How does digital document validation work?",
        ]

        return TutorAskResponse(
            answer=answer,
            matched_module_id=None,
            matched_module_title="GovSkill General Assistant",
            grounding_status=grounding_status,
            suggested_followups=suggested_followups,
            source_sections=[],
            mode="general_chat",
            conversation_mode="general_chat",
        )

    all_modules = await seed_all_default_modules(db)

    # Friendly orientation for pure greetings in Grounded Training (no severe refusal, no wasted API call)
    if is_pure_greeting(payload.question):
        module = all_modules[0] if all_modules else None
        return TutorAskResponse(
            answer=(
                "Hello! I'm your Government Training Copilot. Ask me about the approved training "
                "modules, document verification, portal workflows, or other curriculum topics."
            ),
            matched_module_id=str(module.id) if module and hasattr(module, "id") and module.id else None,
            matched_module_title=module.title if module and hasattr(module, "title") and module.title else "Government Training Copilot",
            grounding_status="grounded",
            suggested_followups=[
                "What are the four mandatory income certificate verification rules?",
                "What should I do if I suspect a phishing email?",
                "When does SLA escalation trigger in portal operations?",
            ],
            source_sections=[],
            mode=payload.mode if payload.mode not in ("general_chat", "general") else "standard",
            conversation_mode="grounded_training",
        )

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
        mode=payload.mode if payload.mode not in ("general_chat", "general") else "standard",
        conversation_mode="grounded_training",
    )
