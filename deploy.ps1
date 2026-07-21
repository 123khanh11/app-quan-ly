# ========================================
# DEPLOY SCRIPT - Vercel + Supabase
# ========================================

Write-Host "🚀 BẮTĐẦU DEPLOYMENT..." -ForegroundColor Green

# 1. Kiểm tra Git
Write-Host "`n📦 Kiểm tra Git..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git chưa được khởi tạo. Khởi tạo Git..." -ForegroundColor Yellow
    git init
    git config user.email "noreply@example.com"
    git config user.name "App User"
}

# 2. Add & Commit
Write-Host "`n📝 Commit code..." -ForegroundColor Cyan
git add .
git commit -m "Deploy to Vercel - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# 3. Check remote
Write-Host "`n🔗 Kiểm tra GitHub remote..." -ForegroundColor Cyan
$remoteUrl = git config --get remote.origin.url
if ([string]::IsNullOrEmpty($remoteUrl)) {
    Write-Host "❌ Chưa có GitHub remote. Vui lòng chạy:" -ForegroundColor Red
    Write-Host "   git remote add origin https://github.com/USERNAME/REPO.git" -ForegroundColor Yellow
    exit
}
Write-Host "✅ Remote: $remoteUrl" -ForegroundColor Green

# 4. Push to GitHub
Write-Host "`n⬆️  Push lên GitHub..." -ForegroundColor Cyan
git push -u origin main

# 5. Deploy Vercel
Write-Host "`n🌐 Deploy lên Vercel..." -ForegroundColor Cyan
Write-Host "Vui lòng vào: https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "Chọn project và click Deploy" -ForegroundColor Yellow

Write-Host "`n✅ HOÀN THÀNH!" -ForegroundColor Green
Write-Host "`n📊 Deployment Status:" -ForegroundColor Cyan
Write-Host "   ✓ Code đã push lên GitHub" -ForegroundColor Green
Write-Host "   ⏳ Vercel sẽ tự động deploy (2-3 phút)" -ForegroundColor Yellow
Write-Host "   🌐 URL: https://app-quan-ly.vercel.app" -ForegroundColor Green
