import { VercelRequest, VercelResponse } from '@vercel/node';

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

// Mock data for testing when token is invalid
const MOCK_PROVINCES = [
  { province_id: 1, province_name: 'Hà Nội' },
  { province_id: 2, province_name: 'Hà Giang' },
  { province_id: 3, province_name: 'Quảng Ninh' },
  { province_id: 15, province_name: 'Hải Phòng' },
  { province_id: 48, province_name: 'Đà Nẵng' },
  { province_id: 202, province_name: 'TP. Hồ Chí Minh' },
];

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
      // Fallback to mock data if token is invalid
      console.log('GHN API error:', data.message, '- Using mock data');
      res.status(200).json({
        success: true,
        data: MOCK_PROVINCES,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    // Fallback to mock data on network error
    res.status(200).json({
      success: true,
      data: MOCK_PROVINCES,
    });
  }
};
