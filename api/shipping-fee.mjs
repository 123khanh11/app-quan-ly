/**
 * GHN Shipping Fee Calculator API
 * POST /api/shipping-fee
 * 
 * Tính toán phí vận chuyển GHN dựa trên:
 * - Quận/huyện và phường/xã giao hàng
 * - Cân nặng và kích thước bưu kiện
 * - Loại dịch vụ
 */

const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api/v2'
const GHN_TOKEN = process.env.GHN_TOKEN || '653bfc7b-8381-11f1-a65e-a68e06d4dd1e'
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '5430969'
const GHN_FROM_DISTRICT_ID = process.env.GHN_FROM_DISTRICT_ID || '1455'
const GHN_FROM_WARD_CODE = process.env.GHN_FROM_WARD_CODE || '21617'

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const {
      to_district_id,
      to_ward_code,
      weight_gram = 1000,
      length_cm = 20,
      width_cm = 20,
      height_cm = 20,
      cod_value = 0,
      insurance_value = 0,
      service_type_id,
    } = req.body

    // Validate required fields
    if (!to_district_id || !to_ward_code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required: to_district_id, to_ward_code'
      })
    }

    console.log('📦 Calculating GHN shipping fee...')
    console.log('To:', to_district_id, to_ward_code)
    console.log('Weight:', weight_gram, 'gram')

    // Determine service type by weight if not specified
    let finalServiceType = service_type_id || 2
    if (weight_gram >= 20000) {
      finalServiceType = 5 // 20kg or more
    } else if (!service_type_id) {
      finalServiceType = 2 // under 20kg
    }

    // Call GHN API
    const payload = {
      from_district_id: parseInt(GHN_FROM_DISTRICT_ID),
      from_ward_code: GHN_FROM_WARD_CODE,
      to_district_id,
      to_ward_code,
      weight: Math.max(weight_gram, 200),
      length: Math.max(length_cm, 10),
      width: Math.max(width_cm, 10),
      height: Math.max(height_cm, 10),
      service_type_id: finalServiceType,
      cod_value: Math.max(cod_value, 0),
      insurance_value: Math.max(insurance_value, 0),
    }

    console.log('📤 Calling GHN API with:', payload)

    const response = await fetch(`${GHN_API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.code !== 200) {
      console.error('❌ GHN API error:', data)
      
      // Fallback: return estimated fee
      const estimatedFee = Math.max(
        20000,
        20000 + Math.max(0, Math.ceil(weight_gram / 1000) - 1) * 5000
      )

      return res.status(200).json({
        success: true,
        data: {
          total: estimatedFee,
          service_fee: estimatedFee,
          insurance_fee: 0,
          cod_fee: 0,
          pick_station_fee: 0,
          pick_remote_areas_fee: 0,
          deliver_remote_areas_fee: 0,
          coupon_value: 0,
          r2s_fee: 0,
          return_again: 0,
          document_return: 0,
          double_check: 0,
          cod_failed_fee: 0,
          change_to_address_fee: 0,
          change_return_address_fee: 0,
          return: 0,
        },
        warning: data.message || 'GHN API error, using estimation'
      })
    }

    console.log('✅ Shipping fee calculated:', data.data.total)

    // Return full fee breakdown
    return res.status(200).json({
      success: true,
      data: {
        total: data.data.total || 0,
        service_fee: data.data.service_fee || 0,
        insurance_fee: data.data.insurance_fee || 0,
        cod_fee: data.data.cod_fee || 0,
        pick_station_fee: data.data.pick_station_fee || 0,
        pick_remote_areas_fee: data.data.pick_remote_areas_fee || 0,
        deliver_remote_areas_fee: data.data.deliver_remote_areas_fee || 0,
        coupon_value: data.data.coupon_value || 0,
        r2s_fee: data.data.r2s_fee || 0,
        return_again: data.data.return_again || 0,
        document_return: data.data.document_return || 0,
        double_check: data.data.double_check || 0,
        cod_failed_fee: data.data.cod_failed_fee || 0,
        change_to_address_fee: data.data.change_to_address_fee || 0,
        change_return_address_fee: data.data.change_return_address_fee || 0,
        return: data.data.return || 0,
      }
    })
  } catch (err) {
    console.error('❌ Shipping fee error:', err)
    
    // Fallback: return default fee
    return res.status(200).json({
      success: true,
      data: {
        total: 50000,
        service_fee: 50000,
        insurance_fee: 0,
        cod_fee: 0,
        pick_station_fee: 0,
        pick_remote_areas_fee: 0,
        deliver_remote_areas_fee: 0,
        coupon_value: 0,
        r2s_fee: 0,
        return_again: 0,
        document_return: 0,
        double_check: 0,
        cod_failed_fee: 0,
        change_to_address_fee: 0,
        change_return_address_fee: 0,
        return: 0,
      },
      error: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}

export default handler
