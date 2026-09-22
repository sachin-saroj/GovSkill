# GovSkill — Digital Skill Support for Local Government Offices

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS 3](https://img.shields.io/badge/Styling-Tailwind%20CSS%203-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1.svg?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini API](https://img.shields.io/badge/AI-Google%20Gemini-8E44AD.svg?style=flat&logo=google)](https://ai.google.dev/)

**GovSkill** is a modern, full-stack web application built for local government offices. It features a **Core Employee Training Module** equipped with an interactive AI Tutor and a server-scored Quiz with an Admin Dashboard, plus **GovAssist** — a citizen self-service pre-submission document validator for Income Certificates.

<div align="center">
  <img src="docs/screenshots/00-hero-banner.png" alt="GovSkill Sovereign Civic Platform Banner" width="100%" />
  <p><em>Archival Museum-Grade Editorial Design System for Sovereign Civic Governance, Employee Qualification, and Citizen Services</em></p>
</div>

---

## 📸 Platform Interface & Visual Tour

### 1. Civil Servant Competency & Learning Experience

| Screen | Highlights & Architecture |
|---|---|
| **Employee Competency Dashboard (`/progress`)**<br><br><img src="docs/screenshots/02-employee-competency-dashboard.png" alt="Employee Competency Dashboard" width="100%" /> | **Deterministic Skills Ledger**<br>• Benchmark comparison against the 75% qualification threshold.<br>• Identifies strongest & weakest competency domains with transparent scoring explainer.<br>• Module readiness states with multi-attempt score growth deltas (`+X% Growth`).<br>• Chronological assessment audit history & learning activity timeline. |
| **Interactive Curriculum & Lesson Reader (`/module`)**<br><br><img src="docs/screenshots/04-curriculum-lesson-reader.png" alt="Curriculum Folio & Lesson Reader" width="100%" /> | **Museum-Grade Lesson Folio**<br>• Structured reading layout with estimated completion times and reading objectives.<br>• Section deep-linking support (`?section=X`) for targeted remediation.<br>• Integrated circular archives and administrative manual excerpts. |
| **Grounded AI Tutor Copilot (`/tutor`)**<br><br><img src="docs/screenshots/03-grounded-ai-tutor-copilot.png" alt="Grounded AI Tutor Copilot" width="100%" /> | **Pedagogical Civic Copilot**<br>• Powered by Google Gemini 2.5 Flash, strictly grounded in official lesson manuals.<br>• Code-driven relevance keyword routing (`find_relevant_modules`) across modules.<br>• Contextual remediation mode delivering rule summaries, workplace scenarios, and red flags. |
| **Server-Scored Quiz Examination (`/quiz`)**<br><br><img src="docs/screenshots/05-server-scored-quiz.png" alt="Server-Scored Quiz Examination" width="100%" /> | **Anti-Tamper Assessment Engine**<br>• 8-question competency examination with answer keys held strictly server-side.<br>• Interactive jump navigator and progress tracking.<br>• Post-quiz competency feedback with direct "Ask AI Tutor" and "Review Lesson" paths. |

---

### 2. GovAssist: Citizen Self-Service & Public Verification

| Screen | Highlights & Architecture |
|---|---|
| **GovAssist Citizen Pre-Submission Checker (`/citizen`)**<br><br><img src="docs/screenshots/06-govassist-citizen-precheck.png" alt="GovAssist Citizen Pre-Submission Checker" width="100%" /> | **Self-Service Pre-Check Tool**<br>• Public access with zero citizen registration required (complete data isolation).<br>• Automated OCR text extraction via Tesseract with contrast boosting and binarization.<br>• 100% deterministic 4-rule engine checking name, certificate format, validity, and seals.<br>• Plain-language AI remediation guidance for failed rules before official counter submission.<br>• Printable pre-submission counter slip with QR verification. |
| **Public Certificate Verification Portal (`/verify`)**<br><br><img src="docs/screenshots/07-public-certificate-verification.png" alt="Public Certificate Verification Portal" width="100%" /> | **Cryptographic Credential Verification**<br>• Instant public authenticity verification for issued officer certificates.<br>• Tamper-evident credential check using cryptographic signatures.<br>• Clean civic portal interface optimized for mobile and desktop scrutiny. |

---

### 3. Administrative Governance & Civic Portal

| Screen | Highlights & Architecture |
|---|---|
| **Supervisor Admin & CMS Dashboard (`/admin`)**<br><br><img src="docs/screenshots/08-admin-governance-dashboard.png" alt="Supervisor Admin & Governance Dashboard" width="100%" /> | **Workforce Readiness Intelligence**<br>• Real-time tracking of employee quiz attempts, average scores, and qualification rates.<br>• Module and question CMS manager for departmental curriculum updates.<br>• Citizen document validation audit log and CSV/JSON governance reporting exports. |
| **Civic Authentication Portal (`/login`)**<br><br><img src="docs/screenshots/09-civic-authentication-portal.png" alt="Civic Authentication Portal" width="100%" /> | **Role-Based Civic Authentication**<br>• Strict separation of `employee` and `admin` roles via JWT Bearer authentication.<br>• Default unchecked statutory consent and DPDP Act 2023 age verification.<br>• High-contrast accessible design with visible focus rings and WCAG 2.2 compliance. |

---

<details>
<summary><b>📜 Click to view Full Editorial Landing Page (Complete 13,000px High-Resolution Scroll)</b></summary>
<br>

<div align="center">
  <img src="docs/screenshots/01-editorial-landing-page.png" alt="GovSkill Full Landing Page Showcase" width="100%" />
</div>

</details>

---

## 🌟 Key Features

### 1. Core Employee Training Module
- **Structured Lesson Reader**: Interactive interface for local government staff to complete official digital workflow training ("Digital Document Handling").
- **Grounded AI Tutor**: Context-aware AI chatbot powered by Google Gemini (`gemini-2.5-flash`), strictly grounded in lesson content to assist employees when stuck.
- **Server-Scored Quiz**: 8-question MCQ quiz evaluated strictly server-side to prevent answer tampering.
- **Supervisor Admin Dashboard**: Metrics dashboard providing real-time tracking of employee quiz attempts, average scores, and pass rates (≥75%).

### 2. GovAssist (Citizen Pre-Submission Checker)
- **Public Self-Service Portal**: No citizen login required.
- **OCR Text Extraction**: Automated text extraction from uploaded Income Certificate scans (PNG, JPG, PDF, TXT) via Tesseract OCR and regex parsing.
- **Deterministic 4-Rule Validation Engine**: 100% code-driven rule engine checking:
  1. *Name Present*
  2. *Certificate Number Format* (Alphanumeric, ≥6 characters)
  3. *Certificate Validity / Expiry Date*
  4. *All Required Fields Extracted*
- **AI Explanation Layer**: Plain-language explanations generated by Gemini for any failed validation rules to guide citizens before official submission.

---

## 🏗 System Architecture

```mermaid
graph TD
    Client[Browser / React 18 SPA] -->|HTTP REST / Axios| API[FastAPI Backend Engine]
    
    subgraph Backend Services
        API --> Auth[JWT & Bcrypt Auth Service]
        API --> Training[Module & Server-Scored Quiz Service]
        API --> OCR[Tesseract OCR & Field Parser]
        API --> RuleEngine[Deterministic Rule Engine]
        API --> AIService[Google Gemini 2.5 Flash Layer]
    end
    
    subgraph Data Store
        Auth --> DB[(PostgreSQL / SQLite Fallback)]
        Training --> DB
        OCR --> DB
    end
```

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Backend Framework** | FastAPI (Python 3.11+) | Async REST API engine with OpenAPI interactive docs |
| **Database & ORM** | PostgreSQL 15 + SQLAlchemy 2.0 Async | Relational database with SQLite async fallback for dev/tests |
| **Database Migrations**| Alembic | Automated schema migrations |
| **Authentication** | JWT (`python-jose`) + Bcrypt (`passlib`) | Role-based Bearer token authentication (`employee` & `admin`) |
| **OCR & Processing** | Tesseract OCR (`pytesseract`) + Pillow | Local image text extraction & regex field parsing |
| **AI Integration** | Google Gemini API (`google-genai`) | Single-turn Q&A tutor and plain-language failed rule explanation |
| **Frontend Framework**| React 18 + Vite (TypeScript) | Fast client-side SPA architecture |
| **Styling & UI** | Tailwind CSS 3 + Lucide Icons | Responsive, clean public-sector aesthetic |
| **HTTP Client** | Axios | Request interceptors with auto Bearer token handling |
| **Testing** | Pytest + pytest-asyncio + httpx | Asynchronous end-to-end integration and unit testing |

---

## 📁 Project Directory Layout

```text
GovSkill/
├── AGENTS.md                   # AI agent instructions & non-negotiable rules
├── README.md                   # Main project documentation & setup guide
├── push_to_github.bat          # Automated deployment script for GitHub
│
├── docs/                       # Comprehensive Architecture & Project Docs
│   ├── PROJECT.md              # Vision, target personas, and feature breakdown
│   ├── ARCHITECTURE.md         # Detailed technical design & schema documentation
│   ├── CURRENT_STATE.md        # Live project dashboard, status, and known bugs
│   ├── DECISIONS.md            # Key architectural decision records (ADRs)
│   ├── ROADMAP.md              # Technical roadmap & future priorities
│   ├── SPECIFICATION.md        # Original product requirements document
│   └── DEBUG_LOG.md            # Master debug & stabilization history
│
├── backend/                    # FastAPI Backend Application
│   ├── alembic/                # Database migrations
│   ├── app/
│   │   ├── main.py             # FastAPI app entrypoint & middleware
│   │   ├── api/                # API routes & dependency injection
│   │   ├── core/               # Configuration & Security (JWT/Bcrypt)
│   │   ├── db/                 # Database engine & session management
│   │   ├── models/             # SQLAlchemy ORM database models
│   │   ├── schemas/            # Pydantic v2 validation schemas
│   │   ├── services/           # OCR, Rule Engine, and Gemini AI services
│   │   └── tests/              # Pytest end-to-end test suite
│   ├── uploads/                # Uploaded citizen document storage
│   ├── alembic.ini
│   ├── requirements.txt        # Python backend dependencies
│   └── .env.example
│
└── frontend/                   # React 18 + Vite Frontend Application
    ├── src/
    │   ├── App.tsx             # Main router & protected routes
    │   ├── main.tsx            # Application entry point
    │   ├── components/         # UI primitives, quiz, and document components
    │   ├── hooks/              # Global Auth context (`useAuth.tsx`)
    │   ├── layout/             # Top Navigation Header
    │   ├── lib/                # Axios API client setup
    │   ├── pages/              # App views (Login, Module, Tutor, Quiz, Admin, Citizen)
    │   └── types/              # TypeScript interfaces & type definitions
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🚀 Quick Start & Setup Guide

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & `npm`
- **Tesseract OCR** binary installed on system PATH
  - *Windows*: Download installer from UB-Mannheim Tesseract OCR and add `C:\Program Files\Tesseract-OCR` to System PATH.

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Copy environment variables
copy .env.example .env

# Run database migrations
alembic upgrade head

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```

Verify backend health at: [http://localhost:8000/health](http://localhost:8000/health)

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Open application in browser: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoint Reference

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Application health check | Public |
| `POST` | `/api/auth/register` | Register new employee or admin user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT access token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer Token |
| `GET` | `/api/modules/{id}` | Get lesson content for a training module | Bearer Token |
| `POST` | `/api/tutor/ask` | Submit question to Gemini AI Tutor | Bearer Token |
| `GET` | `/api/quiz/{module_id}` | Fetch quiz questions (answer key stripped) | Bearer Token |
| `POST` | `/api/quiz/{module_id}/submit` | Submit quiz answers for server-side evaluation | Bearer Token |
| `GET` | `/api/admin/attempts` | Fetch all employee quiz score history | Admin Only |
| `POST` | `/api/documents/upload` | Upload Income Certificate for OCR & Rule Engine check | Public (GovAssist) |
| `GET` | `/api/documents/{id}` | Retrieve pre-check result by document ID | Public (GovAssist) |

---

## 🧪 Testing & Verification

Run the automated test suites to verify backend functionality, authentication, rule engine execution, AI tutor fallbacks, and frontend accessibility/component contracts:

```bash
# 1. Backend Pytest Suite (38/38 passing)
cd backend
.\venv\Scripts\activate
pytest -v

# 2. Frontend Vitest Suite (93/93 passing across 20 test files)
cd ../frontend
npm test

# 3. Frontend Production Build & TypeScript Verification
npm run build
```

---

## 📜 Documentation Sitemap

For detailed architectural and implementation information, consult the `docs/` directory:
- [AGENTS.md](AGENTS.md) — AI agent conventions and strict development rules.
- [PROJECT.md](docs/PROJECT.md) — Product requirements, user journeys, and target personas.
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Technical specifications, database models, and design patterns.
- [CURRENT_STATE.md](docs/CURRENT_STATE.md) — Live project status dashboard and current focus.
- [DECISIONS.md](docs/DECISIONS.md) — Key architectural decision records (ADRs).
- [ROADMAP.md](docs/ROADMAP.md) — Technical roadmap and future priorities.

---

## 📄 License
This project is developed for educational and local government office support purposes.
