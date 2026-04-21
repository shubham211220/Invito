@echo off
echo Starting Invito Backend...
cd /d "%~dp0server"
start "Invito Server" cmd /k "npm run dev"

echo Starting Invito Frontend...
cd /d "%~dp0client"
start "Invito Client" cmd /k "npm run dev"

echo.
echo Both servers starting in separate windows!
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
