import { VercelRequest, VercelResponse } from '@vercel/node'

// Mock data fallback
const MOCK_WARDS = {
  1455: [
    { WardCode: '21617', WardName: 'Phúc Diễn' },
    { WardCode: '21618', WardName: 'Dương Nội' },
    { WardCode: '21619', WardName: 'Hà Cầu' },
  ],
  1: [
    { WardCode: '13000', WardName: 'Bến Nghé' },
    { WardCode: '13001', WardName: 'Bến Thành' },
    { WardCode: '13002', WardName: 'Cầu Ông Lãnh' },
  ],
  3440: [
    { WardCode: '13010', WardName: 'An Lạc' },
    { WardCode: '13011', WardName: 'An Nhơn' },
    { WardCode: '13012', WardName: 'Bình Hưng' },
  ],
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { district_id } = req.query

    if (!district_id) {
      return res.status(400).json({
        success: false,
        error: 'district_id is required',
        data: [],
      })
    }

    const GHN_TOKEN = process.env.GHN_TOKEN
    const GHN_SHOP_ID = process.env.GHN_SHOP_ID

    // If no credentials, return mock data
    if (!GHN_TOKEN || !GHN_SHOP_ID) {
      console.warn('⚠️ GHN credentials not configured, using mock data')
      const mockData = MOCK_WARDS[district_id as keyof typeof MOCK_WARDS] || []
      return res.status(200).json({
        success: true,
        data: mockData,
        mock: true,
      })
    }

    const url = `https://online-gateway.ghn.vn/shiip/public-api/v2/master-data/ward?district_id=${district_id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID,
      },
    })

    let data: any
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      console.warn('⚠️ GHN API non-JSON response, using mock data')
      const mockData = MOCK_WARDS[district_id as keyof typeof MOCK_WARDS] || []
      return res.status(200).json({
        success: true,
        data: mockData,
        mock: true,
      })
    }

    if (data.code === 200) {
      return res.status(200).json({
        success: true,
        data: data.data || [],
      })
    } else {
      // Fallback to mock if GHN API error
      const mockData = MOCK_WARDS[district_id as keyof typeof MOCK_WARDS] || []
      return res.status(200).json({
        success: true,
        data: mockData,
        mock: true,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('❌ Error:', error)
    // Return mock data on error
    const district_id = req.query.district_id
    const mockData = MOCK_WARDS[district_id as keyof typeof MOCK_WARDS] || []
    return res.status(200).json({
      success: true,
      data: mockData,
      mock: true,
      error: error instanceof Error ? error.message : 'Server error',
    })
  }
}
