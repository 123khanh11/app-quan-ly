import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { province_id } = req.query

    if (!province_id) {
      return res.status(400).json({
        success: false,
        error: 'province_id is required',
        data: [],
      })
    }

    const GHN_TOKEN = process.env.GHN_TOKEN
    const GHN_SHOP_ID = process.env.GHN_SHOP_ID

    console.log('🔍 GHN Districts Request:', {
      province_id,
      hasToken: !!GHN_TOKEN,
      hasShopId: !!GHN_SHOP_ID,
    })

    if (!GHN_TOKEN || !GHN_SHOP_ID) {
      console.error('❌ GHN credentials missing!')
      return res.status(500).json({
        success: false,
        error: 'GHN credentials not configured on server',
        data: [],
      })
    }

    const url = `https://online-gateway.ghn.vn/shiip/public-api/v2/master-data/district?province_id=${province_id}`
    console.log('📡 Calling GHN API:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID,
      },
    })

    console.log('📥 GHN Response Status:', response.status)

    const contentType = response.headers.get('content-type')
    console.log('Content-Type:', contentType)

    let data: any
    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error('❌ Non-JSON response:', text.substring(0, 200))
      return res.status(502).json({
        success: false,
        error: 'GHN API returned non-JSON response',
        data: [],
      })
    }

    console.log('📊 GHN Data:', data)

    if (data.code === 200) {
      console.log('✅ Success:', data.data?.length, 'districts')
      return res.status(200).json({
        success: true,
        data: data.data || [],
      })
    } else {
      console.error('❌ GHN API Error:', data.message)
      return res.status(400).json({
        success: false,
        error: data.message || 'Unknown GHN error',
        data: [],
      })
    }
  } catch (error) {
    console.error('❌ GHN Districts Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error',
      data: [],
    })
  }
}
