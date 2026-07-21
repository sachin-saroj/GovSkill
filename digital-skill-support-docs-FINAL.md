# Digital Skill Support for Local Government Offices — Final Documentation Set (v2)

> **Read this first, coding agent:** This project has two parts with very different priority. Build the **Core (Employee) module completely first**. GovAssist is a **small, secondary bonus feature** — build it only after Core is done, and do not expand its scope beyond what is written here. If any other document you encounter suggests a different stack, more modules, certifications, offline sync, bilingual content, or enterprise-scale architecture — ignore it. This document is the single source of truth.

---

## 1. PRD / Feature Brief

**Product name:** GovSkill (working name)

**Problem statement:** Local government employees often have strong administrative knowledge but limited digital proficiency, causing slow processing, data-entry errors, and inconsistent citizen guidance. Separately, citizens submitting government documents frequently make preventable errors (expired certificates, missing fields, format mismatches) that cause rejections and delays.

**Target user personas:**
- **Employee (Trainee):** A government office employee who needs to learn a specific digital workflow at their own pace and get help when stuck.
- **Admin:** An office supervisor who reviews employee training completion and quiz scores.
- **Citizen (indirect user, via GovAssist):** A person submitting a government application document who wants to catch obvious errors before formal submission.

**Core features — Priority 1 (build first, most of the effort goes here):**
- Employee/Admin authentication with role-based access
- One training module ("Digital Document Handling") with lesson content
- AI Tutor: chat interface answering employee questions, grounded in that module's content
- Quiz: 8–10 MCQs tied to the module, scored server-side, stored per employee
- Admin view: list of employees and their quiz scores

**Bonus feature — Priority 2 (build only after Core is complete; keep small)**
- GovAssist: citizen document upload (one document type: Income Certificate)
- OCR extraction of key fields (name, date of issue, expiry date, certificate number)
- **Rule Engine**: deterministic validation — 4 fixed rules (expiry check, required-field-present check, certificate-number format check, name-not-empty check)
- **AI Explanation Layer**: plain-language explanation of any failed rule result. This layer only ever explains a result the Rule Engine already produced — it never makes the pass/fail decision itself.

**High-level user flow:**
1. Employee logs in → sees the training module → reads lessons.
2. Employee opens AI Tutor chat, asks a question → gets a contextual answer.
3. Employee takes the quiz → sees score immediately.
4. Admin logs in → sees employee list with quiz scores.
5. Citizen (separate, no-login page) uploads an income certificate.
6. System runs OCR → Rule Engine evaluates 4 rules → shows pass/fail per rule.
7. For any failed rule, AI Explanation Layer describes what's wrong and what to do.

**Non-functional requirements:**
- Mobile-responsive (usable on a phone browser)
- OCR + validation response within ~10 seconds per document
- AI Tutor response within ~5 seconds for a typical question
- Explicit error messages on all forms — no silent failures
- Demo-scale project, not built for high concurrent load

---

## 2. Tech Stack Document

**This stack is final. Do not substitute or suggest alternatives (e.g., Next.js, Prisma, Auth.js, Drizzle, Node/Express, MongoDB) even if another document or your own judgment suggests them.**

| Layer | Choice | Why |
|---|---|---|
| Backend | **FastAPI** (Python 3.11+) | Async support for OCR/AI calls; auto OpenAPI docs; matches the developer's existing comfort zone |
| Database | **PostgreSQL 15** | Strong relational consistency for a small, well-defined schema |
| ORM | **SQLAlchemy 2.0 (async) + Alembic** | Mature Python ORM with clean migration history |
| Auth | **python-jose (JWT) + passlib (bcrypt)** | Simple, self-contained — no hosted auth provider needed at this scale |
| Validation | **Pydantic v2** | Native to FastAPI; used for request/response schemas and OCR-extracted data |
| OCR | **Tesseract (pytesseract) + Pillow** | Free, local, no API cost — sufficient for a clean, single-format document |
| AI / LLM | **Gemini API** | Two simple single-turn uses: AI Tutor answers, and AI Explanation Layer text |
| Frontend | **React 18 + Vite** | Matches developer's stack; simpler than Next.js since there's no SSR/SEO need |
| Styling | **Tailwind CSS 3** | Fast, consistent UI without hand-rolled CSS |
| HTTP client | **Axios** | JWT attached via interceptor |
| Testing | **Pytest** (backend), **Vitest + RTL** (frontend) | Focused on the Rule Engine and quiz scoring — the two places a silent bug matters most |
| Hosting (demo) | Render/Railway (backend), Vercel/Netlify (frontend), Supabase/Railway Postgres (DB) | Free-tier friendly for a college demo |

