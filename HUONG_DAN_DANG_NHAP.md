# 🔐 Hướng Dẫn Đăng Nhập Ứng Dụng

Ứng dụng quản lý bán hàng yêu cầu tài khoản để đăng nhập. Dưới đây là các cách tạo tài khoản:

---

## 🚀 CÁCH NHANH NHẤT (Khuyến nghị)

### Bước 1: Sao chép SQL query
Mở file: `SQL_TAO_TAI_KHOAN.sql` (trong thư mục này)

### Bước 2: Mở Supabase Dashboard
1. Truy cập: https://supabase.com/dashboard
2. Đăng nhập tài khoản Supabase của bạn
3. Chọn project của bạn

### Bước 3: Vào SQL Editor
1. Menu bên trái: **SQL Editor**
2. Click: **+ New Query**
3. Xóa template hiện có

### Bước 4: Paste SQL
1. Mở file `SQL_TAO_TAI_KHOAN.sql`
2. Copy toàn bộ nội dung
3. Paste vào Supabase SQL Editor

### Bước 5: Chạy Query
1. Click nút **Run** (hoặc nhấn Ctrl+Enter)
2. Chờ kết quả

### Bước 6: Đăng nhập vào app
Sử dụng một trong các tài khoản:

```
👤 Tài khoản ADMIN
Email: admin@example.com
Password: password123

👤 Tài khoản NHÂN VIÊN
Email: staff@example.com
Password: staff123

👤 Tài khoản KHÁCH HÀNG
Email: user@example.com
Password: user123
```

---

## 📱 Cách thứ 2: Sử dụng Supabase Dashboard UI

### Bước 1: Mở Supabase
https://supabase.com/dashboard

### Bước 2: Chọn Authentication
Menu bên trái → **Authentication**

### Bước 3: Chọn Users
Tab: **Users**

### Bước 4: Thêm user
- Click: **Add user** 
- Hoặc: **Create new user**

### Bước 5: Điền thông tin
```
Email:    admin@example.com
Password: password123
```

### Bước 6: Lưu
Click: **Save** hoặc **Create user**

---

## 🔍 Kiểm tra tài khoản đã tạo

### Cách 1: Dashboard Supabase
1. Vào: **Authentication** → **Users**
2. Bạn sẽ thấy danh sách tất cả tài khoản

### Cách 2: SQL Query
Chạy lệnh này trong SQL Editor:
```sql
SELECT email, created_at, updated_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## ✅ Sau khi tạo tài khoản

### 1. Mở ứng dụng
http://localhost:8000

### 2. Nhập thông tin đăng nhập
- **Email**: admin@example.com
- **Password**: password123

### 3. Click "Đăng Nhập"

### 4. ✨ Hoàn thành!
Bạn sẽ vào dashboard ứng dụng

---

## 🎯 Tính năng sau khi đăng nhập

- 📊 **Dashboard**: Xem tổng quan doanh số, hàng tồn, v.v.
- 🛍️ **Sản phẩm**: Thêm, sửa, xóa sản phẩm
- 📦 **Đơn hàng**: Xem danh sách đơn hàng
- 🏷️ **Danh mục**: Quản lý danh mục sản phẩm
- 👤 **Tài khoản**: Thông tin cá nhân, đăng xuất

---

## ⚠️ Lỗi thường gặp

### "Lỗi: Tài khoản không tồn tại"
**Nguyên nhân**: Chưa tạo tài khoản
**Giải pháp**: Tạo tài khoản theo hướng dẫn ở trên

### "Lỗi: Sai mật khẩu"
**Nguyên nhân**: Mật khẩu sai
**Giải pháp**: Kiểm tra lại mật khẩu, hoặc đặt lại mật khẩu

### "App hiển thị trắng"
**Nguyên nhân**: Lỗi loading
**Giải pháp**: 
- Refresh browser (F5)
- Xóa cache (Ctrl+Shift+Delete)
- Mở DevTools (F12) → Console xem lỗi

### "Không kết nối được Supabase"
**Nguyên nhân**: Credentials sai
**Giải pháp**:
- Kiểm tra SUPABASE_URL
- Kiểm tra SUPABASE_ANON_KEY
- Đảm bảo có kết nối internet

---

## 🔐 Bảo mật

### Mật khẩu an toàn
✅ Sử dụng:
- Ít nhất 8 ký tự
- Kết hợp chữ hoa, chữ thường
- Có số và ký tự đặc biệt

❌ Tránh:
- `123456`
- `password`
- Quá đơn giản

### Ví dụ mật khẩu tốt
- `MyShop@2024`
- `SecurePass#123`
- `Admin@Pass99`

---

## 🆘 Cần hỗ trợ?

### Nếu vẫn không đăng nhập được:
1. Kiểm tra DevTools (F12) → Console
2. Đảm bảo tài khoản đã tạo trên Supabase
3. Xác nhận email/password đúng
4. Thử refresh browser

### Liên hệ
- Xem chi tiết ở: `TAO_TAI_KHOAN.md`
- SQL script: `SQL_TAO_TAI_KHOAN.sql`

---

## 📚 Tài liệu liên quan

- `TAO_TAI_KHOAN.md` - Chi tiết tạo tài khoản
- `TAO_TAI_KHOAN_NHANH.md` - Cách nhanh nhất
- `SQL_TAO_TAI_KHOAN.sql` - SQL script

---

**Bạn đã sẵn sàng đăng nhập! 🎉**

Mở: http://localhost:8000

Nhập tài khoản test:
- Email: `admin@example.com`
- Password: `password123`

Click "Đăng Nhập" ✓
