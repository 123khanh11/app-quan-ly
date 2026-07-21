@echo off
REM Deploy to Vercel Production - No Git Required
REM Just run this file and follow prompts

cd /d "c:\Users\baomu\OneDrive\Documents\app quản ly"

echo.
echo ════════════════════════════════════════════════════
echo 🚀 DEPLOYING TO VERCEL PRODUCTION
echo ════════════════════════════════════════════════════
echo.

REM Build
echo Building...
call npm run build

if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo Deploying to Vercel...
echo (Follow any prompts that appear)
echo.

REM Deploy - will prompt for confirmation
call vercel --prod

echo.
echo ════════════════════════════════════════════════════
echo 🎉 DEPLOYMENT COMPLETE!
echo ════════════════════════════════════════════════════
echo.
pause
