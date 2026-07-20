import { VercelRequest, VercelResponse } from '@vercel/node';
import { GHN_SERVICES } from '../../src/data/ghn-locations';

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { from_district, to_district } = req.query;

    if (!from_district || !to_district) {
      return res.status(400).json({
        success: false,
        error: 'from_district and to_district are required',
      });
    }

    const response = await fetch(
      `${GHN_API_URL}/master-data/service?from_district=${from_district}&to_district=${to_district}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Token': GHN_TOKEN,
          'ShopId': GHN_SHOP_ID,
        },
      }
    );

    const data = await response.json();

    if (data.code === 200) {
      res.status(200).json({
        success: true,
        data: data.data || [],
      });
    } else {
      // Fallback to local data
      console.log('GHN API error:', data.message, '- Using local data');
      res.status(200).json({
        success: true,
        data: GHN_SERVICES,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(200).json({
      success: true,
      data: GHN_SERVICES,
    });
  }
};
