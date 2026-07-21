# 🚀 Triển Khai Lên Vercel - Ai Cũng Có Thể Truy Cập

## 🎯 Mục Tiêu

Sau khi deploy, ứng dụng sẽ:
- ✅ Có URL công khai (ví dụ: https://app-quan-ly.vercel.app)
- ✅ Bất kỳ máy tính nào cũng truy cập được
- ✅ Không cần chạy local server
- ✅ Tự động chạy 24/7

---

## 📋 BƯỚC 1: Chuẩn Bị

### 1.1 Cài Đặt Node.js
```
https://nodejs.org/
Tải & cài đặt LTS version
```

### 1.2 Cài Vercel CLI
```
npm install -g vercel
```

### 1.3 Kiểm Tra Cài Đặt
```
vercel --version
```

---

## 📁 BƯỚC 2: Tạo vercel.json

Tạo file `vercel.json` trong thư mục gốc:

```bash
cd "c:\Users\baomu\OneDrive\Documents\app_management"
```

Tạo file: `vercel.json`

```json
{
  "buildCommand": "echo 'Build already done'",
  "installCommand": "echo 'No dependencies'",
  "outputDirectory": "build/web",
  "env": {
    "VERCEL_ENV": "production"
  }
}
```

---

## 🚀 BƯỚC 3: Deploy

### 3.1 Mở Terminal

```
cd "c:\Users\baomu\OneDrive\Documents\app_management"
```

### 3.2 Chạy Lệnh Deploy

```
vercel
```

### 3.3 Trả Lời Câu Hỏi

```
? Set up and deploy "..." from "c:\Users\baomu\OneDrive\Documents\app_management"? (y/N)
→ Nhập: y

? Which scope do you want to deploy to?
→ Chọn scope của bạn (hoặc tạo mới)

? Link to existing project?
→ Nhập: n (tạo project mới)

? What's your project's name?
→ Nhập: app-quan-ly
(hoặc tên khác)

? In which directory is your code located?
→ Nhập: .

? Want to override the settings?
→ Nhập: n
```

### 3.4 Chờ Deploy

```
Vercel sẽ deploy...
```

### 3.5 ✅ Hoàn Thành!

```
✓ Deployed to: https://app-quan-ly.vercel.app
```

---

## 🌐 BƯỚC 4: Truy Cập

### Trên Máy Tính Bạn

```
https://app-quan-ly.vercel.app
```

### Trên Máy Tính Khác

```
https://app-quan-ly.vercel.app
```

### Trên Điện Thoại

```
https://app-quan-ly.vercel.app
```

✅ **Mọi người đều có thể truy cập!**

---

## 👤 ĐĂNG NHẬP

```
Email: admin@example.com
Password: password123
```

---

## 🔄 CẬP NHẬT ỨNG DỤNG

Nếu bạn sửa code:

```
1. flutter build web --release
2. vercel --prod
```

Vercel sẽ tự động cập nhật!

---

## 🆘 LỖI PHỔ BIẾN

### "Lỗi: Vercel không tìm thấy build folder"

**Giải pháp:**
```
1. Kiểm tra build/web tồn tại chưa?
2. Chắc bạn ở thư mục app_management?
3. Chạy: flutter build web --release
4. Thử lại: vercel --prod
```

### "Lỗi: 404 Not Found"

**Giải pháp:**
```
1. Kiểm tra vercel.json có đúng chưa?
2. outputDirectory phải là: "build/web"
3. Chạy lại: vercel --prod
```

### "Lỗi: Cannot GET /"

**Giải pháp:**
```
1. Cần tạo vercel.json
2. Thêm rewrites để Flutter routing hoạt động
```

---

## 📝 vercel.json Hoàn Chỉnh

Nếu gặp lỗi routing, dùng file này:

```json
{
  "version": 2,
  "public": true,
  "builds": [
    {
      "src": "build/web",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/js/(.*)",
      "dest": "/js/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/icons/(.*)",
      "dest": "/icons/$1"
    },
    {
      "src": "/canvaskit/(.*)",
      "dest": "/canvaskit/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## 💡 TIPS

### 1. Custom Domain
```
1. Mua domain (GoDaddy, Namecheap, v.v.)
2. Vercel → Settings → Domains
3. Thêm domain của bạn
```

### 2. Auto Deploy
```
1. Push code lên GitHub
2. Vercel tự động deploy
3. Mỗi lần push → Tự động cập nhật
```

### 3. Xem Logs
```
vercel logs
```

---

## 🎯 TÓM TẮT

| Bước | Hành Động |
|------|----------|
| 1 | Cài Node.js & Vercel CLI |
| 2 | Tạo vercel.json |
| 3 | Chạy: `vercel` |
| 4 | Truy cập URL công khai |

---

## ✨ SẢN PHẨM CUỐI CÙNG

```
🌐 URL Công Khai: https://app-quan-ly.vercel.app
👥 Ai cũng truy cập được
🔐 Login: admin@example.com / password123
📱 Dùng trên Desktop, Tablet, Mobile
🚀 Tự động chạy 24/7
```

---

**Bây giờ bắtđầu deploy! 🚀**

```
1. Cài Vercel CLI: npm install -g vercel
2. Tạo vercel.json
3. Chạy: vercel
4. Nhập thông tin
5. ✓ Hoàn thành!
```
