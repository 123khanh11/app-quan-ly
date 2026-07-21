@echo off
echo ==========================================
echo    Build Ung Dung Web
echo ==========================================
echo.

REM Kiem tra Flutter
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Flutter chua duoc cai dat!
    pause
    exit /b 1
)

echo [1/3] Clean project...
call flutter clean
echo.

echo [2/3] Get dependencies...
call flutter pub get
echo.

echo [3/3] Build web production...
call flutter build web --release
echo.

if %errorlevel% equ 0 (
    echo ==========================================
    echo   BUILD THANH CONG!
    echo ==========================================
    echo.
    echo File build nam trong: build\web\
    echo Ban co the upload folder nay len web hosting
    echo.
) else (
    echo [ERROR] Build that bai!
)

pause
