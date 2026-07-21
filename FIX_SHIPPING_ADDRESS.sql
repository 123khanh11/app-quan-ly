-- ========================================
-- CẬP NHẬT SHIPPING_ADDRESS CHO TẤT CẢ ORDERS
-- ========================================

-- 1. Xem dữ liệu hiện tại
SELECT id, user_id, shipping_address, created_at FROM orders LIMIT 10;

-- 2. Nếu shipping_address rỗng, cập nhật mặc định
UPDATE orders 
SET shipping_address = CASE 
  WHEN user_id IS NOT NULL THEN 
    'Xã: ' || (SELECT COALESCE(ward, 'Chưa có') FROM addresses WHERE user_id = orders.user_id LIMIT 1) || 
    ', Quận: ' || (SELECT COALESCE(district, 'Chưa có') FROM addresses WHERE user_id = orders.user_id LIMIT 1) ||
    ', Thành phố: ' || (SELECT COALESCE(province, 'Chưa có') FROM addresses WHERE user_id = orders.user_id LIMIT 1)
  ELSE 'Chưa có địa chỉ'
END
WHERE shipping_address IS NULL OR shipping_address = '';

-- 3. Hoặc đơn giản hơn, cập nhật tất cả orders chưa có địa chỉ với địa chỉ mẫu
UPDATE orders 
SET shipping_address = 'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'
WHERE shipping_address IS NULL OR shipping_address = '';

-- 4. Xác nhân kết quả
SELECT id, total, shipping_address, order_status, created_at 
FROM orders 
WHERE shipping_address IS NOT NULL AND shipping_address != ''
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Kiểm tra có bao nhiêu orders đã cập nhật
SELECT COUNT(*) as total_orders, 
       COUNT(CASE WHEN shipping_address IS NOT NULL AND shipping_address != '' THEN 1 END) as orders_with_address
FROM orders;
