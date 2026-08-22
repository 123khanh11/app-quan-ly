import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { district_id } = req.query

  if (!district_id) {
    return res.status(400).json({ error: 'district_id required' })
  }

  try {
    const { data, error } = await supabase
      .from('ghn_wards')
      .select('ward_code, ward_name')
      .eq('district_id', parseInt(district_id))
      .order('ward_name', { ascending: true })

    if (error) throw error

    return res.status(200).json({
      success: true,
      wards: data || [],
    })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
