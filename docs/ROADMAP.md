# Technical Roadmap & Next Priorities — GovSkill

This roadmap outlines recommended future work based directly on current implementation gaps, security considerations, and architecture audit findings.

---

## Short-Term Priorities (Immediate Fixes & Hardening)

1. **PDF OCR Support**:
   - Integrate `pdf2image` / Poppler into `ocr_service.py` to convert uploaded PDF pages into images before calling `pytesseract`.
   - Prevent empty extraction errors on PDF file uploads.

2. **Dedicated Quiz Unit Tests**:
   - Replace the placeholder test in `backend/app/tests/test_quiz.py` with unit tests for question retrieval, response filtering, and score evaluation.

3. **Security Hardening**:
   - Enforce mandatory `SECRET_KEY` configuration in production.
   - Replace wildcard CORS (`allow_origins=["*"]`) with specific allowed origin patterns.

4. **Admin Route Pagination**:
   - Add limit and offset pagination query parameters to `GET /api/admin/attempts`.

---

## Medium-Term Priorities (Feature Enhancements)

1. **Admin Module Management (CMS)**:
   - Create API endpoints (`POST /api/modules`, `PUT /api/modules/{id}`) allowing administrators to create and update training modules and quiz questions.
   - Build UI management pages in the Admin Dashboard.

2. **OCR Image Preprocessing**:
   - Add contrast enhancement, grayscale conversion, and deskewing via Pillow before passing images to Tesseract OCR to improve extraction accuracy on noisy scans.

3. **User Profile & Account Management**:
   - Add user password change endpoints and administrator user management options.

---

## Long-Term / Infrastructure Priorities

1. **Containerization**:
   - Create `Dockerfile` for backend and frontend.
   - Create `docker-compose.yml` orchestrating PostgreSQL, FastAPI, and Vite dev/build services.

2. **CI/CD Integration**:
   - Configure GitHub Actions pipeline to run pytest and frontend TypeScript build checks automatically.

---

## Explicitly Out of Scope / UNKNOWN
- Offline synchronization capabilities.
- Multi-language / bilingual content translation.
- Citizen registration or formal document submission workflows.
- Integration with external government identity systems (UNKNOWN / Not in spec).
