import axios from 'axios'

const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee'
const GHN_TOKEN = process.env.GHN_TOKEN || process.env.VITE_GHN_TOKEN || '653bfc7b-8381-11f1-a65e-a68e06d4dd1e'
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || process.env.VITE_GHN_SHOP_ID || '6557702'
const FROM_DISTRICT_ID = process.env.GHN_FROM_DISTRICT_ID || '1455'
const FROM_WARD_CODE = process.env.GHN_FROM_WARD_CODE || '21617'

async function handler(req, res) {
  console.log("📥 Shipping fee request received at:", new Date().toISOString())
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    })
  }

  try {
    const {
      service_id,
      service_type_id,
      to_district_id,
      to_ward_code,
      weight,
      length,
      width,
      height,
      insurance_value,
      coupon
    } = req.body

    console.log("📦 Calculating shipping fee with params:", {
      service_id,
      service_type_id,
      to_district_id,
      to_ward_code,
      weight,
      length,
      width,
      height
    })

    // Validate required fields
    if (!to_district_id || !to_ward_code) {
      return res.status(400).json({ 
        success: false, 
        error: 'to_district_id and to_ward_code are required' 
      })
    }

    if (!weight || !length || !width || !height) {
      return res.status(400).json({ 
        success: false, 
        error: 'weight, length, width, height are required' 
      })
    }

    // Build GHN API request
    const ghnPayload = {
      service_type_id: service_type_id || 2, // Default to Standard (2)
      from_district_id: parseInt(FROM_DISTRICT_ID),
      from_ward_code: FROM_WARD_CODE,
      to_district_id: parseInt(to_district_id),
      to_ward_code: to_ward_code,
      height: parseInt(height),
      length: parseInt(length),
      width: parseInt(width),
      weight: parseInt(weight),
      insurance_value: insurance_value ? parseInt(insurance_value) : 0,
      coupon: coupon || null,
    }

    // If service_id is provided, use it
    if (service_id) {
      ghnPayload.service_id = parseInt(service_id)
      delete ghnPayload.service_type_id
    }

    console.log("📤 Calling GHN API with payload:", JSON.stringify(ghnPayload, null, 2))

    // Call GHN API
    const response = await axios.post(GHN_API_URL, ghnPayload, {
      headers: {
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log("✅ GHN API response:", JSON.stringify(response.data, null, 2))

    if (response.data.code !== 200) {
      console.error("❌ GHN API error:", response.data.message)
      throw new Error(`GHN API error: ${response.data.message}`)
    }

    const { total, service_fee, insurance_fee, pick_station_fee, coupon_value, r2s_fee } = response.data.data

    return res.status(200).json({
      success: true,
      data: {
        total,
        service_fee,
        insurance_fee,
        pick_station_fee,
        coupon_value,
        r2s_fee,
      }
    })

  } catch (error) {
    console.error('❌ API Error:', error.message)
    console.error('❌ Error response:', error.response?.data)
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate shipping fee',
      data: null
    })
  }
}

export default handler
