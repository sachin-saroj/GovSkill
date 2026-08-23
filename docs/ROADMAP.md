# Technical Roadmap & Next Priorities — GovSkill

This roadmap outlines recommended future work based directly on current implementation gaps, security considerations, and architecture audit findings.

---

## Short-Term Priorities (Immediate Fixes & Hardening)

- **None**: PDF OCR, Security Hardening, Quiz Unit Tests, Admin Route Pagination, OCR Image Preprocessing, and Admin CMS have all been successfully implemented in Phases 1-7.

---

## Medium-Term Priorities (Feature Enhancements)

1. **User Profile & Account Management**:
   - Add user password change endpoints and administrator user management options.

2. **Advanced Analytics Dashboard**:
   - Build a visual dashboard for admins to track system-wide employee skill progress and overall module completion rates.

---

## Completed Milestones & Infrastructure

1. **Phases 1-7 Core Deliverables**:
   - PDF OCR extraction, deterministic rule engine, grounded Gemini AI tutor, server-scored quizzes, and role-based Admin CMS.
2. **Containerization & Deployment Parity**:
   - Production Dockerfiles for backend and frontend.
   - `docker-compose.yml` orchestrating PostgreSQL, FastAPI, and Vite dev/build services with Nginx reverse proxy.
3. **CI/CD Pipeline**:
   - GitHub Actions workflow (`.github/workflows/ci.yml`) automatically executing backend Pytest suite and frontend TypeScript compilation checks.

---

## Long-Term / Infrastructure Priorities

- **None**: All infrastructure, testing, and CI/CD integration goals are achieved.

---

## Explicitly Out of Scope / UNKNOWN
- Offline synchronization capabilities.
- Multi-language / bilingual content translation.
- Citizen registration or formal document submission workflows.
- Integration with external government identity systems (UNKNOWN / Not in spec).
