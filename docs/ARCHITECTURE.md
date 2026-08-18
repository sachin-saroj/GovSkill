# Architecture Specification — GovSkill

## System Overview
GovSkill is structured as a full-stack monorepo featuring a FastAPI backend and a React + Vite frontend.

```text
[ React 18 + Vite Frontend ]
        │
        ▼ (HTTP REST API via Axios / `/api` proxy)
[ FastAPI Asynchronous Backend ]
        │
        ├── Auth Service (JWT + Bcrypt)
        ├── Training & Quiz Engine (SQLAlchemy Async)
        ├── OCR & Field Parser (Tesseract OCR + Pillow + Regex)
        ├── Rule Engine (Deterministic Python Logic)
        └── AI Service (Google Gemini API / `gemini-2.5-flash`)
        │
        ▼
[ PostgreSQL Database / SQLite Fallback ]
```

---

## Backend Structure (`backend/app/`)

- **`main.py`**: FastAPI app entrypoint, CORS configuration, route inclusion, and exception handlers.
- **`core/`**:
  - `config.py`: Application settings via Pydantic BaseSettings (`DATABASE_URL`, `GEMINI_API_KEY`, `SECRET_KEY`).
  - `security.py`: Password hashing via `bcrypt` and JWT token creation/decoding.
- **`db/`**:
  - `session.py`: Async SQLAlchemy engine and session factory (`get_db`).
  - `base.py`: Declarative Base class.
- **`models/`**:
  - `user.py`: `User` model (`id`, `email`, `password_hash`, `role`).
  - `module.py`: `Module` model (`id`, `title`, `content`).
  - `quiz.py`: `QuizQuestion` and `QuizAttempt` models.
  - `document.py`: `CitizenDocument` model (`id`, `file_path`, `extracted_data`, `validation_results`).
- **`schemas/`**: Pydantic v2 schemas for request validation and response serialization.
- **`services/`**:
  - `ocr_service.py`: Text extraction via `pytesseract` and regex field extraction.
  - `rule_engine.py`: Pure deterministic 4-rule validation engine.
  - `ai_service.py`: Gemini LLM integrations (`generate_tutor_answer`, `generate_rule_explanation`) with grounded fallbacks.
- **`api/routes/`**:
  - `auth.py`: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
  - `modules.py`: `/api/modules`, `/api/modules/{id}`.
  - `tutor.py`: `/api/tutor/ask`.
  - `quiz.py`: `/api/quiz/{module_id}`, `/api/quiz/{module_id}/submit`.
  - `admin.py`: `/api/admin/attempts`.
  - `documents.py`: `/api/documents/upload`, `/api/documents/{id}`.

---

## Frontend Structure (`frontend/src/`)

- **`App.tsx`**: Main application setup, `react-router-dom` configuration, and `ProtectedRoute` guards.
- **`hooks/useAuth.tsx`**: React Context providing global `user`, `token`, `login()`, and `logout()`.
- **`lib/api.ts`**: Axios client instance configured with base URL `/api` and automatic `Authorization: Bearer <token>` interceptor.
- **`pages/`**:
  - `LoginPage.tsx`: Employee/Admin sign-in and registration form.
  - `ModulePage.tsx`: Lesson reader for training module content.
  - `TutorChatPage.tsx`: Interactive AI Tutor messaging view.
  - `QuizPage.tsx`: Multiple-choice quiz interface with server submission.
  - `AdminDashboardPage.tsx`: Supervisor performance overview and attempt table.
  - `CitizenUploadPage.tsx`: Public document upload and pre-check validation page.
  - `ProgressDashboardPage.tsx`: Employee skill tracking dashboard.
- **`components/`**:
  - `ui/`: Button, Card, Input, Badge primitives.
  - `quiz/QuizCard.tsx`: Individual MCQ rendering component.
  - `document/ValidationResultCard.tsx`: Pass/fail rule engine display card with AI explanation expander.

---

## Database Schema Summary

1. **`users`**: Stores employee and supervisor accounts (`role IN ('employee', 'admin')`).
2. **`modules`**: Stores training module titles and markdown lesson content.
3. **`quiz_questions`**: Stores MCQs linked to `modules.id` including `correct_option_index`.
4. **`quiz_attempts`**: Records employee score submissions (`user_id`, `module_id`, `score`, `total`).
5. **`user_progress`**: Tracks employee skill advancement (`user_id`, `module_id`, `highest_score`, `lessons_completed`, `skill_status`).
6. **`citizen_documents`**: Stores pre-check document uploads and validation results (isolated; no user FK).
