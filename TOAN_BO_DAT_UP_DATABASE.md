# 🗄️ THIẾT LẬP DATABASE HOÀN CHỈNH

## 📋 CÁC FILE SQL CẦN CHẠY

### Bước 1: Tạo Bảng Orders (đã tạo)
```sql
-- File: DATABASE_SCHEMA.sql
-- Hoặc chạy trực tiếp SQL dưới đây
```

**SQL:**
```sql
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  total numeric(12, 2) NOT NULL DEFAULT 0,
  shipping_fee numeric(12, 2) NULL DEFAULT 0,
  payment_method text NULL,
  payment_status text NULL DEFAULT 'pending',
  order_status text NULL DEFAULT 'pending',
  shipping_address text NULL,
  note text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  status character varying(50) NULL DEFAULT 'pending',
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles (id)
);
```

---

### Bước 2: Tạo Bảng Products (MỚI)
```sql
-- File: CREATE_PRODUCTS_TABLE.sql
-- Chạy file này để tạo bảng hàng hóa
```

**SQL:**
```sql
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text NOT NULL UNIQUE,
  price numeric(12, 2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_products_sku ON products (sku);
CREATE INDEX idx_products_name ON products (name);
```

---

### Bước 3: Thêm Dữ Liệu Mẫu

**Orders mẫu:**
```sql
INSERT INTO public.orders (user_id, total, shipping_fee, payment_method, payment_status, order_status, shipping_address, note)
VALUES
  (NULL, 500000, 20000, 'COD', 'pending', 'pending', 'Số 123 Đường ABC, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', 'Giao vào buổi sáng'),
  (NULL, 750000, 20000, 'Transfer', 'paid', 'processing', 'Số 456 Đường XYZ, Phường 5, Quận 6, TP. Hồ Chí Minh', ''),
  (NULL, 300000, 15000, 'COD', 'pending', 'pending', 'Số 789 Đường PQR, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh', 'Để tại tủ ngoài cửa');
```

**Products mẫu:**
```sql
INSERT INTO public.products (name, sku, price, stock, description, category)
VALUES
  ('Áo Phông Nam Tay Ngắn', 'SKU001', 89000, 50, 'Áo phông cotton 100%', 'Áo thun'),
  ('Quần Jeans Nam Slim', 'SKU002', 299000, 35, 'Quần jeans phong cách', 'Quần'),
  ('Áo Khoác Gió Nam', 'SKU003', 199000, 20, 'Áo khoác chống gió', 'Áo khoác'),
  ('Giày Thể Thao Nam', 'SKU004', 599000, 15, 'Giày thể thao đế cao su', 'Giày'),
  ('Mũ Lưỡi Trai Nam', 'SKU005', 49000, 60, 'Mũ lưỡi trai cotton', 'Mũ');
```

---

## 🔄 QUẢN LÝ SHIPPING ADDRESS

### Format Lưu Trữ
```
"Chi tiết, Xã/Phường, Quận/Huyện, Tỉnh/Thành phố"
```

### Ví Dụ
```
"Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
```

### Cập Nhật Shipping Address
```sql
UPDATE public.orders
SET shipping_address = 'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'
WHERE id = 'ORDER_ID_HERE';
```

---

## 📊 THỐNG KÊ & KIỂM TRA

### Xem Tất Cả Orders
```sql
SELECT id, order_status, shipping_address, total, created_at 
FROM public.orders 
ORDER BY created_at DESC;
```

### Xem Tất Cả Products
```sql
SELECT id, name, sku, price, stock, category 
FROM public.products 
ORDER BY created_at DESC;
```

### Đếm Orders Theo Trạng Thái
```sql
SELECT order_status, COUNT(*) as count 
FROM public.orders 
GROUP BY order_status;
```

### Sản Phẩm Sắp Hết (tồn < 20)
```sql
SELECT name, sku, stock 
FROM public.products 
WHERE stock < 20 
ORDER BY stock ASC;
```

### Tổng Giá Trị Kho
```sql
SELECT SUM(price * stock) as total_value 
FROM public.products;
```

### Tổng Doanh Thu
```sql
SELECT SUM(total) as revenue 
FROM public.orders 
WHERE order_status = 'completed';
```

---

## 🔐 THIẾT LẬP RLS (ROW LEVEL SECURITY)

### Cho Orders
```sql
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read orders" 
ON public.orders FOR SELECT USING (true);

-- Authenticated users
CREATE POLICY "Allow authenticated write orders" 
ON public.orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update orders" 
ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');
```

### Cho Products
```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read products" 
ON public.products FOR SELECT USING (true);

-- Authenticated users
CREATE POLICY "Allow authenticated write products" 
ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update products" 
ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
```

---

## 📝 HƯỚNG DẪN CHẠY SQL TRÊN SUPABASE

### Cách 1: Qua Supabase Dashboard
1. Vào https://supabase.com
2. Login tài khoản
3. Chọn project
4. Click **SQL Editor**
5. Click **New Query** hoặc **+ New**
6. Copy-paste SQL script
7. Click **Run** hoặc **Ctrl+Enter**
8. Xem kết quả

### Cách 2: Qua Supabase CLI
```bash
# Login
supabase login

# Chạy SQL file
supabase db push CREATE_PRODUCTS_TABLE.sql
```

### Cách 3: Qua psql (nếu có PostgreSQL)
```bash
psql -h YOUR_DB_HOST -U YOUR_USER -d YOUR_DB < CREATE_PRODUCTS_TABLE.sql
```

---

## ✅ CHECKLIST SETUP DATABASE

- [ ] Tạo bảng `orders` (hoặc kiểm tra đã tồn tại)
- [ ] Tạo bảng `products`
- [ ] Enable RLS cho cả 2 bảng
- [ ] Tạo RLS policies
- [ ] Tạo indexes để tối ưu
- [ ] Thêm dữ liệu mẫu (orders + products)
- [ ] Kiểm tra dữ liệu hiển thị đúng
- [ ] Test thêm/sửa/xóa qua app

---

## 🔍 KIỂM TRA KẾT QUẢ

### Trong Supabase Dashboard
1. Vào **Table Editor**
2. Chọn bảng `products` hoặc `orders`
3. Xem dữ liệu đã được thêm vào

### Trong Ứng Dụng
1. Mở app Flutter hoặc truy cập web
2. Xem danh sách Orders → phải hiển thị dữ liệu
3. Xem danh sách Products → phải hiển thị dữ liệu
4. Kiểm tra địa chỉ giao hàng → phải tách thành chi tiết

---

## 🐛 KHẮC PHỤC SỰ CỐ

### Lỗi: "Relation does not exist"
**Giải pháp:** Chạy lại SQL để tạo bảng

### Lỗi: "Duplicate key value"
**Giải pháp:** SKU đã tồn tại, thay đổi SKU khác

### Dữ liệu không hiển thị
**Giải pháp:** 
1. Kiểm tra RLS policies
2. Kiểm tra app có kết nối internet
3. Kéo để làm mới (pull to refresh)

### Không thể thêm/sửa/xóa
**Giải pháp:**
1. Kiểm tra RLS policies cho authenticated users
2. Kiểm tra login trạng thái
3. Kiểm tra permissions

---

## 📚 TÀI LIỆU THAM KHẢO

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Policy Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Hoàn tất! Database đã sẵn sàng để sử dụng.** ✅
