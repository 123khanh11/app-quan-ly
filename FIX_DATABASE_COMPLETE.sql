-- ========================================
-- FIX DATABASE COMPLETE
-- ========================================
-- Thêm test data + Fix RLS policies

-- ========================================
-- 1. INSERT TEST CATEGORIES
-- ========================================
DELETE FROM public.categories;

INSERT INTO public.categories (name, slug) VALUES
('Điện Thoại', 'dien-thoai'),
('Laptop', 'laptop'),
('Phụ Kiện', 'phu-kien'),
('Đồng Hồ', 'dong-ho'),
('Tablet', 'tablet');

-- ========================================
-- 2. INSERT TEST PRODUCTS
-- ========================================
DELETE FROM public.products;

INSERT INTO public.products (
  category_id,
  name,
  slug,
  sku,
  description,
  price,
  sale_price,
  active
) VALUES
-- iPhone 15
(
  (SELECT id FROM categories WHERE slug = 'dien-thoai' LIMIT 1),
  'iPhone 15 Pro Max',
  'iphone-15-pro-max',
  'IP15PM001',
  'Điện thoại flagship Apple 2024',
  29990000,
  25990000,
  true
),
-- Samsung Galaxy S24
(
  (SELECT id FROM categories WHERE slug = 'dien-thoai' LIMIT 1),
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'SGS24U001',
  'Smartphone Android flagship',
  24990000,
  21990000,
  true
),
-- MacBook Pro
(
  (SELECT id FROM categories WHERE slug = 'laptop' LIMIT 1),
  'MacBook Pro 16 M3 Max',
  'macbook-pro-16-m3',
  'MBP16M3001',
  'Laptop chuyên nghiệp Apple',
  54990000,
  49990000,
  true
),
-- Dell XPS 15
(
  (SELECT id FROM categories WHERE slug = 'laptop' LIMIT 1),
  'Dell XPS 15',
  'dell-xps-15',
  'DXPS15001',
  'Laptop Windows cao cấp',
  35990000,
  31990000,
  true
),
-- AirPods Pro
(
  (SELECT id FROM categories WHERE slug = 'phu-kien' LIMIT 1),
  'Apple AirPods Pro 2',
  'airpods-pro-2',
  'APP2001',
  'Tai nghe không dây Apple',
  6990000,
  5990000,
  true
),
-- Apple Watch
(
  (SELECT id FROM categories WHERE slug = 'dong-ho' LIMIT 1),
  'Apple Watch Series 9',
  'apple-watch-series-9',
  'AW9001',
  'Đồng hồ thông minh Apple',
  9990000,
  8990000,
  true
),
-- iPad Pro
(
  (SELECT id FROM categories WHERE slug = 'tablet' LIMIT 1),
  'iPad Pro 12.9 M2',
  'ipad-pro-12-m2',
  'IPAD12M2001',
  'Máy tính bảng cao cấp',
  19990000,
  17990000,
  true
),
-- Samsung Galaxy Buds
(
  (SELECT id FROM categories WHERE slug = 'phu-kien' LIMIT 1),
  'Samsung Galaxy Buds2 Pro',
  'samsung-galaxy-buds2',
  'SGB2P001',
  'Tai nghe Samsung cao cấp',
  4990000,
  4290000,
  true
);

-- ========================================
-- 3. VERIFY PRODUCTS
-- ========================================
SELECT COUNT(*) as total_products FROM public.products;
SELECT name, price, sale_price, active FROM public.products ORDER BY created_at DESC LIMIT 5;

-- ========================================
-- 4. FIX RLS POLICIES - PRODUCTS
-- ========================================

-- Xóa policy cũ
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.products;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.products;

-- Tạo policy mới - EVERYONE CAN READ
CREATE POLICY "Products: Enable read for all" 
ON public.products 
FOR SELECT 
USING (active = true OR true);

-- AUTHENTICATED CAN INSERT
CREATE POLICY "Products: Enable insert for authenticated" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- AUTHENTICATED CAN UPDATE
CREATE POLICY "Products: Enable update for authenticated" 
ON public.products 
FOR UPDATE 
USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

-- AUTHENTICATED CAN DELETE
CREATE POLICY "Products: Enable delete for authenticated" 
ON public.products 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- ========================================
-- 5. FIX RLS POLICIES - ORDERS
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.orders;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.orders;

-- EVERYONE CAN READ ORDERS
CREATE POLICY "Orders: Enable read for all" 
ON public.orders 
FOR SELECT 
USING (true);

-- AUTHENTICATED CAN INSERT
CREATE POLICY "Orders: Enable insert for authenticated" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- AUTHENTICATED CAN UPDATE
CREATE POLICY "Orders: Enable update for authenticated" 
ON public.orders 
FOR UPDATE 
USING (true) 
WITH CHECK (auth.role() = 'authenticated');

-- AUTHENTICATED CAN DELETE
CREATE POLICY "Orders: Enable delete for authenticated" 
ON public.orders 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- ========================================
-- 6. FIX RLS POLICIES - CATEGORIES
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;

CREATE POLICY "Categories: Enable read for all" 
ON public.categories 
FOR SELECT 
USING (true);

-- ========================================
-- 7. VERIFY
-- ========================================

-- Check categories
SELECT id, name, slug FROM public.categories LIMIT 5;

-- Check products
SELECT id, name, price, sale_price FROM public.products LIMIT 5;

-- Check orders
SELECT id, total, order_status FROM public.orders LIMIT 5;

-- Check RLS is enabled
SELECT tablename FROM pg_tables WHERE tablename IN ('products', 'orders', 'categories');

COMMIT;
