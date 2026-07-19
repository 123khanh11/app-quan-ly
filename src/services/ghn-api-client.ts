/**
 * GHN API Client (Frontend)
 * Calls our Vercel API routes which securely call GHN
 * Token never exposed to frontend
 */

const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''

/**
 * Get Provinces
 */
export async function getProvinces() {
  try {
    const res = await fetch(`${API_BASE}/api/ghn-provinces`)
    const data = await res.json()

    if (data.success) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error,
        data: [],
      }
    }
  } catch (error) {
    console.error('Get Provinces Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

/**
 * Get Districts
 */
export async function getDistricts(provinceId: number) {
  try {
    const res = await fetch(`${API_BASE}/api/ghn-districts?province_id=${provinceId}`)
    const data = await res.json()

    if (data.success) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error,
        data: [],
      }
    }
  } catch (error) {
    console.error('Get Districts Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

/**
 * Get Wards
 */
export async function getWards(districtId: number) {
  try {
    const res = await fetch(`${API_BASE}/api/ghn-wards?district_id=${districtId}`)
    const data = await res.json()

    if (data.success) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error,
        data: [],
      }
    }
  } catch (error) {
    console.error('Get Wards Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

/**
 * Get Service Types
 */
export async function getServiceTypes(fromDistrict: number, toDistrict: number) {
  try {
    const res = await fetch(`${API_BASE}/api/ghn-service?from_district=${fromDistrict}&to_district=${toDistrict}`)
    const data = await res.json()

    if (data.success) {
      return {
        success: true,
        data: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error,
        data: [],
      }
    }
  } catch (error) {
    console.error('Get Services Error:', error)
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
    const res = await fetch(`${API_BASE}/api/ghn-fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    const data = await res.json()

    if (data.success) {
      return {
        success: true,
        data: data.data,
      }
    } else {
      return {
        success: false,
        error: data.error,
        data: null,
      }
    }
  } catch (error) {
    console.error('Calculate Fee Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }
  }
}
