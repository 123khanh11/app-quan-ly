-- Enable RLS on order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for all users" ON public.order_items;
DROP POLICY IF EXISTS "Enable select for all users" ON public.order_items;
DROP POLICY IF EXISTS "Enable update for all users" ON public.order_items;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.order_items;
DROP POLICY IF EXISTS "Allow all access" ON public.order_items;

-- Policy 1: Allow anyone to INSERT order items
CREATE POLICY "Allow anonymous insert" ON public.order_items
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow anyone to SELECT order items
CREATE POLICY "Allow anonymous select" ON public.order_items
  FOR SELECT
  USING (true);

-- Policy 3: Allow authenticated users to UPDATE their own order items
CREATE POLICY "Allow update order items" ON public.order_items
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 4: Allow anyone to DELETE order items
CREATE POLICY "Allow delete order items" ON public.order_items
  FOR DELETE
  USING (true);

-- Verify policies were created
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'order_items'
ORDER BY policyname;