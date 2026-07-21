# 🚀 DEPLOY VERCEL - KHÔNG CẦN GITHUB

## 📋 BƯỚC 1: Chuẩn Bị Project

### 1.1 Kiểm tra `package.json`
Mở file `package.json` và kiểm tra:

```json
{
  "name": "app-quan-ly",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x"
  }
}
```

**Nếu không có `package.json`, tạo file mới!**

---

## 🌐 BƯỚC 2: Upload lên Vercel (Cách Dễ Nhất)

### Cách 1: Drag & Drop (Siêu Dễ)

1. **Vào:** https://vercel.com/upload
2. **Drag & Drop toàn bộ thư mục project vào:**
   ```
   c:\Users\baomu\OneDrive\Documents\app quản ly
   ```
3. **Vercel sẽ phát hiện tự động:**
   - ✓ Project type
   - ✓ Build command
   - ✓ Framework

4. **Thêm Environment Variables:**
   - Click "Environment Variables"
   - Thêm 2 biến:
     ```
     VITE_SUPABASE_URL = https://edtxexnhpbipcecceoop.supabase.co
     VITE_SUPABASE_ANON_KEY = sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
     ```

5. **Click "Deploy"**
6. **Chờ 2-3 phút** → URL sẽ hiện lên ✅

---

### Cách 2: Upload ZIP File

1. **Nén thư mục project:**
   - Click chuột phải vào: `app quản ly`
   - Chọn: `Send to → Compressed (zipped) folder`
   - Sẽ tạo file: `app quản ly.zip`

2. **Vào:** https://vercel.com/upload

3. **Kéo file `.zip` vào Vercel**

4. **Thêm Environment Variables** (như Cách 1)

5. **Deploy** ✅

---

## 📦 BƯỚC 3: Cấu Hình (Nếu Cần)

Nếu Vercel bảo lỗi, hãy cấu hình thủ công:

### Settings → Build & Development Settings:

```
Framework Preset: Vite
Build Command: npm install && npm run build
Output Directory: dist
Install Command: npm install
```

---

## ✅ BƯỚC 4: Kiểm Tra

**Vào URL được cấp (vd: https://app-quan-ly.vercel.app):**

- ✓ Trang load bình thường
- ✓ Xem danh sách đơn hàng
- ✓ Chi tiết đơn hàng (địa chỉ, giá)
- ✓ Cập nhật trạng thái

---

## 🆘 Nếu Gặp Lỗi

### Lỗi: Build Failed
**Kiểm tra:**
- [ ] `package.json` có tồn tại
- [ ] `npm install` chạy được trên máy local
- [ ] Environment Variables đúng

**Fix:**
1. Vào Vercel Dashboard
2. Project Settings
3. Build & Development
4. Xem logs để tìm lỗi

### Lỗi: "Cannot connect to Supabase"
- Kiểm tra Environment Variables chính xác
- Kiểm tra Supabase project còn hoạt động

### Lỗi: "404 - Page not found"
- Vercel chưa detect đúng output directory
- Vào Settings → Output Directory = `dist`

---

## 📝 Supabase Credentials

```
URL: https://edtxexnhpbipcecceoop.supabase.co
Key: sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
```

---

## 🎉 HOÀN THÀNH!

Ứng dụng đã live trên internet! 

**Chia sẻ URL:** `https://app-quan-ly.vercel.app`

