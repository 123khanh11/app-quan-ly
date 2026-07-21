# 📱 Hướng Dẫn Đăng Nhập và Sử Dụng Ứng Dụng

## 🎯 LÀ GÌ? ("Tài Khoản")

**Tài khoản** = Email + Mật khẩu để bạn đăng nhập vào ứng dụng

Nó được lưu trữ trên **Supabase** (máy chủ) giúp:
- ✓ Xác nhận bạn là ai
- ✓ Bảo vệ dữ liệu của bạn
- ✓ Lưu trữ thông tin cá nhân

---

## 📊 CÓ 2 PHẦN:

### Email
Ví dụ: `admin@example.com`
- Dùng để xác định tài khoản
- Phải là email thực (có @)

### Password (Mật khẩu)
Ví dụ: `password123`
- Bảo vệ tài khoản của bạn
- Phải nhớ, không ai biết được
- Tối thiểu 6 ký tự

---

## 🚀 CÁCH TẠO TÀI KHOẢN (NHANH NHẤT)

### Cách 1: Dùng SQL Script (2 phút) - KHUYẾN NGHỊ

#### Bước 1: Mở Supabase Dashboard
```
https://supabase.com/dashboard
```
→ Đăng nhập tài khoản Supabase của bạn
→ Chọn project của bạn

#### Bước 2: Vào SQL Editor
```
Menu bên trái → SQL Editor → + New Query
```

#### Bước 3: Copy SQL
Mở file: `SQL_TAO_TAI_KHOAN.sql`
→ Copy toàn bộ nội dung

#### Bước 4: Paste vào SQL Editor
- Xóa template hiện có
- Paste code SQL

#### Bước 5: Chạy Query
Click **Run** hoặc nhấn **Ctrl+Enter**

#### Bước 6: ✓ Hoàn thành!
Sẽ tạo 3 tài khoản test:
- admin@example.com
- staff@example.com
- user@example.com

---

### Cách 2: Sử dụng Dashboard UI (Thủ công)

#### Bước 1: Mở Authentication
```
Menu bên trái → Authentication → Users
```

#### Bước 2: Thêm User
```
Click: Add user
hoặc: Invite user
hoặc: Create new user
```

#### Bước 3: Điền Email
```
Email: admin@example.com
```

#### Bước 4: Điền Password
```
Password: password123
```

#### Bước 5: Lưu
```
Click: Save
hoặc: Create user
```

#### Bước 6: ✓ Hoàn thành!

---

## 📝 THÔNG TIN ĐĂNG NHẬP

Sau khi tạo, bạn có 3 tài khoản:

### Tài Khoản 1 - ADMIN
```
Email:    admin@example.com
Password: password123
Vai trò:  Quản trị viên
```

### Tài Khoản 2 - NHÂN VIÊN
```
Email:    staff@example.com
Password: staff123
Vai trò:  Nhân viên bán hàng
```

### Tài Khoản 3 - KHÁCH HÀNG
```
Email:    user@example.com
Password: user123
Vai trò:  Người mua hàng
```

---

## ✅ ĐĂNG NHẬP VÀO ỨNG DỤNG

### Bước 1: Mở Ứng Dụng
```
http://localhost:8000
```

### Bước 2: Nhập Email
```
admin@example.com
```

### Bước 3: Nhập Mật Khẩu
```
password123
```

### Bước 4: Click "Đăng Nhập"
```
[Đăng Nhập]
```

### Bước 5: ✓ Hoàn Thành!
Bạn sẽ vào Dashboard ứng dụng

---

## 🎮 SỬ DỤNG ỨNG DỤNG

Sau khi đăng nhập, bạn sẽ thấy:

### 📊 Dashboard
- Xem tổng quan doanh số
- Thống kê sản phẩm bán chạy
- Số đơn hàng hôm nay

### 🛍️ Sản Phẩm
- Xem danh sách sản phẩm
- Thêm sản phẩm mới
- Sửa thông tin sản phẩm
- Xóa sản phẩm

### 📦 Đơn Hàng
- Xem danh sách đơn hàng
- Xem chi tiết đơn hàng
- Cập nhật trạng thái

### 🏷️ Danh Mục
- Xem danh sách danh mục
- Thêm danh mục mới
- Sửa danh mục

