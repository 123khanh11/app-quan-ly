-- 1. Trước tiên, lấy danh sách tất cả sản phẩm để tìm ID
SELECT id, product_name, product_price 
FROM products 
LIMIT 10;

-- 2. Sau khi tìm được ID sản phẩm, hãy sử dụng một trong các query dưới đây
-- Lưu ý: Thay '6e88c5a1-f3c0-456e-9e1c-7d8bb3c0c9a0' bằng ID sản phẩm thực tế của bạn

-- ===== KHUYẾN MẠI 1: Giảm 10% khi mua từ 2 cái =====
INSERT INTO product_promotions (product_id, min_quantity, promotion_type, promotion_value, description)
VALUES ('THAY_ID_SAN_PHAM_O_DAY', 2, 'percentage_discount', 10, 'Giảm 10% khi mua từ 2 cái');

-- ===== KHUYẾN MẠI 2: Giảm 50,000₫ khi mua từ 5 cái =====
INSERT INTO product_promotions (product_id, min_quantity, promotion_type, promotion_value, description)
VALUES ('THAY_ID_SAN_PHAM_O_DAY', 5, 'fixed_discount', 50000, 'Giảm 50,000₫ khi mua từ 5 cái');

-- ===== KHUYẾN MẠI 3: Miễn phí ship khi mua từ 10 cái =====
INSERT INTO product_promotions (product_id, min_quantity, promotion_type, promotion_value, description)
VALUES ('THAY_ID_SAN_PHAM_O_DAY', 10, 'free_shipping', 0, 'Miễn phí ship khi mua từ 10 cái');

-- 3. Kiểm tra khuyến mại vừa tạo
SELECT * FROM product_promotions WHERE product_id = 'THAY_ID_SAN_PHAM_O_DAY';