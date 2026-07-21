# ✅ SETUP HOÀN THÀNH

## 🎯 Những Gì Vừa Thêm Vào

### 1. **Fix RLS Permissions** ✅
- Cho phép thêm/sửa/xóa danh mục
- Cho phép thêm/sửa/xóa sản phẩm
- **File**: `FIX_RLS_POLICIES.sql`

### 2. **Thêm Hình Ảnh Sản Phẩm** ✅
- Upload hình từ gallery
- Lưu vào Supabase Storage
- Hiển thị thumbnail trong danh sách
- **Files**: 
  - `lib/models/product.dart` - Thêm `imageUrl`
  - `lib/screens/product_form_screen.dart` - UI upload
  - `lib/services/product_service.dart` - Upload logic

### 3. **UI Thêm Danh Mục** ✅
- Form dialog để thêm/sửa danh mục
- Đã có sẵn, chỉ cần fix RLS
- **File**: `lib/screens/categories_screen.dart`

---

## 🚀 LÀM NGAY (3 BƯỚC)

### BƯỚC 1: Fix RLS (Quan Trọng!)

```
1. Mở: https://supabase.com/projects
2. Chọn project: edtxexnhpbipcecceoop
3. Vào: SQL Editor
4. Sao chép code từ FIX_RLS_POLICIES.sql
5. Paste vào SQL Editor
6. Click RUN
```

### BƯỚC 2: Setup Storage

```
1. Vào: Storage
2. Click: Create new bucket
3. Tên: product-images
4. Loại: Private
5. Click: Create
6. Vào Policies: Add policy for authenticated users
```

### BƯỚC 3: Add Column

```
1. Vào: SQL Editor
2. Chạy: ALTER TABLE products ADD COLUMN image_url TEXT;
```

---

## 💻 RUN APP

```bash
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"
flutter pub get
flutter build web --release
```

---

## 🎯 TEST

### Thêm Danh Mục

1. Mở app
2. Vào **Danh Mục**
3. Click **+**
4. Nhập tên, slug
5. Click **Lưu**

### Thêm Sản Phẩm Có Ảnh

1. Mở app
2. Vào **Sản Phẩm**
3. Click **+**
4. **Nhấn vào khung hình** để upload ảnh
5. Chọn ảnh từ máy
6. Điền thông tin
7. Click **Lưu sản phẩm**

---

## ⚡ LƯU Ý QUAN TRỌNG

- **Phải fix RLS trước!** Không thì vẫn lỗi 42501
- **Phải tạo bucket** `product-images` cho upload ảnh
- **Phải add column** `image_url` vào products table
- **Chạy** `flutter pub get` để load dependencies

---

## 📞 Nếu Có Lỗi

| Lỗi | Giải Pháp |
|-----|----------|
| Row-level security policy | Chạy `FIX_RLS_POLICIES.sql` |
| Cannot upload image | Kiểm tra bucket `product-images` |
| Column not found | Chạy `ALTER TABLE products ADD COLUMN image_url TEXT;` |
| Cannot pick image | Cấp quyền gallery cho app |

---

**Hãy làm ngay các bước trên, sau đó thử app!** 🚀

Báo cho tôi nếu có lỗi!
