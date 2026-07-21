-- ===================================
-- FIX ROW-LEVEL SECURITY (RLS)
-- ===================================
-- Chạy những câu lệnh này trong Supabase SQL Editor

-- 1. Cho phép bất kỳ người dùng xác thực thêm danh mục
CREATE POLICY "Allow authenticated to insert categories"
ON categories
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Cho phép ai cũng xem danh mục
CREATE POLICY "Allow all to read categories"
ON categories
FOR SELECT
TO public
USING (true);

-- 3. Cho phép người dùng sửa danh mục
CREATE POLICY "Allow authenticated to update categories"
ON categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Cho phép người dùng xóa danh mục
CREATE POLICY "Allow authenticated to delete categories"
ON categories
FOR DELETE
TO authenticated
USING (true);

-- ===================================
-- PRODUCTS POLICIES
-- ===================================

-- 1. Cho phép bất kỳ người dùng xác thực thêm sản phẩm
CREATE POLICY "Allow authenticated to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Cho phép ai cũng xem sản phẩm
CREATE POLICY "Allow all to read products"
ON products
FOR SELECT
TO public
USING (true);

-- 3. Cho phép người dùng sửa sản phẩm
CREATE POLICY "Allow authenticated to update products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Cho phép người dùng xóa sản phẩm
CREATE POLICY "Allow authenticated to delete products"
ON products
FOR DELETE
TO authenticated
USING (true);

-- ===================================
-- ORDERS POLICIES
-- ===================================

-- Cho phép ai cũng xem đơn hàng
CREATE POLICY "Allow all to read orders"
ON orders
FOR SELECT
TO public
USING (true);

-- Cho phép người dùng thêm đơn hàng
CREATE POLICY "Allow authenticated to insert orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Cho phép cập nhật đơn hàng
CREATE POLICY "Allow authenticated to update orders"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ===================================
-- ORDER_ITEMS POLICIES
-- ===================================

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

-- ===================================
-- HƯỚNG DẪN:
-- ===================================
-- 1. Mở Supabase Dashboard
-- 2. Vào SQL Editor
-- 3. Sao chép & dán đoạn code này
-- 4. Chạy (Run)
-- 5. Quay lại app, thử thêm danh mục
