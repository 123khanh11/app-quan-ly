import { VercelRequest, VercelResponse } from '@vercel/node'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

// Mock data fallback
const MOCK_DISTRICTS = {
  1: [
    { district_id: 1, district_name: 'Hoàn Kiếm' },
    { district_id: 2, district_name: 'Ba Đình' },
    { district_id: 1455, district_name: 'Hà Đông' },
  ],
  58: [
    { district_id: 1, district_name: 'Quận 1' },
    { district_id: 3, district_name: 'Quận 3' },
    { district_id: 3440, district_name: 'Bình Chánh' },
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

    // Try to fetch from Supabase using REST API
    try {
      const url = `${SUPABASE_URL}/rest/v1/ghn_districts?province_id=eq.${province_id}&select=district_id,district_name&order=district_name.asc`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`✅ Got ${data.length} districts from Supabase`)
          return res.status(200).json({
            success: true,
            data: data,
            source: 'supabase',
          })
        }
      }
    } catch (supError) {
      console.warn('⚠️ Supabase query failed:', supError)
    }

    // Fallback to mock data
    const mockData = MOCK_DISTRICTS[province_id as keyof typeof MOCK_DISTRICTS] || []
    return res.status(200).json({
      success: true,
      data: mockData,
      source: 'mock',
    })
  } catch (error) {
    console.error('❌ Error:', error)
    // Return mock data on error
    const province_id = req.query.province_id
    const mockData = MOCK_DISTRICTS[province_id as keyof typeof MOCK_DISTRICTS] || []
    return res.status(200).json({
      success: true,
      data: mockData,
      source: 'mock-fallback',
      error: error instanceof Error ? error.message : 'Server error',
    })
  }
}
