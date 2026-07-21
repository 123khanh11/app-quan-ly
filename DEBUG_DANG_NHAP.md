# 🔍 Debug Lỗi Đăng Nhập

## 🎯 Tài khoản đã được tạo nhưng không thể đăng nhập?

Hãy làm theo hướng dẫn này để tìm nguyên nhân:

---

## BƯỚC 1: Refresh Browser

```
1. Mở: http://localhost:8000
2. Nhấn F5 (hoặc Ctrl+F5)
3. Đợi trang load hoàn toàn
```

---

## BƯỚC 2: Mở DevTools

```
Nhấn F12 (hoặc Ctrl+Shift+I)
```

Giao diện DevTools sẽ hiện lên với các tab:
- Elements
- Console  ← Click đây
- Sources
- v.v.

---

## BƯỚC 3: Xem Console Log

1. Click tab **Console**
2. Xóa log cũ (nếu có)

---

## BƯỚC 4: Thử Đăng Nhập

```
1. Email: admin@example.com
2. Password: password123
3. Click "Đăng Nhập"
```

---

## BƯỚC 5: Xem Lỗi Trong Console

Console sẽ hiện các message:

### ✅ Nếu THÀNH CÔNG:
```
🔐 Attempting login with email: admin@example.com
✅ Login successful! User: admin@example.com
```

### ❌ Nếu LỖI:
```
🔐 Attempting login with email: admin@example.com
❌ Login error: [LỖI]
📋 Error type: [LOẠI LỖI]
```

---

## 🆘 CÁC LỖI PHỔ BIẾN

### Lỗi 1: "Invalid login credentials"
```
❌ Lỗi: Invalid login credentials
```

**Nguyên nhân**: Email hoặc password sai

**Giải pháp**:
- Kiểm tra email đúng chưa?
- Kiểm tra password đúng chưa?
- Tài khoản có trong Supabase chưa?

### Lỗi 2: "Too many requests"
```
❌ Lỗi: Too many requests
```

**Nguyên nhân**: Thử đăng nhập quá nhiều lần

**Giải pháp**:
- Chờ vài phút
- Rồi thử lại

### Lỗi 3: "Network error"
```
❌ Lỗi: Network error / fetch failed
```

**Nguyên nhân**: Không kết nối được Supabase

**Giải pháp**:
- Kiểm tra internet
- Kiểm tra Supabase URL đúng chưa?
- Kiểm tra Supabase Key đúng chưa?

### Lỗi 4: "Provider error"
```
❌ Lỗi: Provider is not enabled
```

**Nguyên nhân**: Email/Password provider chưa được bật

**Giải pháp**:
- Vào Supabase Dashboard
- Authentication → Providers
- Bật Email provider

---

## 📋 KIỂM TRA DANH SÁCH

### ✓ Các bước để kiểm tra

- [ ] Tài khoản có tồn tại trên Supabase?
  - Supabase Dashboard → Authentication → Users
  - Xem email có trong danh sách không

- [ ] Email nhập đúng chưa?
  - Kiểm tra không có space ở đầu/cuối
  - Đúng chứ? admin@example.com

- [ ] Password nhập đúng chưa?
  - Kiểm tra không có space ở đầu/cuối
  - Đúng chứ? password123

- [ ] Internet có bình thường không?
  - Mở Google để kiểm tra
  - Refresh trang xem có load không

- [ ] Supabase credentials đúng không?
  - Kiểm tra trong web/index.html
  - SUPABASE_URL có đúng không?
  - SUPABASE_ANON_KEY có đúng không?

---

## 🔧 CÁCH KIỂM TRA SUPABASE CREDENTIALS

### Kiểm tra URL:

File: `web/index.html`

Tìm dòng:
```html
window.SUPABASE_URL = "https://edtxexnhpbipcecceoop.supabase.co";
```

So sánh với Supabase Dashboard:
- Vào Settings → API
- Kiểm tra URL đúng không?

### Kiểm tra Key:

File: `web/index.html`

Tìm dòng:
```html
window.SUPABASE_ANON_KEY = "sb_publishable_...";
```

So sánh với Supabase Dashboard:
- Vào Settings → API
- Kiểm tra Key đúng không?

---

## 💡 MẸO DEBUG

### 1. Xem Network Tab

DevTools → Network Tab → Xem requests:
```
POST https://edtxexnhpbipcecceoop.supabase.co/auth/v1/token
```

Nếu bị lỗi, xem response là gì

### 2. Xem Local Storage

DevTools → Application → Local Storage
```
key: sb_project_auth_token
```

Nếu có → đã đăng nhập thành công

### 3. Xem Cookies

DevTools → Application → Cookies
```
Kiểm tra auth cookie
```

---

## 📞 NẾU VẪN KHÔNG ĐƯỢC

### Cách 1: Tạo Tài Khoản Mới

Xóa tài khoản cũ + tạo tài khoản mới:

```
1. Supabase Dashboard → Authentication → Users
2. Tìm admin@example.com
3. Click ... → Delete user
4. Tạo user mới
```

### Cách 2: Kiểm Tra Email Provider

```
1. Supabase Dashboard
2. Authentication → Providers
3. Tìm "Email" / "Email Provider"
4. Bật nó (Enable)
```

### Cách 3: Reset Password

```
1. Supabase Dashboard → Users
2. Tìm user
3. Click ... → Reset password
4. Tạo mật khẩu mới
5. Thử đăng nhập lại
```

---

## 📝 BIỂU MẪU BÁOCÁO LỖI

Nếu vẫn gặp vấn đề, ghi lại:

```
❌ Lỗi: [LỖI]
📧 Email: admin@example.com
🔑 Password: password123
📍 URL: http://localhost:8000
🌐 Browser: [Tên trình duyệt]
🖥️ OS: Windows

Console log:
[DÁN NỘI DUNG CONSOLE TẠI ĐÂY]
```

---

## ✨ CHÚC BẠN THÀNH CÔNG!

Sau khi fixed, bạn sẽ thấy:
- ✅ Console log xanh
- ✅ Vào được dashboard
- ✅ Thấy menu sản phẩm, đơn hàng, v.v.

---

**Bất cứ lúc nào gặp lỗi, hãy mở DevTools Console xem! 🔍**
