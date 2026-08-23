# AGENTS.md — Repository Guidance for AI Coding Agents

## Project Summary
**GovSkill** is a full-stack web application designed for local government offices. It features:
1. **Core Employee Training Module**: Lesson reading, grounded AI Tutor (Google Gemini), and server-scored Quiz with an Admin Dashboard.
2. **GovAssist (Citizen Pre-Submission Checker)**: Self-service document validation for Income Certificates (OCR + 4-rule Engine + AI Explanation).

---

## Tech Stack Rules (Non-Negotiable)

| Layer | Technology |
|---|---|
| Backend | **FastAPI** (Python 3.11+) |
| Database | **PostgreSQL** (SQLAlchemy 2.0 Async + Alembic) with SQLite fallback |
| Authentication | **JWT** (`python-jose` + `passlib[bcrypt]`) |
| Validation | **Pydantic v2** |
| OCR | **Tesseract OCR** (`pytesseract` + Pillow) |
| AI Integration | **Google Gemini API** (`google-genai` package, model `gemini-2.5-flash`) |
| Frontend | **React 18 + Vite** (TypeScript) |
| Styling | **Tailwind CSS 3** |
| HTTP Client | **Axios** |
| Testing | **Pytest** |

Do **NOT** introduce alternative frameworks (e.g., Next.js, Prisma, Express, Node backend, MongoDB, Drizzle).

---

## Strict Development Rules

1. **Deterministic Business Rules**: The Rule Engine (`backend/app/services/rule_engine.py`) MUST remain 100% code-driven. Never allow AI/LLM logic to make pass/fail validation decisions.
2. **Server-Side Quiz Scoring**: `correct_option_index` must NEVER be sent to the frontend. Quiz evaluation must happen server-side in `/api/quiz/{module_id}/submit`.
3. **AI Layer Scope**: Gemini AI is strictly isolated to (a) grounded AI Tutor Q&A (`generate_tutor_answer`) and (b) plain-language explanations of ALREADY-failed validation rules (`generate_rule_explanation`).
4. **Isolated Citizen Documents**: `citizen_documents` table must NOT have a foreign key to `users`.
5. **No Code Modification Without Verification**: Do not change code or claim completion without running tests or verifying implementation.

---

## Quick Reference Commands

### Backend Setup & Execution
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Run Backend Tests
```bash
cd backend
pytest
```

### Backend Lint & Format
```bash
cd backend
ruff check . --fix && ruff format .
```

### Frontend Setup & Execution
```bash
cd frontend
npm install
npm run dev
```

---

# Engineering Simplicity & Appropriate Complexity Rules

The project should demonstrate real software engineering, AI integration, document processing, security, testing, and a clean architecture. However, the project must NOT become over-engineered. The core principle is: "Advanced functionality, simple architecture."

## 1. NON-NEGOTIABLE PRINCIPLE
Always prefer: Simple + Correct + Maintainable over Complex + Impressive-looking + Unnecessary. Do NOT introduce complexity merely because a technology is modern, scalable, enterprise-grade, AI-related, or architecturally impressive.

## 2. BEFORE IMPLEMENTING ANYTHING
Before changing code:
1. Read AGENTS.md.
2. Read docs/PROJECT.md.
3. Read docs/ARCHITECTURE.md.
4. Read docs/CURRENT_STATE.md.
5. Read docs/DECISIONS.md.
6. Read docs/ROADMAP.md.
7. Inspect the relevant existing implementation.
8. Understand existing data flow and dependencies.
9. Determine whether the requested functionality already exists partially.
10. Reuse existing code whenever practical.
Never redesign existing architecture without a demonstrated requirement. Never assume something is missing until you inspect the repository. If something is unclear, mark it UNKNOWN rather than guessing.

## 3. SIMPLEST-CORRECT-SOLUTION RULE
For every feature, evaluate solutions in this order:
Option A: Can the existing code solve the requirement with a small change?
Option B: Can an existing service/module be extended?
Option C: Can a small new module/file solve it?
Option D: Is a new abstraction actually necessary?
Only choose D when A-C are insufficient.

## 4. COMPLEXITY GATE
Before adding any new dependency, database, table, service, abstraction, framework, Redis, Kafka, Celery, Vector database, microservice, GraphQL, Kubernetes, etc., explicitly justify the need:
1. What exact requirement requires this?
2. Can the requirement be solved without it?
3. What complexity does it introduce?
4. What maintenance cost does it introduce?
5. Can a beginner understand why it exists?
6. Can the team explain it confidently in a college viva?
If the answer to #1 is weak, DO NOT introduce it.

