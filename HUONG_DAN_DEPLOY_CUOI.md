# 🚀 HƯỚNG DẪN DEPLOY LẦN CUỐI

## ✅ ĐÃ HOÀN THÀNH
- ✅ Tạo React app với địa chỉ giao hàng
- ✅ Build thành công vào folder `dist/`
- ✅ Environment variables đã được set trong Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

---

## 🎯 CÁCH 1: KÉ THẢ THƯMỤC `dist` (KHUYẾN NGHỊ)

### Bước 1: Mở thư mục dist
```
Thư mục đã được mở tự động
Hoặc vào: c:\Users\baomu\OneDrive\Documents\app quản ly\dist
```

### Bước 2: Vào Vercel Dashboard
```
https://vercel.com/quanly1/e-commerce-website-interface
```

### Bước 3: Redeploy
1. Click **"Deployments"** tab
2. Click vào deployment mới nhất
3. Click nút **"Redeploy"**
4. Chọn **"Redeploy with same build outputs"** hoặc **"Rebuild"**
5. Xong!

---

## 🎯 CÁCH 2: DEPLOY MỚI HOÀN TOÀN

### Bước 1: Vào Vercel New
```
https://vercel.com/new
```

### Bước 2: Kéo thả
- Kéo **toàn bộ nội dung** trong thư mục `dist/` vào Vercel
- KHÔNG kéo thư mục `dist` - chỉ kéo **nội dung bên trong**:
  - index.html
  - assets/
  - vite.svg (nếu có)

### Bước 3: Cấu hình (nếu cần)
Project Name: `order-management-app` (hoặc tên bất kỳ)

### Bước 4: Environment Variables
**QUAN TRỌNG:** Sau khi deploy, vào Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://edtxexnhpbipcecceoop.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
```

Environment: **Production**, **Preview**

### Bước 5: Redeploy
Sau khi thêm env vars:
1. Vào Deployments tab
2. Click deployment mới nhất
3. Click **"Redeploy"**

---

## 🔍 KIỂM TRA SAU KHI DEPLOY

### 1. Mở website
```
https://[your-app-name].vercel.app
```

### 2. Mở Developer Console (F12)
Kiểm tra:
- ✅ Không có lỗi đỏ
- ✅ Thấy log: "🔗 Supabase URL: https://edtxexnhpbipcecceoop.supabase.co"
- ✅ Thấy log: "🔑 Has Supabase Key: Yes"

### 3. Kiểm tra hiển thị
- ✅ Đơn hàng hiển thị
- ✅ **Địa chỉ giao hàng hiển thị đầy đủ:**
  - 🏙️ Tỉnh/Thành phố
  - 🏘️ Quận/Huyện
  - 🏘️ Xã/Phường
  - 🏠 Chi tiết

---

## ❓ NẾU VẪN KHÔNG HIỂN THỊ ĐỊA CHỈ

### Kiểm tra trong Console (F12):
```javascript
// Kiểm tra data từ Supabase
// Xem tab Network → orders request
```

### Kiểm tra database:
```sql
SELECT id, shipping_address 
FROM orders 
LIMIT 5;
```

Shipping address phải có format:
```
"Số 123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh"
```

---

## 📱 LIÊN HỆ HỖ TRỢ
Nếu vẫn có vấn đề, gửi:
1. URL của website đã deploy
2. Screenshot console (F12)
3. Screenshot phần địa chỉ không hiển thị
