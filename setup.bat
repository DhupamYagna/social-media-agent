@echo off
title Social Media Agentic AI - IBM Granite
color 0A

echo.
echo  ======================================================
echo   🚀 Social Media Agentic AI — Powered by IBM Granite
echo  ======================================================
echo.

:: Check Node.js
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ❌ Node.js is NOT installed.
    echo     Please download and install Node.js from: https://nodejs.org/
    echo     Recommended version: 18 or higher
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo  ✅ Node.js found: %%v

:: Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo  ❌ npm not found. Please reinstall Node.js.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm --version') do echo  ✅ npm found: %%v

echo.
echo [2/5] Installing backend dependencies...
cd /d "%~dp0server"
call npm install
if errorlevel 1 (
    echo  ❌ Failed to install backend dependencies.
    pause
    exit /b 1
)
echo  ✅ Backend dependencies installed.

echo.
echo [3/5] Installing frontend dependencies...
cd /d "%~dp0client"
call npm install
if errorlevel 1 (
    echo  ❌ Failed to install frontend dependencies.
    pause
    exit /b 1
)
echo  ✅ Frontend dependencies installed.

echo.
echo [4/5] Setting up environment configuration...
cd /d "%~dp0server"
if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo  ✅ Created .env from .env.example
    echo.
    echo  ⚠️  IMPORTANT: To enable IBM Granite LLM (live mode):
    echo     1. Open social-media-agent\server\.env
    echo     2. Replace "your_ibm_cloud_api_key_here" with your IBM Cloud API key
    echo     3. Replace "your_watsonx_project_id_here" with your watsonx Project ID
    echo     4. Get credentials at: https://cloud.ibm.com/
    echo.
    echo  Without API keys, the app runs in MOCK mode with sample data.
    echo  All features work in mock mode — no API key required for demo.
    echo.
) else (
    echo  ✅ .env already exists.
)

echo.
echo [5/5] Launching the application...
echo  📡 Starting backend server on http://localhost:3001
echo  🌐 Starting frontend on http://localhost:5173
echo.

:: Start backend in new window
start "IBM Granite Backend (Port 3001)" cmd /k "cd /d "%~dp0server" && echo Starting IBM Granite Social Media Agent Backend... && node index.js"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in new window
start "Social Media Agent Frontend (Port 5173)" cmd /k "cd /d "%~dp0client" && echo Starting Social Media Agent Frontend... && npm run dev"

:: Wait for frontend to start
timeout /t 3 /nobreak >nul

:: Open browser
echo  🚀 Opening browser...
start "" "http://localhost:5173"

echo.
echo  ======================================================
echo   ✅ Application is running!
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo   Health:   http://localhost:3001/api/health
echo.
echo   Close the "Backend" and "Frontend" terminal windows
echo   to stop the application.
echo  ======================================================
echo.
pause
