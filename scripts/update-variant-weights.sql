-- Script cập nhật weight, length, width, height cho product_variants
-- Sửa các giá trị sau cho phù hợp với sản phẩm của bạn

-- Ví dụ 1: Cập nhật sản phẩm 100kg
UPDATE public.product_variants
SET 
  weight_kg = 100,           -- 100 kg
  length_cm = 50,            -- 50 cm
  width_cm = 40,             -- 40 cm
  height_cm = 30,            -- 30 cm
  updated_at = now()
WHERE 
  sku = 'YOUR_SKU_HERE'      -- Thay YOUR_SKU_HERE bằng SKU thực tế
  AND product_id = 'YOUR_PRODUCT_ID_HERE';  -- Hoặc thay bằng product_id

-- Kiểm tra kết quả
SELECT id, sku, color, size, weight_kg, length_cm, width_cm, height_cm, product_id
FROM public.product_variants
WHERE sku = 'YOUR_SKU_HERE'
ORDER BY created_at DESC;

-- Ví dụ 2: Nếu muốn cập nhật nhiều variants cùng 1 sản phẩm
UPDATE public.product_variants
SET 
  weight_kg = 100,
  length_cm = 50,
  width_cm = 40,
  height_cm = 30,
  updated_at = now()
WHERE 
  product_id = 'YOUR_PRODUCT_ID_HERE';

-- Ví dụ 3: Cập nhật tất cả variants có weight_kg = NULL
UPDATE public.product_variants
SET 
  weight_kg = COALESCE(weight_kg, 1.0),  -- Nếu NULL thì set = 1kg
  updated_at = now()
WHERE 
  weight_kg IS NULL;

-- Xem tất cả variants và weight của chúng
SELECT 
  product_id,
  sku,
  color,
  size,
  weight_kg,
  length_cm,
  width_cm,
  height_cm,
  stock,
  price,
  created_at
FROM public.product_variants
ORDER BY product_id, created_at DESC;
