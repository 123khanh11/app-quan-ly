import { NextRequest, NextResponse } from 'next/server'
import { calculateShippingFee, getAvailableServices } from '@/services/ghn-db'

export async function POST(request: NextRequest) {
  try {
    const {
      to_district_id,
      to_ward_code,
      weight,
      length,
      width,
      height,
      service_id,
    } = await request.json()

    // Validation
    if (!to_district_id || !to_ward_code) {
      return NextResponse.json(
        { success: false, error: 'Missing address parameters' },
        { status: 400 }
      )
    }

    // Shop location (fixed)
    const FROM_DISTRICT_ID = 1455
    const FROM_WARD_CODE = '21617'

    console.log('📦 Shipping Fee Request:', {
      from: FROM_DISTRICT_ID,
      to: to_district_id,
      weight,
    })

    // Step 1: Always try to get available services
    console.log('📡 Step 1: Fetching available services...')
    const servicesResult = await getAvailableServices({
      from_district_id: FROM_DISTRICT_ID,
      to_district_id,
    })

    let finalServiceId = service_id

    if (!finalServiceId && servicesResult.success && servicesResult.services?.length > 0) {
      // Use first available service if not provided
      finalServiceId = servicesResult.services[0].service_id
      console.log(`✅ Using available service: ${finalServiceId} (${servicesResult.services[0].service_name})`)
    } else if (!finalServiceId) {
      // Fallback to default if no services available
      finalServiceId = 2
      console.warn('⚠️ No available services, using default service 2')
    }

    // Step 2: Calculate fee with selected service
    console.log(`📡 Step 2: Calculating fee with service ${finalServiceId}...`)

    const feeResult = await calculateShippingFee({
      service_id: finalServiceId,
      from_district_id: FROM_DISTRICT_ID,
      from_ward_code: FROM_WARD_CODE,
      to_district_id,
      to_ward_code,
      weight: Math.max(weight || 1000, 200),
      length: Math.max(length || 20, 10),
      width: Math.max(width || 20, 10),
      height: Math.max(height || 20, 10),
      insurance_value: 0,
      coupon: null,
    })

    if (feeResult.success && feeResult.data?.total) {
      console.log(`✅ Shipping fee calculated: ${feeResult.data.total} VND`)
      return NextResponse.json({
        success: true,
        data: feeResult.data,
      })
    } else {
      console.warn('⚠️ Fee calculation failed, using default')
      const defaultFee = 50000
      return NextResponse.json({
        success: true,
        data: {
          total: defaultFee,
          service_fee: defaultFee,
          insurance_fee: 0,
          pick_station_fee: 0,
          deliver_remote_areas_fee: 0,
          cod_fee: 0,
        },
        warning: feeResult.error || 'Using default fee',
      })
    }
  } catch (error) {
    console.error('❌ Shipping fee calculation error:', error)

    // Fallback: return default estimated fee
    return NextResponse.json({
      success: true,
      data: {
        total: 50000,
        service_fee: 50000,
        insurance_fee: 0,
        pick_station_fee: 0,
        deliver_remote_areas_fee: 0,
        cod_fee: 0,
      },
      error: 'Server error, using default estimation',
    })
  }
}
