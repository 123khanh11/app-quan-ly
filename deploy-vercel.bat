@echo off
REM ========================================
REM DEPLOY LEN VERCEL - BANG TERMINAL
REM ========================================

echo.
echo 🚀 BAT DAU DEPLOY LEN VERCEL...
echo.

REM 1. Kiem tra Node.js
echo 📦 Kiem tra Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js chua duoc cai dat
    echo    Tai tai: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js da co san

REM 2. Kiem tra Vercel CLI
echo.
echo 🔍 Kiem tra Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Vercel CLI chua co
    echo 📥 Cai dat Vercel CLI...
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ Cai dat Vercel that bai
        pause
        exit /b 1
    )
    echo ✅ Vercel CLI da cai dat
)

REM 3. Cai dat dependencies
echo.
echo 📚 Cai dat dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Cai dat dependencies that bai
    pause
    exit /b 1
)
echo ✅ Dependencies da san sang

REM 4. Build project
echo.
echo 🔨 Build project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build that bai
    pause
    exit /b 1
)
echo ✅ Build thanh cong

REM 5. Deploy Vercel
echo.
echo 🌐 Deploy len Vercel...
call vercel --prod

if %errorlevel% neq 0 (
    echo ❌ Deploy that bai
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOY THANH CONG!
echo.
echo 🎉 App cua ban da live tren internet!
echo.
pause
