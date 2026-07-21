@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo =====================================================
echo   DEPLOY TỰ ĐỘNG - QUẢN LÝ ĐỠN HÀNG
echo =====================================================
echo.

cd /d "%~dp0"

REM Bước 1: Build
echo [1/3] Build React App...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build thất bại!
    pause
    exit /b 1
)
echo ✅ Build thành công!
echo.

REM Bước 2: Deploy lên Vercel
echo [2/3] Deploy lên Vercel...
call vercel --prod --confirm
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deploy thất bại!
    pause
    exit /b 1
)
echo ✅ Deploy thành công!
echo.

REM Bước 3: Thêm Environment Variables
echo [3/3] Thêm Environment Variables...
call vercel env add VITE_SUPABASE_URL production <<EOF
https://edtxexnhpbipcecceoop.supabase.co
EOF

call vercel env add VITE_SUPABASE_ANON_KEY production <<EOF
sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
EOF

echo ✅ Environment Variables được thêm!
echo.

echo =====================================================
echo   ✅ HOÀN THÀNH!
echo =====================================================
echo.
echo Website của bạn đã lên sóng!
echo Mở link để xem:
echo https://e-commerce-website-interface-quanly1.vercel.app
echo.
pause
