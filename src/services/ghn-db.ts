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
 * Lấy danh sách service có sẵn giữa 2 địa điểm
 * According to GHN API spec: /shipping-order/available-services
 * NOTE: This function should only be called from server (API routes)
 */
export async function getAvailableServices(params: {
  from_district_id: number
  to_district_id: number
}) {
  try {
    const ghnToken = import.meta.env.VITE_GHN_TOKEN
    const ghnShopId = import.meta.env.VITE_GHN_SHOP_ID
    
    // Check if running in browser - cannot access GHN API from client
    if (typeof window !== 'undefined' && !ghnToken) {
      console.warn('⚠️ GHN credentials not available - must be called from server')
      return { success: false, services: [] }
    }

    const ghnApiUrl = import.meta.env.VITE_GHN_API_URL || 'https://online-gateway.ghn.vn/shiip/public-api/v2'

    if (!ghnToken || !ghnShopId) {
      console.warn('⚠️ GHN credentials missing')
      return { success: false, services: [] }
    }

    console.log('📡 Calling GHN Available Services API')

    const response = await fetch(`${ghnApiUrl}/shipping-order/available-services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': ghnToken,
        'ShopId': ghnShopId,
      },
      body: JSON.stringify(params),
    })

    const data = (await response.json()) as any

    if (data.code === 200 && data.data && Array.isArray(data.data) && data.data.length > 0) {
      const services = data.data.map((s: any) => ({
        service_id: s.service_id,
        service_name: s.short_name || `Service ${s.service_id}`,
        service_type_id: s.service_type_id,
      }))
      console.log('✅ Found services:', services.map((s: any) => s.service_id))
      return {
        success: true,
        services: services,
      }
    } else {
      console.warn('⚠️ No services available for this route')
      return { success: false, services: [], error: data.message || 'No services available' }
    }
  } catch (err) {
    console.error('❌ Error fetching available services:', err)
    return { success: false, services: [], error: String(err) }
  }
}

/**
 * Tính phí vận chuyển - Gọi GHN API trực tiếp
 * According to GHN API spec: /shipping-order/fee
 * NOTE: This function should only be called from server (API routes)
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
}): Promise<{
  success: boolean
  error?: string
  data: any | null
}> {
  try {
    const ghnToken = import.meta.env.VITE_GHN_TOKEN
    const ghnShopId = import.meta.env.VITE_GHN_SHOP_ID
    
    // Check if running in browser - cannot access GHN API from client
    if (typeof window !== 'undefined' && !ghnToken) {
      console.warn('⚠️ Cannot call GHN API from browser - must use /api/shipping/fee endpoint')
      return { success: false, error: 'Browser cannot call GHN API', data: null }
    }

    const ghnApiUrl = import.meta.env.VITE_GHN_API_URL || 'https://online-gateway.ghn.vn/shiip/public-api/v2'

    if (!ghnToken || !ghnShopId) {
      console.warn('⚠️ GHN credentials missing, using estimation')
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

    console.log('📡 Calling GHN Fee API with service:', params.service_id)

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

    if (data.code === 200 && data.data) {
      console.log('✅ GHN Fee calculated:', data.data.total)
      return {
        success: true,
        data: data.data,
      }
    } else if (data.code === 400 && data.message && data.message.includes('route not found')) {
      console.warn('⚠️ Route/service not available, using estimation')
      const estimatedFee = Math.max(30000, 30000 + (Math.ceil(params.weight / 1000) - 1) * 5000)
      return {
        success: true,
        data: {
          total: estimatedFee,
          service_fee: estimatedFee,
          insurance_fee: 0,
          pick_station_fee: 0,
          pick_remote_areas_fee: 0,
          deliver_remote_areas_fee: 0,
          cod_fee: 0,
          coupon_value: 0,
          r2s_fee: 0,
          document_return: 0,
          double_check: 0,
          cod_failed_fee: 0,
        },
      }
    } else {
      console.error('❌ GHN API error:', data.message)
      return {
        success: false,
        error: data.message || 'GHN API error',
        data: null,
      }
    }
  } catch (err) {
    console.error('❌ Error calling GHN Fee API:', err)
    return {
      success: false,
      error: String(err),
      data: null,
    }
  }
}
