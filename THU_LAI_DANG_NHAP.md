# 🔄 Thử Lại Đăng Nhập

## ⚡ Các Bước Nhanh

### 1️⃣ Refresh Browser

```
http://localhost:8000

Nhấn F5 (hoặc Ctrl+F5)
```

### 2️⃣ Mở DevTools Console

```
Nhấn F12
Click tab "Console"
```

### 3️⃣ Thử Đăng Nhập

```
Email: admin@example.com
Password: password123
Click "Đăng Nhập"
```

### 4️⃣ Xem Console Log

Nhìn console có message:

- ✅ **Thành công:**
  ```
  ✅ Login successful!
  ```

- ❌ **Lỗi:**
  ```
  ❌ Login error: [LỖI]
  ```

---

## 📋 Các Lỗi Phổ Biến

### Lỗi "Invalid login credentials"

```
❌ Invalid login credentials
```

**Cách sửa:**
1. Email sai?
   - Kiểm tra: admin@example.com
   
2. Password sai?
   - Kiểm tra: password123
   
3. Tài khoản có tồn tại?
   - Supabase Dashboard → Users
   - Xem có admin@example.com không?

### Lỗi "Provider error"

```
❌ Provider is not enabled
```

**Cách sửa:**
1. Vào Supabase Dashboard
2. Authentication → Providers
3. Bật "Email" provider

### Lỗi "Network error"

```
❌ Network error
❌ fetch failed
```

**Cách sửa:**
1. Kiểm tra internet
2. Kiểm tra Supabase URL
3. Kiểm tra Supabase Key

---

## ✓ Kiểm Tra

- [ ] Tài khoản có trong Supabase Users?
- [ ] Email nhập đúng?
- [ ] Password nhập đúng?
- [ ] DevTools Console xem error gì?
- [ ] Email Provider bật chưa?

---

## 💡 Mẹo

**Nếu vẫn lỗi:**
1. Tạo tài khoản mới
   - Xóa cái cũ
   - Tạo cái mới
   
2. Xem DevTools Console
   - Lỗi chính xác là gì?
   - Copy lỗi ghi lại

---

## 🚀 Bước Tiếp Theo

Sau khi đăng nhập thành công:
1. Bạn sẽ vào Dashboard
2. Xem các menu:
   - 📊 Dashboard
   - 🛍️ Sản phẩm
   - 📦 Đơn hàng
   - 🏷️ Danh mục

---

**Mở DevTools Console để xem lỗi chính xác! 🔍**
