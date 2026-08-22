import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/services/supabase'

export async function GET() {
  return NextResponse.json({ status: 'OK', message: 'Wards endpoint is working' })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any
    const district_id = body?.district_id

    if (!district_id) {
      return NextResponse.json(
        { success: false, error: 'district_id is required', wards: [] },
        { status: 400 }
      )
    }

    console.log(`📍 Fetching wards for district: ${district_id}`)

    // Query from Supabase
    const { data, error } = await supabase
      .from('ghn_wards')
      .select('ward_code, ward_name')
      .eq('district_id', district_id)
      .order('ward_name', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: error.message, wards: [] },
        { status: 500 }
      )
    }

    console.log(`✅ Found ${data?.length || 0} wards`)

    return NextResponse.json({
      success: true,
      wards: data || [],
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: String(error), wards: [] },
      { status: 500 }
    )
  }
}
