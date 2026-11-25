import { useState, useCallback, useRef, useEffect } from 'react'

export interface ShippingFeeParams {
  to_district_id: number
  to_ward_code: string
  weight?: number // grams (g) - default: 1000
  length?: number // centimeters (cm) - default: 20
  width?: number // centimeters (cm) - default: 20
  height?: number // centimeters (cm) - default: 20
  service_id?: number
  insurance_value?: number
  cod_value?: number
  coupon?: string
}

// Cache key: district_id:ward_code:weight:length:width:height
type ShippingCacheKey = string
interface ShippingCacheEntry {
  data: ShippingFeeData
  timestamp: number
}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes cache

export interface ShippingFeeData {
  total: number
  service_fee: number
  insurance_fee: number
  cod_fee: number
  pick_station_fee: number
  pick_remote_areas_fee: number
  deliver_remote_areas_fee: number
  coupon_value: number
  r2s_fee: number
  return_again: number
  document_return: number
  double_check: number
  cod_failed_fee: number
  change_to_address_fee: number
  change_return_address_fee: number
  return: number
}

export interface ShippingFeeResult {
  success: boolean
  data?: ShippingFeeData
  warning?: string
  error?: string
}

export interface UseShippingFeeState {
  loading: boolean
  data: ShippingFeeData | null
  error: string | null
  warning: string | null
}

/**
 * Hook to calculate shipping fee
 * Usage:
 * const { loading, data, error, calculateFee } = useShippingFee()
 * 
 * const result = await calculateFee({
 *   to_district_id: 1444,
 *   to_ward_code: '20308',
 *   weight: 600,
 * })
 */
export function useShippingFee() {
  const [state, setState] = useState<UseShippingFeeState>({
    loading: false,
    data: null,
    error: null,
    warning: null,
  })

  // Cache shipping fees to avoid recalculating same address
  const cacheRef = useRef<Map<ShippingCacheKey, ShippingCacheEntry>>(new Map())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastParamsRef = useRef<ShippingFeeParams | null>(null)

  const getCacheKey = (params: ShippingFeeParams): ShippingCacheKey => {
    return `${params.to_district_id}:${params.to_ward_code}:${params.weight || 1000}:${params.length || 20}:${params.width || 20}:${params.height || 20}`
  }

  const getCachedFee = (key: ShippingCacheKey): ShippingFeeData | null => {
    const entry = cacheRef.current.get(key)
    if (!entry) return null
    
    // Check if cache expired
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cacheRef.current.delete(key)
      return null
    }
    
    return entry.data
  }

  const calculateFee = useCallback(
    async (params: ShippingFeeParams): Promise<ShippingFeeResult> => {
      // Check cache first
      const cacheKey = getCacheKey(params)
      const cachedData = getCachedFee(cacheKey)
      
      if (cachedData) {
        console.log('💾 [Cache Hit] Shipping fee from cache:', cachedData.total, 'VND')
        setState({
          loading: false,
          data: cachedData,
          error: null,
          warning: null,
        })
        return { success: true, data: cachedData }
      }

      setState({ loading: true, data: null, error: null, warning: null })

      try {
        // Validate required params
        if (!params.to_district_id || !params.to_ward_code) {
          const error = 'Missing required parameters: to_district_id, to_ward_code'
          setState({ loading: false, data: null, error, warning: null })
          return { success: false, error }
        }

        console.log('📞 Calculating shipping fee...', { district: params.to_district_id, ward: params.to_ward_code, weight: params.weight })

        // API endpoint - works on Vercel & local dev
        const response = await fetch('/api/shipping-fee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to_district_id: params.to_district_id,
            to_ward_code: params.to_ward_code,
            weight_gram: Math.max(params.weight || 1000, 200),
            length_cm: Math.max(params.length || 20, 10),
            width_cm: Math.max(params.width || 20, 10),
            height_cm: Math.max(params.height || 20, 10),
            cod_value: params.cod_value || 0,
            service_type_id: params.service_id,
          }),
        })

        const result: ShippingFeeResult = await response.json()

        if (result.success && result.data) {
          // Cache the result
          cacheRef.current.set(cacheKey, {
            data: result.data,
            timestamp: Date.now(),
          })

          setState({
            loading: false,
            data: result.data,
            error: null,
            warning: result.warning || null,
          })
          console.log('✅ Shipping fee calculated:', result.data.total, 'VND')
        } else {
          const error = result.error || 'Failed to calculate shipping fee'
          setState({
            loading: false,
            data: result.data || null,
            error,
            warning: result.warning || null,
          })
          console.error('❌ Shipping fee error:', error)
        }

        return result
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Network error'
        setState({
          loading: false,
          data: null,
          error,
          warning: null,
        })
        console.error('❌ Shipping fee request error:', err)
        return {
          success: false,
          error,
        }
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState({ loading: false, data: null, error: null, warning: null })
  }, [])

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    warning: state.warning,
    calculateFee,
    reset,
  }
}

/**
 * Format shipping fee to display
 * @param fee Fee in VNĐ
 * @returns Formatted string (e.g., "50.000 VNĐ")
 */
export function formatShippingFee(fee: number): string {
  return fee.toLocaleString('vi-VN') + ' VNĐ'
}

/**
 * Get shipping fee breakdown as readable text
 * @param data Shipping fee data
 * @returns Formatted breakdown
 */
export function getShippingFeeBreakdown(data: ShippingFeeData): {
  label: string
  amount: number
}[] {
  const items = [
    { label: 'Phí vận chuyển', amount: data.service_fee },
    { label: 'Phí bảo hiểm', amount: data.insurance_fee },
    { label: 'Phí COD', amount: data.cod_fee },
    { label: 'Phí đón tại ga', amount: data.pick_station_fee },
    { label: 'Phí khu vực xa (nhận)', amount: data.pick_remote_areas_fee },
    { label: 'Phí khu vực xa (giao)', amount: data.deliver_remote_areas_fee },
    { label: 'Giảm giá', amount: -data.coupon_value },
  ]

  return items.filter((item) => item.amount > 0)
}
