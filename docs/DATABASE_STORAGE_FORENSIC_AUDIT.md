# GovSkill Database & Storage Forensic Audit

**Date:** September 30, 2026  
**Audit Type:** Pre-Deployment Database, Persistence & Storage Forensic Audit  
**Mode:** READ-ONLY Verification (No application code or database records modified)  
**Target Environment:** Local Runtime, Docker Compose Architecture & Cloud Production Readiness  

---

## 1. Executive Summary

This forensic audit evaluates the database architecture, schema integrity, persistence mechanisms, uploaded file storage, migrations, and operational readiness of the GovSkill platform prior to production deployment.

### Key Conclusions:
1. **Active Local Runtime Database:** The local development runtime uses **SQLite via `aiosqlite`** located physically at `backend/govskill.db` (292.00 KB, 8 tables, 75 document records).
2. **PostgreSQL Dual-Engine Capability:** The application possesses a dual-engine architecture in `backend/app/db/session.py`. When pointed to PostgreSQL via `DATABASE_URL`, it automatically activates an async connection pool (`pool_size=15`, `max_overflow=10`, `pool_recycle=1800`, `pool_pre_ping=True`).
3. **Uploaded File Storage:** Uploaded citizen documents are written to the local disk path `backend/uploads/<uuid>.<ext>` (`/app/uploads` in Docker). In Docker Compose, this is backed by a named volume (`govskill_uploads`). On cloud container hosts (e.g. Render, Railway, AWS ECS) without mounted persistent disks, this filesystem is **EPHEMERAL** and will be wiped upon restart or redeployment.
4. **Schema & Migration Status:** The schema is managed by Alembic across **6 linear migrations** (from `001_initial_schema` to `006_add_user_token_version_and_active`). Both `alembic current` and `alembic heads` are perfectly synchronized at head `006`.
5. **Data Privacy & Architecture:** Citizen document pre-checks have **ZERO foreign keys** to the `users` table, ensuring strict unauthenticated privacy. Sensitive PII (Aadhaar, PAN) is masked prior to database persistence and client response serialization.
6. **Overall Readiness Classification:** **READY WITH CONDITIONS**. Before production launch, specific configuration prerequisites regarding connection URL driver formatting (`postgresql+asyncpg://`), SSL negotiation, release-phase migrations, and persistent upload storage must be met.

---

## 2. Database Architecture

### A. Initialization & Connection Lifecycle
The database lifecycle is centralized in `backend/app/db/session.py`:

```mermaid
flowchart TD
    A[Environment / .env] -->|DATABASE_URL| B[Settings in app.core.config]
    B --> C{URL scheme starts with sqlite?}
    C -- Yes --> D[create_async_engine with NullPool / pool_pre_ping=True]
    C -- No --> E[create_async_engine with AsyncPG Pool]
    E --> F[Pool Size: 15, Max Overflow: 10, Timeout: 10s, Recycle: 1800s]
    D --> G[async_session_maker expire_on_commit=False]
    E --> G
    G --> H[FastAPI Dependency: get_db]
    H --> I[API Route Handlers]
```

### B. Exact Files and Symbols
| Layer | File Path | Symbols / Components |
|---|---|---|
| **Configuration** | [`backend/app/core/config.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/core/config.py) | `Settings.DATABASE_URL`, `DB_POOL_SIZE`, `DB_MAX_OVERFLOW`, `DB_POOL_TIMEOUT`, `DB_POOL_RECYCLE` |
| **Declarative Base** | [`backend/app/db/base.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/db/base.py) | `Base = DeclarativeBase()` |
| **Engine & Session** | [`backend/app/db/session.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/db/session.py) | `engine`, `async_session_maker`, `get_db()`, `check_db_health()` |
| **Health Check** | [`backend/app/main.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/main.py) | `@app.get("/health")`, `check_db_health()` |
| **Dependency Injection** | [`backend/app/api/deps.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/api/deps.py) | `get_db = app.db.session.get_db` |
| **Models Module** | [`backend/app/models/__init__.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/__init__.py) | `User`, `Module`, `QuizQuestion`, `QuizAttempt`, `UserProgress`, `CitizenDocument`, `Credential` |

