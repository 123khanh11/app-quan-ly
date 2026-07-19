import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Type definitions
export interface Product {
  id: string
  name: string
  price: number
  sale_price?: number
  image_url: string
  description: string
  active: boolean
  category_id?: string
  sku?: string
}

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
}

export interface Order {
  id: string
  order_number?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  total_amount?: number
  status: string
  created_at: string
  updated_at?: string
  [key: string]: any  // Allow other fields from database
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

// Order Functions
export async function createOrder(orderData: {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  total_amount: number
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        total_amount: orderData.total_amount,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function addOrderItem(itemData: {
  order_id: string
  product_id: string
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
    query = query.ilike('customer_email', `%${email}%`)
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

export async function getProductImages(productId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}
