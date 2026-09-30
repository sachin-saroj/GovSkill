# AI Mentor Forensic Diagnostic

**Document Version:** 1.0.0  
**Inspection Date:** 2026-09-30  
**Author:** Antigravity Senior Forensic Engineering  
**Scope:** Read-Only Forensic Architecture & Runtime Diagnostic of GovSkill AI Mentor / Training Copilot  
**Status:** CONFIRMED ROOT CAUSE IDENTIFIED  

---

## 1. Executive Summary

### Observed Symptom
When an engineer or user visits the AI Mentor (`/tutor`) interface, the UI displays:
```
Mode: Grounded Training
```
When the user sends a standard greeting such as `"hello"` or `"hey"`, the system returns the deterministic grounded-training curriculum refusal:
> *"This topic cannot be verified from the approved training module ('Digital Document Handling'). As an official Government Training Copilot, I am strictly restricted from inventing unverified administrative policies, statutory deadlines, or legal requirements. Please refer to your departmental Standard Operating Procedures (SOP) or consult your administrative supervisor."*

This refusal occurs consistently even after replacing, reconfiguring, or validating the `GEMINI_API_KEY`.

### Executive Verdict
**The Gemini API integration is completely functional, and the API key is valid.**  
The root cause is a combination of:
1. **Default Mode Initialization:** `TutorChatPage.tsx` initializes `conversationMode` to `'grounded_training'` whenever `/tutor` is opened without explicit `?mode=general_chat` URL parameters.
2. **Ephemeral Mode State:** Switching to `[ General AI Chat ]` is stored only in ephemeral React state; any page reload (such as restarting or reloading after editing `.env`) immediately resets the UI back to `Mode: Grounded Training`.
3. **Deterministic Short-Circuiting in Grounded Mode:** In `grounded_training` mode, the backend (`tutor.py:116-120`) evaluates `"hello"` against curriculum keywords. With zero keyword matches, `is_out_of_scope = True` is set, and `generate_tutor_answer` (`ai_service.py:218-225`) immediately returns the static refusal string **without ever calling Google Gemini**. Consequently, changing the API key has zero effect on this code path.
4. **Verified General AI Operation:** When `conversation_mode: "general_chat"` is explicitly transmitted, the backend and `AIGateway` successfully call Google Gemini (`gemini-3.5-flash-lite`), producing warm, multilingual conversational answers without any curriculum refusal.

---

## 2. Repository Baseline

- **Current Git Branch:** `main` (synchronized with `origin/main`)
- **HEAD Commit:** `c31d72b` (`feat(core): complete internal operational editorial redesign and release hardening`)
- **Working Tree State:** Clean with pending uncommitted architectural extensions in `backend/app/core/ai_gateway.py`, `backend/app/services/document_registry/`, `frontend/src/pages/TutorChatPage.tsx`, and `frontend/src/pages/CitizenUploadPage.tsx`.
- **Modification Policy:** Strictly read-only for this investigation; no application files were modified or deleted.

---

