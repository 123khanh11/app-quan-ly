-- Check product prices in database
SELECT 
  id,
  name,
  price,
  sku,
  image_url,
  active,
  created_at
FROM products
LIMIT 10;

-- Check if any products have NULL price
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN price IS NULL THEN 1 END) as products_with_null_price,
  COUNT(CASE WHEN price = 0 THEN 1 END) as products_with_zero_price,
  MIN(price) as min_price,
  MAX(price) as max_price,
  AVG(price) as avg_price
FROM products;

-- Check variants
SELECT 
  id,
  product_id,
  price,
  color,
  size,
  sku
FROM product_variants
LIMIT 10;

-- Check if variants have prices
SELECT 
  COUNT(*) as total_variants,
  COUNT(CASE WHEN price IS NULL THEN 1 END) as variants_with_null_price,
  COUNT(CASE WHEN price = 0 THEN 1 END) as variants_with_zero_price
FROM product_variants;
