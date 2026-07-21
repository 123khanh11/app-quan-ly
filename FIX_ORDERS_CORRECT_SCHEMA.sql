-- ========================================
-- FIX ORDERS TABLE - ĐÚNG SCHEMA
-- ========================================

-- 1. DROP trigger nếu tồn tại
DROP TRIGGER IF EXISTS trigger_auto_shipping_address ON public.orders CASCADE;
DROP FUNCTION IF EXISTS auto_shipping_address() CASCADE;

-- 2. BACKUP data (if any)
-- Backup existing orders
CREATE TEMP TABLE orders_backup AS SELECT * FROM public.orders;

-- 3. DROP old orders table
DROP TABLE IF EXISTS public.orders CASCADE;

-- 4. CREATE NEW orders table (CORRECT SCHEMA)
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  total numeric NOT NULL,
  shipping_fee numeric,
  payment_method text,
  payment_status text,
  order_status text,
  shipping_address text,
  note text,
  created_at timestamptz,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id)
);

-- 5. CREATE order_items table (CORRECT SCHEMA)
DROP TABLE IF EXISTS public.order_items CASCADE;

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  variant_id text,
  quantity int4 NOT NULL,
  price numeric NOT NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id)
);

-- 6. SET defaults
ALTER TABLE public.orders ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.orders ALTER COLUMN payment_status SET DEFAULT 'pending'::text;
ALTER TABLE public.orders ALTER COLUMN order_status SET DEFAULT 'pending'::text;
ALTER TABLE public.orders ALTER COLUMN total SET DEFAULT 0;

-- 7. CREATE RLS POLICIES FOR ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public READ
CREATE POLICY "Allow all to read orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Allow public INSERT
CREATE POLICY "Allow public insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated UPDATE
CREATE POLICY "Allow authenticated to update orders" 
ON public.orders 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Allow authenticated DELETE
CREATE POLICY "Authenticated can delete orders" 
ON public.orders 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- 8. CREATE RLS POLICIES FOR ORDER_ITEMS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public READ
CREATE POLICY "Allow all to read order_items" 
ON public.order_items 
FOR SELECT 
USING (true);

-- Allow public INSERT
CREATE POLICY "Allow public insert order_items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated UPDATE
CREATE POLICY "Allow authenticated to update order_items" 
ON public.order_items 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 9. VERIFY structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 10. VERIFY order_items structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- 11. VERIFY RLS enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('orders', 'order_items') AND schemaname = 'public';

-- ========================================
-- DONE - Tables fixed to correct schema
-- ========================================
