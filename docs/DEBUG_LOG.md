# GovSkill — Master Debug & Stabilization Log

## Errors Found

1. **`backend/app/api/deps.py` — UUID Type Mismatch in `get_current_user`**:
   JWT payload stores `user_id` as a string (`"sub"`). Querying `select(User).where(User.id == user_id)` compares a UUID column against a Python `str`, which causes type lookup failures or dialect errors across different database drivers.

2. **`backend/app/api/routes/admin.py` — Attribute Error on `submitted_at.isoformat()`**:
   In `list_quiz_attempts`, `attempt_obj.submitted_at` can be a `str` when retrieved from SQLite or text-formatted timestamp columns. Unconditionally calling `.isoformat()` causes an `AttributeError: 'str' object has no attribute 'isoformat'`.

3. **`backend/app/services/ocr_service.py` — Missing Default Tesseract Binary Path Configuration on Windows**:
   `pytesseract` throws `TesseractNotFoundError` on Windows systems unless `pytesseract.pytesseract.tesseract_cmd` is explicitly configured to standard installation paths (e.g., `C:\Program Files\Tesseract-OCR\tesseract.exe`).

4. **`frontend/src/hooks/` — Duplicate / Ambiguous Module Files (`useAuth.ts` and `useAuth.tsx`)**:
   Having both `useAuth.ts` and `useAuth.tsx` in `frontend/src/hooks/` causes import resolution ambiguity and esbuild/Vite build warnings.

5. **`frontend/src/pages/AdminDashboardPage.tsx` — Potential `NaN` Division in Average Score Calculation**:
   The average score calculation does not safeguard against `curr.total === 0`, which could produce `NaN` in UI rendering.

6. **`backend/app/api/routes/documents.py` — Missing Unhandled Exception Safeguard during OCR/Parsing**:
   If OCR or field parsing encounters an unreadable binary file, the route can throw an uncaught 500 error instead of returning a clean validation response.

## Fixes Applied

1. **`backend/app/api/deps.py`**: Added explicit `uuid.UUID(str(user_id))` parsing in `get_current_user` to ensure type compatibility across all database dialects.
2. **`backend/app/api/routes/admin.py`**: Added `hasattr(attempt_obj.submitted_at, 'isoformat')` check before invoking `.isoformat()` to handle both `datetime` objects and string timestamps safely.
3. **`backend/app/services/ocr_service.py`**: Added automatic Windows path detection for `tesseract.exe` across standard installation directories (`C:\Program Files\Tesseract-OCR\tesseract.exe`).
4. **`frontend/src/hooks/`**: Standardized React Auth context into `useAuth.tsx` with clean type exports and updated `useAuth.ts` re-export module.
5. **`frontend/src/pages/AdminDashboardPage.tsx`**: Filtered zero-total attempts in average score calculation (`validAttempts.length > 0`) to prevent `NaN` values.
6. **`backend/app/api/routes/documents.py`**: Added try/except error boundaries around OCR text extraction and AI explanation generation to ensure clean JSON error responses instead of uncaught server crashes.
