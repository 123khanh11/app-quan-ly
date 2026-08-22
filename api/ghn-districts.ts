import { VercelRequest, VercelResponse } from '@vercel/node'

// Mock data fallback
const MOCK_DISTRICTS = {
  1: [
    { DistrictID: 1, DistrictName: 'Hoàn Kiếm' },
    { DistrictID: 2, DistrictName: 'Ba Đình' },
    { DistrictID: 1455, DistrictName: 'Hà Đông' },
  ],
  58: [
    { DistrictID: 1, DistrictName: 'Quận 1' },
    { DistrictID: 3, DistrictName: 'Quận 3' },
    { DistrictID: 3440, DistrictName: 'Bình Chánh' },
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
    const { province_id } = req.query

    if (!province_id) {
      return res.status(400).json({
        success: false,
        error: 'province_id is required',
        data: [],
      })
    }

    const GHN_TOKEN = process.env.GHN_TOKEN
    const GHN_SHOP_ID = process.env.GHN_SHOP_ID

    // If no credentials, return mock data
    if (!GHN_TOKEN || !GHN_SHOP_ID) {
      console.warn('⚠️ GHN credentials not configured, using mock data')
      const mockData = MOCK_DISTRICTS[province_id as keyof typeof MOCK_DISTRICTS] || []
      return res.status(200).json({
        success: true,
        data: mockData,
        mock: true,
      })
    }

    const url = `https://online-gateway.ghn.vn/shiip/public-api/v2/master-data/district?province_id=${province_id}`

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
      const mockData = MOCK_DISTRICTS[province_id as keyof typeof MOCK_DISTRICTS] || []
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
      const mockData = MOCK_DISTRICTS[province_id as keyof typeof MOCK_DISTRICTS] || []
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
    const province_id = req.query.province_id
    const mockData = MOCK_DISTRICTS[province_id as keyof typeof MOCK_DISTRICTS] || []
    return res.status(200).json({
      success: true,
      data: mockData,
      mock: true,
      error: error instanceof Error ? error.message : 'Server error',
    })
  }
}
