-- ========================================
-- CHECK ORDERS TABLE & DATA
-- ========================================

-- 1. CHECK table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 2. CHECK data in orders
SELECT 
  id,
  user_id,
  total,
  shipping_fee,
  payment_method,
  payment_status,
  order_status,
  shipping_address,
  note,
  created_at
FROM public.orders
LIMIT 10;

-- 3. COUNT total orders
SELECT COUNT(*) as total_orders FROM public.orders;

-- 4. CHECK NULL values
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN total IS NULL THEN 1 END) as null_total,
  COUNT(CASE WHEN total IS NOT NULL THEN 1 END) as not_null_total,
  SUM(total) as sum_total,
  AVG(total) as avg_total,
  MIN(total) as min_total,
  MAX(total) as max_total
FROM public.orders;

-- 5. UPDATE NULL total to test value (if needed)
-- Uncomment this if total is NULL
-- UPDATE public.orders SET total = 1250000 WHERE total IS NULL;

-- 6. VERIFY after update
SELECT 
  id,
  total,
  order_status
FROM public.orders
ORDER BY created_at DESC
LIMIT 5;
