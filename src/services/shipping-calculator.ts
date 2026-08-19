/**
 * Shipping Fee Calculator Service
 * Tính toán phí vận chuyển dựa trên:
 * - Cân nặng sản phẩm
 * - Kích thước bưu kiện
 * - Khoảng cách (từ shop → khách)
 * - Loại dịch vụ GHN
 */

import { calculateShippingFee, getAvailableServices } from './ghn-db'

/**
 * Product item with shipping info
 */
export interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  weight?: number // gram (mặc định: 500g)
  length?: number // cm (mặc định: 20cm)
  width?: number // cm (mặc định: 20cm)
  height?: number // cm (mặc định: 20cm)
}

/**
 * Shipping calculation result
 */
export interface ShippingResult {
  success: boolean
  total: number // Tổng phí (VNĐ)
  details?: {
    service_fee: number
    insurance_fee: number
    pick_station_fee: number
    pick_remote_areas_fee: number
    deliver_remote_areas_fee: number
    cod_fee: number
  }
  error?: string
}

/**
 * Shop location (cố định)
 * Hà Đông, Hà Nội
 */
const SHOP_INFO = {
  name: 'Shop',
  district_id: 1455,
  ward_code: '21617',
}

/**
 * Tính tổng cân nặng từ giỏ hàng
 * @param items - Danh sách sản phẩm trong giỏ
 * @returns Tổng cân nặng (gram)
 */
export function calculateTotalWeight(items: CartItem[]): number {
  if (!items || items.length === 0) {
    return 1000 // Min 1kg
  }

  let totalWeight = 0

  items.forEach((item) => {
    // Weight per item: default 500g if not specified
    const itemWeight = item.weight || 500
    // Total weight for this item: weight * quantity
    totalWeight += itemWeight * item.quantity
  })

  // Ensure minimum weight: 1kg (1000g)
  return Math.max(totalWeight, 1000)
}

/**
 * Tính kích thước bưu kiện từ giỏ hàng
 * @param items - Danh sách sản phẩm trong giỏ
 * @returns { length, width, height } in cm
 */
export function calculateDimensions(items: CartItem[]): {
  length: number
  width: number
  height: number
} {
  if (!items || items.length === 0) {
    return { length: 20, width: 20, height: 20 }
  }

  let maxLength = 0
  let maxWidth = 0
  let totalHeight = 0

  items.forEach((item) => {
    const itemLength = item.length || 20
    const itemWidth = item.width || 20
    const itemHeight = item.height || 20

    // Length & Width: take the max
    maxLength = Math.max(maxLength, itemLength)
    maxWidth = Math.max(maxWidth, itemWidth)

    // Height: sum up all items
    totalHeight += itemHeight * item.quantity
  })

  // Ensure minimum dimensions: 20x20x20cm
  return {
    length: Math.max(maxLength, 20),
    width: Math.max(maxWidth, 20),
    height: Math.max(totalHeight, 20),
  }
}

/**
 * Estimate shipping fee WITHOUT calling GHN API
 * (For quick preview, before API call)
 * @param weight - Total weight in gram
 * @param distance - Distance category: 'local' | 'province' | 'remote'
 * @returns Estimated fee in VNĐ
 */
export function estimateShippingFee(
  weight: number,
  distance: 'local' | 'province' | 'remote' = 'province'
): number {
  // Convert gram to kg for calculation
  const weightKg = weight / 1000

  // Base fee by distance
  let baseFee = 0
  switch (distance) {
    case 'local': // Same district
      baseFee = 20000 // 20k base
      break
    case 'province': // Different province
      baseFee = 35000 // 35k base
      break
    case 'remote': // Remote area
      baseFee = 50000 // 50k base
      break
    default:
      baseFee = 35000
  }

  // Weight surcharge: 5k per kg
  const weightSurcharge = Math.max(0, (weightKg - 1) * 5000)

  // Total estimate
  return baseFee + weightSurcharge
}

/**
 * Main function: Calculate shipping fee from GHN API
 * @param items - Cart items
 * @param toDistrictId - Destination district ID
 * @param toWardCode - Destination ward code
 * @param serviceId - GHN service type (optional, will auto-detect if not provided)
 * @returns Shipping fee result
 */
