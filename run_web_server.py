#!/usr/bin/env python3
"""
Chạy Web Server để phục vụ Flutter Web App
Đảm bảo dự án ở thư mục app_management
"""
import http.server
import socketserver
import os
import webbrowser
import time
from pathlib import Path

# Cấu hình
PORT = 8000
PROJECT_DIR = Path("c:/Users/baomu/OneDrive/Documents/app_management")
WEB_DIR = PROJECT_DIR / "build" / "web"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)
    
    def end_headers(self):
        # Thêm headers để hỗ trợ CORS và caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    print("\n" + "=" * 60)
    print("🚀 Flutter Web Server")
    print("=" * 60)
    print(f"📁 Serving from: {WEB_DIR}")
    print(f"🌐 URL: http://localhost:{PORT}")
    print("=" * 60)
    print("Nhấn Ctrl+C để dừng server")
    print("=" * 60)
    
    # Kiểm tra thư mục
    if not WEB_DIR.exists():
        print(f"\n❌ Lỗi: Thư mục {WEB_DIR} không tồn tại")
        print("Vui lòng chạy: flutter build web")
        return
    
    # Tạo server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        try:
            # Mở browser tự động sau 1 giây
            print("\n⏳ Đang khởi động server...\n")
            time.sleep(1)
            
            try:
                webbrowser.open(f"http://localhost:{PORT}")
                print(f"✓ Đã mở browser tại http://localhost:{PORT}\n")
            except:
                print(f"ℹ️  Vui lòng mở browser tại: http://localhost:{PORT}\n")
            
            # Chạy server
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server đã dừng")
            print("Cảm ơn bạn đã sử dụng Flutter Web App!")

if __name__ == "__main__":
    run_server()
