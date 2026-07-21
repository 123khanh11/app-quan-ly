# ========================================
# SETUP ENVIRONMENT VARIABLES - VERCEL
# ========================================

Write-Host "`n🔧 SETUP ENVIRONMENT VARIABLES`n" -ForegroundColor Green

# 1. Kiem tra Vercel
Write-Host "[1/4] Kiem tra Vercel CLI..." -ForegroundColor Cyan
$vercelCheck = vercel --version 2>$null
if ($null -eq $vercelCheck) {
    Write-Host "❌ Vercel CLI chua co - Cai dat..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI da cai dat" -ForegroundColor Green
}

# 2. Dang nhap
Write-Host "`n[2/4] Dang nhap Vercel..." -ForegroundColor Cyan
vercel login

# 3. Them bien 1
Write-Host "`n[3/4] Them VITE_SUPABASE_URL..." -ForegroundColor Cyan
Write-Host "Chon: Production" -ForegroundColor Yellow
Write-Host "Paste: https://edtxexnhpbipcecceoop.supabase.co" -ForegroundColor Yellow
Write-Host "Chon: No, I don't want to add to .env.local" -ForegroundColor Yellow
Read-Host "Nhan Enter sau khi san sang"
vercel env add VITE_SUPABASE_URL

# 4. Them bien 2
Write-Host "`n[4/4] Them VITE_SUPABASE_ANON_KEY..." -ForegroundColor Cyan
Write-Host "Chon: Production" -ForegroundColor Yellow
Write-Host "Paste: sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7" -ForegroundColor Yellow
Write-Host "Chon: No, I don't want to add to .env.local" -ForegroundColor Yellow
Read-Host "Nhan Enter sau khi san sang"
vercel env add VITE_SUPABASE_ANON_KEY

Write-Host "`n✅ SETUP THANH CONG!" -ForegroundColor Green
Write-Host "`n📝 Environment Variables da them" -ForegroundColor Cyan
Write-Host "`n🚀 Buoc tiep theo: Deploy" -ForegroundColor Green
Write-Host "   Lenh: vercel --prod" -ForegroundColor Yellow
