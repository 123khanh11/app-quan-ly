# 📝 Tài Khoản - Hướng Dẫn Không Lỗi

## 🎯 Tài Khoản Là Gì?

**Tài khoản** = Email + Mật khẩu để đăng nhập

---

## ⚡ Cách Nhanh (Nếu Gặp Lỗi)

### Bước 1: Xóa Tài Khoản Cũ

Chạy SQL này **trước**:
```sql
DELETE FROM auth.users WHERE email IN (
  'admin@example.com',
  'staff@example.com',
  'user@example.com'
);
```

### Bước 2: Tạo Tài Khoản Mới

**Sử dụng file**: `SQL_TAO_TAI_KHOAN_FIXED.sql`

- Copy toàn bộ nội dung
- Paste vào Supabase SQL Editor
- Click **Run**

✅ **Xong!**

---

## 📊 Thông Tin Đăng Nhập

```
👤 ADMIN
Email: admin@example.com
Password: password123

👤 NHÂN VIÊN
Email: staff@example.com
Password: staff123

👤 KHÁCH HÀNG
Email: user@example.com
Password: user123
```

---

## 🌐 Đăng Nhập Ứng Dụng

```
1. http://localhost:8000
2. Email: admin@example.com
3. Password: password123
4. Click Đăng Nhập
```

---

## 🆘 Nếu Vẫn Lỗi

### Cách B: Dùng Dashboard UI

```
1. https://supabase.com/dashboard
2. Authentication → Users
3. Xóa user cũ (click ... → Delete)
4. Click Add user
5. Email: admin@example.com
6. Password: password123
7. Click Save
```

---

## ✨ Thế Đó!

Bạn đã có tài khoản để đăng nhập! 🎉

---

**File liên quan:**
- `SQL_TAO_TAI_KHOAN_FIXED.sql`
- `SUA_LOI_SQL.md`
- `DANG_NHAP_VA_DUNG_APP.md`
