-- ===================================
-- FIX ROW-LEVEL SECURITY (RLS)
-- Xóa policy cũ + Tạo mới
-- ===================================

-- DROP PRODUCTS POLICIES CŨ
DROP POLICY IF EXISTS "Allow all to read products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to delete products" ON products;

-- TẠO PRODUCTS POLICIES MỚI
CREATE POLICY "Allow authenticated to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all to read products"
ON products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to update products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete products"
ON products
FOR DELETE
TO authenticated
USING (true);

-- DROP CATEGORIES POLICIES CŨ
DROP POLICY IF EXISTS "Allow authenticated to insert categories" ON categories;
DROP POLICY IF EXISTS "Allow all to read categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated to update categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated to delete categories" ON categories;

-- TẠO CATEGORIES POLICIES MỚI
CREATE POLICY "Allow authenticated to insert categories"
ON categories
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all to read categories"
ON categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to update categories"
ON categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete categories"
ON categories
FOR DELETE
TO authenticated
USING (true);

-- DROP ORDERS POLICIES CŨ
DROP POLICY IF EXISTS "Allow all to read orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated to insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated to update orders" ON orders;

-- TẠO ORDERS POLICIES MỚI
CREATE POLICY "Allow all to read orders"
ON orders
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to insert orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to update orders"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DROP ORDER_ITEMS POLICIES CŨ
DROP POLICY IF EXISTS "Allow all to read order_items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated to insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated to update order_items" ON order_items;

-- TẠO ORDER_ITEMS POLICIES MỚI
CREATE POLICY "Allow all to read order_items"
ON order_items
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated to insert order_items"
ON order_items
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to update order_items"
ON order_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