### C. Fallback Mechanism Behavior
The fallback mechanism between SQLite and PostgreSQL is **configuration-driven, not dynamic runtime failover**:
- If `DATABASE_URL` begins with `sqlite`, the engine treats it as SQLite using `aiosqlite`.
- If `DATABASE_URL` points to PostgreSQL, it connects via `asyncpg` with production pooling parameters.
- **Failover Invariant:** If PostgreSQL fails to connect during operation, the application raises `SQLAlchemyError` and the global exception handler returns HTTP 503 (`DATABASE_ERROR`). It does **not** dynamically fall back to SQLite, preventing catastrophic split-brain state and data loss.

---

## 3. Actual Runtime Database

Forensic inspection of the active running application environment reveals:

| Parameter | Observed Runtime Value |
|---|---|
| **Database Engine** | SQLite (via `sqlite+aiosqlite`) |
| **Active `DATABASE_URL`** | `sqlite+aiosqlite:///./govskill.db` |
| **Physical File Path** | `C:\Users\Asus\OneDrive\Desktop\GovSkill\backend\govskill.db` |
| **Physical File Size** | 299,008 bytes (292.00 KB) |
| **Last Modification Time** | Wed Sep 30 18:14:31 2026 |
| **Git Tracking Status** | **Ignored** by `.gitignore` (line 19: `backend/govskill.db`) |
| **Host / Port** | Embedded local file (No network host or port) |
| **Database Name** | `govskill.db` |
| **Database User / Password** | None (embedded SQLite file) |

---

## 4. Configuration Sources

GovSkill aggregates configuration through Pydantic v2 `BaseSettings`:

| Config Source | File Path | DB Configuration Defined |
|---|---|---|
| **Active Environment File** | `backend/.env` | `DATABASE_URL="sqlite+aiosqlite:///./govskill.db"` |
| **Example Environment Template** | [`backend/.env.example`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/.env.example) | `DATABASE_URL="sqlite+aiosqlite:///./govskill.db"`<br>Documented Postgres: `postgresql+asyncpg://user:password@host:5432/govskill` |
| **Docker Compose Services** | [`docker-compose.yml`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/docker-compose.yml) | Service `db`: `postgres:16-alpine`<br>Backend env: `postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}` |
| **Docker Application Image** | [`backend/Dockerfile`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/Dockerfile) | Base: `python:3.11-slim`, workdir `/app`, creates `/app/uploads` |
| **Alembic Environment** | [`backend/alembic/env.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/alembic/env.py) | Dynamic URL bind: `config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)` |
| **Test Configuration** | [`backend/app/tests/test_employee_journey.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/tests/test_employee_journey.py) | In-Memory SQLite: `sqlite+aiosqlite:///:memory:` |

### Secret Management Audit:
- **`SECRET_KEY`**: Configured in `backend/.env` (Source: environment, Value: `[REDACTED]`). Validated against default insecure strings by Pydantic validator.
- **`CREDENTIAL_SIGNING_KEY`**: Configured in `backend/.env` (Source: environment, Value: `[REDACTED]`). Validated against default insecure strings.
- **`GEMINI_API_KEY`**: Configured in `backend/.env` (Source: environment, Value: `[REDACTED]`).
- **`POSTGRES_PASSWORD`**: Defined as mandatory variable in `docker-compose.yml` (`${POSTGRES_PASSWORD:?}`).

---

## 5. Complete Table Inventory

All tables present in the active database were queried directly using SQLite catalog inspection:

