-- Check if products exist
SELECT COUNT(*) as total_products FROM products;

-- List first 5 products
SELECT id, name, price, sku, image_url FROM products LIMIT 5;

-- Check product_variants for these products
SELECT COUNT(*) as total_variants FROM product_variants;

-- Check if any products have variants
SELECT p.id, p.name, p.price, COUNT(v.id) as variant_count
FROM products p
LEFT JOIN product_variants v ON p.id = v.product_id
GROUP BY p.id, p.name, p.price
LIMIT 10;

-- Check products with images
SELECT id, name, image_url, price 
FROM products 
WHERE image_url IS NOT NULL 
LIMIT 5;
