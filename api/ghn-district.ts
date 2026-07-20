import { VercelRequest, VercelResponse } from '@vercel/node';
import { GHN_DISTRICTS } from '../../src/data/ghn-locations';

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

const MOCK_DISTRICTS = [
  { district_id: 1, district_name: 'Hoàn Kiếm' },
  { district_id: 2, district_name: 'Hà Bình' },
  { district_id: 3, district_name: 'Ba Đình' },
  { district_id: 1455, district_name: 'Hà Đông' },
];

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
      const localDistricts = GHN_DISTRICTS[provinceIdNum] || MOCK_DISTRICTS;
      console.log('GHN API error:', data.message, '- Using local data');
      res.status(200).json({
        success: true,
        data: localDistricts,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(200).json({
      success: true,
      data: MOCK_DISTRICTS,
    });
  }
};
