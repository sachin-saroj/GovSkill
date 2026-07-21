# GovSkill — Digital Skill Support for Local Government Offices

GovSkill is a web application designed for local government offices. It features a **Core Employee Training Module** with an AI Tutor and server-scored Quiz, alongside an Admin Dashboard, plus **GovAssist** for citizen pre-submission document validation (Income Certificates).

---

## Pre-flight Checklist (Prerequisites)

- [x] **PostgreSQL** installed and running locally.
- [x] **Python 3.11+** & **Node.js 18+** installed.
- [x] **Tesseract OCR** binary installed on system PATH (Required for OCR extraction on images/scans).
  - *Windows:* Download installer from UB-Mannheim Tesseract OCR and add `C:\Program Files\Tesseract-OCR` to System PATH.
- [x] **Environment File `.env`**: Copy `.env.example` to `.env` in `backend/` and set your `DATABASE_URL` and `GEMINI_API_KEY`.

---

## Step-by-Step Execution Guide

### 1. Backend Setup

Open a terminal in the root directory:

```bash
cd backend

# Create & activate Python virtual environment
python -m venv venv
# On Windows PowerShell / CMD:
.\venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Copy .env configuration if not already done
copy .env.example .env
```

> **Note:** Open `backend/.env` and update your PostgreSQL credentials and Gemini API Key if using live AI generation.

```bash
# Run database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

Verify backend health in your browser:
[http://localhost:8000/health](http://localhost:8000/health) — Should return `{"status": "ok", "app": "GovSkill"}`.

---

### 2. Frontend Setup

Open a **new terminal** in the root directory:

```bash
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## User Journeys

### Employee & Admin Journey
1. Navigate to `/login`.
2. Register an Employee account (`role: employee`) or Supervisor account (`role: admin`).
3. Log in to access the **Digital Document Handling** lesson module (`/module`).
4. Ask questions to the grounded **AI Tutor** (`/tutor`).
5. Complete the 8-question MCQ **Quiz** (`/quiz`) to receive a server-evaluated score.
6. Log in with an Admin account to review all employee quiz attempt scores (`/admin`).

### Citizen Journey (GovAssist)
1. Navigate to `/citizen` (No login required).
2. Upload an Income Certificate document (JPG/PNG/PDF/TXT).
3. System runs OCR → 4 Deterministic Validation Rules → AI Explanation Layer for any failed rule.