## 3. Complete AI Mentor Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FRONTEND (React 18)                             │
│                                                                             │
│  TutorChatPage.tsx                                                          │
│  ├── Mode Switcher Pill: [ Grounded Training ] | [ General AI Chat ]        │
│  ├── React State: conversationMode ('grounded_training' | 'general_chat')    │
│  │   └── Initialized from URL param ?mode=... (defaults to 'grounded_training')│
│  ├── Form Submit Handler: handleSendMessage -> sendQuestionText             │
│  │   └── Assembles requestPayload: { module_id, question, mode,             │
│  │                                   conversation_mode, history }           │
│  └── API Client (lib/api.ts): Axios with JWT Authorization header           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ POST /api/tutor/ask
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND API (FastAPI)                              │
│                                                                             │
│  app/api/routes/tutor.py -> ask_tutor()                                     │
│  ├── Authenticate JWT -> current_user (User)                                │
│  ├── Validate Schema -> TutorAskRequest                                     │
│  └── Mode Branch Check:                                                     │
│      is_general = conversation_mode == "general_chat" or mode == "general" │
├──────────────────────────────────────┬──────────────────────────────────────┤
│               IF is_general = True   │             IF is_general = False    │
│                                      │                                      │
│  [GENERAL AI PATH]                   │  [GROUNDED TRAINING PATH]            │
│  ├── Load AIGateway via Singleton    │  ├── Fetch certified modules from DB │
│  ├── System Instruction:             │  ├── Score question keyword overlap  │
│  │   Multilingual, casual register,  │  │   via score_module_relevance()    │
│  │   script-preservation             │  │   - "hello" -> Score = 0          │
│  ├── Call AIGateway.generate_text()  │  │   - is_out_of_scope = True        │
│  │   with prompt & history           │  └── Call generate_tutor_answer()    │
│  └── Return TutorAskResponse         │      ├── IF is_out_of_scope:         │
│      (grounding_status="general_chat")│      │   RETURN STATIC REFUSAL      │
│                                      │      │   (Gemini NEVER called!)     │
│                                      │      └── ELSE:                      │
│                                      │          Call AIGateway with        │
│                                      │          strict curriculum prompt   │
└──────────────────────────────────────┴──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CENTRAL AI GATEWAY (ai_gateway.py)                    │
│                                                                             │
│  AIGateway (Singleton)                                                      │
│  ├── Secret: GEMINI_API_KEY (from app/core/config.py)                       │
│  ├── Model Chain: ["gemini-3.5-flash-lite", "gemini-3.5-flash", ...]        │
│  ├── Non-blocking execution via asyncio.to_thread                           │
│  └── Target: Google Gemini GenAI API                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. File Inventory

| File Path | Component / Layer | Architectural Responsibility | Key Symbols / Functions |
|---|---|---|---|
| `frontend/src/pages/TutorChatPage.tsx` | Frontend UI | Chat interface, mode switcher, history accumulation, form submit | `conversationMode`, `handleSwitchMode`, `sendQuestionText`, `GROUNDED_PROMPTS`, `GENERAL_PROMPTS` |
| `frontend/src/components/tutor/ChatMessageItem.tsx` | Frontend UI | Message bubble rendering, grounding badges, follow-up actions | `ChatMessageItem`, `ChatMessage` |
| `frontend/src/types/index.ts` | Frontend Types | TypeScript contract for tutor requests and responses | `TutorAskRequest`, `TutorAskResponse`, `Module` |
| `backend/app/schemas/tutor.py` | API Contract | Pydantic v2 schemas for request validation | `TutorAskRequest`, `TutorAskResponse`, `TutorChatMessage` |
| `backend/app/api/routes/tutor.py` | API Router | Route handler, mode routing check, relevance scoring | `ask_tutor`, `is_general`, `score_module_relevance` |
| `backend/app/services/ai_service.py` | Domain Service | Grounded training business logic, curriculum extraction, static refusal | `generate_tutor_answer`, `score_module_relevance`, `find_relevant_modules` |
| `backend/app/core/ai_gateway.py` | Core Infrastructure | Central Gemini SDK gateway, thread pool executor, multimodal client | `AIGateway`, `get_ai_gateway`, `generate_text` |
| `backend/app/core/config.py` | Configuration | Pydantic BaseSettings loading environment variables from `.env` | `Settings`, `GEMINI_API_KEY`, `AI_MODEL`, `AI_TIMEOUT_SECONDS` |
| `backend/.env` | Environment Config | Local runtime secrets and provider parameters | `GEMINI_API_KEY`, `AI_PROVIDER`, `AI_MODEL` |

---

## 5. Frontend Mode Flow

### State Definition & Default Initialization
In `frontend/src/pages/TutorChatPage.tsx` (lines 45–48):
```tsx
const [conversationMode, setConversationMode] = useState<'grounded_training' | 'general_chat'>(() => {
  const rawMode = searchParams.get('mode') || searchParams.get('conversation_mode') || '';
  return rawMode === 'general_chat' || rawMode === 'general' ? 'general_chat' : 'grounded_training';
});
```

