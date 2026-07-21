# 🚀 LỆNH DEPLOYMENT CHÍNH XÁC

## ✅ BƯỚC 1: GitHub Setup

**Mở PowerShell tại thư mục project:**
```powershell
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"
```

**Khởi tạo Git:**
```powershell
git init
git config user.email "baomu@example.com"
git config user.name "Bao Mu"
```

**Tạo Initial Commit:**
```powershell
git add .
git commit -m "Initial commit - Order Management App"
```

**Thêm remote GitHub:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/app-quan-ly.git
```

**Push lên GitHub:**
```powershell
git branch -M main
git push -u origin main
```

---

## ✅ BƯỚC 2: Vercel Deployment

1. **Truy cập Vercel:**
   - https://vercel.com
   - Đăng nhập hoặc Sign up with GitHub

2. **New Project:**
   - Click "New Project"
   - Chọn "GitHub" từ menu
   - Authorize Vercel
   - Chọn repository: `app-quan-ly`

3. **Build Settings:**
   ```
   Framework Preset: Other
   Build Command: npm install && npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables:**
   ```
   VITE_SUPABASE_URL = https://edtxexnhpbipcecceoop.supabase.co
   VITE_SUPABASE_ANON_KEY = sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
   ```

5. **Deploy:**
   - Click "Deploy"
   - Chờ 2-3 phút
   - URL: `https://app-quan-ly.vercel.app`

---

## ✅ BƯỚC 3: Cập Nhật Sau (Push Changes)

**Mỗi lần thay đổi code:**
```powershell
# 1. Commit
git add .
git commit -m "Mô tả thay đổi của bạn"

# 2. Push
git push

# 3. Vercel sẽ tự động deploy
```

---

## ✅ BƯỚC 4: Kiểm Tra

**Vào URL và test:**
- https://app-quan-ly.vercel.app

**Kiểm tra chức năng:**
- ✓ Danh sách đơn hàng hiển thị
- ✓ Chi tiết đơn hàng (địa chỉ, giá, v.v)
- ✓ Cập nhật trạng thái
- ✓ Tìm kiếm đơn hàng

---

## 🆘 Nếu Gặp Lỗi

### Lỗi: "Build failed - Cannot find module"
```powershell
# Chạy local để test
npm install
npm run build

# Nếu lỗi, fix lỗi rồi push lại
git add .
git commit -m "Fix build error"
git push
```

### Lỗi: "Remote origin not found"
```powershell
# Check remote
git remote -v

# Nếu không có, thêm:
git remote add origin https://github.com/YOUR_USERNAME/app-quan-ly.git
```

### Lỗi: "Supabase connection failed"
- Vào Vercel Dashboard
- Chọn Project Settings
- Kiểm tra Environment Variables đúng không
- Redeploy nếu cần

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Docs: https://docs.github.com
