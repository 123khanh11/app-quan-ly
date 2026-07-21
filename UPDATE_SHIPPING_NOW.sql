-- ========================================
-- CẬP NHẬT SHIPPING_ADDRESS NGAY BÂY GIỜ
-- ========================================

-- 1. Xem dữ liệu hiện tại
SELECT id, total, shipping_address, order_status FROM orders LIMIT 5;

-- 2. Cập nhật tất cả orders chưa có shipping_address
UPDATE orders 
SET shipping_address = 'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'
WHERE shipping_address IS NULL OR shipping_address = '';

-- 3. Kiểm tra kết quả
SELECT id, total, shipping_address, order_status FROM orders ORDER BY created_at DESC LIMIT 10;

-- 4. Đếm có bao nhiêu orders có shipping_address
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN shipping_address IS NOT NULL AND shipping_address != '' THEN 1 END) as orders_with_address,
  COUNT(CASE WHEN shipping_address IS NULL OR shipping_address = '' THEN 1 END) as orders_without_address
FROM orders;