| Table Name | Purpose | Primary Key | Key Columns | Foreign Keys & Constraints | Physical Row Count |
|---|---|---|---|---|:---:|
| `users` | Platform authentication, roles, and status | `id` (CHAR(32) UUID) | `email`, `password_hash`, `role`, `token_version`, `is_active`, `created_at` | Check: `role IN ('employee', 'admin')`<br>Unique: `email` | **12** |
| `modules` | Certified training curriculum content | `id` (CHAR(32) UUID) | `title`, `content` | None | **4** |
| `quiz_questions` | Module evaluation questions & competencies | `id` (CHAR(32) UUID) | `module_id`, `question`, `options` (JSON), `correct_option_index`, `competency` | FK: `module_id -> modules(id)` ON DELETE CASCADE | **10** |
| `quiz_attempts` | Employee quiz scores and submission history | `id` (CHAR(32) UUID) | `user_id`, `module_id`, `score`, `total`, `submitted_at` | FK: `user_id -> users(id)` ON DELETE CASCADE<br>FK: `module_id -> modules(id)` ON DELETE CASCADE | **9** |
| `user_progress` | Employee learning status, progress, scores | `id` (CHAR(32) UUID) | `user_id`, `module_id`, `status`, `best_score`, `lessons_completed`, `last_accessed_section` | Unique: `(user_id, module_id)`<br>FK: `user_id -> users(id)` ON DELETE CASCADE<br>FK: `module_id -> modules(id)` ON DELETE CASCADE | **6** |
| `citizen_documents` | GovAssist pre-submission validation records | `id` (CHAR(32) UUID) | `file_path`, `extracted_data` (JSON), `validation_results` (JSON), `uploaded_at` | **ZERO Foreign Keys** (Anonymous citizen records) | **75** |
| `credentials` | Tamper-evident digital completion certificates | `id` (CHAR(32) UUID) | `credential_id`, `user_id`, `module_id`, `score_achieved`, `verification_hash`, `issued_at` | Unique: `(user_id, module_id)`<br>Unique: `credential_id`<br>FK: `user_id -> users(id)` ON DELETE CASCADE<br>FK: `module_id -> modules(id)` ON DELETE CASCADE | **1** |
| `alembic_version` | Migration state tracker | `version_num` (VARCHAR(32)) | `version_num` | None | **1** |

---

## 6. SQLAlchemy Model Map

The ORM layer maps 1-to-1 with declarative Python classes in `backend/app/models/`:

### 1. `User` ([`app/models/user.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/user.py))
- **Table:** `users`
- **Columns:**
  - `id`: UUID, Primary Key, default `uuid.uuid4`
  - `email`: String, Unique, Not Null, Index
  - `password_hash`: String, Not Null (Bcrypt cost >= 12)
  - `role`: String, Not Null (`CheckConstraint("role IN ('employee', 'admin')")`)
  - `token_version`: Integer, default 1, Not Null
  - `is_active`: Boolean, default True, Not Null
  - `created_at`: DateTime(timezone=True), Not Null
- **Relationships:**
  - `credentials`: backref from `Credential`
  - `progress_records`: backref from `UserProgress`
  - `quiz_attempts`: backref from `QuizAttempt`

### 2. `Module` ([`app/models/module.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/module.py))
- **Table:** `modules`
- **Columns:**
  - `id`: UUID, Primary Key
  - `title`: String, Not Null
  - `content`: Text, Not Null
- **Relationships:**
  - `questions`: backref from `QuizQuestion`
  - `quiz_attempts`: backref from `QuizAttempt`
  - `progress_records`: backref from `UserProgress`
  - `credentials`: backref from `Credential`

### 3. `QuizQuestion` ([`app/models/quiz.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/quiz.py))
- **Table:** `quiz_questions`
- **Columns:**
  - `id`: UUID, Primary Key
  - `module_id`: UUID, FK `modules.id` (ON DELETE CASCADE), Not Null
  - `question`: Text, Not Null
  - `options`: JSON, Not Null
  - `correct_option_index`: Integer, Not Null (**Never sent to client**)
  - `competency`: Text, Nullable
- **Relationships:**
  - `module`: `relationship("Module", backref="questions")`

### 4. `QuizAttempt` ([`app/models/quiz.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/quiz.py))
- **Table:** `quiz_attempts`
- **Columns:**
  - `id`: UUID, Primary Key
  - `user_id`: UUID, FK `users.id` (ON DELETE CASCADE), Not Null
  - `module_id`: UUID, FK `modules.id` (ON DELETE CASCADE), Not Null
  - `score`: Integer, Not Null
  - `total`: Integer, Not Null
  - `submitted_at`: DateTime(timezone=True), Not Null
- **Relationships:**
  - `user`: `relationship("User", backref="quiz_attempts")`
  - `module`: `relationship("Module", backref="quiz_attempts")`

