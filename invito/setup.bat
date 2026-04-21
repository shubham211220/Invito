@echo off
echo ==========================================
echo   INVITO - Setup & Install
echo ==========================================
echo.

echo [1/2] Installing server dependencies...
cd /d "%~dp0server"
call npm install
echo.

echo [2/2] Installing client dependencies...
cd /d "%~dp0client"
call npm install
echo.

echo ==========================================
echo   Setup complete!
echo   
echo   To start the app:
echo   1. Open Terminal 1: cd server ^&^& npm run dev
echo   2. Open Terminal 2: cd client ^&^& npm run dev
echo ==========================================
pause
