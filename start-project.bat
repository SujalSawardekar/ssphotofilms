@echo off
setlocal
echo ============================================================
echo      SS PHOTO ^& FILMS - ONE-CLICK STARTUP
echo ============================================================
echo.

:: Get the root directory
set PROJECT_ROOT=%~dp0

echo [1/2] Starting Frontend (Next.js) on http://localhost:3000...
start "SS Frontend" cmd /k "cd /d "%PROJECT_ROOT%" && npm run dev"

echo.
echo [2/2] Starting AI Engine (Python) on http://localhost:5001...
start "SS AI Engine" cmd /k "cd /d "%PROJECT_ROOT%\face_recognition_engine" && ..\.venv\Scripts\python app.py"

echo.
echo SUCCESS: Both components are starting in separate windows.
echo You can close this window now.
echo.
pause
