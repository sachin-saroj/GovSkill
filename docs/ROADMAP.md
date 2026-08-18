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
