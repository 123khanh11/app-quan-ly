-- ⚠️ SUPABASE - CHẠY NGAY CÁI NÀY

-- BƯỚC 1: Xóa column stock_quantity (nếu tồn tại)
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;

-- BƯỚC 2: Xóa tất cả policies cũ
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to insert products" ON products;
DROP POLICY IF EXISTS "Allow all to read products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated to delete products" ON products;
DROP POLICY IF EXISTS "Allow public select products" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable select for all users" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

-- BƯỚC 3: Tạo policies mới
CREATE POLICY "products_insert_auth" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_update_auth" ON products FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "products_delete_auth" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Done!
