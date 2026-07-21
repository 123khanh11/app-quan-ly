-- ===================================
-- CẤU TRÚC DATABASE (SCHEMA)
-- ===================================

-- 1. TABLE: CATEGORIES (Danh Mục)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLE: PRODUCTS (Sản Phẩm)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  sku TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  image_url TEXT,                    -- ← HÌNH ẢNH
  active BOOLEAN DEFAULT true,
  category_id UUID REFERENCES categories(id),
  brand_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABLE: ORDERS (Đơn Hàng)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',      -- pending, processing, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. TABLE: ORDER_ITEMS (Chi Tiết Đơn Hàng)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===================================
-- COLUMNS CHI TIẾT
-- ===================================

-- CATEGORIES:
-- ├── id (UUID) - Mã danh mục
-- ├── name (TEXT) - Tên danh mục
-- ├── slug (TEXT) - URL slug
-- ├── created_at (TIMESTAMP) - Ngày tạo
-- └── updated_at (TIMESTAMP) - Ngày cập nhật

-- PRODUCTS:
-- ├── id (UUID) - Mã sản phẩm
-- ├── name (TEXT) - Tên sản phẩm
-- ├── slug (TEXT) - URL slug
-- ├── sku (TEXT) - Mã SKU
-- ├── description (TEXT) - Mô tả
-- ├── price (DECIMAL) - Giá bán
-- ├── sale_price (DECIMAL) - Giá khuyến mãi
-- ├── image_url (TEXT) - ← LINK HÌNH ẢNH
-- ├── active (BOOLEAN) - Kích hoạt?
-- ├── category_id (UUID) - Danh mục
-- ├── brand_id (UUID) - Thương hiệu
-- ├── created_at (TIMESTAMP) - Ngày tạo
-- └── updated_at (TIMESTAMP) - Ngày cập nhật

-- ORDERS:
-- ├── id (UUID) - Mã đơn hàng
-- ├── order_number (TEXT) - Số đơn hàng
-- ├── customer_name (TEXT) - Tên khách
-- ├── customer_email (TEXT) - Email khách
-- ├── customer_phone (TEXT) - SĐT khách
-- ├── total_amount (DECIMAL) - Tổng tiền
-- ├── status (TEXT) - Trạng thái
-- ├── created_at (TIMESTAMP) - Ngày tạo
-- └── updated_at (TIMESTAMP) - Ngày cập nhật

-- ORDER_ITEMS:
-- ├── id (UUID) - Mã chi tiết
-- ├── order_id (UUID) - Đơn hàng
-- ├── product_id (UUID) - Sản phẩm
-- ├── quantity (INTEGER) - Số lượng
-- ├── price (DECIMAL) - Giá lúc đó
-- └── created_at (TIMESTAMP) - Ngày tạo

-- ===================================
-- RELATIONSHIPS (QUAN HỆ)
-- ===================================
-- products.category_id → categories.id (1 danh mục nhiều sản phẩm)
-- order_items.order_id → orders.id (1 đơn hàng nhiều chi tiết)
-- order_items.product_id → products.id (1 sản phẩm xuất hiện trong nhiều đơn)

-- ===================================
-- INDEX (ĐỂ TỐC ĐỘ TÌM KIẾM)
-- ===================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_order_items_order ON order_items(order_id);
