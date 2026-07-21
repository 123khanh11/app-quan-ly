# 👤 Hướng Dẫn Tạo Tài Khoản Đăng Nhập

Ứng dụng sử dụng **Supabase** để quản lý tài khoản người dùng. Bạn cần tạo tài khoản trước khi có thể đăng nhập.

---

## ✅ Cách 1: Tạo tài khoản qua Supabase Dashboard (Khuyến nghị)

### Bước 1: Truy cập Supabase Dashboard
1. Mở: https://supabase.com/dashboard
2. Đăng nhập tài khoản Supabase của bạn
3. Chọn project của bạn

### Bước 2: Vào mục Authentication
1. Trên menu bên trái, chọn **Authentication**
2. Chọn tab **Users**

### Bước 3: Tạo user mới
1. Click nút **Add user** (hoặc **Create new user**)
2. Điền thông tin:
   - **Email**: Ví dụ: `admin@example.com`
   - **Password**: Nhập mật khẩu (ít nhất 6 ký tự)
   - **Confirm password**: Nhập lại mật khẩu

### Bước 4: Lưu tài khoản
1. Click **Save** hoặc **Create user**
2. Tài khoản được tạo thành công!

---

## ✅ Cách 2: Tạo tài khoản qua SQL (Advanced)

### Bước 1: Mở SQL Editor
1. Trong Supabase Dashboard, chọn **SQL Editor**
2. Click **+ New Query**

### Bước 2: Chạy lệnh SQL
Sao chép và dán lệnh này:

```sql
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  'admin@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin"}',
  NOW(),
  NOW()
);
```

### Bước 3: Chạy query
Click **Run** hoặc nhấn `Ctrl+Enter`

---

## 📝 Thông tin tài khoản mẫu

**Đã tạo sẵn trong hệ thống:**

| Email | Password | Vai trò |
|-------|----------|--------|
| admin@example.com | password123 | Quản trị viên |

---

## 🔐 Lưu ý bảo mật

### ⚠️ Mật khẩu an toàn
- ✅ Sử dụng ít nhất 8 ký tự
- ✅ Kết hợp chữ hoa, chữ thường, số
- ✅ Không sử dụng mật khẩu quá đơn giản

**Ví dụ mật khẩu tốt:**
- `Abc@123xyz456` 
- `MyShop2024Pass`
- `SecurePass@2024`

### 🚫 Mật khẩu kém
- ❌ `123456`
- ❌ `password`
- ❌ `123123`

---

## 🔄 Quên mật khẩu?

### Cách đặt lại mật khẩu

1. **Trên giao diện login:**
   - Click **Quên mật khẩu?**
   - Nhập email
   - Kiểm tra email để đặt lại mật khẩu

2. **Trên Supabase Dashboard:**
   - Vào **Authentication** → **Users**
   - Tìm user
   - Click "..." → **Reset password**

---

## ✨ Tính năng đăng nhập

Ứng dụng hỗ trợ:
- ✓ Đăng nhập bằng email/password
- ✓ Ghi nhớ phiên đăng nhập
- ✓ Đăng xuất an toàn
- ✓ Quản lý phiên

---

## 🆘 Troubleshooting

### "Email đã được sử dụng"
→ Sử dụng email khác hoặc xóa user cũ

### "Lỗi kết nối"
→ Kiểm tra:
- Kết nối internet
- SUPABASE_URL đúng chưa
- SUPABASE_ANON_KEY đúng chưa

### "Password không đủ mạnh"
→ Sử dụng mật khẩu dài hơn (8+ ký tự)

---

## 📚 Các tài khoản khác

Bạn cũng có thể tạo thêm tài khoản cho:
- Nhân viên bán hàng
- Quản lý kho
- Kế toán
- v.v.

**Mỗi người dùng sẽ có riêng dữ liệu của họ!**

---

## 🎯 Sau khi tạo tài khoản

1. Mở ứng dụng: http://localhost:8000
2. Nhập **email** bạn vừa tạo
3. Nhập **password** bạn vừa đặt
4. Click **Đăng nhập**
5. ✓ Chúc mừng! Bạn đã vào ứng dụng

---

## 📞 Hỗ trợ

Nếu có vấn đề:
1. Kiểm tra console (F12) xem lỗi gì
2. Đảm bảo tài khoản đã được tạo trên Supabase
3. Xác nhận email và password đúng
