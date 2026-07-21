# 👤 Tạo Tài Khoản & Đăng Nhập - Cách Đơn Giản

## ❓ Tài Khoản Là Gì?

**Tài khoản** = Email + Mật khẩu để đăng nhập vào ứng dụng

---

## ✅ CÁCH NHANH NHẤT (Dùng Dashboard UI)

### Bước 1: Mở Supabase Dashboard
```
https://supabase.com/dashboard
```

### Bước 2: Đăng nhập tài khoản Supabase

### Bước 3: Chọn Project
Chọn project của bạn

### Bước 4: Vào Authentication
```
Menu bên trái → Authentication
```

### Bước 5: Chọn Users Tab
```
Click tab "Users"
```

### Bước 6: Thêm User Mới
```
Click nút "Add user" 
hoặc "Invite user"
hoặc "Create new user"
```

### Bước 7: Điền Thông Tin

**Tùy chọn 1: Email + Password (Nhanh)**
```
Email: admin@example.com
Password: password123
```

**Tùy chọn 2: Send Invite (Email)**
```
Email: admin@example.com
(Gửi link qua email)
```

### Bước 8: Lưu User
```
Click "Save"
hoặc "Create user"
hoặc "Send invite"
```

### ✅ Hoàn Thành!
Tài khoản đã được tạo

---

## 📊 THÔNG TIN TEST

Tạo 3 tài khoản theo thứ tự:

### Tài Khoản 1 - ADMIN
```
Email: admin@example.com
Password: password123
```

### Tài Khoản 2 - NHÂN VIÊN
```
Email: staff@example.com
Password: staff123
```

### Tài Khoản 3 - KHÁCH HÀNG
```
Email: user@example.com
Password: user123
```

---

## 🌐 ĐĂNG NHẬP VÀO ỨNG DỤNG

### Bước 1: Mở Ứng Dụng
```
http://localhost:8000
```

### Bước 2: Nhập Email
```
admin@example.com
```

### Bước 3: Nhập Password
```
password123
```

### Bước 4: Click "Đăng Nhập"

### ✅ XONG!
Bạn đã vào ứng dụng! 🎉

---

## 📱 GỌI LẠI BƯỚC TẠO TÀI KHOẢN

**Nếu bạn quên bước nào:**

1. **Mở Supabase**
   - URL: https://supabase.com/dashboard

2. **Tìm Authentication**
   - Menu bên trái → Authentication

3. **Chọn Users**
   - Tab "Users"

4. **Thêm User**
   - Nút "Add user"

5. **Điền Email & Password**
   - Email: admin@example.com
   - Password: password123

6. **Lưu**
   - Click "Save"

7. **Đăng Nhập App**
   - URL: http://localhost:8000
   - Nhập email & password
   - Click "Đăng Nhập"

---

## 🆘 GẶP SỰ CỐ?

### "Không thể tạo user"
→ Kiểm tra:
- Email đúng format chưa? (có @)
- Password đủ dài chưa? (6+ ký tự)
- Project có setup chưa?

### "Lỗi SQL khi INSERT"
→ **KHÔNG dùng SQL INSERT!**
→ **Chỉ dùng Dashboard UI để tạo**

### "Không đăng nhập được"
→ Kiểm tra:
- Email đúng chưa?
- Password đúng chưa?
- Tài khoản có trong Users list chưa?

### "App trắng"
→ Cách khắc phục:
- Refresh browser (F5)
- Xóa cache (Ctrl+Shift+Delete)
- Mở DevTools (F12) xem console

---

## ✨ ĐÓ LÀ TẤT CẢ!

Bạn đã có tài khoản để đăng nhập vào ứng dụng! 🎊

### Tóm tắt 3 bước:

1. **Tạo tài khoản** trên Supabase Dashboard
   - Authentication → Users → Add user
   
2. **Mở ứng dụng** web
   - http://localhost:8000
   
3. **Đăng nhập** với email & password
   - Email: admin@example.com
   - Password: password123

✓ **Chúc bạn thành công!**

---

## 📚 TÀI LIỆU KHÁC

- `DANG_NHAP_VA_DUNG_APP.md` - Hướng dẫn đầy đủ
- `TAI_KHOAN_HUONG_DAN_NON.md` - Hướng dẫn ngắn
- `SUA_LOI_SQL.md` - Chi tiết lỗi SQL

---

**NHẮC NHỎ**: KHÔNG dùng SQL để tạo tài khoản!
Chỉ dùng **Dashboard UI** → **Authentication** → **Add user**