### Analysis of Frontend Mode Behaviors:
1. **Default Mode:** When navigating to `/tutor` directly, `rawMode` is empty (`""`). The initial state is hardcoded to `'grounded_training'`.
2. **Value Stored on General AI Selection:** Clicking `[ General AI Chat ]` executes `handleSwitchMode('general_chat')`, setting state to `'general_chat'`.
3. **Value Stored on Grounded Training Selection:** Clicking `[ Grounded Training ]` executes `handleSwitchMode('grounded_training')`, setting state to `'grounded_training'`.
4. **Exact Outgoing Payload:**
   In lines 123–133 of `TutorChatPage.tsx`:
   ```tsx
   const requestPayload: Record<string, any> = {
     module_id: conversationMode === 'general_chat' ? 'auto' : selectedModuleId,
     question: questionText.trim(),
     mode: conversationMode === 'general_chat' ? 'general_chat' : mode,
     conversation_mode: conversationMode,
   };
   if (conversationMode === 'general_chat' && historyPayload.length > 0) {
     requestPayload.history = historyPayload;
   }
   ```
5. **Field Names Transmitted:** Both `mode` and `conversation_mode` are transmitted.
   - When `conversationMode === 'general_chat'`: `mode = "general_chat"` and `conversation_mode = "general_chat"`.
   - When `conversationMode === 'grounded_training'`: `mode = "standard"` (or caller mode) and `conversation_mode = "grounded_training"`.
6. **State Persistence Deficiency:** `handleSwitchMode` does NOT update URL search parameters, nor does it persist to `localStorage` or `sessionStorage`. As a result, any page reload or browser refresh silently resets the mode to `grounded_training`.

---

## 6. API Contract Trace

In `backend/app/schemas/tutor.py`:
```python
class TutorChatMessage(BaseModel):
    sender: str = "user"  # "user" | "tutor" | "assistant"
    text: str = Field(max_length=2000)

class TutorAskRequest(BaseModel):
    module_id: str = "auto"
    question: str = Field(min_length=1, max_length=1000)
    mode: str = "standard"
    conversation_mode: str = "grounded_training"
    history: list[TutorChatMessage] = Field(default_factory=list)

class TutorAskResponse(BaseModel):
    answer: str
    matched_module_id: str | None = None
    matched_module_title: str
    grounding_status: str
    suggested_followups: list[str] = []
    source_sections: list[str] = []
    mode: str = "standard"
    conversation_mode: str = "grounded_training"
```
- Both `mode` and `conversation_mode` default to `"grounded_training"`.
- Values are case-sensitive lowercase strings (`"general_chat"`, `"grounded_training"`).

---

## 7. Backend Routing

In `backend/app/api/routes/tutor.py` (lines 28–31):
```python
is_general = payload.conversation_mode == "general_chat" or payload.mode in (
    "general_chat",
    "general",
)
```

### Precedence and Branch Evaluation:
- If `payload.conversation_mode == "general_chat"` OR `payload.mode in ("general_chat", "general")`, execution enters the **General AI Assistant** branch.
- In all other cases (`conversation_mode == "grounded_training"`), execution enters the **Grounded Training** branch.
- **The Out-of-Scope Trap:**
  In lines 111–120:
  ```python
  if payload.module_id in ("all", "auto", "default"):
      relevant_mods = find_relevant_modules(payload.question, all_modules)
      module = relevant_mods[0] if relevant_mods else all_modules[0]

      top_score, matched_sections = score_module_relevance(payload.question, module)
      if top_score == 0:
          any_score = max(score_module_relevance(payload.question, m)[0] for m in all_modules)
          if any_score == 0:
              is_out_of_scope = True
  ```
  When the query is a conversational greeting like `"hello"`:
  - `score_module_relevance("hello", m)` returns `(0, [])` across all 4 public administration modules.
  - `any_score` is `0`.
  - `is_out_of_scope` becomes `True`.
  - At line 139, `generate_tutor_answer(..., is_out_of_scope=True)` is called.

---

## 8. AI Gateway Trace

