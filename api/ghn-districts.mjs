import { createClient } from '@supabase/supabase-js'

let supabaseClient = null
let initError = null

try {
  console.log("✅ @supabase/supabase-js loaded successfully")
} catch (e) {
  initError = e
  console.error("❌ Failed to load @supabase/supabase-js:", e.message)
}

function getSupabaseClient() {
  if (initError) {
    throw new Error("Supabase module not loaded: " + initError.message)
  }

  if (supabaseClient) return supabaseClient

  // Thử cả hai tên biến (với và không có prefix VITE_)
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://edtxexnhpbipcecceoop.supabase.co'
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

  console.log("🔍 DEBUG: SUPABASE_URL exists:", !!url)
  console.log("🔍 DEBUG: SUPABASE_ANON_KEY exists:", !!key)
  console.log("🔍 DEBUG: Using URL:", url.substring(0, 30) + '...')

  if (!url || !key) {
    const err = new Error(`Supabase credentials missing: URL=${url ? 'SET' : 'MISSING'}, KEY=${key ? 'SET' : 'MISSING'}`)
    console.error("❌", err.message)
    throw err
  }

  supabaseClient = createClient(url, key)
  return supabaseClient
}

async function handler(req, res) {
  console.log("📥 Request received at:", new Date().toISOString())
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { province_id } = req.query

    console.log("Province ID:", province_id)

    if (!province_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'province_id required',
        data: [] 
      })
    }

    console.log(`📍 Fetching districts for province: ${province_id}`)

    const client = getSupabaseClient()
    console.log("✅ Supabase client initialized")

    const { data, error } = await client
      .from('ghn_districts')
      .select('district_id, district_name')
      .eq('province_id', parseInt(province_id))
      .order('district_name', { ascending: true })

    if (error) {
      console.error('❌ Supabase error:', error.message)
      throw error
    }

    console.log(`✅ Found ${data?.length || 0} districts`)

    return res.status(200).json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error('❌ API Error:', error.message)
    console.error('❌ Error type:', error.constructor.name)
    return res.status(500).json({
      success: false,
      error: error.message || 'Database error',
      data: [],
    })
  }
}

export default handler