### 5. `UserProgress` ([`app/models/progress.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/progress.py))
- **Table:** `user_progress`
- **Columns:**
  - `id`: UUID, Primary Key
  - `user_id`: UUID, FK `users.id` (ON DELETE CASCADE), Not Null
  - `module_id`: UUID, FK `modules.id` (ON DELETE CASCADE), Not Null
  - `lessons_completed`: Boolean, default False, Not Null
  - `best_score`: Integer, default 0, Not Null
  - `total_questions`: Integer, default 0, Not Null
  - `status`: String, default "not_started", Not Null
  - `started_at`: DateTime(timezone=True), Nullable
  - `last_accessed_section`: Integer, default 0, Not Null
  - `completed_at`: DateTime(timezone=True), Nullable
  - `updated_at`: DateTime(timezone=True), Not Null
- **Constraints:** `UniqueConstraint("user_id", "module_id", name="uq_user_module_progress")`
- **Relationships:**
  - `user`: `relationship("User", backref="progress_records")`
  - `module`: `relationship("Module", backref="progress_records")`

### 6. `CitizenDocument` ([`app/models/document.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/document.py))
- **Table:** `citizen_documents`
- **Columns:**
  - `id`: UUID, Primary Key (matches uploaded file UUID)
  - `file_path`: String, Not Null
  - `extracted_data`: JSON, Nullable (stores normalized dictionary + `_analysis` object)
  - `validation_results`: JSON, Nullable (stores list of rule evaluation items)
  - `uploaded_at`: DateTime(timezone=True), Not Null
- **Privacy Design:** Strictly decoupled from user management. **Zero foreign keys.**

### 7. `Credential` ([`app/models/credential.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/models/credential.py))
- **Table:** `credentials`
- **Columns:**
  - `id`: UUID, Primary Key
  - `credential_id`: String(64), Unique, Index, Not Null
  - `user_id`: UUID, FK `users.id` (ON DELETE CASCADE), Index, Not Null
  - `module_id`: UUID, FK `modules.id` (ON DELETE CASCADE), Index, Not Null
  - `score_achieved`: Integer, Not Null
  - `total_score`: Integer, Not Null
  - `verification_hash`: String(64), Not Null (HMAC-SHA256)
  - `issued_at`: DateTime(timezone=True), Not Null
  - `updated_at`: DateTime(timezone=True), Not Null
- **Constraints:** `UniqueConstraint("user_id", "module_id", name="uq_user_module_credential")`
- **Relationships:**
  - `user`: `relationship("User", backref="credentials")`
  - `module`: `relationship("Module", backref="credentials")`

---

## 7. Document Persistence Flow

The complete GovAssist document processing lifecycle from HTTP ingress to database storage:

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Citizen / User
    participant Router as POST /api/documents/upload
    participant Disk as Local Filesystem (/uploads)
    participant OCR as OCR & Hybrid Vision Engine
    participant Registry as Document Registry & Rule Engine
    participant AI as Gemini AI Gateway (Explanations)
    participant DB as SQLite / PostgreSQL (citizen_documents)

    Citizen->>Router: Upload document (JPG, PNG, PDF, TXT <= 5MB)
    Note over Router: Enforce extension whitelist, Content-Type, max 5MB limit, disk check
    Router->>Disk: Persist file to uploads/{file_id}{ext}
    Router->>OCR: extract_raw_text() + classify_document()
    OCR-->>Router: raw_text, doc_def, extracted_fields
    opt Local OCR Insufficient & AI_VISION_ENABLED
        Router->>AI: Gemini Vision Fallback (Multimodal extraction)
        AI-->>Router: Enhanced extracted_fields & quality grade
    end
    Router->>Registry: Deterministic validation (doc_def.validator)
    Registry-->>Router: rule_results (passed, reasons, severity)
    opt One or more rules failed
        Router->>AI: generate_rule_explanation() via AIGateway
        AI-->>Router: Plain-language civic explanation
    end
    Note over Router: Mask Aadhaar (XXXX-XXXX-1234) & PAN (ABCDE****F)
    Router->>DB: INSERT into citizen_documents (id=file_id, file_path, extracted_data, validation_results)
    DB-->>Router: Commit confirmed
    Router-->>Citizen: 200 OK (DocumentUploadResponse with document_id, masked data, and counter-slip data)
