# 📸 Hướng Dẫn: Thêm Hình Ảnh & Danh Mục

## 🎯 Những Gì Tôi Đã Làm

### 1. ✅ Fix RLS Permissions
- Tạo file `FIX_RLS_POLICIES.sql`
- Cho phép user thêm/sửa/xóa danh mục & sản phẩm

### 2. ✅ Thêm Image Upload
- Cập nhật `Product` model - thêm `imageUrl` field
- Cập nhật `ProductFormScreen` - thêm image picker
- Cập nhật `ProductService` - hàm upload image
- Cập nhật `ProductsScreen` - hiển thị thumbnail

### 3. ✅ Tạo UI thêm danh mục
- `CategoriesScreen` đã có form dialog
- Chỉ cần fix RLS là dùng được

---

## 🚀 BƯỚC SETUP (Làm Ngay)

### BƯỚC 1: Fix RLS Permissions

**Đi vào Supabase Dashboard:**

1. Mở: https://supabase.com/projects
2. Chọn project `edtxexnhpbipcecceoop`
3. Vào **SQL Editor** (bên trái)
4. Sao chép code từ `FIX_RLS_POLICIES.sql`
5. Paste vào SQL Editor
6. Click **Run** (hoặc Ctrl+Enter)

✅ Xong! Giờ permission đã được fix.

### BƯỚC 2: Setup Supabase Storage (Cho ảnh)

**Tạo bucket cho ảnh:**

1. Vào **Storage** (bên trái)
2. Click **Create new bucket**
3. Đặt tên: `product-images`
4. Chọn **Private** (hoặc Public nếu muốn public URL)
5. Click **Create bucket**

**Cấu hình permissions:**

1. Vào bucket `product-images`
2. Click tab **Policies**
3. Click **New Policy**
4. Chọn **For authenticated users**
5. Chọn **All operations** (SELECT, INSERT, UPDATE, DELETE)
6. Click **Save**

✅ Giờ có thể upload ảnh!

### BƯỚC 3: Update Database

**Thêm column `image_url` vào table `products`:**

1. Vào **SQL Editor**
2. Chạy lệnh này:

```sql
ALTER TABLE products ADD COLUMN image_url TEXT;
```

✅ Xong!

### BƯỚC 4: Get Dependencies

Mở Terminal trong project:

```bash
flutter pub get
```

✅ Done!

### BƯỚC 5: Rebuild & Test

```bash
flutter clean
flutter pub get
flutter build web --release
```

---

## ✨ THÊM DANH MỤC

### Cách dùng:

1. Mở app
2. Đăng nhập
3. Vào **Danh Mục** (Categories)
4. Click **+** (FAB)
5. Nhập tên: "Điện thoại"
6. Nhập slug: "dien-thoai"
7. Click **Lưu**

✅ Danh mục được thêm!

---

## 📸 THÊM HÌNH ẢNH SẢN PHẨM

### Cách dùng:

1. Mở app
2. Vào **Sản Phẩm**
3. Click **+** hoặc chỉnh sửa sản phẩm
4. **Nhấn vào hình ảnh** để chọn từ điện thoại
5. Chọn ảnh từ gallery
6. Điền thông tin sản phẩm
7. Click **Lưu sản phẩm**

✅ Hình ảnh được upload & lưu!

---

## 🔧 Nếu Có Lỗi

### Lỗi: "PostgrestException(message: row violates row-level security policy"
→ Fix: Chạy SQL từ `FIX_RLS_POLICIES.sql`

### Lỗi: "Lỗi upload hình ảnh"
→ Fix: Kiểm tra bucket `product-images` tồn tại

### Lỗi: "Không chọn được ảnh"
→ Fix: Cấp quyền camera & gallery cho app

---

## 📝 Files Đã Sửa

```
✅ lib/models/product.dart - Thêm imageUrl field
✅ lib/screens/product_form_screen.dart - Thêm image picker UI
✅ lib/screens/products_screen.dart - Hiển thị thumbnail
✅ lib/services/product_service.dart - Upload function
✅ FIX_RLS_POLICIES.sql - RLS permissions
```

---

## 🎉 Hoàn Thành!

Bây giờ bạn có thể:
- ✅ Thêm danh mục mới
- ✅ Thêm/sửa sản phẩm với hình ảnh
- ✅ Hiển thị ảnh trong danh sách

Nếu có câu hỏi, hãy nói! 🚀
