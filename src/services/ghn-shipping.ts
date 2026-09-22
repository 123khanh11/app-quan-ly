/**
 * GHN Shipping Fee Service
 */

interface ShippingFeeRequest {
  to_district_id: number
  to_ward_code: string
  weight_gram?: number
  length_cm?: number
  width_cm?: number
  height_cm?: number
  cod_value?: number
  service_type_id?: number
  from_district_id?: number
  from_ward_code?: string
}

interface ShippingFeeResponse {
  success: boolean
  total_fee: number
  service_fee: number
  insurance_fee: number
  cod_fee: number
  [key: string]: any
}

/**
 * Calculate shipping fee from GHN
 */
export async function calculateShippingFee(
  params: ShippingFeeRequest
): Promise<ShippingFeeResponse> {
  try {
    const response = await fetch('/api/shipping-fee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_district_id: params.to_district_id,
        to_ward_code: params.to_ward_code,
        weight_gram: params.weight_gram || 500,
        length_cm: params.length_cm || 20,
        width_cm: params.width_cm || 15,
        height_cm: params.height_cm || 10,
        cod_value: params.cod_value || 0,
        service_type_id: params.service_type_id || 2,
        from_district_id: params.from_district_id,
        from_ward_code: params.from_ward_code
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to calculate shipping fee')
    }

    return data
  } catch (err) {
    console.error('Shipping fee calculation error:', err)
    throw err
  }
}

/**
 * Format shipping fee for display
 */
export function formatShippingFee(fee: number): string {
  return fee.toLocaleString('vi-VN') + 'đ'
}
