/**
 * GHN API Server Handler
 * This file contains functions to call GHN API from the backend
 * Token is kept secure on the server, never exposed to frontend
 */

const GHN_CONFIG = {
  TOKEN: process.env.GHN_TOKEN || '',
  SHOP_ID: parseInt(process.env.GHN_SHOP_ID || '0'),
  API_URL: process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2',
  FROM_DISTRICT_ID: parseInt(process.env.GHN_FROM_DISTRICT_ID || '1455'),
  FROM_WARD_CODE: process.env.GHN_FROM_WARD_CODE || '21617',
}

// Helper to get GHN headers (server-side)
function getGHNHeaders() {
  return {
    'Content-Type': 'application/json',
    'Token': GHN_CONFIG.TOKEN,
    'ShopId': GHN_CONFIG.SHOP_ID.toString(),
  }
}

/**
 * Get Provinces from GHN
 */
export async function getProvinces() {
  try {
    const res = await fetch(`${GHN_CONFIG.API_URL}/master-data/province`, {
      method: 'GET',
      headers: getGHNHeaders(),
    })

    const data = await res.json()

    if (data.code === 200) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.message,
        data: [],
      }
    }
  } catch (error) {
    console.error('GHN Get Provinces Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

/**
 * Get Districts for a Province
 */
export async function getDistricts(provinceId: number) {
  try {
    const res = await fetch(`${GHN_CONFIG.API_URL}/master-data/district?province_id=${provinceId}`, {
      method: 'GET',
      headers: getGHNHeaders(),
    })

    const data = await res.json()

    if (data.code === 200) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.message,
        data: [],
      }
    }
  } catch (error) {
    console.error('GHN Get Districts Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

/**
 * Get Wards for a District
 */
export async function getWards(districtId: number) {
  try {
    const res = await fetch(`${GHN_CONFIG.API_URL}/master-data/ward?district_id=${districtId}`, {
      method: 'GET',
      headers: getGHNHeaders(),
    })

    const data = await res.json()

    if (data.code === 200) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.message,
        data: [],
      }
    }
  } catch (error) {
    console.error('GHN Get Wards Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

/**
 * Get Service Types (to find service_id)
 */
export async function getServiceTypes(fromDistrictId: number, toDistrictId: number) {
  try {
    const res = await fetch(
      `${GHN_CONFIG.API_URL}/master-data/service?from_district=${fromDistrictId}&to_district=${toDistrictId}`,
      {
        method: 'GET',
        headers: getGHNHeaders(),
      }
    )

    const data = await res.json()

    if (data.code === 200) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.message,
        data: [],
      }
    }
  } catch (error) {
    console.error('GHN Get Services Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

/**
 * Calculate Shipping Fee
 */
export async function calculateShippingFee(params: {
  service_id: number
  from_district_id: number
  from_ward_code: string
  to_district_id: number
  to_ward_code: string
  weight: number
  length?: number
  width?: number
  height?: number
  insurance_value?: number
  coupon?: string
}) {
  try {
    const res = await fetch(`${GHN_CONFIG.API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: getGHNHeaders(),
      body: JSON.stringify({
        service_id: params.service_id,
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
      }),
    })

    const data = await res.json()

    if (data.code === 200) {
      return {
        success: true,
        data: data.data,
      }
    } else {
      return {
        success: false,
        error: data.message,
        data: null,
      }
    }
  } catch (error) {
    console.error('GHN Calculate Fee Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}

/**
 * Create Shipping Order
 */
export async function createShippingOrder(orderData: {
  service_id: number
  from_district_id: number
  from_ward_code: string
  to_district_id: number
  to_ward_code: string
  to_name: string
  to_phone: string
  to_address: string
  weight: number
  length?: number
  width?: number
  height?: number
  insurance_value?: number
  cod_value?: number
  content: string
  items?: Array<{
    name: string
    quantity: number
    length?: number
    width?: number
    height?: number
    weight?: number
  }>
}) {
  try {
    const res = await fetch(`${GHN_CONFIG.API_URL}/shipping-order/create`, {
      method: 'POST',
      headers: getGHNHeaders(),
      body: JSON.stringify({
        service_id: orderData.service_id,
        from_district_id: orderData.from_district_id,
        from_ward_code: orderData.from_ward_code,
        to_district_id: orderData.to_district_id,
        to_ward_code: orderData.to_ward_code,
        to_name: orderData.to_name,
        to_phone: orderData.to_phone,
        to_address: orderData.to_address,
        weight: orderData.weight,
        length: orderData.length || 0,
        width: orderData.width || 0,
        height: orderData.height || 0,
        insurance_value: orderData.insurance_value || 0,
        cod_value: orderData.cod_value || 0,
        content: orderData.content,
        items: orderData.items || [],
      }),
    })

    const data = await res.json()

    if (data.code === 200) {
      return {
        success: true,
        data: data.data,
      }
    } else {
      return {
        success: false,
        error: data.message,
        data: null,
      }
    }
  } catch (error) {
    console.error('GHN Create Order Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}

export { GHN_CONFIG }
