module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const province_id = req.query.province_id

    if (!province_id) {
      return res.status(400).json({ success: false, error: 'province_id required' })
    }

    const MOCK = {
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

    const data = MOCK[province_id] || []
    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) })
  }
}
