@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ════════════════════════════════════════════════════
echo 🚀 DEPLOY LÊN VERCEL PRODUCTION
echo ════════════════════════════════════════════════════
echo.

cd /d "c:\Users\baomu\OneDrive\Documents\app quản ly"

echo ✅ Bước 1: Build project...
echo.
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Build thất bại!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Build thành công!
echo.
echo ✅ Bước 2: Deploy lên Vercel Production...
echo.
call vercel --prod --yes

if errorlevel 1 (
    echo.
    echo ⚠️ Deploy có thể chưa xong, vui lòng kiểm tra https://vercel.com
    echo.
)

echo.
echo ════════════════════════════════════════════════════
echo ✅ DEPLOY HOÀN TẤT!
echo ════════════════════════════════════════════════════
echo.
echo 🌐 Kiểm tra tại: https://app-ql-v2-qctqdmd4u-quanly1.vercel.app
echo.
pause
