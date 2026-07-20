import { VercelRequest, VercelResponse } from '@vercel/node';
import { GHN_WARDS } from '../../src/data/ghn-locations.ts';

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

const MOCK_WARDS = [
  { ward_code: '21617', ward_name: 'Phường Tây Hồ' },
  { ward_code: '21618', ward_name: 'Phường Bình Minh' },
  { ward_code: '21619', ward_name: 'Phường Cầu Giấy' },
];

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { district_id } = req.query;

    if (!district_id) {
      return res.status(400).json({
        success: false,
        error: 'district_id is required',
      });
    }

    const response = await fetch(`${GHN_API_URL}/master-data/ward?district_id=${district_id}`, {
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
      const districtIdNum = parseInt(String(district_id));
      const localWards = GHN_WARDS[districtIdNum] || MOCK_WARDS;
      console.log('GHN API error:', data.message, '- Using local data');
      res.status(200).json({
        success: true,
        data: localWards,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(200).json({
      success: true,
      data: MOCK_WARDS,
    });
  }
};
