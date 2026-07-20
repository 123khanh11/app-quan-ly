import { VercelRequest, VercelResponse } from '@vercel/node';

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

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
      res.status(400).json({
        success: false,
        error: data.message,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
