@echo off
chcp 65001 > nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Khắc Phục Lỗi Flutter Web và Chạy Ứng Dụng             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/6] Làm sạch dự án (flutter clean)...
call flutter clean
if errorlevel 1 (
    echo ✗ Lỗi khi chạy flutter clean
    goto error
)
echo ✓ Hoàn thành
echo.

echo [2/6] Xóa pubspec.lock...
if exist pubspec.lock (
    del pubspec.lock
    echo ✓ Đã xóa pubspec.lock
) else (
    echo - pubspec.lock không tồn tại
)
echo.

echo [3/6] Cài đặt lại dependencies (flutter pub get)...
call flutter pub get
if errorlevel 1 (
    echo ✗ Lỗi khi cài đặt dependencies
    goto error
)
echo ✓ Hoàn thành
echo.

echo [4/6] Upgrade Flutter...
echo Nhấn Y để upgrade hoặc N để bỏ qua
call flutter upgrade
echo.

echo [5/6] Đang chuẩn bị chạy ứng dụng...
echo.
echo Tùy chọn chạy:
echo   1. Chạy bình thường (flutter run -d chrome)
echo   2. Chạy với verbose mode (flutter run -d chrome -v)
echo   3. Chạy ở chế độ release (flutter run -d chrome --release)
echo.
set /p choice="Chọn tùy chọn (1/2/3): "

echo.
if "%choice%"=="1" (
    echo [6/6] Chạy: flutter run -d chrome
    call flutter run -d chrome
) else if "%choice%"=="2" (
    echo [6/6] Chạy: flutter run -d chrome -v
    call flutter run -d chrome -v
) else if "%choice%"=="3" (
    echo [6/6] Chạy: flutter run -d chrome --release
    call flutter run -d chrome --release
) else (
    echo ✗ Tùy chọn không hợp lệ. Sử dụng tùy chọn 1 (mặc định)
    call flutter run -d chrome
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Hoàn thành!                                              ║
echo ╚════════════════════════════════════════════════════════════╝
pause
exit /b 0

:error
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Có lỗi xảy ra!                                           ║
echo ╚════════════════════════════════════════════════════════════╝
pause
exit /b 1
