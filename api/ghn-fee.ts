/**
 * Vercel Serverless Function - Calculate GHN Shipping Fee
 * Endpoint: /api/ghn-fee (POST)
 */

import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    service_id,
    from_district_id,
    from_ward_code,
    to_district_id,
    to_ward_code,
    weight,
    length = 0,
    width = 0,
    height = 0,
    insurance_value = 0,
    coupon = null,
  } = req.body

  if (!service_id || !from_district_id || !to_district_id || !to_ward_code || !weight) {
    return res.status(400).json({
      error: 'Missing required parameters: service_id, from_district_id, to_district_id, to_ward_code, weight',
    })
  }

  try {
    const token = process.env.GHN_TOKEN
    const shopId = process.env.GHN_SHOP_ID

    if (!token || !shopId) {
      return res.status(500).json({ error: 'GHN credentials not configured' })
    }

    const response = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
        'ShopId': shopId,
      },
      body: JSON.stringify({
        service_id,
        from_district_id,
        from_ward_code,
        to_district_id,
        to_ward_code,
        weight,
        length,
        width,
        height,
        insurance_value,
        coupon,
      }),
    })

    const data = await response.json()

    if (data.code === 200) {
      return res.status(200).json({
        success: true,
        data: data.data,
      })
    } else {
      return res.status(400).json({
        success: false,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('GHN Fee Calculation Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
