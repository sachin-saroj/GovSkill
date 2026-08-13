# CURRENT STATE

Last Updated:
2026-08-13

## Working

- **User Authentication**: JWT registration, login, and role-based route protection (`employee` vs `admin`).
- **Core Training Module**: Markdown lesson reader for "Digital Document Handling".
- **Grounded AI Tutor**: Gemini 2.5 Flash interactive Q&A grounded in module content with keyword fallbacks.
- **Server-Scored Quiz**: 8 MCQs, server-side grading, answer key stripping, and score persistence.
- **Admin Dashboard**: Attempt log table, average score %, and pass rate metrics for supervisors.
- **GovAssist Citizen Pre-Checker**: Document upload (JPG/PNG/TXT), Tesseract OCR, regex field extraction, 4-rule Engine, and failed rule AI explanations.
- **Database & Migrations**: PostgreSQL + SQLite fallback with Alembic migration (`001_initial_schema.py`).
- **Automated Testing Suite**: Full Pytest E2E suite (`test_e2e_full_suite.py`), auth tests, rule engine unit tests, employee and citizen journey tests.

## Partially Working

- **PDF Document OCR Processing**: Endpoint accepts `.pdf` files, but `ocr_service.py` uses `PIL.Image.open()` directly on file paths without PDF rendering, causing PDF uploads to yield empty extracted fields (`name: null, certificate_number: null, expiry_date: null`).
- **Multi-Module System**: Database schema and API endpoints support `module_id` parameters, but only 1 default module is seeded, with no management interface for additional modules.

## Not Implemented

- **Admin Module CMS**: No UI or API routes for supervisors to create, edit, or delete training modules and quiz questions.
- **Email Verification**: No email confirmation upon account registration.
- **Password Reset**: No password recovery or account update flow.
- **Admin Dashboard Pagination**: `GET /api/admin/attempts` returns all records in a single un-paginated response.
- **Production Deployment Setup**: No Docker containerization, Nginx config, or CI/CD deployment pipelines.

## Known Bugs

- **PDF OCR Parsing Failure**: `ocr_service.py` throws `UnidentifiedImageError` on `.pdf` files, falling back to plain-text reading which returns empty JSON fields.
- **Permissive CORS Configuration**: `CORSMiddleware` in `backend/app/main.py` uses `allow_origins=["*"]` with `allow_credentials=True`.
- **Hardcoded Secret Key Fallback**: `SECRET_KEY` in `backend/app/core/config.py` defaults to `"super_secret_jwt_key_change_in_production"` if not overridden in `.env`.
- **Placeholder Quiz Test File**: `backend/app/tests/test_quiz.py` contains only a placeholder assertion (`assert True`).

## Current Blockers

- **None**: Local server execution, SQLite/PostgreSQL database connections, and test suites are fully operational.

## Current Focus

- Fixing PDF document OCR processing in `ocr_service.py`.
- Replacing placeholder unit tests in `test_quiz.py` with full test coverage.

## Next Tasks

1. Integrate PDF page rendering (`pdf2image` / Poppler) into `ocr_service.py` to fix PDF text extraction.
2. Write dedicated unit tests for question retrieval and server-side scoring in `test_quiz.py`.
3. Harden security settings by enforcing mandatory `SECRET_KEY` env variable and domain-restricted CORS origins.
4. Add pagination (`limit` / `offset`) to `GET /api/admin/attempts`.
5. Build Admin CMS API endpoints and UI for creating and editing training modules and quiz questions.
