#!/usr/bin/env pwsh

Write-Host "🚀 Starting GHN API Server..." -ForegroundColor Green
Write-Host "This will run for 5 seconds to show startup output..." -ForegroundColor Yellow
Write-Host ""

$proc = Start-Process -FilePath "npm" -ArgumentList "run server" -PassThru
Start-Sleep -Seconds 5
$proc.Kill()

Write-Host ""
Write-Host "✅ Server test complete! If you saw environment variables above, all is good!" -ForegroundColor Green
Write-Host ""
Write-Host "To run server permanently:" -ForegroundColor Cyan
Write-Host "  npm run server" -ForegroundColor White
Write-Host ""
Write-Host "Then test in browser:" -ForegroundColor Cyan
Write-Host "  http://localhost:5000/api/ghn/province" -ForegroundColor White
