-- ========================================
-- ADD CUSTOMER EMAIL & PHONE FIELDS
-- ========================================
-- Copy & paste vào Supabase SQL Editor
-- Thêm các field để lưu thông tin khách hàng

-- 1. Thêm columns nếu chưa có
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- 2. Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('customer_email', 'customer_phone');

-- 3. Update test data (nếu cần)
-- UPDATE orders 
-- SET customer_email = 'test@example.com',
--     customer_phone = '0912345678'
-- WHERE customer_email IS NULL;