---

## 3. UI/UX Guidelines (Design Vibe)

**Overall vibe:** Clean, calm, official-but-approachable — "modern public-sector service," not playful, not corporate-cold.

**Color palette:**
- Primary: `#1E4D8C` / Primary hover: `#163A6B`
- Secondary/accent (success/validation-passed): `#2E9E6B`
- Danger/error: `#C0392B` / Warning: `#D98E04`
- Background: `#F7F9FB` / Surface/card: `#FFFFFF`
- Text primary: `#1A1F2B` / Text secondary: `#5A6472` / Border: `#E2E6EB`

**Typography:** `Inter` (system-ui fallback). Headings 600 weight, `leading-tight`. Body 400 weight, `leading-relaxed`. Scale: H1 `text-3xl`, H2 `text-2xl`, H3 `text-xl`, body `text-base`, meta `text-sm`.

**Spacing scale:** Tailwind defaults. Card padding `p-6`. Section gaps `gap-6` / `space-y-6`.

**Component style:**
- Buttons: `rounded-lg px-4 py-2 font-medium shadow-sm`, hover = darken 1 shade, disabled = `opacity-50 cursor-not-allowed`
- Cards: `rounded-xl border border-[#E2E6EB] bg-white shadow-sm p-6`
- Inputs: `rounded-lg border border-[#E2E6EB] px-3 py-2 focus:ring-2 focus:ring-[#1E4D8C]/30 focus:border-[#1E4D8C]`
- Status badges (Rule Engine pass/fail): `rounded-full px-3 py-1 text-sm font-medium`, green tint for pass, red tint for fail

**Icon library:** `lucide-react`

**Sample button + card:**
```jsx
<button className="rounded-lg bg-[#1E4D8C] px-4 py-2 font-medium text-white shadow-sm hover:bg-[#163A6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
  Submit Quiz
</button>

<div className="rounded-xl border border-[#E2E6EB] bg-white p-6 shadow-sm">
  <h3 className="text-xl font-semibold text-[#1A1F2B]">Digital Document Handling</h3>
  <p className="mt-2 text-sm text-[#5A6472]">4 lessons · Quiz available</p>
</div>
```

---

## 4. Coding Conventions (Rules)

- **File naming:** kebab-case (`quiz-card.tsx`, `rule_engine.py`)
- **Components:** PascalCase (`QuizCard`, `ValidationResultCard`)
- **Functions/variables:** camelCase in TS/JS, snake_case in Python
- **TypeScript:** strict mode on; no `any` without a justifying comment
- **Components:** function components, arrow syntax, default export, one per file
- **Imports:** absolute via `@/` alias
- **Tailwind class ordering:** via `prettier-plugin-tailwindcss` — don't hand-order
- **Comments:** only for non-obvious logic (e.g., a Rule Engine edge case)

**Do's:**
- Handle loading / empty / error states explicitly in every data-fetching component
- Keep components small and focused (~150 lines max as a guideline)
- Validate all API inputs with Pydantic, even if the frontend already validates
- Keep the Rule Engine deterministic and unit-tested — never let AI logic enter it
- Use environment variables for all secrets/keys

