import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/services/supabase'

export async function POST(request: NextRequest) {
  try {
    const { district_id } = await request.json()

    if (!district_id) {
      return NextResponse.json(
        { success: false, error: 'district_id is required', wards: [] },
        { status: 400 }
      )
    }

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
