import { createClient } from '@supabase/supabase-js'

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  try {
    const url = process.env.VITE_SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY

    console.log('🔍 Test API - Env vars:')
    console.log('URL exists:', !!url)
    console.log('Key exists:', !!key)

    if (!url || !key) {
      return res.status(500).json({ 
        error: 'Missing env vars',
        hasUrl: !!url,
        hasKey: !!key
      })
    }

    const supabase = createClient(url, key)
    console.log('✅ Supabase client created')

    // Try to query orders table
    const { data, error } = await supabase
      .from('orders')
      .select('id, created_at')
      .limit(1)

    if (error) {
      console.error('❌ Query error:', error)
      return res.status(500).json({ 
        error: error.message,
        code: error.code
      })
    }

    console.log('✅ Query successful, rows:', data?.length || 0)
    return res.status(200).json({ 
      success: true,
      message: 'Supabase connection OK',
      orderCount: data?.length || 0
    })
  } catch (err) {
    console.error('❌ Test error:', err)
    return res.status(500).json({ 
      error: err?.message || 'Unknown error',
      type: err?.constructor?.name
    })
  }
}

export default handler
