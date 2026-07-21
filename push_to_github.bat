@echo off
echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Committing files...
git commit -m "Initial commit - CLG PROJECT"

echo Setting main branch...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/nikhil-surve-dev/clg-project.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================================
echo Done! Your code has been pushed to GitHub.
echo Repository URL: https://github.com/nikhil-surve-dev/clg-project
echo ========================================================
pause
