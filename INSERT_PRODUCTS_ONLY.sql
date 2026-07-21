-- ========================================
-- INSERT TEST PRODUCTS DATA ONLY
-- ========================================

-- 1. DELETE old products (if any)
DELETE FROM public.products WHERE sku IN ('IP15PM001', 'SGS24U001', 'MBP16M3001', 'DXPS15001', 'APP2001', 'AW9001', 'IPAD12M2001', 'SGB2P001');

-- 2. INSERT NEW PRODUCTS
INSERT INTO public.products (
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
  'iPhone 15 Pro Max',
  'iphone-15-pro-max',
  'IP15PM001',
  'Điện thoại flagship Apple 2024',
  29990000.00,
  25990000.00,
  true
),
-- Samsung Galaxy S24
(
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'SGS24U001',
  'Smartphone Android flagship',
  24990000.00,
  21990000.00,
  true
),
-- MacBook Pro
(
  'MacBook Pro 16 M3 Max',
  'macbook-pro-16-m3',
  'MBP16M3001',
  'Laptop chuyên nghiệp Apple',
  54990000.00,
  49990000.00,
  true
),
-- Dell XPS 15
(
  'Dell XPS 15',
  'dell-xps-15',
  'DXPS15001',
  'Laptop Windows cao cấp',
  35990000.00,
  31990000.00,
  true
),
-- AirPods Pro
(
  'Apple AirPods Pro 2',
  'airpods-pro-2',
  'APP2001',
  'Tai nghe không dây Apple',
  6990000.00,
  5990000.00,
  true
),
-- Apple Watch
(
  'Apple Watch Series 9',
  'apple-watch-series-9',
  'AW9001',
  'Đồng hồ thông minh Apple',
  9990000.00,
  8990000.00,
  true
),
-- iPad Pro
(
  'iPad Pro 12.9 M2',
  'ipad-pro-12-m2',
  'IPAD12M2001',
  'Máy tính bảng cao cấp',
  19990000.00,
  17990000.00,
  true
),
-- Samsung Galaxy Buds
(
  'Samsung Galaxy Buds2 Pro',
  'samsung-galaxy-buds2',
  'SGB2P001',
  'Tai nghe Samsung cao cấp',
  4990000.00,
  4290000.00,
  true
);

-- 3. VERIFY - Check inserted products
SELECT 
  id,
  name,
  sku,
  price,
  sale_price,
  active,
  created_at
FROM public.products 
WHERE sku IN ('IP15PM001', 'SGS24U001', 'MBP16M3001', 'DXPS15001', 'APP2001', 'AW9001', 'IPAD12M2001', 'SGB2P001')
ORDER BY created_at DESC;

-- 4. COUNT total products
SELECT COUNT(*) as total_products FROM public.products;

-- 5. STATS
SELECT 
  COUNT(*) as total,
  SUM(price) as total_price,
  AVG(price) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM public.products;