In `backend/app/services/ai_service.py` (lines 218–225):
```python
if is_out_of_scope:
    refusal_msg = (
        f"This topic cannot be verified from the approved training module ('{module_title}').\n\n"
        "As an official Government Training Copilot, I am strictly restricted from inventing unverified "
        "administrative policies, statutory deadlines, or legal requirements. Please refer to your "
        "departmental Standard Operating Procedures (SOP) or consult your administrative supervisor."
    )
    return refusal_msg, "insufficient_context"
```
**Critical Forensic Finding:**  
When `is_out_of_scope` is `True`, `generate_tutor_answer` **immediately returns `refusal_msg`**.  
The lines that call `gateway = get_ai_gateway()` and `gateway.generate_text(...)` (lines 257–264) are **NEVER reached**.  
Gemini is not invoked. No network request leaves the server.

In contrast, in General AI mode (`tutor.py:61-67`):
```python
if gateway.is_configured():
    answer = await gateway.generate_text(
        prompt=payload.question,
        system_instruction=system_instruction,
        history=history_payload,
    )
```
The central `AIGateway` invokes Google Gemini with `gemini-3.5-flash-lite`, the multilingual system instruction, and session history.

---

## 9. Gemini Configuration Trace

- **Configuration File:** `backend/.env`
- **Settings Class:** `backend/app/core/config.py::Settings`
- **Active Environment Values:**
  - `GEMINI_API_KEY`: Configured (Length: 53 characters, non-empty, loaded from `backend/.env`)
  - `AI_PROVIDER`: `"gemini"`
  - `AI_MODEL`: `"gemini-3.5-flash-lite"`
  - `AI_TIMEOUT_SECONDS`: `25.0`
  - `AI_MAX_CONCURRENCY`: `3`
  - `AI_VISION_ENABLED`: `True`
- **Process Verification:** Both the live running Uvicorn server and local Python runtime have the identical `.env` configuration loaded.

---

## 10. Runtime Processes

| Process | Process ID (PID) | Listening Port | Command Line |
|---|---|---|---|
| **Backend (FastAPI)** | `29228` | `127.0.0.1:8000` | `"C:\Users\Asus\OneDrive\Desktop\GovSkill\backend\venv\Scripts\python.exe" "C:\Users\Asus\OneDrive\Desktop\GovSkill\backend\venv\Scripts\uvicorn.exe" app.main:app --port 8000` |
| **Frontend (Vite)** | `23160` | `localhost:3000` | `"node" "C:\Users\Asus\OneDrive\Desktop\GovSkill\frontend\node_modules\.bin\..\vite\bin\vite.js"` |

Both processes are running against the current repository source tree.

---

## 11. Live Network Evidence

Captured live from the running Chrome DevTools browser session:

### Evidence A: Default Grounded Mode Request (`reqid=106` & `reqid=114`)
**UI State:** `Mode: Grounded Training`  
**User Message:** `"hello"`  
**Request Payload:**
```json
{
  "module_id": "auto",
  "question": "hello",
  "mode": "standard",
  "conversation_mode": "grounded_training"
}
```
**HTTP Response (Status 200):**
```json
{
  "answer": "This topic cannot be verified from the approved training module ('Digital Document Handling').\n\nAs an official Government Training Copilot, I am strictly restricted from inventing unverified administrative policies, statutory deadlines, or legal requirements. Please refer to your departmental Standard Operating Procedures (SOP) or consult your administrative supervisor.",
  "matched_module_id": "11111111-1111-1111-1111-111111111111",
  "matched_module_title": "Digital Document Handling",
  "grounding_status": "insufficient_context",
  "suggested_followups": [
    "What is the minimum character length for certificate numbers?",
    "What are common data entry errors to avoid during verification?",
    "How should citizen PII and certificates be stored securely?"
  ],
  "source_sections": [
    "Lesson 1: Introduction to Digital Document Handling",
    "Lesson 2: Verification Checklist & Standards"
  ],
  "mode": "standard",
  "conversation_mode": "grounded_training"
}
```

