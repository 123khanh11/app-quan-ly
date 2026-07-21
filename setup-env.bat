@echo off
REM ========================================
REM SETUP ENVIRONMENT VARIABLES - VERCEL
REM ========================================

echo.
echo ============================================
echo 🔧 SETUP ENVIRONMENT VARIABLES
echo ============================================
echo.

REM Kiem tra Vercel CLI
echo [1/3] Kiem tra Vercel CLI...
vercel --version >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI chua co
    echo 📥 Cai dat Vercel CLI...
    call npm install -g vercel
)

REM Dang nhap Vercel
echo.
echo [2/3] Dang nhap Vercel...
call vercel login

REM Thiet lap Environment Variables
echo.
echo [3/3] Thiet lap Environment Variables...
echo.
echo Nhap cac lenh sau:
echo.
echo vercel env add VITE_SUPABASE_URL
echo Sau do paste: https://edtxexnhpbipcecceoop.supabase.co
echo.
echo vercel env add VITE_SUPABASE_ANON_KEY
echo Sau do paste: sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
echo.
pause

call vercel env add VITE_SUPABASE_URL
call vercel env add VITE_SUPABASE_ANON_KEY

echo.
echo ============================================
echo ✅ SETUP THANH CONG!
echo ============================================
echo.
echo Buoc tiep theo: Deploy
echo Lenh: vercel --prod
echo.
pause
