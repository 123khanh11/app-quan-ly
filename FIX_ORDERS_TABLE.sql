-- ========================================
-- FIX ORDERS TABLE
-- ========================================

-- 1. DROP trigger nếu tồn tại
DROP TRIGGER IF EXISTS trigger_auto_shipping_address ON public.orders;
DROP FUNCTION IF EXISTS auto_shipping_address();

-- 2. CHECK current structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';

-- 3. ALTER table - XÓA trường status (vì đã có order_status)
-- Nếu status chứa dữ liệu, copy sang order_status trước
UPDATE public.orders 
SET order_status = status 
WHERE order_status IS NULL AND status IS NOT NULL;

-- 4. DROP column status nếu tồn tại
ALTER TABLE public.orders 
DROP COLUMN IF EXISTS status;

-- 5. VERIFY orders table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 6. CHECK data
SELECT 
  id,
  total,
  order_status,
  payment_status,
  shipping_address,
  created_at
FROM public.orders
LIMIT 5;

-- 7. FIX RLS - Allow UPDATE order_status
DROP POLICY IF EXISTS "Orders: Enable update for authenticated" ON public.orders;

CREATE POLICY "Orders: Enable update for authenticated" 
ON public.orders 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 8. VERIFY RLS enabled
SELECT tablename FROM pg_tables 
WHERE tablename = 'orders' AND schemaname = 'public';

-- ========================================
-- DONE - Orders table fixed
-- ========================================
