-- ========================================
-- CẬP NHẬT SHIPPING_ADDRESS CHO ORDERS
-- ========================================

-- 1. Kiểm tra xem có trường shipping_address không
-- Nếu không có, thêm nó
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_address TEXT;

-- 2. Cập nhật tất cả orders chưa có shipping_address
UPDATE public.orders 
SET shipping_address = 'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'
WHERE shipping_address IS NULL OR shipping_address = '';

-- 3. Xác nhân dữ liệu - kiểm tra xem có shipping_address không
SELECT 
  id,
  total,
  shipping_fee,
  shipping_address,
  order_status,
  created_at
FROM public.orders 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Thêm test data nếu cần
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
(
  NULL,
  500000,
  30000,
  'cod',
  'pending',
  'pending',
  'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  'Ghi chú: Email khach@example.com - SĐT: 0912345678',
  NOW()
);
