/**
 * GHN API Client - Frontend
 * 
 * Gọi backend API thay vì gọi GHN API trực tiếp
 * Token được bảo vệ trên server
 * 
 * API Base URL: http://localhost:5000 (dev) hoặc /api (production)
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'

// ============================================
// 1. LẤY DANH SÁCH TỈNH/THÀNH PHỐ
// ============================================
export async function getProvinces() {
  try {
    const response = await fetch(`${API_BASE_URL}/ghn/province`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        provinces: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error || 'Lỗi lấy danh sách tỉnh',
        provinces: [],
      }
    }
  } catch (error) {
    console.error('Get Provinces Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi kết nối',
      provinces: [],
    }
  }
}

// ============================================
// 2. LẤY DANH SÁCH QUẬN/HUYỆN
// ============================================
export async function getDistricts(province_id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/ghn/district?province_id=${province_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        districts: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error || 'Lỗi lấy danh sách quận/huyện',
        districts: [],
      }
    }
  } catch (error) {
    console.error('Get Districts Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi kết nối',
      districts: [],
    }
  }
}

// ============================================
// 3. LẤY DANH SÁCH XÃ/PHƯỜNG
// ============================================
export async function getWards(district_id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/ghn/ward?district_id=${district_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        wards: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error || 'Lỗi lấy danh sách xã/phường',
        wards: [],
      }
    }
  } catch (error) {
    console.error('Get Wards Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi kết nối',
      wards: [],
    }
  }
}

// ============================================
// 4. LẤY DANH SÁCH DỊCH VỤ
// ============================================
export async function getServices(from_district: number, to_district: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ghn/service?from_district=${from_district}&to_district=${to_district}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        services: data.data || [],
      }
    } else {
      return {
        success: false,
        error: data.error || 'Lỗi lấy danh sách dịch vụ',
        services: [],
      }
    }
  } catch (error) {
    console.error('Get Services Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi kết nối',
      services: [],
    }
  }
}

// ============================================
// 5. TÍNH PHÍ VẬN CHUYỂN
// ============================================
export interface CalculateFeeParams {
  service_id: number // Service ID từ GHN
  from_district_id: number // District ID nơi gửi (từ shop)
  from_ward_code?: string // Ward code nơi gửi (từ shop)
  to_district_id: number // District ID nơi nhận (từ customer)
  to_ward_code: string // Ward code nơi nhận (từ customer)
  weight: number // Cân nặng (gram)
  length?: number // Chiều dài (cm)
  width?: number // Chiều rộng (cm)
  height?: number // Chiều cao (cm)
  insurance_value?: number // Giá trị bảo hiểm
  coupon?: string | null // Mã giảm giá
}

export async function calculateShippingFee(params: CalculateFeeParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/ghn/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        data: {
          total: data.data.total,
          service_fee: data.data.service_fee,
          insurance_fee: data.data.insurance_fee,
          pick_station_fee: data.data.pick_station_fee,
          coupon_value: data.data.coupon_value,
          r2s_fee: data.data.r2s_fee,
          document_return: data.data.document_return,
          double_check: data.data.double_check,
          cod_fee: data.data.cod_fee,
          pick_remote_areas_fee: data.data.pick_remote_areas_fee,
          deliver_remote_areas_fee: data.data.deliver_remote_areas_fee,
          cod_failed_fee: data.data.cod_failed_fee,
        },
      }
    } else {
      return {
        success: false,
        error: data.error || 'Lỗi tính phí vận chuyển',
      }
    }
  } catch (error) {
    console.error('Calculate Shipping Fee Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi kết nối',
    }
  }
}
