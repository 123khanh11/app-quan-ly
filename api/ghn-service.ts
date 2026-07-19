/**
 * Vercel Serverless Function - Get GHN Service Types
 * Endpoint: /api/ghn-service?from_district=1450&to_district=1542
 */

import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { from_district, to_district } = req.query

  if (!from_district || !to_district) {
    return res.status(400).json({ error: 'from_district and to_district are required' })
  }

  try {
    const token = process.env.GHN_TOKEN
    const shopId = process.env.GHN_SHOP_ID

    if (!token || !shopId) {
      return res.status(500).json({ error: 'GHN credentials not configured' })
    }

    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/master-data/service?from_district=${from_district}&to_district=${to_district}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Token': token,
          'ShopId': shopId,
        },
      }
    )

    const data = await response.json()

    if (data.code === 200) {
      return res.status(200).json({
        success: true,
        data: data.data || [],
      })
    } else {
      return res.status(400).json({
        success: false,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('GHN Service Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
