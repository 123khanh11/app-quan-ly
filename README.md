# 🛍️ Ứng dụng Quản Lý Bán Hàng

Ứng dụng Flutter quản lý bán hàng toàn diện kết nối với Supabase.

## 🚀 Bắt đầu nhanh

### Cách nhanh nhất (Windows)
1. Cài đặt Flutter: https://docs.flutter.dev/get-started/install/windows
2. Cấu hình file `.env` với thông tin Supabase của bạn
3. Chạy file `run.bat`

### Setup database
Xem file `SETUP_DATABASE.sql` và chạy trong Supabase SQL Editor.

### Hướng dẫn chi tiết
Xem file `HUONG_DAN_CAI_DAT.md` để biết chi tiết.

## Tính năng

- ✅ Đăng nhập/Đăng xuất
- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý danh mục
- ✅ Tìm kiếm sản phẩm

## Cài đặt

### 1. Cài đặt Flutter
Tải và cài đặt Flutter từ: https://docs.flutter.dev/get-started/install/windows

### 2. Cấu hình Supabase
1. Tạo file `.env` từ file mẫu:
```bash
copy .env.example .env
```

2. Cập nhật thông tin Supabase trong file `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Cài đặt dependencies
```bash
flutter pub get
```

### 4. Chạy ứng dụng

**Chạy trên web:**
```bash
flutter run -d chrome
```

**Hoặc build production:**
```bash
flutter build web
```

**Chạy trên mobile:**
```bash
flutter run
```

## Cấu trúc thư mục

```
lib/
├── config/          # Cấu hình Supabase
├── models/          # Models (Product, Order, Category...)
├── providers/       # State management với Provider
├── screens/         # Các màn hình UI
└── services/        # Services để gọi API Supabase
```

## Database Schema

Ứng dụng sử dụng schema database đã được cung cấp với các bảng:
- categories
- brands
- profiles
- products
- product_variants
- product_images
- addresses
- carts
- orders
- order_items
- reviews

## Build

### Android
```bash
flutter build apk
```

### Windows
```bash
flutter build windows
```

## Lưu ý

- Đảm bảo đã cấu hình đúng Supabase URL và Key
- Cần có tài khoản đăng nhập trong Supabase Auth
- Database tables cần được tạo trước khi sử dụng
