module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST required' })
  }

  try {
    const { to_district_id, to_ward_code, weight } = req.body

    if (!to_district_id || !to_ward_code || !weight) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    // Calculate shipping fee
    // Base fee: 30,000 VND
    // Per kg: 5,000 VND
    const baseFee = 30000
    const perKgFee = 5000
    const additionalKg = Math.max(0, Math.ceil(weight / 1000) - 1)
    const totalFee = baseFee + (additionalKg * perKgFee)

    return res.status(200).json({
      success: true,
      data: {
        total: totalFee,
        service_fee: totalFee,
        insurance_fee: 0,
        pick_station_fee: 0,
        coupon_value: 0,
        r2s_fee: 0,
        document_return: 0,
        double_check: 0,
        cod_fee: 0,
        pick_remote_areas_fee: 0,
        deliver_remote_areas_fee: 0,
        cod_failed_fee: 0,
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: String(error)
    })
  }
}