### Evidence B: General AI Chat Mode Request (`reqid=109`)
**UI State:** `Mode: General AI Assistant`  
**User Message:** `"hey"`  
**Request Payload:**
```json
{
  "module_id": "auto",
  "question": "hey",
  "mode": "general_chat",
  "conversation_mode": "general_chat"
}
```
**HTTP Response (Status 200 from real Gemini API):**
```json
{
  "answer": "Hello! I am GovSkill Assistant. How can I help you today? Whether you have questions about civic administration, need help drafting an official communication, want to discuss a technical topic, or just need to brainstorm—feel free to ask!",
  "matched_module_id": null,
  "matched_module_title": "GovSkill General Assistant",
  "grounding_status": "general_chat",
  "suggested_followups": [
    "Explain machine learning in simple terms",
    "What are best practices for government office workflows?",
    "How does digital document validation work?"
  ],
  "source_sections": [],
  "mode": "general_chat",
  "conversation_mode": "general_chat"
}
```

### Evidence C: Multilingual General AI Request (`reqid=110`)
**User Message:** `"मुझे मशीन लर्निंग simple words में समझाओ"`  
**HTTP Response:**
```json
{
  "answer": "अरे बिल्कुल! चलो मशीन लर्निंग (Machine Learning या ML) को एकदम आसान भाषा में समझते हैं।\n\nसोचो कि आप एक छोटे बच्चे को सिखा रहे हैं कि बिल्ली कैसी दिखती है...",
  "grounding_status": "general_chat",
  "conversation_mode": "general_chat"
}
```

### Evidence D: Multi-Turn Contextual Follow-up (`reqid=111`)
**User Message:** `"what did you just explain?"`  
**History Array Sent:** Contained previous turns (greeting + Hindi ML explanation).  
**HTTP Response:**
```json
{
  "answer": "Maine abhi aapko Machine Learning (ML) ke baare mein bilkul aasan shabdon mein samjhaya tha! Maine bataya tha ki jaise ek chhota bachcha cheezon ko dekh kar khud-ba-khud sikhata hai...",
  "grounding_status": "general_chat",
  "conversation_mode": "general_chat"
}
```

---

## 12. Test Evidence

The repository maintains automated verification in:
- `backend/app/tests/test_ai_mentor_multilingual.py`
  - `test_general_chat_casual_greetings`: Verifies `conversation_mode="general_chat"` receives a conversational response.
  - `test_multilingual_responses_match_language`: Verifies Hindi/Marathi responses match language.
  - `test_multi_turn_history_preservation`: Verifies pronoun and concept resolution.
  - `test_grounded_curriculum_answering`: Verifies curriculum grounding.
  - `test_grounded_strict_refusal_out_of_scope`: Verifies that `"Give me a chocolate cake recipe"` in grounded mode returns the exact refusal message.
- `frontend/src/pages/TutorChatPage.test.tsx`
  - Verifies mode switching, payload generation, and UI state toggling.

---

## 13. Root Cause

### CONFIRMED ROOT CAUSE
The symptom is caused by **mode defaulting and state reset in the frontend, combined with deterministic keyword rejection of conversational greetings in Grounded Training mode**:

1. **Default Mode is Grounded:** `TutorChatPage.tsx` initializes to `'grounded_training'` whenever a user navigates to `/tutor`.
2. **Reload Reversion:** Because mode selection is not persisted in the URL query string or browser storage, refreshing the page (e.g., after updating `.env`) silently resets the mode to `grounded_training`.
3. **Keyword Scoring Zero for Greetings:** In `tutor.py`, the greeting `"hello"` has zero lexical overlap with certified administrative training modules (`any_score == 0`).
4. **Deterministic Short-Circuit:** When `is_out_of_scope` is set to `True`, `generate_tutor_answer` immediately returns the hardcoded refusal string:
   `"This topic cannot be verified from the approved training module ('Digital Document Handling')..."`
   **without ever making a call to Google Gemini.**