```

### What is Persisted in `citizen_documents`:
- `id`: UUID (e.g. `0029478a-9ce1-4d7e-9c5e-d939de59e882`)
- `file_path`: Absolute path on disk (`C:\Users\...\backend\uploads\<id>.<ext>` or `/app/uploads/<id>.<ext>`)
- `extracted_data`:
  - Masked field values (e.g. `applicant_name`, `certificate_number`, `masked_aadhaar`, `expiry_date`)
  - `_analysis`: Metadata JSON holding `document_type`, `display_name`, `extraction_source` (`LOCAL_OCR` vs `VISION_AI`), `ocr_quality`, `summary`, `detected_issues`, `overall_status`, `field_details`
- `validation_results`: JSON array of rule evaluations with `ruleName`, `passed`, `reason`, `severity`, `recommended_action`, and `explanation`.
- `uploaded_at`: UTC timestamp.

---

## 8. File Storage Architecture

### Implementation Details ([`backend/app/api/routes/documents.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/api/routes/documents.py)):
- **Physical Directory:** `backend/uploads` (locally) or `/app/uploads` (in Docker container).
- **File Naming Scheme:** Strictly isolated UUID v4: `{file_id}{ext}` (e.g. `002e3a58-cd05-4727-b6d8-b157b9974a58.png`).
- **Directory Traversal Protection:**
  - Uses `os.path.basename(file.filename)` to sanitize inbound filenames.
  - Verifies destination: `if not saved_filepath.startswith(UPLOAD_DIR): raise HTTPException(400)`.
- **Extension Whitelist:** Strictly restricted to `{".jpg", ".jpeg", ".png", ".pdf", ".txt"}`.
- **Size Limits:** Enforced at 5 MB (`5 * 1024 * 1024` bytes).
- **Pre-flight Disk Check:** Rejects uploads with HTTP 507 (`INSUFFICIENT_STORAGE`) if local disk free space is below 20 MB.
- **Physical Uploads Inventory:** Currently **2,507 items** totaling **3.12 MB** on local disk (1,560 `.txt`, 154 `.png`, 792 `.pdf`, 1 `.gitkeep`).
- **File Access Security:** **Zero public download routes.** The `/uploads` folder is NOT served via FastAPI `StaticFiles` or `FileResponse`. Uploaded files are strictly local backend assets used during OCR analysis.

---

## 9. Database vs File Storage Matrix

| Data Entity | Stored Where | Physical Format / Key | Persistent in Docker Compose? | Persistent in Cloud Container (e.g. Render Web Service)? |
|---|---|---|:---:|:---:|
| **User Account & Role** | Database (`users` table) | Relational row (`id` UUID) | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **Password Hash** | Database (`users.password_hash`) | Bcrypt hash string | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **Learning Progress** | Database (`user_progress` table) | Relational row (`user_id`, `module_id`) | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **Quiz Attempts & Scores** | Database (`quiz_attempts` table) | Relational row (`id` UUID) | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **Digital Credentials** | Database (`credentials` table) | Relational row + HMAC-SHA256 | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **Training Modules Content** | Database (`modules` table) | Markdown text in DB | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **OCR Extracted Metadata** | Database (`citizen_documents`) | JSON column (`extracted_data`) | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **Validation Results & AI Exp** | Database (`citizen_documents`) | JSON column (`validation_results`) | **YES** (in `govskill_pgdata`) | **YES** (in Managed Postgres) |
| **Uploaded Document Files** | Local Filesystem (`/app/uploads`) | Binary file `{uuid}.{ext}` | **YES** (in `govskill_uploads` volume) | **NO — EPHEMERAL** (Wiped on container restart/redeploy) |
| **Idempotency Upload Cache** | Application Memory (`_recent_uploads`) | In-memory Python dict (30s TTL) | **NO** (Process memory) | **NO** (Process memory) |
| **Rate Limiter Counters** | Application Memory (`upload_limiter`) | In-memory token bucket dict | **NO** (Process memory) | **NO** (Process memory) |
| **AI Tutor Chat History** | Client Browser State (`TutorChatPage`) | React state (`messagesByMode`) | **NO** (Client session memory) | **NO** (Client session memory) |

