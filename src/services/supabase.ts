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
  fbp?: string
  fbc?: string
  created_at?: string
  [key: string]: any
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  product_name: string
  quantity: number
  price: number
  color?: string
  size?: string
  sku?: string
  weight_kg?: number
  length_cm?: number
  width_cm?: number
  height_cm?: number
  created_at: string
}

// Order Functions
export async function createOrder(orderData: {
  user_id?: string
  total: number
  shipping_fee: number
  payment_method: string
  shipping_address: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  note?: string
  fbp?: string
  fbc?: string
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
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        note: orderData.note,
        fbp: orderData.fbp,
        fbc: orderData.fbc,
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
  variant_id: string
  product_name: string
  quantity: number
  price: number
  color?: string
  size?: string
  sku?: string
  weight_kg?: number
  length_cm?: number
  width_cm?: number
  height_cm?: number
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

export async function getAllOrders(): Promise<Array<Order & { items: OrderItem[] }>> {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (ordersError) throw new Error(ordersError.message)

  // Fetch items for each order
  const ordersWithItems = await Promise.all(
    (ordersData || []).map(async (order) => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

      if (itemsError) {
        console.warn(`Failed to fetch items for order ${order.id}:`, itemsError)
        return { ...order, items: [] }
      }

      return { ...order, items: itemsData || [] }
    })
  )

  return ordersWithItems
}

// Product Functions
export async function getProducts(): Promise<Product[]> {
  console.log('Fetching products...')
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('Products query result:', { data, error })
  
  if (error) {
    console.error('Products error:', error)
    throw new Error(error.message)
  }
  
  console.log('Returning products:', data?.length || 0)
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
export interface ProductImage {
  id: string
  image_url: string
  is_main: boolean
}

export interface VariantImage {
  id: string
  image_url: string
  is_main: boolean
  display_order: number
}

export interface ProductDetail {
  product_id: string
  product_name: string
  description: string
  product_price: number
  original_price: number
  category_id: string
  category_name: string
  product_image: string
  product_images: ProductImage[]
  allVariantImages: ProductImage[] // All images from all variants combined
  variants: Array<{
    variant_id: string
    color: string
    size: string
    stock: number
    variant_price: number
    sku: string
    barcode: string
    variant_image: string
    description: string
    images: VariantImage[]
  }>
}

export async function getProductDetails(productId: string): Promise<ProductDetail | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        discount_description,
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

    // Use discount_description if available, otherwise use description
    const displayDescription = data.discount_description || data.description

    // Fetch variant images separately for each variant
    let variantImagesMap = new Map<string, VariantImage[]>()
    try {
      for (const variant of data.product_variants || []) {
        const { data: varImgData } = await supabase
          .from('variant_images')
          .select('id, image_url, display_order')
          .eq('variant_id', variant.id)
          .order('display_order', { ascending: true })

        if (varImgData && varImgData.length > 0) {
          variantImagesMap.set(
            variant.id,
            varImgData.map((img: any) => ({
              id: img.id,
              image_url: img.image_url,
              is_main: varImgData.indexOf(img) === 0, // First image is main
              display_order: img.display_order || 0,
            }))
          )
        }
      }
    } catch (varImgError) {
      console.warn('variant_images table not available or error fetching variant images', varImgError)
    }

    // Collect all unique images from all variants for allVariantImages
    const allVariantImagesMap = new Map<string, ProductImage>()
    
    // Transform variants
    const variants = (data.product_variants || []).map((v: any) => {
      let variantImages = variantImagesMap.get(v.id) || []
      
      // If variant has no images from variant_images table, create one from variant_image field
      if (variantImages.length === 0 && v.image_url) {
        variantImages = [{
          id: `${v.id}-main`,
          image_url: v.image_url,
          is_main: true,
          display_order: 0,
        }]
      }

      // Add all variant images to the allVariantImages collection
      variantImages.forEach((img: VariantImage) => {
        allVariantImagesMap.set(img.id, {
          id: img.id,
          image_url: img.image_url,
          is_main: img.is_main || false,
        })
      })

      return {
        variant_id: v.id,
        color: v.color,
        size: v.size,
        stock: v.stock,
        variant_price: v.price,
        sku: v.sku,
        barcode: v.barcode,
        variant_image: v.image_url,
        description: displayDescription,
        images: variantImages,
      }
    })

    // Product images fallback (in case we need product-level images later)
    const productImages: ProductImage[] = []
    if (data.image_url) {
      productImages.push({
        id: `${data.id}-main`,
        image_url: data.image_url,
        is_main: true,
      })
    }

    const allVariantImages = Array.from(allVariantImagesMap.values())

    return {
      product_id: data.id,
      product_name: data.name,
      description: displayDescription,
      product_price: data.sale_price,
      original_price: data.original_price,
      category_id: data.category_id,
      category_name: data.categories?.name || '',
      product_image: data.image_url,
      product_images: productImages,
      allVariantImages: allVariantImages.length > 0 ? allVariantImages : productImages,
      variants,
    }
  } catch (err) {
    console.error('Error in getProductDetails:', err)
    throw err
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: string, excludeProductId?: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) throw new Error(error.message)
  
  // Filter out current product if provided
  if (excludeProductId) {
    return (data || []).filter(p => p.id !== excludeProductId)
  }
  
  return data || []
}
