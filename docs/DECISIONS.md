# Key Architectural & Design Decisions — GovSkill

This document records the fundamental architectural, technological, and security decisions inferred directly from the codebase and project specification.

---

## 1. Deterministic Rule Engine vs. AI Isolation
- **Decision**: All business validation rules in GovAssist (`rule_engine.py`) are strictly 100% deterministic code (Python regex matching and ISO date comparisons).
- **Rationale**: AI models can hallucinate or produce non-deterministic results. Business validation rules must produce reliable, repeatable outcomes.
- **Role of AI**: Google Gemini (`gemini-2.5-flash`) is strictly restricted to an **Explanation Layer** that explains why a rule failed *after* the Rule Engine has produced the result. It is never allowed to determine pass/fail status.

---

## 2. Server-Side Quiz Evaluation
- **Decision**: Quiz questions returned via `GET /api/quiz/{module_id}` exclude the `correct_option_index` field (`QuestionOut` schema).
- **Rationale**: Prevents client-side tampering or inspection of answer keys. Scoring is performed exclusively on the backend inside `POST /api/quiz/{module_id}/submit`.

---

## 3. Decoupled Citizen Data Model
- **Decision**: The `citizen_documents` database table contains no foreign key references to `users` or internal employee tables.
- **Rationale**: Maintains strict separation between public citizen self-service pre-checks and internal government employee accounts. Protects privacy and avoids unnecessary data coupling.

---

## 4. Dual Database Compatibility (PostgreSQL + SQLite Fallback)
- **Decision**: The backend utilizes SQLAlchemy 2.0 Async with driver fallback logic supporting `postgresql+asyncpg` for production/development and `sqlite+aiosqlite` for in-memory integration testing.
- **Rationale**: Enables fast, isolated execution of `pytest` test suites without requiring a running PostgreSQL database instance.

---

## 5. Resilient LLM Fallback Architecture
- **Decision**: `ai_service.py` provides hardcoded, keyword-matched fallback responses for both the AI Tutor (`generate_tutor_answer`) and AI Explanation Layer (`generate_rule_explanation`).
- **Rationale**: Ensures the web application remains fully functional even when `GEMINI_API_KEY` is not provided in `.env` or if third-party LLM API requests time out.
