/**
 * GHN Data - Query từ Supabase directly
 * (Thay vì gọi /api endpoints)
 */

import { supabase } from './supabase'

export interface District {
  district_id: number
  district_name: string
}

export interface Ward {
  ward_code: string
  ward_name: string
}

/**
 * Lấy danh sách quận/huyện theo tỉnh
 */
export async function getDistricts(provinceId: number) {
  try {
    const { data, error } = await supabase
      .from('ghn_districts')
      .select('district_id, district_name')
      .eq('province_id', provinceId)
      .order('district_name', { ascending: true })

    if (error) {
      console.error('Error fetching districts:', error)
      return { success: false, error: error.message, districts: [] }
    }

    return { success: true, districts: data || [] }
  } catch (err) {
    console.error('Error:', err)
    return { success: false, error: 'Network error', districts: [] }
  }
}

/**
 * Lấy danh sách phường/xã theo quận
 */
export async function getWards(districtId: number) {
  try {
    const { data, error } = await supabase
      .from('ghn_wards')
      .select('ward_code, ward_name')
      .eq('district_id', districtId)
      .order('ward_name', { ascending: true })

    if (error) {
      console.error('Error fetching wards:', error)
      return { success: false, error: error.message, wards: [] }
    }

    return { success: true, wards: data || [] }
  } catch (err) {
    console.error('Error:', err)
    return { success: false, error: 'Network error', wards: [] }
  }
}

/**
 * Tính phí vận chuyển - Gọi GHN API trực tiếp
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
  coupon?: string | null
}) {
  try {
    const ghnToken = import.meta.env.VITE_GHN_TOKEN
    const ghnShopId = import.meta.env.VITE_GHN_SHOP_ID
    const ghnApiUrl = import.meta.env.VITE_GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2'

    if (!ghnToken || !ghnShopId) {
      console.warn('⚠️ GHN credentials missing, using fallback estimation')
      const estimatedFee = Math.max(30000, 30000 + (Math.ceil(params.weight / 1000) - 1) * 5000)
      return {
        success: true,
        data: {
          total: estimatedFee,
          service_fee: estimatedFee,
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
        },
      }
    }

    console.log('📡 Calling GHN API directly with params:', params)

    const response = await fetch(`${ghnApiUrl}/shipping-order/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': ghnToken,
        'ShopId': ghnShopId,
      },
      body: JSON.stringify(params),
    })

    const data = (await response.json()) as any

    console.log('📥 GHN API Response:', data)

    if (data.code === 200 && data.data) {
      return {
        success: true,
        data: data.data,
      }
    } else {
      console.warn('⚠️ GHN API error:', data.message)
      // Fallback to estimation
      const estimatedFee = Math.max(30000, 30000 + (Math.ceil(params.weight / 1000) - 1) * 5000)
      return {
        success: true,
        data: {
          total: estimatedFee,
          service_fee: estimatedFee,
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
        },
      }
    }
  } catch (err) {
    console.error('❌ Error calculating shipping:', err)
    // Fallback to estimation
    const estimatedFee = Math.max(30000, 30000 + (Math.ceil(params.weight / 1000) - 1) * 5000)
    return {
      success: true,
      data: {
        total: estimatedFee,
        service_fee: estimatedFee,
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
      },
    }
  }
}
