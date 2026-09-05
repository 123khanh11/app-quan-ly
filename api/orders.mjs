import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  console.log('🔑 Env check:')
  console.log('  SUPABASE_URL:', url ? '✅' : '❌')
  console.log('  SUPABASE_KEY:', key ? '✅' : '❌')

  if (!url || !key) {
    throw new Error(`Missing Supabase env vars: URL=${url ? 'SET' : 'MISSING'}, KEY=${key ? 'SET' : 'MISSING'}`)
  }

  supabaseClient = createClient(url, key)
  return supabaseClient
}

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = getSupabaseClient()

    const { order, items } = req.body

    if (!order || !items) {
      return res.status(400).json({ error: 'Missing order or items' })
    }

    // Remove user_id if it's null or undefined to avoid FK constraint
    if (!order.user_id) {
      delete order.user_id
    }

    console.log('📝 API: Creating order with items')
    console.log('Order data:', JSON.stringify(order, null, 2))
    console.log('Items count:', items.length)
    console.log('User ID:', order.user_id || '(anonymous)')

    // Log each item to verify all fields
    items.forEach((item, idx) => {
      console.log(`Item ${idx + 1}:`, {
        product_id: item.product_id ? '✅' : '❌',
        variant_id: item.variant_id ? '✅' : '❌',
        product_name: item.product_name ? '✅' : '❌',
        quantity: item.quantity,
        price: item.price,
      })
    })

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()

    if (orderError) {
      console.error('❌ Order creation error:', orderError)
      console.error('Order data sent:', JSON.stringify(order, null, 2))
      return res.status(500).json({
        error: `Order creation failed: ${orderError.message}`,
      })
    }

    if (!orderData || orderData.length === 0) {
      console.error('❌ Order created but no data returned')
      return res.status(500).json({
        error: 'Order created but no data returned',
      })
    }

    const orderId = orderData[0].id
    console.log('✅ Order created:', orderId)

    // Create order items
    const itemsWithOrderId = items.map((item) => ({
      ...item,
      order_id: orderId,
    }))

    console.log('📦 Inserting items:', JSON.stringify(itemsWithOrderId[0], null, 2))

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId)
      .select()

    if (itemsError) {
      console.error('❌ Order items creation error:', itemsError)
      console.error('Error message:', itemsError.message)
      console.error('Error details:', itemsError)

      return res.status(400).json({
        error: `Failed to save items: ${itemsError.message}`,
      })
    }

    console.log('✅ Order items created:', itemsData?.length)

    return res.status(201).json({
      success: true,
      order: orderData[0],
      items: itemsData || [],
    })
  } catch (err) {
    console.error('❌ API error:', err)
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack')
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ 
      error: message,
      details: err instanceof Error ? err.toString() : err
    })
  }
}

export default handler
