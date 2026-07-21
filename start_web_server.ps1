# Start Web Server cho Flutter Web App

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗"
Write-Host "║   Flutter Web Server - Khởi động                      ║"
Write-Host "╚════════════════════════════════════════════════════════╝"
Write-Host ""

# Kiểm tra xem build web tồn tại không
$webPath = "$PSScriptRoot\app_management\build\web"
if (-not (Test-Path "$webPath\index.html")) {
    Write-Host "❌ Lỗi: Web app chưa được build"
    Write-Host ""
    Write-Host "Vui lòng chạy các lệnh sau:"
    Write-Host "  1. cd app_management"
    Write-Host "  2. flutter build web --release"
    Write-Host ""
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

Write-Host "✓ Tìm thấy build web tại: $webPath"
Write-Host ""

# Thiết lập port
$port = 8000
Write-Host "🌐 Web Server sẽ chạy tại: http://localhost:$port"
Write-Host ""

# Di chuyển đến thư mục web
Set-Location $webPath

Write-Host "⏳ Đang khởi động server Python..."
Write-Host ""

# Kiểm tra xem Python được cài đặt không
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python: $pythonVersion"
} catch {
    Write-Host "❌ Python không được tìm thấy. Vui lòng cài đặt Python từ https://www.python.org/downloads/"
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════"
Write-Host "✓ Server đang chạy tại http://localhost:$port"
Write-Host "════════════════════════════════════════════════════════"
Write-Host "Nhấn Ctrl+C để dừng server"
Write-Host "════════════════════════════════════════════════════════"
Write-Host ""

# Mở browser tự động
try {
    Start-Process "http://localhost:$port"
} catch {
    Write-Host "ℹ️  Vui lòng mở browser tại: http://localhost:$port"
}

# Chạy server
python -m http.server $port --bind 127.0.0.1
