/**
 * GHN Database Service
 * 
 * Query dữ liệu từ Supabase (sau khi chạy sync-ghn-data.ts)
 * Thay vì gọi GHN API liên tục
 * 
 * Được gọi trong CheckoutForm.tsx
 */

import { supabase } from './supabase'

/**
 * Get all provinces from database
 */
export async function getProvincesFromDB() {
  try {
    const { data, error } = await supabase
      .from('ghn_provinces')
      .select('*')
      .order('province_name', { ascending: true })

    if (error) throw error

    return {
      success: true,
      provinces: data || [],
    }
  } catch (error) {
    console.error('❌ Error fetching provinces:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      provinces: [],
    }
  }
}

/**
 * Get districts by province_id
 */
export async function getDistrictsFromDB(provinceId: number) {
  try {
    const { data, error } = await supabase
      .from('ghn_districts')
      .select('*')
      .eq('province_id', provinceId)
      .order('district_name', { ascending: true })

    if (error) throw error

    return {
      success: true,
      districts: data || [],
    }
  } catch (error) {
    console.error(`❌ Error fetching districts for province ${provinceId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      districts: [],
    }
  }
}

/**
 * Get wards by district_id
 */
export async function getWardsFromDB(districtId: number) {
  try {
    const { data, error } = await supabase
      .from('ghn_wards')
      .select('*')
      .eq('district_id', districtId)
      .order('ward_name', { ascending: true })

    if (error) throw error

    return {
      success: true,
      wards: data || [],
    }
  } catch (error) {
    console.error(`❌ Error fetching wards for district ${districtId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      wards: [],
    }
  }
}

/**
 * Get ward full info (with district and province name)
 */
export async function getWardFullInfo(wardCode: string, districtId: number) {
  try {
    const { data, error } = await supabase
      .from('v_wards_full_info')
      .select('*')
      .eq('ward_code', wardCode)
      .eq('district_id', districtId)
      .single()

    if (error) throw error

    return {
      success: true,
      ward: data,
    }
  } catch (error) {
    console.error(`❌ Error fetching ward ${wardCode}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      ward: null,
    }
  }
}

/**
 * Search districts by name
 */
export async function searchDistrictsByName(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from('ghn_districts')
      .select('*')
      .ilike('district_name', `%${searchTerm}%`)
      .limit(20)

    if (error) throw error

    return {
      success: true,
      districts: data || [],
    }
  } catch (error) {
    console.error(`❌ Error searching districts:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      districts: [],
    }
  }
}

/**
 * Get statistics
 */
export async function getLocationStats() {
  try {
    // Count provinces
    const { count: provinceCount } = await supabase
      .from('ghn_provinces')
      .select('*', { count: 'exact', head: true })

    // Count districts
    const { count: districtCount } = await supabase
      .from('ghn_districts')
      .select('*', { count: 'exact', head: true })

    // Count wards
    const { count: wardCount } = await supabase
      .from('ghn_wards')
      .select('*', { count: 'exact', head: true })

    return {
      success: true,
      stats: {
        provinces: provinceCount || 0,
        districts: districtCount || 0,
        wards: wardCount || 0,
      },
    }
  } catch (error) {
    console.error('❌ Error fetching stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stats: null,
    }
  }
}

/**
 * Get all data for a specific district (with wards)
 */
export async function getDistrictWithWards(districtId: number) {
  try {
    // Get district info
    const { data: district, error: districtError } = await supabase
      .from('ghn_districts')
      .select('*')
      .eq('district_id', districtId)
      .single()

    if (districtError) throw districtError

    // Get wards for this district
    const { data: wards, error: wardsError } = await supabase
      .from('ghn_wards')
      .select('*')
      .eq('district_id', districtId)
      .order('ward_name', { ascending: true })

    if (wardsError) throw wardsError

    return {
      success: true,
      district,
      wards: wards || [],
    }
  } catch (error) {
    console.error(`❌ Error fetching district ${districtId} with wards:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      district: null,
      wards: [],
    }
  }
}

/**
 * Validate address (check if combination exists)
 */
export async function validateAddress(provinceId: number, districtId: number, wardCode: string) {
  try {
    // Check if ward exists
    const { data, error } = await supabase
      .from('ghn_wards')
      .select('*')
      .eq('province_id', provinceId)
      .eq('district_id', districtId)
      .eq('ward_code', wardCode)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found

    return {
      success: !!data,
      valid: !!data,
      ward: data || null,
    }
  } catch (error) {
    console.error('❌ Error validating address:', error)
    return {
      success: false,
      valid: false,
      ward: null,
    }
  }
}
