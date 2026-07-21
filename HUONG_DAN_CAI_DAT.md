# Hướng Dẫn Cài Đặt và Chạy Ứng Dụng

## Bước 1: Cài đặt Flutter

### Tải Flutter SDK
1. Truy cập: https://docs.flutter.dev/get-started/install/windows
2. Tải file ZIP Flutter SDK (khoảng 1.5GB)
3. Giải nén vào thư mục `C:\src\flutter` (hoặc nơi bạn muốn)

### Thêm Flutter vào PATH
1. Mở **Start** → Tìm "Environment Variables"
2. Click **Environment Variables**
3. Trong **User variables**, tìm **Path** và click **Edit**
4. Click **New** và thêm: `C:\src\flutter\bin`
5. Click **OK** để lưu

### Kiểm tra cài đặt
Mở Command Prompt mới và chạy:
```bash
flutter doctor
```

### Cài đặt Chrome (nếu chưa có)
Flutter Web cần Chrome để chạy. Tải tại: https://www.google.com/chrome/

## Bước 2: Cấu hình Supabase

1. **Tạo file `.env`** (copy từ .env.example):
```bash
copy .env.example .env
```

2. **Lấy thông tin Supabase**:
   - Truy cập: https://supabase.com/dashboard
   - Chọn project của bạn
   - Vào **Settings** → **API**
   - Copy **URL** và **anon public key**

3. **Cập nhật file `.env`**:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Bước 3: Cài đặt dependencies

Trong thư mục project, chạy:
```bash
flutter pub get
```

## Bước 4: Chạy ứng dụng

### Chạy trên Web (Chrome)
```bash
flutter run -d chrome
```

### Chạy ở chế độ release (nhanh hơn)
```bash
flutter run -d chrome --release
```

### Build để deploy
```bash
flutter build web
```
File build sẽ nằm trong `build/web/`

## Bước 5: Tạo tài khoản đăng nhập

### Cách 1: Qua Supabase Dashboard
1. Vào **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Nhập email và password
4. Click **Create user**

### Cách 2: Qua SQL
Vào **SQL Editor** trong Supabase và chạy:
```sql
-- Tạo user mới
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'admin@example.com',
  crypt('password123', gen_salt('bf')),
  NOW()
);
```

## Khắc phục lỗi thường gặp

### Lỗi: "flutter is not recognized"
- Kiểm tra lại PATH
- Khởi động lại Command Prompt
- Chạy: `where flutter` để kiểm tra

### Lỗi: "No supported devices connected"
- Đảm bảo Chrome đã được cài đặt
- Chạy: `flutter devices` để xem danh sách thiết bị

### Lỗi: "Failed to load .env"
- Kiểm tra file .env có tồn tại không
- Đảm bảo SUPABASE_URL và SUPABASE_ANON_KEY đã được điền

### Lỗi kết nối Supabase
- Kiểm tra URL và Key có đúng không
- Kiểm tra kết nối internet
- Đảm bảo database tables đã được tạo

## Deploy lên Web Host

Sau khi build (`flutter build web`), upload folder `build/web/` lên:
- **Vercel**: Kéo thả folder vào vercel.com
- **Netlify**: Kéo thả folder vào netlify.com
- **Firebase Hosting**: `firebase deploy`
- **GitHub Pages**: Push lên gh-pages branch

## Các lệnh hữu ích

```bash
# Xem version Flutter
flutter --version

# Xem devices khả dụng
flutter devices

# Clean build
flutter clean

# Upgrade Flutter
flutter upgrade

# Chạy trên web với hot reload
flutter run -d chrome

# Build production
flutter build web --release

# Chạy tests
flutter test
```