---

## 10. Alembic Migration Audit

### Migration Linear Sequence
Alembic migration history was verified directly in `backend/alembic/versions/`:

```
001_initial_schema (base)
   ↓
002_add_user_progress
   ↓
003_add_module_progress_tracking
   ↓
004_add_quiz_question_competency
   ↓
005_add_credentials_table
   ↓
006_add_user_token_version_and_active (head)
```

### Execution Status:
- Total Migrations: **6**
- Current Migration in Database: `006_add_user_token_version_and_active`
- Branching / Divergence: **None** (100% linear chain)
- Downgrade Capability: **Implemented** on all 6 migrations (`def downgrade() -> None` exists and cleanly drops added tables/columns).
- Database Startup Migrations:
  - In `docker-compose.yml`: Automated via `command: sh -c "alembic upgrade head && ..."`
  - In `backend/Dockerfile`: Default CMD runs `uvicorn app.main:app` without Alembic. Production deployments must include an explicit release command.

---

## 11. Docker Persistence

### Development & Staging Topology ([`docker-compose.yml`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/docker-compose.yml))
The Docker Compose architecture defines two dedicated named volumes:
1. `govskill_pgdata` ➔ Mounted to `/var/lib/postgresql/data` in container `govskill-db`.
2. `govskill_uploads` ➔ Mounted to `/app/uploads` in container `govskill-backend`.

### Container Lifecycle Impact:
- **`docker compose restart`**: Both database and uploaded documents survive without data loss.
- **`docker compose down` (without `-v`)**: Both named volumes remain on the host; restarting recreates containers attached to the same data.
- **`docker compose down -v`**: Destroys named volumes; results in complete database and file loss.
- **Container Rebuild (`docker compose build`)**: Data in named volumes is retained.

---

## 12. Retention & Cleanup

### Retention Service Architecture ([`backend/app/services/retention_service.py`](file:///c:/Users/Asus/OneDrive/Desktop/GovSkill/backend/app/services/retention_service.py))
- **Function:** `purge_aged_documents(db: AsyncSession, retention_days: int = 30)`
- **Behavior:**
  - Queries `CitizenDocument` where `uploaded_at < NOW() - retention_days`.
  - For each aged record, verifies physical file existence and unlinks file via `os.remove(file_path)`.
  - Deletes database entity via `await db.delete(doc)`.
  - Commits transaction atomically: `await db.commit()`.
  - Returns structured audit summary: `records_purged`, `files_deleted`, `bytes_reclaimed`.
- **Administrative API Trigger:** Exposed at `POST /api/admin/maintenance/purge-documents?retention_days=30` protected by `get_current_admin_user` dependency.
- **Automation Gap:** There is currently **no automated scheduler** (e.g. Celery, APScheduler, or system cron) running this function automatically in the background. It currently relies entirely on manual invocation by an administrator.

---

## 13. Security & Privacy Audit

| Security Domain | Status | Verification Finding |
|---|:---:|---|
| **Password Storage** | **SECURE** | Passwords hashed using Bcrypt (`CryptContext(schemes=["bcrypt"])`). Passwords truncated to 72 bytes to avoid Bcrypt overflow vulnerabilities. Plaintext never stored. |
| **Token Storage** | **SECURE** | JWTs are stateless HMAC-SHA256 signed. Not stored in DB. Revocation supported via `token_version` check against `users.token_version`. |
| **Citizen Privacy / PII** | **SECURE** | `citizen_documents` table contains zero foreign keys to `users`. Citizen document uploads are completely unlinked from user accounts. |
| **PII Data Masking** | **SECURE** | Aadhaar numbers masked to `XXXX-XXXX-1234`. PAN numbers masked to `ABCDE****F` before persistence in `extracted_data` JSON. |
| **File Traversal Defense** | **SECURE** | Path resolution verifies `saved_filepath.startswith(UPLOAD_DIR)` and enforces `os.path.basename` extraction. |
| **File Download Exposure** | **SECURE** | No public `/uploads` routing exists. Files are inaccessible via HTTP URL directly. |
| **MIME / Format Check** | **ACCEPTABLE (WITH RECOMMENDATION)** | Extension whitelist (`.jpg, .jpeg, .png, .pdf, .txt`) enforced. `file.content_type` header checked against whitelist. Deep magic-byte sniffing (`python-magic`) is not yet implemented at upload gate, though Pillow/PyMuPDF catch malformed files during parsing. |

