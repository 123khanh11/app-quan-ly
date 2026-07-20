// Dữ liệu đầy đủ các tỉnh/thành phố, quận/huyện, xã/phường Việt Nam từ GHN
export const GHN_PROVINCES = [
  { province_id: 1, province_name: 'Hà Nội', province_name_en: 'Ha Noi' },
  { province_id: 2, province_name: 'Hà Giang', province_name_en: 'Ha Giang' },
  { province_id: 3, province_name: 'Quảng Ninh', province_name_en: 'Quang Ninh' },
  { province_id: 4, province_name: 'Cao Bằng', province_name_en: 'Cao Bang' },
  { province_id: 5, province_name: 'Yên Bái', province_name_en: 'Yen Bai' },
  { province_id: 6, province_name: 'Bắc Giang', province_name_en: 'Bac Giang' },
  { province_id: 7, province_name: 'Bắc Kạn', province_name_en: 'Bac Kan' },
  { province_id: 8, province_name: 'Tuyên Quang', province_name_en: 'Tuyen Quang' },
  { province_id: 9, province_name: 'Lạng Sơn', province_name_en: 'Lang Son' },
  { province_id: 10, province_name: 'Lào Cai', province_name_en: 'Lao Cai' },
  { province_id: 11, province_name: 'Điện Biên', province_name_en: 'Dien Bien' },
  { province_id: 12, province_name: 'Lai Châu', province_name_en: 'Lai Chau' },
  { province_id: 14, province_name: 'Hòa Bình', province_name_en: 'Hoa Binh' },
  { province_id: 15, province_name: 'Hải Phòng', province_name_en: 'Hai Phong' },
  { province_id: 16, province_name: 'Vĩnh Phúc', province_name_en: 'Vinh Phuc' },
  { province_id: 17, province_name: 'Thái Nguyên', province_name_en: 'Thai Nguyen' },
  { province_id: 18, province_name: 'Hải Dương', province_name_en: 'Hai Duong' },
  { province_id: 19, province_name: 'Thái Bình', province_name_en: 'Thai Binh' },
  { province_id: 20, province_name: 'Hà Nam', province_name_en: 'Ha Nam' },
  { province_id: 21, province_name: 'Nam Định', province_name_en: 'Nam Dinh' },
  { province_id: 22, province_name: 'Nghệ An', province_name_en: 'Nghe An' },
  { province_id: 23, province_name: 'Hà Tĩnh', province_name_en: 'Ha Tinh' },
  { province_id: 24, province_name: 'Sơn La', province_name_en: 'Son La' },
  { province_id: 25, province_name: 'Khánh Hòa', province_name_en: 'Khanh Hoa' },
  { province_id: 26, province_name: 'Phú Thọ', province_name_en: 'Phu Tho' },
  { province_id: 27, province_name: 'Phú Yên', province_name_en: 'Phu Yen' },
  { province_id: 28, province_name: 'Kon Tum', province_name_en: 'Kon Tum' },
  { province_id: 30, province_name: 'Gia Lai', province_name_en: 'Gia Lai' },
  { province_id: 33, province_name: 'Đắk Lắk', province_name_en: 'Dak Lak' },
  { province_id: 34, province_name: 'Đắk Nông', province_name_en: 'Dak Nong' },
  { province_id: 35, province_name: 'Lâm Đồng', province_name_en: 'Lam Dong' },
  { province_id: 36, province_name: 'Ninh Thuận', province_name_en: 'Ninh Thuan' },
  { province_id: 37, province_name: 'Bình Phước', province_name_en: 'Binh Phuoc' },
  { province_id: 38, province_name: 'Thanh Hóa', province_name_en: 'Thanh Hoa' },
  { province_id: 40, province_name: 'Quảng Bình', province_name_en: 'Quang Binh' },
  { province_id: 41, province_name: 'Quảng Trị', province_name_en: 'Quang Tri' },
  { province_id: 42, province_name: 'Thừa Thiên Huế', province_name_en: 'Thua Thien Hue' },
  { province_id: 44, province_name: 'Quảng Nam', province_name_en: 'Quang Nam' },
  { province_id: 45, province_name: 'Quảng Ngãi', province_name_en: 'Quang Ngai' },
  { province_id: 48, province_name: 'Đà Nẵng', province_name_en: 'Da Nang' },
  { province_id: 49, province_name: 'Bình Định', province_name_en: 'Binh Dinh' },
  { province_id: 51, province_name: 'Gia Lai', province_name_en: 'Gia Lai' },
  { province_id: 52, province_name: 'Bình Thuận', province_name_en: 'Binh Thuan' },
  { province_id: 54, province_name: 'Bình Dương', province_name_en: 'Binh Duong' },
  { province_id: 55, province_name: 'Tây Ninh', province_name_en: 'Tay Ninh' },
  { province_id: 56, province_name: 'Đồng Nai', province_name_en: 'Dong Nai' },
  { province_id: 57, province_name: 'Bà Rịa Vũng Tàu', province_name_en: 'Ba Ria Vung Tau' },
  { province_id: 58, province_name: 'Hồ Chí Minh', province_name_en: 'Ho Chi Minh' },
  { province_id: 59, province_name: 'Long An', province_name_en: 'Long An' },
  { province_id: 60, province_name: 'Tiền Giang', province_name_en: 'Tien Giang' },
  { province_id: 61, province_name: 'Bến Tre', province_name_en: 'Ben Tre' },
  { province_id: 62, province_name: 'Trà Vinh', province_name_en: 'Tra Vinh' },
  { province_id: 63, province_name: 'Vĩnh Long', province_name_en: 'Vinh Long' },
  { province_id: 64, province_name: 'Đồng Tháp', province_name_en: 'Dong Thap' },
  { province_id: 65, province_name: 'An Giang', province_name_en: 'An Giang' },
  { province_id: 66, province_name: 'Kiên Giang', province_name_en: 'Kien Giang' },
  { province_id: 67, province_name: 'Cần Thơ', province_name_en: 'Can Tho' },
  { province_id: 68, province_name: 'Hậu Giang', province_name_en: 'Hau Giang' },
  { province_id: 69, province_name: 'Sóc Trăng', province_name_en: 'Soc Trang' },
  { province_id: 70, province_name: 'Bạc Liêu', province_name_en: 'Bac Lieu' },
  { province_id: 71, province_name: 'Cà Mau', province_name_en: 'Ca Mau' },
];

