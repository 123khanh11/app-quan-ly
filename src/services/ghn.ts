// GHN Shipping API Configuration
const GHN_CONFIG = {
  TOKEN: import.meta.env.VITE_GHN_TOKEN || '',
  SHOP_ID: import.meta.env.VITE_GHN_SHOP_ID || '',
  // Dev: https://dev-online-gateway.ghn.vn
  // Production: https://online-gateway.ghn.vn
  API_URL: import.meta.env.VITE_GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2',
}

// Headers for GHN API
function getGHNHeaders() {
  return {
    'Content-Type': 'application/json',
    'Token': GHN_CONFIG.TOKEN,
    'ShopId': GHN_CONFIG.SHOP_ID,
  }
}

// Calculate Shipping Fee
export async function calculateGHNShippingFee(params: {
  service_type_id: number // 2: Hàng nhẹ, 5: Hàng nặng
  from_district_id: number
  from_ward_code?: string
  to_district_id: number
  to_ward_code: string
  weight: number // grams
  length?: number // cm
  width?: number // cm
  height?: number // cm
  insurance_value?: number
  coupon?: string
  items?: Array<{
    name: string
    quantity: number
    length?: number
    width?: number
    height?: number
    weight?: number
    code?: string
  }>
}) {
  try {
    const response = await fetch(`${GHN_CONFIG.API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: getGHNHeaders(),
      body: JSON.stringify({
        service_type_id: params.service_type_id,
        from_district_id: params.from_district_id,
        from_ward_code: params.from_ward_code,
        to_district_id: params.to_district_id,
        to_ward_code: params.to_ward_code,
        weight: params.weight,
        length: params.length || 0,
        width: params.width || 0,
        height: params.height || 0,
        insurance_value: params.insurance_value || 0,
        coupon: params.coupon || null,
        items: params.items || [],
      }),
    })

    const result = await response.json()

    if (result.code === 200) {
      return {
        success: true,
        data: {
          total: result.data.total,
          service_fee: result.data.service_fee,
          insurance_fee: result.data.insurance_fee,
          pick_station_fee: result.data.pick_station_fee,
          coupon_value: result.data.coupon_value,
          r2s_fee: result.data.r2s_fee,
          document_return: result.data.document_return,
          double_check: result.data.double_check,
          cod_fee: result.data.cod_fee,
          pick_remote_areas_fee: result.data.pick_remote_areas_fee,
          deliver_remote_areas_fee: result.data.deliver_remote_areas_fee,
          cod_failed_fee: result.data.cod_failed_fee,
        },
      }
    } else {
      return {
        success: false,
        error: result.message || 'Failed to calculate shipping fee',
        code: result.code,
      }
    }
  } catch (error) {
    console.error('GHN Calculate Fee Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Create Shipping Order with GHN
export async function createGHNShippingOrder(orderData: {
  service_type_id: number
  from_district_id: number
  from_ward_code?: string
  to_district_id: number
  to_ward_code: string
  weight: number
  length?: number
  width?: number
  height?: number
  insurance_value?: number
  coupon?: string
  cod_value?: number
  content: string // Order description
  pick_shift?: number // 1, 2, 3
  items?: Array<{
    name: string
    quantity: number
    length?: number
    width?: number
    height?: number
    weight?: number
    code?: string
  }>
}) {
  try {
    const response = await fetch(`${GHN_CONFIG.API_URL}/shipping-order/create`, {
      method: 'POST',
      headers: getGHNHeaders(),
      body: JSON.stringify({
        service_type_id: orderData.service_type_id,
        from_district_id: orderData.from_district_id,
        from_ward_code: orderData.from_ward_code,
        to_district_id: orderData.to_district_id,
        to_ward_code: orderData.to_ward_code,
        weight: orderData.weight,
        length: orderData.length || 0,
        width: orderData.width || 0,
        height: orderData.height || 0,
        insurance_value: orderData.insurance_value || 0,
        coupon: orderData.coupon || null,
        cod_value: orderData.cod_value || 0,
        content: orderData.content,
        pick_shift: orderData.pick_shift || 1,
        items: orderData.items || [],
      }),
    })

    const result = await response.json()

    if (result.code === 200) {
      return {
        success: true,
        order_code: result.data.order_code,
        order_id: result.data.order_id,
        expected_delivery_time: result.data.expected_delivery_time,
        total_fee: result.data.total_fee,
      }
    } else {
      return {
        success: false,
        error: result.message || 'Failed to create shipping order',
        code: result.code,
      }
    }
  } catch (error) {
    console.error('GHN Create Order Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Get District List
export async function getGHNDistricts(province_id: number) {
  try {
    const response = await fetch(`${GHN_CONFIG.API_URL}/master-data/district`, {
      method: 'GET',
      headers: getGHNHeaders(),
    })

    const result = await response.json()

    if (result.code === 200) {
      // Filter by province_id if needed
      return {
        success: true,
        districts: result.data || [],
      }
    } else {
      return {
        success: false,
        error: result.message,
        districts: [],
      }
    }
  } catch (error) {
    console.error('GHN Get Districts Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      districts: [],
    }
  }
}

// Get Ward List
export async function getGHNWards(district_id: number) {
  try {
    const response = await fetch(`${GHN_CONFIG.API_URL}/master-data/ward?district_id=${district_id}`, {
      method: 'GET',
      headers: getGHNHeaders(),
    })

    const result = await response.json()

    if (result.code === 200) {
      return {
        success: true,
        wards: result.data || [],
      }
    } else {
      return {
        success: false,
        error: result.message,
        wards: [],
      }
    }
  } catch (error) {
    console.error('GHN Get Wards Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      wards: [],
    }
  }
}

// Get Service Types
export async function getGHNServiceTypes(from_district: number, to_district: number) {
  try {
    const response = await fetch(
      `${GHN_CONFIG.API_URL}/master-data/service?from_district=${from_district}&to_district=${to_district}`,
      {
        method: 'GET',
        headers: getGHNHeaders(),
      }
    )

    const result = await response.json()

    if (result.code === 200) {
      return {
        success: true,
        services: result.data || [],
      }
    } else {
      return {
        success: false,
        error: result.message,
        services: [],
      }
    }
  } catch (error) {
    console.error('GHN Get Services Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      services: [],
    }
  }
}