---

## 14. Backup & Restore

- **Database Backup Scripts:** **NOT IMPLEMENTED / NOT VERIFIED** in repository.
- **Storage Backup Scripts:** **NOT IMPLEMENTED / NOT VERIFIED** in repository.
- **Disaster Recovery Runbook:** **NOT IMPLEMENTED**.
- **Assessment:** Local development relies on `govskill.db` SQLite snapshotting. Production deployments must establish automated cloud-level backups (e.g., Render Managed Postgres daily snapshots, AWS RDS automated backups, or S3 replication).

---

## 15. Test Database Isolation

- **Verification Finding:** **100% ISOLATED AND SAFE**.
- **Evidence:** Test suites (`backend/app/tests/`) uniformly use in-memory SQLite instances:
  ```python
  TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
  engine_test = create_async_engine(TEST_DB_URL, echo=False)
  ```
  Tests override the `get_db` FastAPI dependency using `app.dependency_overrides[get_db] = override_get_db`.
- **Result:** Running `pytest` does NOT touch, modify, corrupt, or truncate the development database `govskill.db`.

---

## 16. Production Deployment Requirements

Before deploying GovSkill to cloud platforms (Render, Railway, Fly.io, AWS, GCP), the following infrastructure configurations must be addressed:

```mermaid
graph LR
    subgraph Cloud Infrastructure
        Postgres[Managed PostgreSQL 15+]
        Disk[Persistent Disk Volume / Object Storage]
        Scheduler[Scheduled Maintenance Cron]
    end

    subgraph GovSkill Container
        App[FastAPI Backend]
        Alembic[Alembic Migration Runner]
    end

    Alembic -->|1. Run on Deploy| Postgres
    App -->|2. Async Pool + SSL| Postgres
    App -->|3. Persist Uploads| Disk
    Scheduler -->|4. Trigger Retention Purge| App
```

1. **Managed PostgreSQL Provisioning:**
   - PostgreSQL 15 or 16 instance.
   - Connection string formatted as `postgresql+asyncpg://...`.
   - SSL mode required: `?ssl=require`.
2. **Release Phase / Pre-Deploy Command:**
   - Command: `alembic upgrade head && python -m app.db.seed_admin`.
3. **Uploads Volume Attachment:**
   - Mount persistent volume to `/app/uploads` (minimum 10 GB).
4. **Environment Variables:**
   - `DATABASE_URL`: `postgresql+asyncpg://<user>:<password>@<host>:5432/<dbname>?ssl=require`
   - `SECRET_KEY`: Random 64-character hex string.
   - `CREDENTIAL_SIGNING_KEY`: Distinct random 64-character hex string.
   - `ADMIN_EMAIL` & `ADMIN_PASSWORD`: For admin account bootstrapping.
   - `GEMINI_API_KEY`: Server-side API key.
   - `ALLOWED_ORIGINS`: Production frontend domain (e.g. `https://govskill.yourdomain.com`).

---

## 17. Critical Findings

### [BLOCKER] 1. Ephemeral Upload Storage on Cloud Container Platforms
- **Impact:** If deployed to standard cloud container web services (Render, Railway, AWS ECS Fargate) without an attached persistent disk, `/app/uploads` is ephemeral. Every deployment or container restart permanently deletes all uploaded PDFs and images. Database records in `citizen_documents` will point to non-existent file paths.
- **Remediation:** Attach a persistent volume to `/app/uploads` on the container service, or introduce an S3/GCS object storage driver.

### [BLOCKER] 2. Asyncpg URL Driver Prefix Incompatibility with Cloud Providers
- **Impact:** Cloud PostgreSQL providers (Render, Supabase, Neon, AWS) provide connection URLs starting with `postgres://` or `postgresql://`. SQLAlchemy async engine requires `postgresql+asyncpg://`. Supplying standard cloud URLs without the driver prefix causes immediate backend startup crash.
- **Remediation:** Ensure deployment scripts or `config.py` normalize URL prefixes: `DATABASE_URL.replace("postgres://", "postgresql+asyncpg://").replace("postgresql://", "postgresql+asyncpg://")`.

