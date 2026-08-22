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

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://edtxexnhpbipcecceoop.supabase.co'
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

  console.log("🔍 DEBUG: SUPABASE_URL exists:", !!url)
  console.log("🔍 DEBUG: SUPABASE_ANON_KEY exists:", !!key)

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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    console.log(`📍 Fetching all provinces`)

    const client = getSupabaseClient()
    console.log("✅ Supabase client initialized")

    const { data, error } = await client
      .from('ghn_provinces')
      .select('province_id, province_name')
      .order('province_name', { ascending: true })

    if (error) {
      console.error('❌ Supabase error:', error.message)
      throw error
    }

    console.log(`✅ Found ${data?.length || 0} provinces`)

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
