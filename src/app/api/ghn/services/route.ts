/**
 * API Route: /api/ghn/services
 * Purpose: Get available GHN services between two districts
 */

const GHN_CONFIG = {
  TOKEN: process.env.GHN_TOKEN || '',
  SHOP_ID: parseInt(process.env.GHN_SHOP_ID || '0'),
  API_URL: process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.from_district_id || !body.to_district_id) {
      return Response.json(
        {
          code: 400,
          message: 'Missing required fields: from_district_id, to_district_id',
          data: null,
        },
        { status: 400 }
      )
    }

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

    console.log('📡 Fetching GHN services:', {
      from_district_id: body.from_district_id,
      to_district_id: body.to_district_id,
    })

    // Call GHN API
    const ghnResponse = await fetch(`${GHN_CONFIG.API_URL}/shipping-order/available-services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Token: GHN_CONFIG.TOKEN,
        ShopId: GHN_CONFIG.SHOP_ID.toString(),
      },
      body: JSON.stringify({
        from_district_id: body.from_district_id,
        to_district_id: body.to_district_id,
      }),
    })

    const ghnData = await ghnResponse.json()

    console.log('📥 GHN Services Response:', ghnData)

    return Response.json(ghnData, {
      status: ghnResponse.ok ? 200 : ghnResponse.status,
    })
  } catch (error) {
    console.error('❌ Get services error:', error)

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
