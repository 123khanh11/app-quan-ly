/**
 * API Route: /api/shipping/fee
 * Purpose: Calculate shipping fee via GHN API (server-side)
 */

const GHN_CONFIG = {
  TOKEN: process.env.GHN_TOKEN || '',
  SHOP_ID: parseInt(process.env.GHN_SHOP_ID || '0'),
  API_URL: process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2',
}

export async function POST(request: Request) {
  try {
    console.log('🔵 [/api/shipping/fee] Request received')
    
    const body = await request.json()
    console.log('📋 Request body:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.from_district_id || !body.to_district_id || body.weight === undefined) {
      console.warn('⚠️ Missing required fields:', {
        from_district_id: body.from_district_id,
        to_district_id: body.to_district_id,
        weight: body.weight,
      })
      return Response.json(
        {
          code: 400,
          message: 'Missing required fields: from_district_id, to_district_id, weight',
          data: null,
        },
        { status: 400 }
      )
    }

    // Check GHN credentials
    console.log('🔐 GHN Config:', {
      TOKEN: GHN_CONFIG.TOKEN ? '***' : 'MISSING',
      SHOP_ID: GHN_CONFIG.SHOP_ID || 'MISSING',
      API_URL: GHN_CONFIG.API_URL,
    })

    if (!GHN_CONFIG.TOKEN || !GHN_CONFIG.SHOP_ID) {
      console.error('❌ GHN credentials not configured')
      return Response.json(
        {
          code: 500,
          message: 'GHN credentials not configured',
          data: null,
        },
        { status: 500 }
      )
    }

    // Prepare GHN API request
    const payload = {
      service_id: body.service_id || 53320,
      from_district_id: body.from_district_id,
      from_ward_code: body.from_ward_code || '21617',
      to_district_id: body.to_district_id,
      to_ward_code: body.to_ward_code || '21012',
      weight: body.weight || 300,
      length: body.length || 15,
      width: body.width || 15,
      height: body.height || 15,
      insurance_value: body.insurance_value || 0,
      coupon: body.coupon || null,
    }

    console.log('📡 Sending to GHN API:')
    console.log('  URL:', `${GHN_CONFIG.API_URL}/shipping-order/fee`)
    console.log('  Payload:', JSON.stringify(payload, null, 2))
    console.log('  Headers:', {
      'Content-Type': 'application/json',
      Token: '***',
      ShopId: GHN_CONFIG.SHOP_ID,
    })

    // Call GHN API
    const ghnResponse = await fetch(`${GHN_CONFIG.API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Token: GHN_CONFIG.TOKEN,
        ShopId: GHN_CONFIG.SHOP_ID.toString(),
      },
      body: JSON.stringify(payload),
    })

    console.log('📥 GHN Response Status:', ghnResponse.status, ghnResponse.statusText)

    const ghnData = await ghnResponse.json()

    console.log('📥 GHN Response Body:', JSON.stringify(ghnData, null, 2))

    if (ghnResponse.ok) {
      console.log('✅ Success - returning GHN data')
    } else {
      console.warn('⚠️ GHN API returned non-ok status:', ghnResponse.status)
    }

    // Return GHN response as-is
    return Response.json(ghnData, {
      status: ghnResponse.ok ? 200 : ghnResponse.status,
    })
  } catch (error) {
    console.error('❌ Shipping fee calculation error:')
    console.error('  Type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('  Message:', error instanceof Error ? error.message : String(error))
    console.error('  Stack:', error instanceof Error ? error.stack : 'N/A')

    return Response.json(
      {
        code: 500,
        message: error instanceof Error ? error.message : 'Internal server error',
        data: null,
      },
      { status: 500 }
    )
  }
}
