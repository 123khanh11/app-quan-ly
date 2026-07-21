-- AUTO SHIPPING ADDRESS TRIGGER
-- Tự động lấy shipping_address từ bảng addresses khi insert order
-- Chạy cái này trong Supabase SQL Editor

-- Bước 1: Tạo Function
CREATE OR REPLACE FUNCTION auto_shipping_address()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu user_id có, tìm địa chỉ mặc định từ bảng addresses
  IF NEW.user_id IS NOT NULL THEN
    SELECT address_full INTO NEW.shipping_address
    FROM addresses
    WHERE user_id = NEW.user_id AND is_default = true
    LIMIT 1;
  END IF;
  
  -- Nếu không có địa chỉ mặc định, để trống hoặc dùng giá trị mặc định
  IF NEW.shipping_address IS NULL THEN
    NEW.shipping_address := 'Chưa cập nhật địa chỉ';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bước 2: Tạo Trigger
DROP TRIGGER IF EXISTS trigger_auto_shipping_address ON orders;
CREATE TRIGGER trigger_auto_shipping_address
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION auto_shipping_address();

-- Bước 3: Test
-- INSERT INTO orders (user_id, total, shipping_fee, payment_method, order_status)
-- VALUES ('user-123', 500000, 30000, 'cod', 'pending');
-- Sẽ tự động lấy shipping_address từ addresses table
