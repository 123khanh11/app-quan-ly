# 📚 HƯỚNG DẪN CHI TIẾT - SETUP TỪNG BƯỚC

## 🎯 MỤC TIÊU

Sau khi làm xong, bạn sẽ có:
- ✅ Thêm danh mục mới
- ✅ Thêm sản phẩm với hình ảnh
- ✅ Hiển thị ảnh sản phẩm trong danh sách

---

## 📖 PHẦN 1: FIX ROW-LEVEL SECURITY (RLS)

### Bước 1: Mở Supabase Dashboard

1. Mở trình duyệt (Chrome, Firefox, Edge)
2. Truy cập: **https://supabase.com/projects**
3. Bạn sẽ thấy danh sách projects

### Bước 2: Chọn Project

1. Tìm project với ID: **edtxexnhpbipcecceoop**
2. Hoặc tìm tên: **app_management** hoặc **quanly1**
3. Click vào để mở

### Bước 3: Mở SQL Editor

1. Bên cạnh trái, tìm menu
2. Nhấn **SQL Editor** (biểu tượng hình { })
3. Click **New Query** hoặc **Create new**

### Bước 4: Sao Chép Code

Sao chép **toàn bộ code này**:

```sql
-- CATEGORIES POLICIES
CREATE POLICY "Allow authenticated to insert categories"
ON categories
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all to read categories"
ON categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to update categories"
ON categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete categories"
ON categories
FOR DELETE
TO authenticated
USING (true);

-- PRODUCTS POLICIES
CREATE POLICY "Allow authenticated to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all to read products"
ON products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to update products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete products"
ON products
FOR DELETE
TO authenticated
USING (true);

-- ORDERS POLICIES
CREATE POLICY "Allow all to read orders"
ON orders
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to insert orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to update orders"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ORDER_ITEMS POLICIES
CREATE POLICY "Allow all to read order_items"
ON order_items
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to insert order_items"
ON order_items
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to update order_items"
ON order_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
```

### Bước 5: Paste Vào SQL Editor

1. Click vào khung trắng SQL Editor
2. Nhấn **Ctrl+A** để xóa code cũ (nếu có)
3. Nhấn **Ctrl+V** để paste code
4. Hoặc chuột phải → Paste

### Bước 6: Chạy Code

**Cách 1:** Click nút **▶ Run** (xanh lá, bên phải)

**Cách 2:** Nhấn **Ctrl+Enter** (hoặc Command+Enter trên Mac)

### Bước 7: Kiểm Tra Kết Quả

Bên dưới sẽ hiện:
- ✅ "Success" hoặc "Query executed"
- Không lỗi đỏ

✅ **XONG BƯỚC 1!**

---

## 📖 PHẦN 2: TẠO STORAGE BUCKET CHO ẢNH

### Bước 1: Vào Storage

1. Bên cạnh trái, nhấn **Storage** (biểu tượng hình hộp 📦)

### Bước 2: Tạo Bucket Mới

1. Click nút **Create new bucket** (xanh lá)
2. Hoặc tìm **+ New bucket**

### Bước 3: Điền Thông Tin

Trong dialog:

**Bucket name:**
```
product-images
```

**Privacy:** Chọn **Private** (hoặc Public)

### Bước 4: Tạo Bucket

Click **Create bucket**

✅ Thấy bucket `product-images` trong danh sách

### Bước 5: Setup Permissions

1. Click vào bucket **product-images**
2. Nhấn tab **Policies**
3. Click **New Policy** hoặc **+ Create Policy**

### Bước 6: Cấu Hình Policy

**Chọn Template:**
```
For authenticated users
```

**Hoặc chọn:**
- ✅ SELECT (Xem)
- ✅ INSERT (Thêm)
- ✅ UPDATE (Sửa)
- ✅ DELETE (Xóa)

**For:** Authenticated users

### Bước 7: Lưu Policy

Click **Create** hoặc **Save**

✅ **XONG BƯỚC 2!**

---

## 📖 PHẦN 3: THÊM COLUMN IMAGE VÀO DATABASE

### Bước 1: Quay Lại SQL Editor

1. Click **SQL Editor** (trái menu)
2. Click **New Query** hoặc tạo tab mới

### Bước 2: Sao Chép Lệnh

```sql
ALTER TABLE products ADD COLUMN image_url TEXT;
```

### Bước 3: Paste & Chạy

1. Paste code vào khung SQL
2. Click **▶ Run** hoặc **Ctrl+Enter**

✅ Thấy "Success"

✅ **XONG BƯỚC 3!**

---

## 📖 PHẦN 4: UPDATE CODE FLUTTER (LOCAL)

### Bước 1: Mở Terminal/PowerShell

1. Nhấn **Windows + R**
2. Gõ: `powershell`
3. Nhấn Enter

### Bước 2: Navigate Đến Project