## 5. DO NOT OVER-ENGINEER
Never add technology because "This is more scalable", "Enterprise systems use this", "This is industry standard", or "We may need it in the future." Build for the actual requirement and realistic expected scale.

## 6. CURRENT GOVSKILL ARCHITECTURE
Preserve the existing general architecture unless there is a concrete reason to change it. Do not convert this into microservices unless a real requirement demands it.

## 7. AI DESIGN RULE
AI should be used where it provides genuine value. Prefer deterministic logic for deterministic problems. Do NOT allow an LLM to replace deterministic validation when a clear business rule can perform the decision. AI should explain, assist, summarize, route, or answer questions where appropriate. Do not introduce agents, tools, vector databases, RAG pipelines, or multi-agent systems unless the actual project requirement justifies them.

## 8. DATABASE RULE
Keep the database relational and understandable. Before adding a table:
1. Identify the exact data that must persist.
2. Check whether an existing entity can represent it.
3. Check relationships and ownership.
4. Avoid duplicate data.
5. Avoid speculative tables for future features.

## 9. API RULE
Reuse existing API patterns. Check whether an existing endpoint can be extended before creating a new one. Do not create duplicate endpoints for the same operation.

## 10. FRONTEND RULE
Keep the UI understandable. Prefer extending an existing component over creating a new abstraction system. Use reusable components when actual repetition exists.

## 11. ERROR HANDLING
Handle realistic failure cases (invalid input, auth failure, DB failure, OCR failure, AI failure, etc.). Use the existing error-handling approach where possible. Do not create a massive global error framework unless required.

## 12. SECURITY
Security is important, but security implementation must remain understandable. Prioritize auth, input validation, file size limits, secure secrets, CORS, and API access control.

## 13. TESTING RULE
Every meaningful feature must have appropriate verification. Prefer unit test + integration test + existing E2E test. Never use placeholder tests such as `assert True`. Tests should verify actual behavior.

## 14. DEPENDENCY RULE
Before installing a package, check whether the functionality already exists or if standard libraries can solve it. Avoid dependency proliferation.

## 15. FILE CREATION RULE
Can this functionality logically belong in an existing file without making that file unreasonable? If yes, prefer the existing file. Avoid utility dumping grounds and empty abstraction folders.

## 16. REFACTORING RULE
Do not refactor unrelated code while implementing a feature. Preserve existing UI, routes, APIs, and behavior unless the task explicitly requires changing them.

## 17. PERFORMANCE RULE
Do not optimize prematurely. First make the system Correct → Tested → Secure → Then optimize measured bottlenecks.

## 18. SCALABILITY RULE
Design cleanly enough that normal growth is possible. Prefer Modular monolith over Microservices unless real requirements demonstrate that service separation is necessary.

## 19. COLLEGE-VIVA EXPLAINABILITY RULE
Every major architectural decision should be explainable in simple language. Be able to answer what problem it solves, why the technology was used, data flow, failure modes, and why a more complicated alternative wasn't used.

## 20. IMPLEMENTATION PROCESS
UNDERSTAND → INSPECT → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT.
Before implementation, provide: Requirement, Existing System, Minimal Solution, Files Affected, Dependencies, Risks.

## 21. STOP CONDITIONS
Stop and ask for clarification instead of implementing if requirements conflict, multiple valid interpretations exist, DB migration impact is unclear, or major redesign is required. Do not guess.

## 22. AFTER IMPLEMENTATION
Always report what changed, why it changed, files modified, tests executed, and documentation updated. Never claim a feature is complete without verification.

## 23. DOCUMENTATION RULE
Update documentation only when the implementation actually changes project state. CURRENT_STATE.md is the live project dashboard. DECISIONS.md changes for meaningful architectural decisions. ROADMAP.md changes for milestones.

## 24. GIT RULE
Work on the assigned branch. Commit only intended changes with clear conventional commit messages (e.g., `feat(backend): add secure document upload validation`). Run tests before committing.

## 25. AGENT RESPONSIBILITY
You are rewarded for Correctness, Security, Maintainability, Simplicity, Testability, Explainability, and Minimal unnecessary changes. Do not optimize for "How advanced can we make the architecture?" Optimize for "How advanced can we make the functionality while keeping the architecture simple enough to understand, maintain, test, and explain?"
