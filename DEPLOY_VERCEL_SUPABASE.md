# 🚀 HƯỚNG DẪN DEPLOY VERCEL + SUPABASE (Chi tiết)

## 📋 BƯỚC 1: Chuẩn Bị

### 1.1 Yêu cầu
- GitHub Account (https://github.com)
- Vercel Account (https://vercel.com) 
- Supabase Project (https://supabase.com)
- Node.js đã cài đặt

### 1.2 Kiểm tra Supabase Credentials
```
Vào: https://supabase.com → Chọn Project → Settings → API

Lấy 2 thông tin này:
- Project URL: https://edtxexnhpbipcecceoop.supabase.co
- anon public key: sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
```

---

## 🔧 BƯỚC 2: Setup Git & GitHub

### 2.1 Tạo Repository trên GitHub
1. Vào https://github.com/new
2. Tạo repo có tên: `app-quan-ly` (hoặc tên khác)
3. **Không** initialize với README
4. Click "Create repository"

### 2.2 Push Code lên GitHub

**Mở Terminal (PowerShell) và chạy:**

```powershell
# Vào thư mục project
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"

# Khởi tạo Git
git init

# Cấu hình Git (thay email và name)
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Thêm tất cả file
git add .

# Commit
git commit -m "Initial commit - Order Management App"

# Thêm remote URL (thay USERNAME/REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Đặt tên branch
git branch -M main

# Push lên GitHub
git push -u origin main
```

---

## 🌐 BƯỚC 3: Deploy lên Vercel

### 3.1 Kết nối GitHub với Vercel
1. Vào https://vercel.com
2. Đăng nhập (hoặc sign up with GitHub)
3. Click "New Project"
4. Chọn GitHub → Authorize Vercel
5. Chọn repository `app-quan-ly`

### 3.2 Cấu hình Build
**Nhập các thông tin sau:**

```
Framework Preset: Other
Build Command: npm install && npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Environment Variables
**Click "Environment Variables" và thêm:**

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://edtxexnhpbipcecceoop.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7` |

### 3.4 Deploy
Click "Deploy" → Chờ hoàn thành (khoảng 2-3 phút) ✅

**URL của bạn sẽ là:** `https://app-quan-ly.vercel.app`

---

## 📱 BƯỚC 4: Kiểm Tra Deployment

1. **Vào URL:** https://app-quan-ly.vercel.app
2. **Test chức năng:**
   - ✅ Xem danh sách đơn hàng
   - ✅ Xem chi tiết đơn hàng (địa chỉ, thanh toán)
   - ✅ Cập nhật trạng thái đơn hàng
   - ✅ Tìm kiếm đơn hàng

---

## 🔄 BƯỚC 5: Cập Nhật Code (nếu cần)

**Mỗi khi bạn thay đổi code:**

```powershell
# 1. Commit changes
git add .
git commit -m "Mô tả thay đổi"

# 2. Push lên GitHub
git push

# 3. Vercel sẽ tự động deploy (khoảng 2-3 phút)
```

---

## 🚨 Troubleshooting

### Lỗi: "Build failed"
- Kiểm tra `package.json` có tồn tại không
- Kiểm tra lệnh build có đúng không

### Lỗi: "Cannot find module"
- Chạy `npm install` trên máy local
- Push lại lên GitHub

### Lỗi: "Supabase connection failed"
- Kiểm tra Environment Variables đúng không
- Kiểm tra Supabase project có đang chạy không

---

## ✅ Hoàn Thành!

Ứng dụng của bạn đã được deploy trên Vercel + Supabase! 🎉

**Chia sẻ URL với team:**
```
https://app-quan-ly.vercel.app
```

