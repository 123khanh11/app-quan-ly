-- ========================================
-- INSERT TEST ORDERS WITH COMPLETE DATA
-- ========================================

DELETE FROM public.orders WHERE id IS NOT NULL;

INSERT INTO public.orders (
  id,
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
(
  gen_random_uuid(),
  NULL,
  1250000,
  50000,
  'cod',
  'pending',
  'pending',
  'Số 123 Đường Nguyễn Huệ, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  'Khách hàng: Trần Văn A | SĐT: 0912345678',
  NOW()
),
(
  gen_random_uuid(),
  NULL,
  850000,
  30000,
  'transfer',
  'completed',
  'completed',
  'Số 456 Đường Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh',
  'Khách hàng: Nguyễn Thị B | SĐT: 0987654321',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  NULL,
  2500000,
  75000,
  'cod',
  'pending',
  'processing',
  'Số 789 Đường Lê Lợi, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
  'Khách hàng: Phạm Văn C | SĐT: 0909999999',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  NULL,
  1500000,
  45000,
  'transfer',
  'pending',
  'shipped',
  'Số 321 Đường Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  'Khách hàng: Hoàng Văn D | SĐT: 0933333333 | Ghi chú: Hàng dễ vỡ',
  NOW() - INTERVAL '3 days'
),
(
  gen_random_uuid(),
  NULL,
  3200000,
  60000,
  'cod',
  'pending',
  'pending',
  'Số 654 Đường Đinh Tiên Hoàng, Phường Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
  'Khách hàng: Lê Văn E | SĐT: 0944444444',
  NOW() - INTERVAL '4 days'
);

-- ========================================
-- VERIFY
-- ========================================
SELECT 
  id,
  total,
  shipping_fee,
  order_status,
  payment_status,
  shipping_address,
  note,
  created_at
FROM public.orders
ORDER BY created_at DESC;

-- COUNT
SELECT COUNT(*) as total_orders FROM public.orders;
