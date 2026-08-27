import { supabase } from '@/services/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order, items } = body

    if (!order || !items) {
      return NextResponse.json(
        { error: 'Missing order or items' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: `Order creation failed: ${orderError.message}` },
        { status: 500 }
      )
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
      
      // Return error with details
      return NextResponse.json(
        { error: `Failed to save items: ${itemsError.message}` },
        { status: 400 }
      )
    } else {
      console.log('✅ Order items created:', itemsData?.length)
    }

    return NextResponse.json(
      {
        success: true,
        order: orderData,
        items: itemsData || [],
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('❌ API error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
