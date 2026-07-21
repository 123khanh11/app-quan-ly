@echo off
REM ========================================
REM DEPLOY LEN VERCEL - QUICK VERSION
REM ========================================
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ============================================
echo 🚀 DEPLOY LEN VERCEL
echo ============================================
echo.

REM Kiem tra Node.js
echo [1/4] Kiem tra Node.js...
node -v >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js chua duoc cai dat!
    echo    Tai: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js OK

REM Cai dat dependencies
echo.
echo [2/4] Cai dat dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Cai dat that bai
    pause
    exit /b 1
)
echo ✅ Dependencies OK

REM Build
echo.
echo [3/4] Build project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build that bai
    pause
    exit /b 1
)
echo ✅ Build OK

REM Deploy
echo.
echo [4/4] Deploy len Vercel...
echo.
echo Nhap lenh: vercel --prod
echo.
pause

call vercel --prod

echo.
echo ============================================
echo ✅ DEPLOY THANH CONG!
echo ============================================
echo.
pause
