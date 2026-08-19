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
    const body = await request.json()

    // Validate required fields
    if (!body.from_district_id || !body.to_district_id || !body.weight) {
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
    if (!GHN_CONFIG.TOKEN || !GHN_CONFIG.SHOP_ID) {
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
      service_id: body.service_id || 2,
      from_district_id: body.from_district_id,
      from_ward_code: body.from_ward_code || '21617',
      to_district_id: body.to_district_id,
      to_ward_code: body.to_ward_code || '21012',
      weight: body.weight || 500, // Default 500g instead of 1000g
      length: body.length || 20,
      width: body.width || 20,
      height: body.height || 20,
      insurance_value: body.insurance_value || 0,
      coupon: body.coupon || null,
    }

    console.log('📡 GHN API Request:', payload)

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

    const ghnData = await ghnResponse.json()

    console.log('📥 GHN API Response:', ghnData)

    // Return GHN response as-is
    return Response.json(ghnData, {
      status: ghnResponse.ok ? 200 : ghnResponse.status,
    })
  } catch (error) {
    console.error('❌ Shipping fee calculation error:', error)

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
