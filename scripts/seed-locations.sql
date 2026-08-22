-- Clear existing data
DELETE FROM public.ghn_wards;
DELETE FROM public.ghn_districts;
DELETE FROM public.ghn_provinces;

-- Insert provinces
INSERT INTO public.ghn_provinces (province_id, province_name, province_name_en, is_active) VALUES
(1, 'Hà Nội', 'Ha Noi', true),
(58, 'TP. Hồ Chí Minh', 'Ho Chi Minh City', true),
(48, 'Đà Nẵng', 'Da Nang', true),
(40, 'Hải Phòng', 'Hai Phong', true);

-- Insert districts
INSERT INTO public.ghn_districts (province_id, district_id, district_name, district_name_en, support_type, is_active) VALUES
-- Hà Nội
(1, 1, 'Hoàn Kiếm', 'Hoan Kiem', 1, true),
(1, 2, 'Ba Đình', 'Ba Dinh', 1, true),
(1, 3, 'Tây Hồ', 'Tay Ho', 1, true),
(1, 4, 'Long Biên', 'Long Bien', 1, true),
(1, 1455, 'Hà Đông', 'Ha Dong', 1, true),
(1, 1456, 'Thanh Trì', 'Thanh Tri', 1, true),
-- TP. HCM
(58, 1, 'Quận 1', 'District 1', 1, true),
(58, 3, 'Quận 3', 'District 3', 1, true),
(58, 4, 'Quận 4', 'District 4', 1, true),
(58, 3440, 'Bình Chánh', 'Binh Chanh', 1, true),
(58, 3441, 'Tân Phú', 'Tan Phu', 1, true),
-- Đà Nẵng
(48, 1, 'Hải Châu', 'Hai Chau', 1, true),
(48, 2, 'Thanh Khê', 'Thanh Khe', 1, true),
(48, 3, 'Sơn Trà', 'Son Tra', 1, true);

-- Insert wards
INSERT INTO public.ghn_wards (province_id, district_id, ward_code, ward_name, ward_name_en, support_type, is_active) VALUES
-- Hà Nội - Hoàn Kiếm (district_id: 1)
(1, 1, '01', 'Hàng Trống', 'Hang Trong', 1, true),
(1, 1, '02', 'Hàng Bông', 'Hang Bong', 1, true),
(1, 1, '03', 'Trang Tiền', 'Trang Tien', 1, true),
-- Hà Nội - Ba Đình (district_id: 2)
(1, 2, '04', 'Phúc Tân', 'Phuc Tan', 1, true),
(1, 2, '05', 'Cát Linh', 'Cat Linh', 1, true),
-- Hà Nội - Hà Đông (district_id: 1455)
(1, 1455, '21617', 'Phúc Diễn', 'Phuc Dien', 1, true),
(1, 1455, '21618', 'Dương Nội', 'Duong Noi', 1, true),
(1, 1455, '21619', 'Hà Cầu', 'Ha Cau', 1, true),
-- TP. HCM - Quận 1 (district_id: 1)
(58, 1, '13000', 'Bến Nghé', 'Ben Nghe', 1, true),
(58, 1, '13001', 'Bến Thành', 'Ben Thanh', 1, true),
(58, 1, '13002', 'Cầu Ông Lãnh', 'Cau Ong Lanh', 1, true),
-- TP. HCM - Bình Chánh (district_id: 3440)
(58, 3440, '13010', 'An Lạc', 'An Lac', 1, true),
(58, 3440, '13011', 'An Nhơn', 'An Nhon', 1, true),
(58, 3440, '13012', 'Bình Hưng', 'Binh Hung', 1, true),
-- Đà Nẵng - Hải Châu (district_id: 1)
(48, 1, '30000', 'Thạch Thang', 'Thach Thang', 1, true),
(48, 1, '30001', 'Hòa Cường', 'Hoa Cuong', 1, true);