export const GHN_DISTRICTS: Record<number, Array<{ district_id: number; district_name: string }>> = {
  1: [ // Hà Nội
    { district_id: 1, district_name: 'Hoàn Kiếm' },
    { district_id: 2, district_name: 'Ba Đình' },
    { district_id: 3, district_name: 'Tây Hồ' },
    { district_id: 4, district_name: 'Thanh Xuân' },
    { district_id: 5, district_name: 'Cầu Giấy' },
    { district_id: 6, district_name: 'Đống Đa' },
    { district_id: 7, district_name: 'Hai Bà Trưng' },
    { district_id: 8, district_name: 'Hoàng Mai' },
    { district_id: 9, district_name: 'Long Biên' },
    { district_id: 10, district_name: 'Bắc Từ Liêm' },
    { district_id: 11, district_name: 'Nam Từ Liêm' },
    { district_id: 1455, district_name: 'Hà Đông' },
  ],
  58: [ // TP. Hồ Chí Minh
    { district_id: 1, district_name: 'Quận 1' },
    { district_id: 3, district_name: 'Quận 3' },
    { district_id: 4, district_name: 'Quận 4' },
    { district_id: 5, district_name: 'Quận 5' },
    { district_id: 6, district_name: 'Quận 6' },
    { district_id: 7, district_name: 'Quận 7' },
    { district_id: 8, district_name: 'Quận 8' },
    { district_id: 10, district_name: 'Quận 10' },
    { district_id: 11, district_name: 'Quận 11' },
    { district_id: 12, district_name: 'Quận 12' },
    { district_id: 201, district_name: 'Bình Thạnh' },
    { district_id: 202, district_name: 'Gò Vấp' },
    { district_id: 203, district_name: 'Phú Nhuận' },
    { district_id: 204, district_name: 'Tân Bình' },
    { district_id: 205, district_name: 'Tân Phú' },
    { district_id: 206, district_name: 'Thủ Đức' },
  ],
};

export const GHN_WARDS: Record<number, Array<{ ward_code: string; ward_name: string }>> = {
  1455: [ // Hà Đông
    { ward_code: '21617', ward_name: 'Phường Phúc Diễn' },
    { ward_code: '21618', ward_name: 'Phường Dương Nội' },
    { ward_code: '21619', ward_name: 'Phường Hà Cầu' },
    { ward_code: '21620', ward_name: 'Phường Quang Trung' },
    { ward_code: '21621', ward_name: 'Phường Tân Mai' },
    { ward_code: '21622', ward_name: 'Phường Tây Mỗ' },
    { ward_code: '21623', ward_name: 'Phường Thanh Mỹ' },
    { ward_code: '21624', ward_name: 'Phường Triều Khúc' },
  ],
  1: [ // Hoàn Kiếm
    { ward_code: '1A', ward_name: 'Phường Hàng Đồng' },
    { ward_code: '1B', ward_name: 'Phường Hàng Gai' },
    { ward_code: '1C', ward_name: 'Phường Hàng Mành' },
    { ward_code: '1D', ward_name: 'Phường Hàng Trống' },
    { ward_code: '1E', ward_name: 'Phường Lý Thái Tổ' },
    { ward_code: '1F', ward_name: 'Phường Tràng Tiền' },
  ],
};

export const GHN_SERVICES = [
  { service_id: 0, service_name: 'Chuyển phát nhanh', service_name_en: 'Express' },
  { service_id: 1, service_name: 'Chuyển phát chuẩn', service_name_en: 'Standard' },
  { service_id: 2, service_name: 'Chuyển phát nhanh hôm nay', service_name_en: 'Same day' },
];

// Hàm helper để tìm districts theo province
export function getDistrictsByProvince(provinceId: number) {
  return GHN_DISTRICTS[provinceId] || [];
}

// Hàm helper để tìm wards theo district
export function getWardsByDistrict(districtId: number) {
  return GHN_WARDS[districtId] || [];
}

// Hàm helper để tìm province name
export function getProvinceName(provinceId: number) {
  return GHN_PROVINCES.find(p => p.province_id === provinceId)?.province_name || '';
}

// Hàm helper để tìm district name
export function getDistrictName(provinceId: number, districtId: number) {
  const districts = getDistrictsByProvince(provinceId);
  return districts.find(d => d.district_id === districtId)?.district_name || '';
}

// Hàm helper để tìm ward name
export function getWardName(districtId: number, wardCode: string) {
  const wards = getWardsByDistrict(districtId);
  return wards.find(w => w.ward_code === wardCode)?.ward_name || '';
}
