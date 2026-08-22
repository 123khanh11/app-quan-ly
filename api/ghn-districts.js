export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const province_id = String(req.query.province_id || '')

    if (!province_id) {
      return res.status(400).json({ success: false, error: 'province_id required' })
    }

    const MOCK = {
      '1': [
        { district_id: 1, district_name: 'Hoàn Kiếm' },
        { district_id: 2, district_name: 'Ba Đình' },
        { district_id: 1455, district_name: 'Hà Đông' },
      ],
      '58': [
        { district_id: 1, district_name: 'Quận 1' },
        { district_id: 3, district_name: 'Quận 3' },
        { district_id: 3440, district_name: 'Bình Chánh' },
      ],
    }

    const data = MOCK[province_id] || []
    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
