import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Type definitions
export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  active: boolean
}

export interface CartItem {
  id: string
  variant_id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  user_id?: string
  total: number
  shipping_fee: number
  payment_method: string
  payment_status: string
  order_status: string
  shipping_address: string
  note?: string
  created_at: string
  email?: string
  phone?: string
}

export interface OrderItem {
  id: string
  order_id: string
  variant_id: string
  quantity: number
  price: number
}

// Order Functions
export async function createOrder(orderData: {
  total: number
  shipping_fee: number
  payment_method: string
  shipping_address: string
  note?: string
  email?: string
  phone?: string
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: null,
        total: orderData.total,
        shipping_fee: orderData.shipping_fee,
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        order_status: 'pending',
        shipping_address: orderData.shipping_address,
        note: orderData.note,
      },
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function addOrderItem(itemData: {
  order_id: string
  variant_id: string
  quantity: number
  price: number
}): Promise<OrderItem> {
  const { data, error } = await supabase
    .from('order_items')
    .insert([itemData])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getOrders(email?: string): Promise<Order[]> {
  let query = supabase.from('orders').select('*')

  if (email) {
    query = query.ilike('email', `%${email}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getOrderDetails(orderId: string): Promise<{
  order: Order
  items: OrderItem[]
}> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError) throw new Error(orderError.message)

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  if (itemsError) throw new Error(itemsError.message)

  return {
    order: orderData,
    items: itemsData || [],
  }
}

// Product Functions
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('active', true)

  if (error) throw new Error(error.message)
  return data || []
}
