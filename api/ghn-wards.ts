import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

// Mock data fallback
const MOCK_WARDS = {
  1455: [
    { ward_code: '21617', ward_name: 'Phúc Diễn' },
    { ward_code: '21618', ward_name: 'Dương Nội' },
    { ward_code: '21619', ward_name: 'Hà Cầu' },
  ],
  1: [
    { ward_code: '13000', ward_name: 'Bến Nghé' },
    { ward_code: '13001', ward_name: 'Bến Thành' },
    { ward_code: '13002', ward_name: 'Cầu Ông Lãnh' },
  ],
  3440: [
    { ward_code: '13010', ward_name: 'An Lạc' },
    { ward_code: '13011', ward_name: 'An Nhơn' },
    { ward_code: '13012', ward_name: 'Bình Hưng' },
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

    // Try to fetch from Supabase first
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      const { data, error } = await supabase
        .from('ghn_wards')
        .select('ward_code, ward_name')
        .eq('district_id', parseInt(district_id as string))
        .order('ward_name', { ascending: true })

      if (!error && data && data.length > 0) {
        console.log(`✅ Got ${data.length} wards from Supabase`)
        return res.status(200).json({
          success: true,
          data: data,
          source: 'supabase',
        })
      }
    } catch (supError) {
      console.warn('⚠️ Supabase query failed:', supError)
    }

    // Fallback to mock data
    const mockData = MOCK_WARDS[district_id as keyof typeof MOCK_WARDS] || []
    return res.status(200).json({
      success: true,
      data: mockData,
      source: 'mock',
    })
  } catch (error) {
    console.error('❌ Error:', error)
    // Return mock data on error
    const district_id = req.query.district_id
    const mockData = MOCK_WARDS[district_id as keyof typeof MOCK_WARDS] || []
    return res.status(200).json({
      success: true,
      data: mockData,
      source: 'mock-fallback',
      error: error instanceof Error ? error.message : 'Server error',
    })
  }
}
