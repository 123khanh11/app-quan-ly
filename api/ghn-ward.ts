import { VercelRequest, VercelResponse } from '@vercel/node';

const WARDS: Record<number, Array<{ ward_code: string; ward_name: string }>> = {
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
      // Fallback to local data if token is invalid
      const districtIdNum = parseInt(String(district_id));
      const localWards = WARDS[districtIdNum] || [];
      console.log('GHN API error:', data.message, '- Using local data');
      res.status(200).json({
        success: true,
        data: localWards,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    const { district_id } = req.query;
    const districtIdNum = parseInt(String(district_id || 0));
    res.status(200).json({
      success: true,
      data: WARDS[districtIdNum] || [],
    });
  }
};
