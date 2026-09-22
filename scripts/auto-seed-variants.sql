-- Auto-create default variant for each product that doesn't have one
-- This ensures every product displays correctly

INSERT INTO product_variants (product_id, sku, color, size, price, stock, is_active)
SELECT 
  p.id,
  COALESCE(p.sku, 'DEFAULT-' || substr(p.id::text, 1, 8)),
  'Standard',
  'One Size',
  p.price,
  100,
  true
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_variants WHERE product_id = p.id
)
ON CONFLICT DO NOTHING;

-- Verify results
SELECT 
  COUNT(*) as total_products,
  (SELECT COUNT(*) FROM product_variants) as total_variants
FROM products;

-- Show products with their variants
SELECT 
  p.name,
  p.price,
  COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id
GROUP BY p.id, p.name, p.price
ORDER BY p.name;
