-- FIX: "Could not find the 'stock_quantity' column of 'products'" error
-- This happens when Supabase schema cache is stale

-- STEP 1: Drop ALL old policies (if they exist)
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to insert products" ON products;
DROP POLICY IF EXISTS "Allow all to read products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to delete products" ON products;
DROP POLICY IF EXISTS "Allow public select products" ON products;

-- STEP 2: Create fresh clean policies (NO stock_quantity references)
CREATE POLICY "Enable insert for authenticated users only"
  ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for all users"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Enable update for authenticated users only"
  ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only"
  ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- STEP 3: Verify table columns (should NOT have stock_quantity)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY column_name;

-- STEP 4: If stock_quantity column exists, drop it
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;

-- STEP 5: RLS policies for product_variants (stock is stored here)
DROP POLICY IF EXISTS "Enable insert variants for authenticated" ON product_variants;
DROP POLICY IF EXISTS "Enable select variants for all" ON product_variants;
DROP POLICY IF EXISTS "Enable update variants for authenticated" ON product_variants;
DROP POLICY IF EXISTS "Enable delete variants for authenticated" ON product_variants;

CREATE POLICY "Enable insert variants for authenticated"
  ON product_variants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select variants for all"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Enable update variants for authenticated"
  ON product_variants FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete variants for authenticated"
  ON product_variants FOR DELETE
  USING (auth.role() = 'authenticated');

-- STEP 6: Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Done! Refresh browser and try creating a product again
