-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('products', 'product_variants');

-- Count products
SELECT COUNT(*) as total_products FROM products;

-- Count variants
SELECT COUNT(*) as total_variants FROM product_variants;

-- Show all products
SELECT id, name, price, image_url, created_at FROM products ORDER BY created_at DESC LIMIT 10;

-- Show all variants
SELECT id, product_id, color, size, sku, price, stock FROM product_variants ORDER BY created_at DESC LIMIT 20;

-- Check for products without variants
SELECT p.id, p.name, p.price, 
  (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id) as variant_count
FROM products p
ORDER BY p.name;

-- Show detailed variant data
SELECT 
  pv.id,
  pv.product_id,
  p.name as product_name,
  pv.color,
  pv.size,
  pv.sku,
  pv.price,
  pv.stock,
  pv.image_url,
  pv.is_active,
  pv.created_at
FROM product_variants pv
LEFT JOIN products p ON p.id = pv.product_id
ORDER BY p.name, pv.created_at;
