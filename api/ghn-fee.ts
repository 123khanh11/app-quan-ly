import { VercelRequest, VercelResponse } from '@vercel/node';

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed',
      });
    }

    const {
      service_id,
      from_district_id,
      from_ward_code,
      to_district_id,
      to_ward_code,
      weight,
      length = 0,
      width = 0,
      height = 0,
      insurance_value = 0,
      coupon = null,
    } = req.body;

    if (!service_id || !from_district_id || !to_district_id || !to_ward_code || !weight) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
      });
    }

    const response = await fetch(`${GHN_API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID,
      },
      body: JSON.stringify({
        service_type_id: service_id,
        from_district_id,
        from_ward_code,
        to_district_id,
        to_ward_code,
        weight,
        length,
        width,
        height,
        insurance_value,
        coupon,
      }),
    });

    const data = await response.json();

    if (data.code === 200) {
      res.status(200).json({
        success: true,
        data: data.data,
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
