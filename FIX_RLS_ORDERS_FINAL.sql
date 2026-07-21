-- ========================================
-- FIX RLS POLICIES CHO ORDERS TABLE
-- ========================================
-- Copy & paste vào Supabase SQL Editor
-- Để cho phép app quản lý đọc/sửa orders

-- 1. DROP old policies (nếu có)
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated can update orders" ON public.orders;

-- 2. Tạo policies mới
-- ✅ Public read orders (cho app quản lý)
CREATE POLICY "Public can read orders" ON public.orders 
FOR SELECT USING (true);

-- ✅ Authenticated update orders
CREATE POLICY "Authenticated can update orders" ON public.orders 
FOR UPDATE USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

-- ✅ Authenticated insert orders
CREATE POLICY "Authenticated can insert orders" ON public.orders 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ✅ Authenticated delete orders (optional)
CREATE POLICY "Authenticated can delete orders" ON public.orders 
FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Order Items - tương tự
DROP POLICY IF EXISTS "Public can view order_items" ON public.order_items;

CREATE POLICY "Public can read order_items" ON public.order_items 
FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage order_items" ON public.order_items 
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

-- ========================================
-- TEST (chạy sau khi apply policies)
-- ========================================
-- SELECT id, shipping_address, order_status FROM orders LIMIT 5;
-- UPDATE orders SET order_status = 'processing' WHERE id = 'xxx';
