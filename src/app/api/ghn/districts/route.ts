import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/services/supabase'

export async function POST(request: NextRequest) {
  try {
    const { province_id } = await request.json()

    if (!province_id) {
      return NextResponse.json(
        { success: false, error: 'province_id is required', districts: [] },
        { status: 400 }
      )
    }

    // Query from Supabase
    const { data, error } = await supabase
      .from('ghn_districts')
      .select('district_id, district_name')
      .eq('province_id', province_id)
      .order('district_name', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: error.message, districts: [] },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      districts: data || [],
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: String(error), districts: [] },
      { status: 500 }
    )
  }
}