export async function calculateShipping(
  items: CartItem[],
  toDistrictId: number,
  toWardCode: string,
  serviceId?: number
): Promise<ShippingResult> {
  try {
    // Validate inputs
    if (!items || items.length === 0) {
      return {
        success: false,
        total: 0,
        error: 'Giỏ hàng trống',
      }
    }

    if (!toDistrictId || !toWardCode) {
      return {
        success: false,
        total: 0,
        error: 'Địa chỉ giao hàng không hợp lệ',
      }
    }

    // Calculate weight & dimensions
    const totalWeight = calculateTotalWeight(items)
    const dimensions = calculateDimensions(items)

    // Log calculation
    console.log('📦 Shipping Calculation:', {
      items: items.length,
      weight: totalWeight,
      dimensions,
      toDistrict: toDistrictId,
      toWard: toWardCode,
    })

    // Get available services if not provided
    let finalServiceId = serviceId
    if (!finalServiceId) {
      try {
        const servicesResult = await getAvailableServices({
          from_district_id: SHOP_INFO.district_id,
          to_district_id: toDistrictId,
        })

        if (servicesResult.success && servicesResult.services && Array.isArray(servicesResult.services) && servicesResult.services.length > 0) {
          // Use first available service (usually standard delivery)
          finalServiceId = servicesResult.services[0].service_id
          console.log('✅ Using service:', finalServiceId, servicesResult.services[0].service_name)
        } else {
          // Fallback to service 2 if no services available
          finalServiceId = 2
          console.warn('⚠️ No services found, using default service 2')
        }
      } catch (err) {
        console.error('❌ Error fetching services:', err)
        finalServiceId = 2
      }
    }

    // Call GHN API
    const result = await calculateShippingFee({
      service_id: finalServiceId,
      from_district_id: SHOP_INFO.district_id,
      from_ward_code: SHOP_INFO.ward_code,
      to_district_id: toDistrictId,
      to_ward_code: toWardCode,
      weight: totalWeight,
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      insurance_value: 0,
      coupon: null,
    })

    if (!result.success) {
      // Fallback to estimation
      console.warn('⚠️ GHN API failed, using estimation')
      const estimatedFee = estimateShippingFee(totalWeight, 'province')
      return {
        success: true,
        total: estimatedFee,
        error: `Không thể lấy giá từ GHN. Ước tính: ${estimatedFee}`,
      }
    }

    // Success
    return {
      success: true,
      total: result.data?.total || 50000,
      details: {
        service_fee: result.data?.service_fee || 0,
        insurance_fee: result.data?.insurance_fee || 0,
        pick_station_fee: result.data?.pick_station_fee || 0,
        pick_remote_areas_fee: result.data?.pick_remote_areas_fee || 0,
        deliver_remote_areas_fee: result.data?.deliver_remote_areas_fee || 0,
        cod_fee: result.data?.cod_fee || 0,
      },
    }
  } catch (error) {
    console.error('❌ Shipping calculation error:', error)
    // Fallback to default
    const estimatedFee = estimateShippingFee(1000, 'province')
    return {
      success: true,
      total: estimatedFee,
      error: 'Lỗi tính phí, đang dùng giá ước tính',
    }
  }
}

/**
 * Format shipping fee to display
 * @param fee - Fee in VNĐ
 * @returns Formatted string
 */
export function formatShippingFee(fee: number): string {
  return fee.toLocaleString('vi-VN') + ' VNĐ'
}

/**
 * Get distance category between two districts
 * @param fromDistrictId - Source district
 * @param toDistrictId - Destination district
 * @returns Distance category
 */
export function getDistanceCategory(
  fromDistrictId: number,
  toDistrictId: number
): 'local' | 'province' | 'remote' {
  // Same district
  if (fromDistrictId === toDistrictId) {
    return 'local'
  }

  // Hanoi/HCMC districts - different district but same city
  const hanoiDistricts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1455]
  const hcmDistricts = [1, 3, 4, 5, 6, 7, 8, 10, 11, 12, 201, 202, 203, 204, 205, 206]

  const isFromHanoi = hanoiDistricts.includes(fromDistrictId)
  const isFromHCM = hcmDistricts.includes(fromDistrictId)
  const isToHanoi = hanoiDistricts.includes(toDistrictId)
  const isToHCM = hcmDistricts.includes(toDistrictId)

  // Same city, different district
  if ((isFromHanoi && isToHanoi) || (isFromHCM && isToHCM)) {
    return 'province'
  }

  // Different city or remote area
  return 'remote'
}

/**
 * Calculate summary: subtotal + shipping
 * @param items - Cart items with prices
 * @param shippingFee - Calculated shipping fee
 * @returns { subtotal, shipping, total }
 */
export function calculateOrderSummary(
  items: CartItem[],
  shippingFee: number
): {
  subtotal: number
  shipping: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    subtotal,
    shipping: shippingFee,
    total: subtotal + shippingFee,
  }
}

/**
 * Validate cart items before checkout
 * @param items - Cart items
 * @returns { valid, errors }
 */
export function validateCartItems(items: CartItem[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!items || items.length === 0) {
    errors.push('Giỏ hàng trống')
    return { valid: false, errors }
  }

  items.forEach((item, index) => {
    if (!item.product_id) {
      errors.push(`Sản phẩm ${index + 1}: Thiếu product_id`)
    }
    if (!item.name) {
      errors.push(`Sản phẩm ${index + 1}: Thiếu tên sản phẩm`)
    }
    if (item.price <= 0) {
      errors.push(`Sản phẩm ${index + 1}: Giá không hợp lệ`)
    }
    if (item.quantity <= 0) {
      errors.push(`Sản phẩm ${index + 1}: Số lượng không hợp lệ`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
