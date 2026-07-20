import { VercelRequest, VercelResponse } from '@vercel/node';

const PROVINCES = [
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

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const response = await fetch(`${GHN_API_URL}/master-data/province`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID,
      },
    });

    const data = await response.json();

    if (data.code === 200) {
      res.status(200).json({
        success: true,
        data: data.data || [],
      });
    } else {
      // Fallback to local data if token is invalid
      res.status(200).json({
        success: true,
        data: PROVINCES,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    // Fallback to local data on network error
    res.status(200).json({
      success: true,
      data: PROVINCES,
    });
  }
};
