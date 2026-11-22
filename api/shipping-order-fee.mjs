/**
 * GHN Shipping Order Fee API
 * GET /api/shipping-order-fee
 * 
 * Lấy chi tiết phí của một đơn hàng GHN đã tồn tại
 * Dựa trên mã vận đơn (order_code)
 */

const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api/v2'
const GHN_TOKEN = process.env.GHN_TOKEN || 'a2bb6329-1eda-4bb3-9282-01a8a011c1c8'
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '5430969'

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    })
  }

  try {
    // Get order_code from query parameter
    const { order_code } = req.query

    // Validate required fields
    if (!order_code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameter: order_code'
      })
    }

    // Validate order_code format
    if (typeof order_code !== 'string' || order_code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order_code format'
      })
    }

    const cleanOrderCode = String(order_code).trim().toUpperCase()

    console.log('📦 Fetching GHN shipping order fee...')
    console.log('Order Code:', cleanOrderCode)
    console.log('Shop ID:', GHN_SHOP_ID)

    // Call GHN API
    const ghnUrl = new URL(`${GHN_API_URL}/shipping-order/soc`)
    ghnUrl.searchParams.append('order_code', cleanOrderCode)

    const response = await fetch(ghnUrl.toString(), {
      method: 'GET',
      headers: {
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID
      }
    })

    const data = await response.json()

    // Handle error responses from GHN
    if (response.status === 404) {
      console.error('❌ Order not found:', cleanOrderCode)
      return res.status(404).json({
        success: false,
        error: `Order code not found: ${cleanOrderCode}`
      })
    }

    if (response.status === 400 && data.code === 'CLIENT_NOT_OWNER_OF_SHOP') {
      console.error('❌ Order does not belong to this shop:', cleanOrderCode)
      return res.status(400).json({
        success: false,
        error: 'Order does not belong to your shop'
      })
    }

    if (data.code !== 200) {
      console.error('❌ GHN API error:', data)
      return res.status(response.status || 500).json({
        success: false,
        error: data.message || 'GHN API error'
      })
    }

    console.log('✅ Shipping order fee fetched:', {
      order_code: data.data.order_code,
      total: data.data.detail.main_service
    })

    // Return full fee breakdown
    return res.status(200).json({
      success: true,
      data: {
        order_code: data.data.order_code,
        detail: {
          main_service: data.data.detail.main_service || 0,
          insurance: data.data.detail.insurance || 0,
          cod_fee: data.data.detail.cod_fee || 0,
          station_do: data.data.detail.station_do || 0,
          station_pu: data.data.detail.station_pu || 0,
          return: data.data.detail.return || 0,
          r2s: data.data.detail.r2s || 0,
          coupon: data.data.detail.coupon || 0,
          document_return: data.data.detail.document_return || 0,
          double_check: data.data.detail.double_check || 0,
          pick_remote_areas_fee: data.data.detail.pick_remote_areas_fee || 0,
          deliver_remote_areas_fee: data.data.detail.deliver_remote_areas_fee || 0,
          change_to_address_fee: data.data.detail.change_to_address_fee || 0,
          change_return_address_fee: data.data.detail.change_return_address_fee || 0,
          total: data.data.detail.total || 0
        },
        cod_collect_date: data.data.cod_collect_date || null
      }
    })
  } catch (err) {
    console.error('❌ Shipping order fee error:', err)
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}

export default handler
