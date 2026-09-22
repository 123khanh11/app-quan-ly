import { useState, useCallback } from 'react'

export interface ShippingFeeParams {
  to_district_id: number
  to_ward_code: string
  weight?: number // gram, default: 1000
  length?: number // cm, default: 20
  width?: number // cm, default: 20
  height?: number // cm, default: 20
  service_id?: number
  insurance_value?: number
  cod_value?: number
  coupon?: string
}

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

  const calculateFee = useCallback(
    async (params: ShippingFeeParams): Promise<ShippingFeeResult> => {
      setState({ loading: true, data: null, error: null, warning: null })

      try {
        // Validate required params
        if (!params.to_district_id || !params.to_ward_code) {
          const error = 'Missing required parameters: to_district_id, to_ward_code'
          setState({ loading: false, data: null, error, warning: null })
          return { success: false, error }
        }

        console.log('📞 Calculating shipping fee...', params)

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
