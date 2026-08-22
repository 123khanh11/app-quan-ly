export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' })
    return
  }

  try {
    const { district_id } = req.query

    if (!district_id) {
      res.status(400).json({ success: false, error: 'district_id required' })
      return
    }

    const MOCK = {
      '1': [
        { ward_code: '13000', ward_name: 'Bến Nghé' },
        { ward_code: '13001', ward_name: 'Bến Thành' },
        { ward_code: '13002', ward_name: 'Cầu Ông Lãnh' },
      ],
      '1455': [
        { ward_code: '21617', ward_name: 'Phúc Diễn' },
        { ward_code: '21618', ward_name: 'Dương Nội' },
        { ward_code: '21619', ward_name: 'Hà Cầu' },
      ],
      '3440': [
        { ward_code: '13010', ward_name: 'An Lạc' },
        { ward_code: '13011', ward_name: 'An Nhơn' },
        { ward_code: '13012', ward_name: 'Bình Hưng' },
      ],
    }

    const data = MOCK[district_id] || []
    res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
