@echo off
REM ============================================
REM Update Web App to Vercel
REM ============================================

echo.
echo ╔════════════════════════════════════════╗
echo ║  UPDATE WEB APP TO VERCEL              ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Cai dat dependencies...
    call npm install
    echo.
)

REM Build
echo Building web app...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.

REM Deploy
echo Deploying to Vercel...
call vercel deploy --prod

echo.
echo ╔════════════════════════════════════════╗
echo ║  ✅ DEPLOYMENT COMPLETE!              ║
echo ║  Check: order-management-web-*.app   ║
echo ╚════════════════════════════════════════╝
echo.

pause
