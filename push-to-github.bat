@echo off
REM Push code to GitHub after creating repository
REM Run this after creating app-quan-ly repository on GitHub

cd /d "c:\Users\baomu\OneDrive\Documents\app quản ly"

echo.
echo ════════════════════════════════════════════════════
echo 🚀 PUSHING TO GITHUB
echo ════════════════════════════════════════════════════
echo.
echo Username: 123khanh11
echo Repository: app-quan-ly
echo.

echo Pushing code...
git push -u origin master

if errorlevel 1 (
    echo.
    echo ⚠️ Push failed!
    echo Make sure you:
    echo 1. Created repository on GitHub
    echo 2. Have internet connection
    echo 3. Logged in to GitHub
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════
echo ✅ PUSHED TO GITHUB SUCCESSFULLY!
echo ════════════════════════════════════════════════════
echo.
echo Next step: Connect Vercel to GitHub
echo 1. Go to https://vercel.com/dashboard
echo 2. Open app-ql-v2 project
echo 3. Settings -^> Git -^> Connect GitHub
echo 4. Select: 123khanh11/app-quan-ly
echo 5. Save
echo.
pause
