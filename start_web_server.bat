@echo off
chcp 65001 > nul

REM Đi đến thư mục web app
cd /d "c:\Users\baomu\OneDrive\Documents\app_management\build\web"

title 🌐 Web Server - Ứng Dụng Quản Lý Bán Hàng

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   🚀 Web Server Đang Chạy                                    ║
echo ║   Ứng Dụng Quản Lý Bán Hàng                                  ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📁 Thư mục: %cd%
echo.
echo 🌐 TRUY CẬP ỨNG DỤNG TẠI:
echo.
echo    ► http://localhost:8000
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ℹ️  Nhấn Ctrl+C để dừng server
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM Chạy Python HTTP Server
python -m http.server 8000 --bind 127.0.0.1

echo.
echo Server đã dừng
pause