```bash
cd "C:\Users\baomu\OneDrive\Documents\app quản ly"
```

Nhấn Enter

### Bước 3: Load Dependencies

```bash
flutter pub get
```

Nhấn Enter, chờ khoảng 30 giây

### Bước 4: Build Web

```bash
flutter clean
```

Nhấn Enter, chờ

Rồi:

```bash
flutter build web --release
```

Nhấn Enter, chờ khoảng 2-3 phút

✅ Thấy "Build complete"

✅ **XONG BƯỚC 4!**

---

## 📖 PHẦN 5: COPY ẢNH LÊN PRODUCTION

### Bước 1: Copy Folder public

```bash
xcopy /E /Y "build\web\*" "..\app_management\public\"
```

Nhấn Enter

### Bước 2: Kiểm Tra

Mở File Explorer:
```
C:\Users\baomu\OneDrive\Documents\app_management\public
```

Phải thấy:
- main.dart.js
- flutter.js
- assets folder
- icons folder
- ...

✅ **XONG BƯỚC 5!**

---

## 📖 PHẦN 6: DEPLOY LÊN VERCEL

### Bước 1: Mở Terminal

```bash
cd "C:\Users\baomu\OneDrive\Documents\app_management"
```

### Bước 2: Deploy

```bash
vercel deploy --prod --yes
```

Nhấn Enter, chờ khoảng 10-20 giây

### Bước 3: Kiểm Tra

Thấy:
```
✓ Ready in 10s
Production      https://appmanagement-xxx-quanly1.vercel.app
```

✅ **XONG BƯỚC 6!**

---

## 🎯 PHẦN 7: TEST APP

### Bước 1: Mở App

Truy cập: **https://appmanagement-six.vercel.app**

Hoặc URL từ bước 6

### Bước 2: Đăng Nhập

```
Email: admin@example.com
Password: password123
```

Click Login

### Bước 3: Thêm Danh Mục

1. Click **Danh Mục** (bên trái)
2. Click **+** (FAB xanh dưới phải)
3. Nhập:
   - **Tên danh mục:** Điện thoại
   - **Slug:** dien-thoai
4. Click **Lưu**

✅ Thấy "Thêm danh mục thành công"

### Bước 4: Thêm Sản Phẩm Có Ảnh

1. Click **Sản Phẩm**
2. Click **+**
3. **Nhấn vào khung hình** (trên cùng)
4. Chọn ảnh từ máy tính
5. Điền:
   - **Tên:** iPhone 15
   - **SKU:** IP15-001
   - **Danh mục:** Điện thoại
   - **Giá:** 20000000
   - **Mô tả:** Điện thoại thông minh
6. Click **Lưu sản phẩm**

✅ Thấy thumbnail ảnh trong danh sách

✅ **TẤT CẢ XONG!** 🎉

---

## 🚨 TẠI SAO LỖI?

### Lỗi 1: "Row violates row-level security policy"
**Nguyên nhân:** Chưa fix RLS

**Cách sửa:** Làm lại Phần 1

### Lỗi 2: "Cannot upload image"
**Nguyên nhân:** Bucket chưa tạo hoặc permission sai

**Cách sửa:** Làm lại Phần 2

### Lỗi 3: "Column image_url not found"
**Nguyên nhân:** Chưa add column

**Cách sửa:** Làm lại Phần 3

### Lỗi 4: "Cannot pick image on web"
**Nguyên nhân:** Bạn đang dùng web, có thể phải dùng URL

**Cách sửa:** Thay vì chọn ảnh, nhập link ảnh từ internet

### Lỗi 5: "Flutter build lỗi"
**Nguyên nhân:** Dependencies chưa load đủ

**Cách sửa:**
```bash
flutter clean
flutter pub get
flutter build web --release
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Chạy FIX_RLS_POLICIES.sql
- [ ] Tạo bucket product-images
- [ ] Add policy cho bucket
- [ ] Add column image_url
- [ ] flutter pub get
- [ ] flutter build web --release
- [ ] Copy to app_management/public
- [ ] vercel deploy --prod --yes
- [ ] Thêm danh mục OK
- [ ] Thêm sản phẩm + ảnh OK
- [ ] Hiển thị ảnh OK

---

## 💬 LƯU Ý

1. **Làm theo thứ tự** - Từ Phần 1 đến Phần 7
2. **Không bỏ bước** - Mỗi bước đều quan trọng
3. **Chờ đủ thời gian** - Build Flutter mất 1-3 phút
4. **Kiểm tra URL** - Deploy có thể mất 5-10 giây
5. **Làm cách trong Kiro** - Copy code từ file để đỡ lỗi

---

**Hãy làm từng bước, báo kết quả cho tôi! 💪**

Nếu stuck ở đâu, gửi ảnh lỗi + bước nào bị lỗi!
