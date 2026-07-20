import { VercelRequest, VercelResponse } from '@vercel/node';

const DISTRICTS: Record<number, Array<{ district_id: number; district_name: string }>> = {
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

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { province_id } = req.query;

    if (!province_id) {
      return res.status(400).json({
        success: false,
        error: 'province_id is required',
      });
    }

    const response = await fetch(`${GHN_API_URL}/master-data/district?province_id=${province_id}`, {
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
      const provinceIdNum = parseInt(String(province_id));
      const localDistricts = DISTRICTS[provinceIdNum] || [];
      console.log('GHN API error:', data.message, '- Using local data');
      res.status(200).json({
        success: true,
        data: localDistricts,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    const { province_id } = req.query;
    const provinceIdNum = parseInt(String(province_id || 0));
    res.status(200).json({
      success: true,
      data: DISTRICTS[provinceIdNum] || [],
    });
  }
};
