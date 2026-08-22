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

  const { province_id } = req.query

  if (!province_id) {
    return res.status(400).json({ error: 'province_id required' })
  }

  try {
    const { data, error } = await supabase
      .from('ghn_districts')
      .select('district_id, district_name')
      .eq('province_id', parseInt(province_id))
      .order('district_name', { ascending: true })

    if (error) throw error

    return res.status(200).json({
      success: true,
      districts: data || [],
    })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
