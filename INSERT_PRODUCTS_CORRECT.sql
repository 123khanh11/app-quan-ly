-- ========================================
-- INSERT PRODUCTS - DÙNG ĐÚNG CÁC TRƯỜNG
-- ========================================

-- 1. DELETE old products (optional)
DELETE FROM public.products WHERE sku IN ('IP15PM001', 'SGS24U001', 'MBP16M3001', 'DXPS15001', 'APP2001', 'AW9001', 'IPAD12M2001', 'SGB2P001');

-- 2. INSERT PRODUCTS (dùng đúng các trường từ bảng)
INSERT INTO public.products (
  id,
  category_id,
  brand_id,
  name,
  slug,
  sku,
  description,
  price,
  sale_price,
  active,
  image_url,
  image,
  created_at,
  updated_at
) VALUES
-- iPhone 15
(
  gen_random_uuid(),
  NULL,
  NULL,
  'iPhone 15 Pro Max',
  'iphone-15-pro-max',
  'IP15PM001',
  'Điện thoại flagship Apple 2024 với chip A17 Pro',
  29990000.00,
  25990000.00,
  true,
  'https://example.com/iphone15.jpg',
  NULL,
  NOW(),
  NOW()
),
-- Samsung Galaxy S24
(
  gen_random_uuid(),
  NULL,
  NULL,
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'SGS24U001',
  'Smartphone Android flagship 2024',
  24990000.00,
  21990000.00,
  true,
  'https://example.com/s24.jpg',
  NULL,
  NOW(),
  NOW()
),
-- MacBook Pro
(
  gen_random_uuid(),
  NULL,
  NULL,
  'MacBook Pro 16 M3 Max',
  'macbook-pro-16-m3',
  'MBP16M3001',
  'Laptop chuyên nghiệp Apple với M3 Max chip',
  54990000.00,
  49990000.00,
  true,
  'https://example.com/mbp16.jpg',
  NULL,
  NOW(),
  NOW()
),
-- Dell XPS 15
(
  gen_random_uuid(),
  NULL,
  NULL,
  'Dell XPS 15',
  'dell-xps-15',
  'DXPS15001',
  'Laptop Windows cao cấp 2024',
  35990000.00,
  31990000.00,
  true,
  'https://example.com/xps15.jpg',
  NULL,
  NOW(),
  NOW()
),
-- AirPods Pro
(
  gen_random_uuid(),
  NULL,
  NULL,
  'Apple AirPods Pro 2',
  'airpods-pro-2',
  'APP2001',
  'Tai nghe không dây Apple với ANC',
  6990000.00,
  5990000.00,
  true,
  'https://example.com/airpods.jpg',
  NULL,
  NOW(),
  NOW()
),
-- Apple Watch
(
  gen_random_uuid(),
  NULL,
  NULL,
  'Apple Watch Series 9',
  'apple-watch-series-9',
  'AW9001',
  'Đồng hồ thông minh Apple',
  9990000.00,
  8990000.00,
  true,
  'https://example.com/watch.jpg',
  NULL,
  NOW(),
  NOW()
),
-- iPad Pro
(
  gen_random_uuid(),
  NULL,
  NULL,
  'iPad Pro 12.9 M2',
  'ipad-pro-12-m2',
  'IPAD12M2001',
  'Máy tính bảng cao cấp Apple M2',
  19990000.00,
  17990000.00,
  true,
  'https://example.com/ipad.jpg',
  NULL,
  NOW(),
  NOW()
),
-- Samsung Galaxy Buds
(
  gen_random_uuid(),
  NULL,
  NULL,
  'Samsung Galaxy Buds2 Pro',
  'samsung-galaxy-buds2',
  'SGB2P001',
  'Tai nghe Samsung cao cấp',
  4990000.00,
  4290000.00,
  true,
  'https://example.com/buds.jpg',
  NULL,
  NOW(),
  NOW()
);

-- ========================================
-- 3. VERIFY
-- ========================================
SELECT 
  id,
  name,
  sku,
  price,
  sale_price,
  active,
  image_url,
  created_at,
  updated_at
FROM public.products 
WHERE sku IN ('IP15PM001', 'SGS24U001', 'MBP16M3001', 'DXPS15001', 'APP2001', 'AW9001', 'IPAD12M2001', 'SGB2P001')
ORDER BY created_at DESC;

-- ========================================
-- 4. COUNT & STATS
-- ========================================
SELECT COUNT(*) as total_products FROM public.products;

SELECT 
  COUNT(*) as total,
  SUM(price) as total_price,
  AVG(price) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM public.products
WHERE active = true;
