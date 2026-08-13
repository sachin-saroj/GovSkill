@echo off
echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Committing files...
git commit -m "Initial release - GovSkill Full-Stack Platform"

echo Setting main branch...
git branch -M main

echo Pushing to GitHub repository GovSkill...
git push -u origin main

echo.
echo ========================================================
echo Done! Your code has been pushed to GitHub.
echo ========================================================
pause
