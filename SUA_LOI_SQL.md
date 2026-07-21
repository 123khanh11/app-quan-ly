# 🔧 Sửa Lỗi SQL: ON CONFLICT

## ❌ Lỗi Gặp Phải

```
ERROR: 42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification
```

**Nguyên nhân**: Bảng `auth.users` không có unique constraint trên email

---

## ✅ Giải Pháp

### Cách 1: Sử dụng File SQL Mới (Khuyến nghị)

**File mới**: `SQL_TAO_TAI_KHOAN_FIXED.sql`

Tôi đã sửa lỗi bằng cách:
1. Xóa `ON CONFLICT (email) DO NOTHING`
2. Thêm bước DELETE tài khoản cũ trước
3. Rồi INSERT tài khoản mới

**Các bước:**
1. Mở file: `SQL_TAO_TAI_KHOAN_FIXED.sql`
2. Copy toàn bộ nội dung
3. Paste vào Supabase SQL Editor
4. Click **Run**

✅ **Xong!** Tài khoản đã được tạo

---

### Cách 2: Xóa Tài Khoản Cũ Thủ Công

Nếu tài khoản cũ vẫn còn:

```sql
DELETE FROM auth.users WHERE email = 'admin@example.com';
DELETE FROM auth.users WHERE email = 'staff@example.com';
DELETE FROM auth.users WHERE email = 'user@example.com';
```

Rồi chạy lại SQL tạo tài khoản

---

### Cách 3: Dùng Dashboard UI (Dễ nhất)

1. **Authentication** → **Users**
2. Tìm tài khoản cũ
3. Click "..." → **Delete user**
4. Tạo user mới bằng nút **Add user**

---

## 📝 Chi Tiết Sửa Lỗi

### Lỗi Cũ:
```sql
INSERT INTO auth.users (...) VALUES (...)
ON CONFLICT (email) DO NOTHING;  ❌ Lỗi!
```

### Sửa Mới:
```sql
-- Bước 1: Xóa tài khoản cũ (nếu có)
DELETE FROM auth.users WHERE email = 'admin@example.com';

-- Bước 2: Insert tài khoản mới
INSERT INTO auth.users (...) VALUES (...);  ✅ OK!
```

---

## 🚀 Thử Lại

### Bước 1: Xóa Cũ

Chạy query này **trước**:
```sql
DELETE FROM auth.users WHERE email IN (
  'admin@example.com',
  'staff@example.com',
  'user@example.com'
);
```

### Bước 2: Tạo Mới

Rồi chạy query này:
```sql
INSERT INTO auth.users (...) VALUES (...);
```

---

## ✨ Tài Khoản Test

| Email | Password |
|-------|----------|
| admin@example.com | password123 |
| staff@example.com | staff123 |
| user@example.com | user123 |

---

## 📚 File Hướng Dẫn

- **SQL_TAO_TAI_KHOAN_FIXED.sql** - Script đã sửa
- **DANG_NHAP_VA_DUNG_APP.md** - Hướng dẫn đầy đủ

---

**Chúc bạn thành công!** ✓
