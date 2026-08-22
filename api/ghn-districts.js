const { createClient } = require('@supabase/supabase-js')

let supabaseClient = null

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  console.log("🔍 DEBUG: VITE_SUPABASE_URL exists:", !!url)
  console.log("🔍 DEBUG: VITE_SUPABASE_ANON_KEY exists:", !!key)

  if (!url || !key) {
    const err = new Error(`Supabase credentials missing: URL=${url ? 'SET' : 'MISSING'}, KEY=${key ? 'SET' : 'MISSING'}`)
    console.error("❌", err.message)
    throw err
  }

  supabaseClient = createClient(url, key)
  return supabaseClient
}

async function handler(req, res) {
  console.log("📥 Request received")
  console.log("Method:", req.method)
  console.log("URL:", req.url)
  
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
        districts: [] 
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
      districts: data || [],
    })
  } catch (error) {
    console.error('❌ API Error:', error.message)
    console.error('❌ Stack:', error.stack)
    return res.status(500).json({
      success: false,
      error: error.message || 'Database error',
      districts: [],
    })
  }
}

module.exports = handler