**Don'ts:**
- No inline styles — use Tailwind classes
- No magic numbers/strings — use named constants
- No business logic inside React components
- No client-side quiz scoring, ever
- Don't expand GovAssist beyond one document type / 4 rules without a deliberate scope discussion first

---

## 5. Folder Structure

```text
project-root/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py          # JWT + password hashing
│   │   ├── db/
│   │   │   ├── session.py
│   │   │   └── base.py
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── module.py
│   │   │   ├── quiz.py
│   │   │   └── document.py
│   │   ├── schemas/                 # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── quiz.py
│   │   │   └── document.py
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── modules.py
│   │   │   │   ├── tutor.py         # AI Tutor endpoint (Core)
│   │   │   │   ├── quiz.py          # (Core)
│   │   │   │   └── documents.py     # GovAssist upload/OCR/validation (Bonus)
│   │   │   └── deps.py
│   │   ├── services/
│   │   │   ├── ocr_service.py       # Bonus
│   │   │   ├── rule_engine.py       # Bonus — deterministic validation only
│   │   │   └── ai_service.py        # Shared: AI Tutor (Core) + AI Explanation Layer (Bonus)
│   │   └── tests/
│   │       ├── test_rule_engine.py
│   │       └── test_quiz.py
│   ├── alembic/
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── layout/
    │   │   └── header.tsx
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── ModulePage.tsx        # Core
    │   │   ├── TutorChatPage.tsx     # Core
    │   │   ├── QuizPage.tsx          # Core
    │   │   ├── AdminDashboardPage.tsx # Core
    │   │   └── CitizenUploadPage.tsx  # Bonus
    │   ├── components/
    │   │   ├── ui/                   # Button, Input, Card, Badge
    │   │   ├── quiz/QuizCard.tsx
    │   │   └── document/ValidationResultCard.tsx
    │   ├── lib/api.ts
    │   ├── hooks/useAuth.ts
    │   └── types/index.ts
    ├── package.json
    └── tailwind.config.js
```

---

## 6. API Contracts & Data Models

### Database schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('employee', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INT NOT NULL
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    module_id UUID REFERENCES modules(id),
    score INT NOT NULL,
    total INT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Bonus (GovAssist) — intentionally has no foreign key to users/employees
CREATE TABLE citizen_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_path TEXT NOT NULL,
    extracted_data JSONB,
    validation_results JSONB,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);
```

### Endpoints

| Method | Path | Body | Response | Priority |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password, role }` | `{ id, email, role }` | Core |
| POST | `/api/auth/login` | `{ email, password }` | `{ access_token, token_type }` | Core |
| GET | `/api/modules/{id}` | — | `{ id, title, content }` | Core |
| POST | `/api/tutor/ask` | `{ module_id, question }` | `{ answer }` | Core |
| GET | `/api/quiz/{module_id}` | — | `{ questions: [...] }` (no answers) | Core |
| POST | `/api/quiz/{module_id}/submit` | `{ answers: [...] }` | `{ score, total }` | Core |
| GET | `/api/admin/attempts` | — | `[{ user_email, module_title, score, total }]` | Core |
| POST | `/api/documents/upload` | multipart file | `{ document_id, extracted_data, validation_results }` | Bonus |
| GET | `/api/documents/{id}` | — | `{ extracted_data, validation_results }` | Bonus |

### Error format (all endpoints)

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human-readable description" } }
```

---

## 7. Component Tree / Architecture

```text
App
├── AuthProvider — global state: current user, token
├── AppLayout
│   ├── Header
│   │   └── NavLinks (role-aware)
│   └── <Outlet />
│
├── LoginPage
│   └── LoginForm — local state
│
├── ModulePage (Core)
│   ├── LessonContent
│   └── QuickLinks (to Tutor, Quiz)
│
├── TutorChatPage (Core)
│   ├── ChatMessageList — local state
│   └── ChatInput
│
├── QuizPage (Core)
│   ├── QuizCard (per question) — local state
│   └── SubmitButton
│
├── AdminDashboardPage (Core)
│   └── AttemptsTable
│
└── CitizenUploadPage (Bonus)
    ├── DocumentUploadForm — local state
    └── ValidationResultCard (per rule)