### 👤 Tài Khoản
- Thông tin cá nhân
- Cài đặt
- **Đăng Xuất**

---

## ⚠️ LỖI THƯỜNG GẶP

### "Lỗi: Tài khoản không tồn tại"
**Nguyên nhân**: Chưa tạo tài khoản trên Supabase
**Giải pháp**: Tạo tài khoản theo hướng dẫn ở trên

### "Lỗi: Sai mật khẩu"
**Nguyên nhân**: Mật khẩu sai
**Giải pháp**: Kiểm tra lại mật khẩu

### "App hiển thị trắng"
**Nguyên nhân**: Lỗi loading
**Giải pháp**: 
- Refresh browser (F5)
- Xóa cache (Ctrl+Shift+Delete)
- Mở DevTools (F12) → Console

### "Email đã được sử dụng"
**Nguyên nhân**: Email đã tạo trước đó
**Giải pháp**: Dùng email khác

### "Lỗi kết nối Supabase"
**Nguyên nhân**: Credentials sai
**Giải pháp**:
- Kiểm tra SUPABASE_URL
- Kiểm tra SUPABASE_ANON_KEY

---

## 🔐 BẢNG DƯỜNG DẪN MẬT KHẨU

### ✅ MẬT KHẨU TỐT
- `MyShop@2024`
- `SecurePass#123`
- `Admin@Pass99`
- `Store2024Safe!`

**Đặc điểm:**
- 8+ ký tự
- Có chữ hoa, thường, số
- Có ký tự đặc biệt (@, #, !, ...)

### ❌ MẬT KHẨU KÉM
- `123456`
- `password`
- `admin123`
- `123123`

**Lý do:**
- Quá đơn giản
- Dễ đoán
- Không bảo mật

---

## 🆘 QUÊN MẬT KHẨU?

### Cách 1: Đặt lại trên Supabase Dashboard
```
1. Mở: https://supabase.com/dashboard
2. Authentication → Users
3. Tìm tài khoản
4. Click "..." → Reset password
5. Mật khẩu mới được gửi qua email
```

### Cách 2: Tạo tài khoản mới
```
Chỉ cần tạo tài khoản khác với email khác
```

---

## 📌 TIPS & TRICKS

### 💡 Tip 1: Sao chép email
Tránh nhầm lẫn bằng cách copy-paste email

### 💡 Tip 2: Ghi chép mật khẩu
Lưu mật khẩu ở nơi an toàn

### 💡 Tip 3: Đặt lại mật khẩu định kỳ
Thay đổi mật khẩu mỗi 3 tháng

### 💡 Tip 4: Không chia sẻ tài khoản
Mỗi người dùng có tài khoản riêng

---

## 📚 TÀI LIỆU LIÊN QUAN

- `SQL_TAO_TAI_KHOAN.sql` - SQL script để tạo tài khoản
- `TAO_TAI_KHOAN.md` - Hướng dẫn chi tiết
- `TAO_TAI_KHOAN_NHANH.md` - Cách nhanh nhất
- `HUONG_DAN_DANG_NHAP.md` - Hướng dẫn đăng nhập

---

## 🎉 TÓM TẮT

| Bước | Hành động |
|------|----------|
| 1 | Tạo tài khoản trên Supabase (email + password) |
| 2 | Mở ứng dụng: http://localhost:8000 |
| 3 | Nhập email |
| 4 | Nhập mật khẩu |
| 5 | Click "Đăng Nhập" |
| 6 | ✓ Vào được ứng dụng! |

---

## 🚀 BẮT ĐẦU NGAY

### 1️⃣ Tạo tài khoản
```
Mở: https://supabase.com/dashboard
Copy file: SQL_TAO_TAI_KHOAN.sql
Chạy SQL
```

### 2️⃣ Mở ứng dụng
```
http://localhost:8000
```

### 3️⃣ Đăng nhập
```
Email: admin@example.com
Password: password123
Click "Đăng Nhập"
```

### 4️⃣ Hoàn thành! 🎉
```
Bạn đã sử dụng được ứng dụng!
```

---

**Bạn đã sẵn sàng sử dụng ứng dụng! Chúc bạn thành công! 🎊**
