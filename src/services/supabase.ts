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

export interface Category {
  id: string
  name: string
  parent_id?: string | null
  slug?: string
  active?: boolean
}

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  weight?: number // grams (for GHN shipping calculation)
  length?: number // cm (for GHN shipping calculation)
  width?: number // cm (for GHN shipping calculation)
  height?: number // cm (for GHN shipping calculation)
}

export interface Order {
  id: string
  user_id?: string
  total?: number
  shipping_fee?: number
  payment_method?: string
  payment_status?: string
  order_status?: string
  shipping_address?: string
  note?: string
  created_at?: string
  [key: string]: any
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
  user_id?: string
  total: number
  shipping_fee: number
  payment_method: string
  shipping_address: string
  note?: string
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
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

  // Search in note field instead of customer_email
  if (email) {
    query = query.ilike('note', `%${email}%`)
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

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

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

// Get product details with variants
export interface ProductDetail {
  product_id: string
  product_name: string
  description: string
  product_price: number
  original_price: number
  category_id: string
  category_name: string
  product_image: string
  variants: Array<{
    variant_id: string
    color: string
    size: string
    stock: number
    variant_price: number
    sku: string
    barcode: string
    variant_image: string
  }>
}

export async function getProductDetails(productId: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      sale_price,
      original_price,
      category_id,
      image_url,
      categories(name),
      product_variants(
        id,
        color,
        size,
        stock,
        price,
        sku,
        barcode,
        image_url
      )
    `)
    .eq('id', productId)
    .single()

  if (error) throw new Error(error.message)
  
  if (!data) return null

  // Transform data
  return {
    product_id: data.id,
    product_name: data.name,
    description: data.description,
    product_price: data.sale_price,
    original_price: data.original_price,
    category_id: data.category_id,
    category_name: data.categories?.name || '',
    product_image: data.image_url,
    variants: (data.product_variants || []).map((v: any) => ({
      variant_id: v.id,
      color: v.color,
      size: v.size,
      stock: v.stock,
      variant_price: v.price,
      sku: v.sku,
      barcode: v.barcode,
      variant_image: v.image_url,
    })),
  }
}
