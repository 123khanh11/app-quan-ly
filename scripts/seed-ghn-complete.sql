-- Seed GHN Provinces
INSERT INTO public.ghn_provinces (province_id, province_name, province_name_en, is_active) VALUES
(1, 'Hà Nội', 'Ha Noi', true),
(2, 'Hà Giang', 'Ha Giang', true),
(3, 'Quảng Ninh', 'Quang Ninh', true),
(15, 'Hải Phòng', 'Hai Phong', true),
(48, 'Đà Nẵng', 'Da Nang', true),
(58, 'TP. Hồ Chí Minh', 'Ho Chi Minh', true)
ON CONFLICT (province_id) DO NOTHING;

-- Seed GHN Districts - Hà Nội
INSERT INTO public.ghn_districts (province_id, district_id, district_name, district_name_en, is_active) VALUES
(1, 1, 'Hoàn Kiếm', 'Hoan Kiem', true),
(1, 2, 'Ba Đình', 'Ba Dinh', true),
(1, 3, 'Tây Hồ', 'Tay Ho', true),
(1, 4, 'Thanh Xuân', 'Thanh Xuan', true),
(1, 5, 'Cầu Giấy', 'Cau Giay', true),
(1, 6, 'Đống Đa', 'Dong Da', true),
(1, 7, 'Hai Bà Trưng', 'Hai Ba Trung', true),
(1, 8, 'Hoàng Mai', 'Hoang Mai', true),
(1, 9, 'Long Biên', 'Long Bien', true),
(1, 10, 'Bắc Từ Liêm', 'Bac Tu Liem', true),
(1, 11, 'Nam Từ Liêm', 'Nam Tu Liem', true),
(1, 1455, 'Hà Đông', 'Ha Dong', true)
ON CONFLICT (district_id) DO NOTHING;

-- Seed GHN Districts - TP.HCM
INSERT INTO public.ghn_districts (province_id, district_id, district_name, district_name_en, is_active) VALUES
(58, 1, 'Quận 1', 'District 1', true),
(58, 3, 'Quận 3', 'District 3', true),
(58, 4, 'Quận 4', 'District 4', true),
(58, 5, 'Quận 5', 'District 5', true),
(58, 6, 'Quận 6', 'District 6', true),
(58, 7, 'Quận 7', 'District 7', true),
(58, 8, 'Quận 8', 'District 8', true),
(58, 10, 'Quận 10', 'District 10', true),
(58, 11, 'Quận 11', 'District 11', true),
(58, 12, 'Quận 12', 'District 12', true),
(58, 201, 'Bình Thạnh', 'Binh Thanh', true),
(58, 202, 'Gò Vấp', 'Go Vap', true),
(58, 203, 'Phú Nhuận', 'Phu Nhuan', true),
(58, 204, 'Tân Bình', 'Tan Binh', true),
(58, 205, 'Tân Phú', 'Tan Phu', true),
(58, 206, 'Thủ Đức', 'Thu Duc', true),
(58, 3440, 'Bình Chánh', 'Binh Chanh', true)
ON CONFLICT (district_id) DO NOTHING;

-- Seed GHN Wards - Hà Đông, Hà Nội
INSERT INTO public.ghn_wards (province_id, district_id, ward_code, ward_name, ward_name_en, is_active) VALUES
(1, 1455, '21617', 'Phúc Diễn', 'Phuc Dien', true),
(1, 1455, '21618', 'Dương Nội', 'Duong Noi', true),
(1, 1455, '21619', 'Hà Cầu', 'Ha Cau', true),
(1, 1455, '21620', 'Quang Trung', 'Quang Trung', true),
(1, 1455, '21621', 'Tân Mai', 'Tan Mai', true),
(1, 1455, '21622', 'Tây Mỗ', 'Tay Mo', true),
(1, 1455, '21623', 'Thanh Mỹ', 'Thanh My', true),
(1, 1455, '21624', 'Triều Khúc', 'Trieu Khuc', true)
ON CONFLICT (district_id, ward_code) DO NOTHING;

-- Seed GHN Wards - Quận 1, TP.HCM
INSERT INTO public.ghn_wards (province_id, district_id, ward_code, ward_name, ward_name_en, is_active) VALUES
(58, 1, '13000', 'Bến Nghé', 'Ben Nghe', true),
(58, 1, '13001', 'Bến Thành', 'Ben Thanh', true),
(58, 1, '13002', 'Cầu Ông Lãnh', 'Cau Ong Lanh', true),
(58, 1, '13003', 'Đa Kao', 'Da Kao', true),
(58, 1, '13004', 'Nguyễn Huệ', 'Nguyen Hue', true),
(58, 1, '13005', 'Tân Định', 'Tan Dinh', true)
ON CONFLICT (district_id, ward_code) DO NOTHING;

-- Seed GHN Wards - Bình Chánh, TP.HCM
INSERT INTO public.ghn_wards (province_id, district_id, ward_code, ward_name, ward_name_en, is_active) VALUES
(58, 3440, '13010', 'An Lạc', 'An Lac', true),
(58, 3440, '13011', 'An Nhơn', 'An Nhon', true),
(58, 3440, '13012', 'Bình Hưng', 'Binh Hung', true),
(58, 3440, '13013', 'Tân Túc', 'Tan Tuc', true)
ON CONFLICT (district_id, ward_code) DO NOTHING;