5. **API Key Irrelevance:** Because the grounded refusal is generated purely in local Python code prior to any AI provider call, modifying or replacing the `GEMINI_API_KEY` had zero effect on the output.

---

## 14. Contributing Factors

1. **Lack of Friendly Greeting Handling in Grounded Mode:** Even in strict curriculum training mode, a polite conversational opener (`"hello"`, `"hi"`, `"good morning"`) should ideally be greeted politely with an invitation to ask training questions, rather than triggering an out-of-scope violation alert.
2. **Mode Switch Does Not Persist Across Reloads:** The UI lacks URL query synchronization (`?mode=general_chat`) or `localStorage` caching, causing reloads to always revert to Grounded Training.
3. **History Cross-Contamination on Mode Switch:** In `TutorChatPage.tsx`, switching modes does not isolate or clear the `messages` array, causing grounded refusal messages to be sent as prior history when switching to General AI chat.

---

## 15. Recommended Fix (For Next Engineer)

*Note: As per task rules, this fix is NOT implemented here.*

### Proposed Minimal Production-Safe Fix:
1. **Frontend (`TutorChatPage.tsx`)**:
   - Persist mode in URL search parameters or `localStorage`:
     ```tsx
     // Sync mode with URL search params so refresh maintains selection:
     const [conversationMode, setConversationMode] = useState<'grounded_training' | 'general_chat'>(() => {
       const urlMode = searchParams.get('mode') || searchParams.get('conversation_mode');
       if (urlMode === 'general_chat' || urlMode === 'general') return 'general_chat';
       const stored = localStorage.getItem('govskill_tutor_mode');
       return stored === 'general_chat' ? 'general_chat' : 'grounded_training';
     });
     ```
   - On mode switch, update URL search params and `localStorage.setItem('govskill_tutor_mode', newMode)`.
   - Optionally separate or reset conversation history when switching modes to avoid cross-contamination.
2. **Backend (`ai_service.py` / `tutor.py`)**:
   - In `grounded_training` mode, detect common cordial greetings (`"hello"`, `"hi"`, `"namaste"`, `"good morning"`) before marking `is_out_of_scope = True`.
   - If a greeting is detected, return a friendly, grounded orientation response:
     > *"Hello! I am your official Government Training Copilot. I am ready to assist you with questions on document verification, portal workflows, cybersecurity standards, and record retention."*
     instead of treating `"hello"` as an unverified policy hallucination.

---

## 16. Verification Plan

After implementing the recommended fix, execute:
1. **Browser Test 1:** Open `/tutor` with default settings. Send `"hello"`. Verify it returns a friendly Copilot greeting, not an out-of-scope refusal.
2. **Browser Test 2:** Click `[ General AI Chat ]`. Verify `Mode: General AI Assistant` is active. Send `"hello"`. Verify a warm conversational Gemini response is returned.
3. **Browser Test 3:** Press `F5` / reload the page. Verify the page remains in `General AI Chat` mode.
4. **Browser Test 4:** Switch to `[ Grounded Training ]`. Send `"Give me a chocolate cake recipe"`. Verify the strict out-of-scope refusal is preserved.
5. **Automated Tests:**
   - `pytest backend/app/tests/test_ai_mentor_multilingual.py`
   - `npm test src/pages/TutorChatPage.test.tsx`

---

## 17. Risk Assessment

- **Security:** Low risk. No secrets or tokens are exposed. API keys remain strictly server-side.
- **Reliability:** Low risk. Enhancing greeting detection prevents false-positive curriculum refusals.
- **AI Behavior:** Zero regression to anti-hallucination policies. Grounded curriculum questions remain strictly grounded.
- **Privacy:** Aadhaar/PAN masking and citizen document boundaries are unrelated and unaffected.
- **Regression:** Existing curriculum tests will pass provided greeting detection is scoped to pure conversational openers.

---

## 18. Final Diagnostic Verdict

**CONFIRMED ROOT CAUSE**  
The investigation has definitively established that the observed refusal behavior is not an API key failure, but a frontend mode defaulting issue coupled with deterministic keyword rejection of conversational greetings in Grounded Training mode.
