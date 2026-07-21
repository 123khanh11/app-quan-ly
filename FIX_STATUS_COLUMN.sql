-- FIX: Thêm 'status' column vào orders table
-- Chạy cái này trong Supabase SQL Editor

-- Bước 1: Thêm status column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Bước 2: Copy dữ liệu từ order_status sang status (nếu cần)
UPDATE orders SET status = order_status WHERE status IS NULL OR status = 'pending';

-- Bước 3: Kiểm tra
SELECT id, order_status, status FROM orders LIMIT 5;
