@echo off
echo ==========================================
echo    Chay Ung Dung Quan Ly Ban Hang
echo ==========================================
echo.

REM Kiem tra Flutter da cai chua
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Flutter chua duoc cai dat!
    echo Vui long cai Flutter tai: https://docs.flutter.dev/get-started/install/windows
    pause
    exit /b 1
)

echo [1/4] Kiem tra Flutter...
flutter --version
echo.

echo [2/4] Kiem tra file .env...
if not exist .env (
    echo [WARNING] File .env chua ton tai!
    echo Tao file .env tu .env.example...
    copy .env.example .env
    echo.
    echo Vui long cap nhat SUPABASE_URL va SUPABASE_ANON_KEY trong file .env
    echo Sau do chay lai file nay!
    pause
    exit /b 1
)
echo File .env: OK
echo.

echo [3/4] Cai dat dependencies...
call flutter pub get
if %errorlevel% neq 0 (
    echo [ERROR] Cai dat dependencies that bai!
    pause
    exit /b 1
)
echo.

echo [4/4] Chay ung dung tren Chrome...
echo.
echo ==========================================
echo   Ung dung dang khoi dong...
echo   Nhan Ctrl+C de dung
echo ==========================================
echo.

call flutter run -d chrome

pause
