const GHN_CONFIG = {
  TOKEN: process.env.GHN_TOKEN || '',
  SHOP_ID: parseInt(process.env.GHN_SHOP_ID || '0'),
  API_URL: process.env.GHN_API_URL || 'https://online-gateway.ghn.vn/shiip/public-api/v2',
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as any

    console.log('📡 GHN Services API called')
    console.log('Params:', { from_district_id: body.from_district_id, to_district_id: body.to_district_id })

    const payload = {
      from_district_id: body.from_district_id || 1455,
      to_district_id: body.to_district_id,
    }

    console.log('Calling GHN with:', payload)

    const response = await fetch(`${GHN_CONFIG.API_URL}/shipping-order/available-services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_CONFIG.TOKEN,
        'ShopId': GHN_CONFIG.SHOP_ID.toString(),
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json() as any

    console.log('GHN Services Response:', data)

    if (data.code === 200 && data.data && Array.isArray(data.data)) {
      return Response.json({
        success: true,
        services: data.data,
      })
    } else {
      return Response.json({
        success: false,
        services: [],
        error: data.message || 'No services available',
      })
    }
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { success: false, services: [], error: String(error) },
      { status: 500 }
    )
  }
}
