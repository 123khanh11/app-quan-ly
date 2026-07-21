# 🚀 Khởi Động Web Server cho Flutter Web App

Ứng dụng Flutter Web đã được build thành công! Bây giờ bạn cần khởi động một web server để chạy nó.

## Cách 1: Sử dụng Python (Khuyến nghị) ✓

### Bước 1: Mở PowerShell hoặc Command Prompt
```bash
cd "c:\Users\baomu\OneDrive\Documents\app_management\build\web"
```

### Bước 2: Chạy Python HTTP Server
```bash
python -m http.server 8000
```

**Hoặc sử dụng cổng khác:**
```bash
python -m http.server 3000
```

### Bước 3: Mở browser
Truy cập: **http://localhost:8000**

---

## Cách 2: Sử dụng Node.js http-server

### Bước 1: Cài đặt http-server (nếu chưa có)
```bash
npm install -g http-server
```

### Bước 2: Chạy server
```bash
http-server "c:\Users\baomu\OneDrive\Documents\app_management\build\web" -p 8000
```

### Bước 3: Mở browser
Truy cập: **http://localhost:8000**

---

## Cách 3: Sử dụng Live Server từ VS Code

1. Cài đặt extension **Live Server** cho VS Code
2. Click chuột phải vào file `index.html` trong thư mục `build/web`
3. Chọn **Open with Live Server**

---

## Các lệnh hữu ích

### Xem server đang chạy
```bash
netstat -ano | findstr :8000
```

### Dừng server
- Nhấn **Ctrl + C** trong terminal

### Rebuild lại web app
```bash
cd "c:\Users\baomu\OneDrive\Documents\app_management"
flutter build web --release
```

---

## Thông tin quan trọng

- **Build Folder**: `c:\Users\baomu\OneDrive\Documents\app_management\build\web`
- **URL mặc định**: http://localhost:8000
- **Port khuyến nghị**: 8000, 3000, 5000
- **Cần login**: Sử dụng tài khoản từ Supabase

---

## Troubleshooting

### "Port already in use" (Cổng đã được sử dụng)
```bash
# Sử dụng cổng khác
python -m http.server 3000
```

### "Python not found" (Python không được tìm thấy)
- Cài đặt Python từ https://www.python.org/downloads/
- Hoặc sử dụng **Cách 2** (Node.js)

### CORS Error
- Điều này là bình thường khi chạy locally
- Hầu hết các trình duyệt hiện đại hỗ trợ

---

**Để dừng server**: Nhấn **Ctrl + C** trong terminal
