@echo off
echo ========================================================
echo           GovSkill Local Development Environment
echo ========================================================
echo.
echo [1/2] Starting Backend (FastAPI on http://localhost:8000)...
start "GovSkill Backend API" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting Frontend (Vite on http://localhost:3000)...
start "GovSkill Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both services are launching in separate consoles.
echo - Backend API:  http://localhost:8000
echo - Swagger Docs: http://localhost:8000/docs
echo - Frontend UI:  http://localhost:3000
echo.
echo Press any key to exit this launcher window...
pause >nul

