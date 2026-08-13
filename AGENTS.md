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

### Frontend Setup & Execution
```bash
cd frontend
npm install
npm run dev
```
