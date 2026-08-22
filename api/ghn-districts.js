const { createClient } = require('@supabase/supabase-js')

console.log('Supabase URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING')
console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING')

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Supabase credentials missing!')
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')))
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { province_id } = req.query

    if (!province_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'province_id required',
        districts: [] 
      })
    }

    console.log(`📍 Fetching districts for province: ${province_id}`)

    const { data, error } = await supabase
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
    return res.status(500).json({
      success: false,
      error: error.message || 'Database error',
      districts: [],
    })
  }
}