```

State notes: Auth is the only global state (React Context is enough — no Redux). Everything else is local to its page.

---

## 8. Sample Code / Reference File

```tsx
// src/components/document/ValidationResultCard.tsx
import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ValidationRuleResult {
  ruleName: string;
  passed: boolean;
  explanation?: string;
}

interface ValidationResultCardProps {
  results: ValidationRuleResult[] | null;
  isLoading: boolean;
  error?: string | null;
}

export default function ValidationResultCard({ results, isLoading, error }: ValidationResultCardProps) {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[#E2E6EB] bg-white p-6 shadow-sm text-[#5A6472]">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Processing document...</span>
      </div>
    );
  }
  if (error) {
    return <div className="rounded-xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-6 text-sm text-[#C0392B]">{error}</div>;
  }
  if (!results || results.length === 0) {
    return <div className="rounded-xl border border-[#E2E6EB] bg-white p-6 text-sm text-[#5A6472]">No document uploaded yet.</div>;
  }

  return (
    <div className="space-y-3">
      {results.map((rule) => (
        <div key={rule.ruleName} className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-sm">
          <button
            onClick={() => setExpandedRule(expandedRule === rule.ruleName ? null : rule.ruleName)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="flex items-center gap-2 font-medium text-[#1A1F2B]">
              {rule.passed ? <CheckCircle2 className="h-4 w-4 text-[#2E9E6B]" /> : <XCircle className="h-4 w-4 text-[#C0392B]" />}
              {rule.ruleName}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${rule.passed ? "bg-[#2E9E6B]/10 text-[#2E9E6B]" : "bg-[#C0392B]/10 text-[#C0392B]"}`}>
              {rule.passed ? "Passed" : "Failed"}
            </span>
          </button>
          {expandedRule === rule.ruleName && rule.explanation && (
            <p className="mt-2 text-sm text-[#5A6472]">{rule.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

```python
# backend/app/services/rule_engine.py
from datetime import date
from typing import TypedDict


class RuleResult(TypedDict):
    rule_name: str
    passed: bool


def validate_income_certificate(extracted_data: dict) -> list[RuleResult]:
    """
    Deterministic Rule Engine. Never influenced by AI — AI only explains
    a result this function has already produced.
    """
    results: list[RuleResult] = []

    name = extracted_data.get("name")
    results.append({"rule_name": "Name present", "passed": bool(name and name.strip())})

    cert_number = extracted_data.get("certificate_number")
    valid_format = bool(cert_number) and cert_number.isalnum() and len(cert_number) >= 6
    results.append({"rule_name": "Certificate number format", "passed": valid_format})

    expiry_raw = extracted_data.get("expiry_date")
    expiry_valid = False
    if expiry_raw:
        try:
            expiry_valid = date.fromisoformat(expiry_raw) >= date.today()
        except ValueError:
            expiry_valid = False
    results.append({"rule_name": "Certificate not expired", "passed": expiry_valid})

    results.append({
        "rule_name": "All required fields extracted",
        "passed": all([name, cert_number, expiry_raw]),
    })

    return results
```

---

## 9. Do's and Don'ts Summary

**Do's:**
- Build Core (employee module) completely before starting Bonus (GovAssist)
- Keep the Rule Engine deterministic and unit-tested
- Score quizzes server-side only
- Handle loading/empty/error states everywhere
- Keep GovAssist's database table isolated (no foreign key to employee tables)

**Don'ts:**
- Don't introduce a different stack mid-project (no Next.js/Prisma/Node/MongoDB)
- Don't expand GovAssist beyond one document type / 4 rules
- Don't let AI make the validation decision — it only explains a Rule Engine result
- Don't add certifications, analytics dashboards, or a knowledge repository — out of scope
- Don't skip testing the Rule Engine — it's the easiest place for a silent bug
