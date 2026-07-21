@echo off
echo ============================================
echo   THÊM ENVIRONMENT VARIABLES VÀ REDEPLOY
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Thêm VITE_SUPABASE_URL...
vercel env add VITE_SUPABASE_URL production

echo.
echo [2/4] Thêm VITE_SUPABASE_ANON_KEY...
vercel env add VITE_SUPABASE_ANON_KEY production

echo.
echo [3/4] Build lại app...
call npm run build

echo.
echo [4/4] Deploy lên Vercel...
vercel --prod

echo.
echo ============================================
echo   HOÀN THÀNH!
echo ============================================
echo.
echo Mở link trên để xem website!
echo.
pause
