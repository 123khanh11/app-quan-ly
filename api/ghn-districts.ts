/**
 * Vercel Serverless Function - Get GHN Districts
 * Endpoint: /api/ghn-districts?province_id=201
 */

import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { province_id } = req.query

  if (!province_id) {
    return res.status(400).json({ error: 'province_id is required' })
  }

  try {
    const token = process.env.GHN_TOKEN
    const shopId = process.env.GHN_SHOP_ID

    if (!token || !shopId) {
      return res.status(500).json({ error: 'GHN credentials not configured' })
    }

    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/master-data/district?province_id=${province_id}`,
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
    console.error('GHN Districts Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
