import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { order, items } = req.body

    if (!order || !items) {
      return res.status(400).json({ error: 'Missing order or items' })
    }

    console.log('📝 API: Creating order with items')
    console.log('Order data:', JSON.stringify(order, null, 2))
    console.log('Items count:', items.length)

    // Log each item to verify all fields
    items.forEach((item: any, idx: number) => {
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
      .single()

    if (orderError) {
      console.error('❌ Order creation error:', orderError)
      return res.status(500).json({
        error: `Order creation failed: ${orderError.message}`,
      })
    }

    console.log('✅ Order created:', orderData.id)

    // Create order items
    const itemsWithOrderId = items.map((item: any) => ({
      ...item,
      order_id: orderData.id,
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
      order: orderData,
      items: itemsData || [],
    })
  } catch (err) {
    console.error('❌ API error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
