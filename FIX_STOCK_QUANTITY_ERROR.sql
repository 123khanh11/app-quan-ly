-- FIX: "Could not find the 'stock_quantity' column of 'products'" error
-- This happens when Supabase schema cache is stale

-- SOLUTION 1: Clear schema cache (if you have admin access)
-- Run in Supabase SQL Editor:

-- Refresh schema
SELECT pg_catalog.pg_notify('supabase:schema_cache_cleared', 'products');

-- Alternative: Drop and recreate the RLS policies

-- Step 1: Drop old policies with stock_quantity reference
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;

-- Step 2: Create new clean policies (no stock_quantity references)
CREATE POLICY "Allow authenticated to insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all to read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated to update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Step 3: Verify no stock_quantity references in SELECT
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY column_name;

-- If stock_quantity still shows, you need to drop it:
-- ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;

-- Done! Try creating a product again.