### [BLOCKER] 3. SSL Configuration Required for Managed PostgreSQL
- **Impact:** Cloud-managed PostgreSQL enforces SSL. `backend/app/db/session.py` initializes `create_async_engine` with `connect_args={"timeout": 5, "command_timeout": 15}` without SSL parameters. Connecting to cloud databases will fail SSL negotiation unless configured or passed via query parameter `?ssl=require`.
- **Remediation:** Pass `?ssl=require` in cloud `DATABASE_URL` or support `ssl` in `connect_args`.

### [IMPORTANT] 1. Standalone Dockerfile Lacks Automated Migrations on Startup
- **Impact:** While `docker-compose.yml` executes `alembic upgrade head`, the base `Dockerfile` CMD only runs `uvicorn`. Deploying the Docker image directly without a release command will fail on new migrations.
- **Remediation:** Define a deployment release command: `alembic upgrade head`.

### [IMPORTANT] 2. Document Retention Purge Lacks Automated Scheduling
- **Impact:** Document retention purge logic is implemented in `retention_service.py` but only accessible via manual administrative endpoint `POST /api/admin/maintenance/purge-documents`. Over time, unpurged uploads and records will consume disk capacity.
- **Remediation:** Configure a cloud cron trigger or external heartbeat to trigger the maintenance purge weekly.

### [IMPORTANT] 3. Lack of Automated Database Backup Runbook
- **Impact:** No automated `pg_dump` or recovery runbook is present in source control.
- **Remediation:** Activate automated daily backups and point-in-time recovery on the managed database provider.

### [INFORMATIONAL] 1. Excellent Citizen Privacy Architecture
- **Impact:** `citizen_documents` table has zero foreign keys to `users`. PII (Aadhaar, PAN) is masked before storage in `extracted_data`. Uploads directory is not publicly served via HTTP.

### [INFORMATIONAL] 2. Complete Test Suite Isolation
- **Impact:** Tests use in-memory SQLite (`:memory:`) via dependency overrides. Test runs do not alter development database state.

---

## 18. Deployment Prerequisites

Before deploying to production, execute the following checklist:

- [ ] **1. Provision Managed PostgreSQL:** Set up PostgreSQL 15+ with daily automated backups.
- [ ] **2. Format `DATABASE_URL`:** Must be `postgresql+asyncpg://user:pass@host:5432/dbname?ssl=require`.
- [ ] **3. Configure Environment Variables:**
  - `SECRET_KEY` (distinct 64-char random hex)
  - `CREDENTIAL_SIGNING_KEY` (distinct 64-char random hex)
  - `ADMIN_EMAIL` & `ADMIN_PASSWORD`
  - `GEMINI_API_KEY`
  - `ALLOWED_ORIGINS` (exact production HTTPS domains)
- [ ] **4. Attach Persistent Disk Volume:** Mount persistent storage to `/app/uploads` (min 10 GB).
- [ ] **5. Configure Pre-Deploy Release Step:** Execute `alembic upgrade head && python -m app.db.seed_admin`.
- [ ] **6. Schedule Maintenance Cron:** Configure recurring job for `POST /api/admin/maintenance/purge-documents?retention_days=30`.

---

## 19. Final Database/Storage Readiness

### Classification: **READY WITH CONDITIONS**

**Evidence & Justification:**
- **Schema & Migrations:** The schema is mature, robust, and clean. All 6 migrations are linear, bidirectional, and synchronized at head `006`.
- **Database Engine:** The SQLAlchemy 2.0 async engine in `backend/app/db/session.py` is fully architected for PostgreSQL connection pooling and health checks.
- **Data Integrity & Security:** PII masking, bcrypt password hashing, and user-decoupled citizen document architecture satisfy strict privacy requirements.
- **Conditions to Satisfy:** Production deployment must attach persistent volume storage for `/app/uploads`, configure the `postgresql+asyncpg://` connection URL with SSL, and execute Alembic migrations during the pre-deploy release phase.
