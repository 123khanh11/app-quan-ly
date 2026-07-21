@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   Khởi động Web Server cho Flutter Web App           ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Kiểm tra xem app_management/build/web có tồn tại không
if not exist "app_management\build\web\index.html" (
    echo ✗ Lỗi: App chưa được build
    echo.
    echo Vui lòng chạy lệnh sau trước:
    echo   cd app_management
    echo   flutter build web --release
    echo.
    pause
    exit /b 1
)

echo ✓ Tìm thấy build web
echo.
echo Sử dụng Python để khởi động server...
python run_web_server.py

if errorlevel 1 (
    echo.
    echo ✗ Lỗi: Python không được cài đặt hoặc không trong PATH
    echo.
    echo Cách khác: Sử dụng Node.js http-server
    echo   1. Cài đặt: npm install -g http-server
    echo   2. Chạy: http-server app_management\build\web
    echo.
    pause
)

pause
