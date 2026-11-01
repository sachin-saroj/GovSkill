@echo off
echo ========================================================
echo        GovSkill - Live Database Visual Studio
echo ========================================================
echo.
echo Launching Drizzle Studio for SQLite Database: backend\govskill.db
echo.
echo Once started, open your browser at: https://local.drizzle.studio
echo.
npx drizzle-kit studio --port 4983
pause
