# 🚀 Cài Đặt Nhanh

## Bạn đã có Flutter! Còn 3 bước nữa:

### Bước 1: Cấu hình Supabase (2 phút)

1. **Truy cập Supabase Dashboard**: https://supabase.com/dashboard
2. **Tạo project mới** (nếu chưa có)
3. **Vào Settings → API**
4. **Copy thông tin:**
   - URL: `https://xxxxx.supabase.co`
   - anon/public key: `eyJhbGci...`

5. **Mở file `.env`** trong thư mục này và thay thế:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
```

### Bước 2: Setup Database (1 phút)

1. **Vào Supabase Dashboard → SQL Editor**
2. **Mở file `SETUP_DATABASE.sql`** trong project này
3. **Copy toàn bộ nội dung → Paste vào SQL Editor**
4. **Click "Run"**

### Bước 3: Chạy ứng dụng

**Cách 1: Dùng script tự động**
```bash
run.bat
```

**Cách 2: Chạy thủ công**
```bash
C:\src\flutter\bin\flutter pub get
C:\src\flutter\bin\flutter run -d chrome
```

## ✅ Xong! Ứng dụng sẽ mở trong Chrome

## 🔑 Tạo tài khoản đăng nhập

Trong Supabase Dashboard:
1. **Vào Authentication → Users**
2. **Click "Add user" → "Create new user"**
3. **Nhập email và password**
4. **Click "Create user"**

Dùng email/password này để đăng nhập vào ứng dụng!

## 📞 Cần giúp đỡ?

- Xem `HUONG_DAN_CAI_DAT.md` để biết chi tiết
- Xem `TINH_NANG.md` để xem danh sách tính năng
