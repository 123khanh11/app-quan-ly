-- ========================================
-- TỰ ĐỘNG CẬP NHẬT SHIPPING_ADDRESS KHI ĐẶT HÀNG
-- ========================================
-- Trigger này sẽ tự động thêm địa chỉ giao hàng khi order được tạo

-- 1. Nếu user có địa chỉ trong bảng addresses, lấy từ đó
-- Nếu không có, dùng địa chỉ mặc định

-- Cách 1: Tạo trigger tự động cập nhật shipping_address từ bảng addresses
CREATE OR REPLACE FUNCTION auto_update_shipping_address()
RETURNS TRIGGER AS $$
DECLARE
  addr_detail TEXT;
  addr_ward TEXT;
  addr_district TEXT;
  addr_province TEXT;
BEGIN
  -- Nếu user_id không null, lấy địa chỉ từ bảng addresses
  IF NEW.user_id IS NOT NULL THEN
    SELECT detail, ward, district, province INTO addr_detail, addr_ward, addr_district, addr_province
    FROM public.addresses
    WHERE user_id = NEW.user_id AND is_default = true
    LIMIT 1;
    
    -- Nếu có địa chỉ, gộp thành 1 chuỗi
    IF addr_detail IS NOT NULL THEN
      NEW.shipping_address = COALESCE(addr_detail, '') || ', ' || 
                             COALESCE(addr_ward, '') || ', ' ||
                             COALESCE(addr_district, '') || ', ' ||
                             COALESCE(addr_province, '');
    END IF;
  END IF;
  
  -- Nếu vẫn không có shipping_address, dùng địa chỉ mặc định
  IF NEW.shipping_address IS NULL OR NEW.shipping_address = '' THEN
    NEW.shipping_address = 'Địa chỉ sẽ được cập nhật sau';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Tạo trigger gắn với bảng orders
DROP TRIGGER IF EXISTS trigger_auto_shipping_address ON public.orders;

CREATE TRIGGER trigger_auto_shipping_address
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION auto_update_shipping_address();

-- ========================================
-- TEST
-- ========================================
-- Thêm 1 order test và xem shipping_address có tự động được cập nhật không

INSERT INTO public.orders (
  user_id,
  total,
  shipping_fee,
  payment_method,
  payment_status,
  order_status,
  note,
  created_at
) VALUES (
  NULL,
  500000,
  30000,
  'cod',
  'pending',
  'pending',
  'Test order - shipping address sẽ tự động cập nhật',
  NOW()
);

-- Xem kết quả
SELECT id, total, shipping_address, created_at 
FROM public.orders 
ORDER BY created_at DESC 
LIMIT 5;
