# Script tự động thêm Environment Variables
# Chạy: .\add-env-auto.ps1

Write-Host "🔧 Thêm Environment Variables vào Vercel..." -ForegroundColor Green

# Biến 1
Write-Host "`nBiến 1: VITE_SUPABASE_URL" -ForegroundColor Cyan
Write-Host "https://edtxexnhpbipcecceoop.supabase.co" -ForegroundColor Yellow
$env:VITE_SUPABASE_URL = "https://edtxexnhpbipcecceoop.supabase.co"

# Biến 2
Write-Host "`nBiến 2: VITE_SUPABASE_ANON_KEY" -ForegroundColor Cyan
Write-Host "sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7" -ForegroundColor Yellow
$env:VITE_SUPABASE_ANON_KEY = "sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7"

Write-Host "`n✅ Environment Variables đã được set!" -ForegroundColor Green

# Deploy
Write-Host "`n🚀 Deploy lên Vercel..." -ForegroundColor Green
Write-Host "Nhập lệnh: vercel --prod" -ForegroundColor Yellow
Write-Host ""
Read-Host "Nhấn Enter để tiếp tục"

vercel --prod

Write-Host "`n✅ Xong! App của bạn đã update!" -ForegroundColor Green
