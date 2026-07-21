-- ===================================
-- THÊM COLUMN HÌNH ẢNH VÀO DATABASE
-- ===================================

-- 1. Thêm column image_url vào table products
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Kiểm tra (chạy lệnh này để xem column đã thêm chưa)
-- SELECT column_name FROM information_schema.columns WHERE table_name='products';

-- ===================================
-- HƯỚNG DẪN:
-- ===================================
-- 1. Mở Supabase Dashboard
-- 2. Vào SQL Editor
-- 3. Copy code này
-- 4. Paste vào SQL Editor
-- 5. Click RUN
-- 6. Xong!

-- Sau đó:
-- - Thêm sản phẩm
-- - Nhập link ảnh: https://via.placeholder.com/400x300
-- - Ảnh sẽ hiển thị preview
-- - Lưu sản phẩm

-- ===================================
-- VÍ DỤ LINK ẢNH:
-- ===================================
-- https://via.placeholder.com/400x300?text=Sản+Phẩm
-- https://picsum.photos/400/300
-- https://images-na.ssl-images-amazon.com/...
