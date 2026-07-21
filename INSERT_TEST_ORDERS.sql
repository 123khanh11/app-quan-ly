-- ========================================
-- INSERT TEST DATA CHO ORDERS
-- ========================================
-- Để test app quản lý

-- 1. Insert test orders
INSERT INTO public.orders (
  user_id,
  total,
  shipping_fee,
  payment_method,
  payment_status,
  order_status,
  shipping_address,
  note,
  created_at
) VALUES
-- Order 1
(
  NULL,
  500000,
  30000,
  'cod',
  'pending',
  'pending',
  'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  'Email: khach1@example.com' || E'\n' || 'SĐT: 0912345678',
  NOW()
),
-- Order 2
(
  NULL,
  1200000,
  50000,
  'transfer',
  'completed',
  'completed',
  'Số 456 Nguyễn Huệ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
  'Email: khach2@example.com' || E'\n' || 'SĐT: 0987654321' || E'\n' || 'Ghi chú: Giao lúc 14h',
  NOW() - INTERVAL '3 days'
),
-- Order 3
(
  NULL,
  350000,
  25000,
  'cod',
  'pending',
  'processing',
  'Số 789 Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh',
  'Email: khach3@example.com' || E'\n' || 'SĐT: 0909999999',
  NOW() - INTERVAL '1 day'
),
-- Order 4
(
  NULL,
  750000,
  40000,
  'transfer',
  'pending',
  'shipped',
  'Số 321 Đinh Tiên Hoàng, Phường Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
  'Email: khach4@example.com' || E'\n' || 'SĐT: 0933333333' || E'\n' || 'Ghi chú: Hàng dễ vỡ',
  NOW() - INTERVAL '2 days'
),
-- Order 5
(
  NULL,
  900000,
  45000,
  'cod',
  'pending',
  'pending',
  'Số 654 Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  'Email: khach5@example.com' || E'\n' || 'SĐT: 0944444444',
  NOW() - INTERVAL '5 days'
);

-- ========================================
-- VERIFY
-- ========================================
SELECT 
  id,
  total,
  shipping_fee,
  payment_method,
  order_status,
  shipping_address,
  created_at
FROM public.orders 
ORDER BY created_at DESC 
LIMIT 10;

-- ========================================
-- STATS
-- ========================================
SELECT 
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN order_status = 'processing' THEN 1 END) as processing,
  COUNT(CASE WHEN order_status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN order_status = 'shipped' THEN 1 END) as shipped
FROM public.orders;
