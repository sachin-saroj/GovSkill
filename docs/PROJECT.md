# Project Overview — GovSkill

## Product Vision
**GovSkill** is a digital skill support web application designed for local government offices. It addresses two primary challenges:
1. **Internal Training**: Local government employees often have strong administrative knowledge but limited digital proficiency, leading to data-entry errors and slow document processing.
2. **Citizen Self-Service**: Citizens frequently submit government documents with preventable errors (expired certificates, missing fields, format mismatches), causing rejections and processing delays.

---

## User Personas

1. **Government Employee (Trainee)**:
   - Uses the portal to complete digital workflow training lessons.
   - Asks questions to a grounded AI Tutor when stuck.
   - Takes module quizzes to verify competency and record official scores.

2. **Office Supervisor (Admin)**:
   - Views overall office training metrics.
   - Monitors employee quiz attempt history and pass rates.

3. **Citizen (GovAssist User)**:
   - Accesses a public self-service pre-check page (no login required).
   - Uploads Income Certificate documents for instant OCR extraction and 4-rule validation check before formal submission.

---

## Feature Scope

### Core Features (Priority 1)
- Role-based authentication (Employee & Admin).
- Training Module viewer ("Digital Document Handling").
- Grounded AI Tutor chatbot for interactive Q&A.
- Server-evaluated 8-question MCQ Quiz.
- Supervisor Admin Dashboard tracking quiz scores.

### Bonus Feature (Priority 2)
- **GovAssist**: Citizen Income Certificate pre-submission checker.
- Tesseract OCR text extraction & regex field parsing (`name`, `certificate_number`, `expiry_date`).
- Deterministic 4-rule validation engine.
- AI Explanation Layer providing plain-language guidance for failed rules.

---

## Scope Boundaries & Exclusions
- **GovAssist Document Scope**: Income Certificates only (single document type).
- **Single Seed Module**: Currently features 1 training module ("Digital Document Handling").
- **No Citizen Accounts**: Citizens do not register or maintain accounts.
- **Out of Scope**: Formal document submission pipeline, offline sync, bilingual translation, user certification issuing.
