/**
 * Order Service - Tạo order + tự động lấy shipping_address
 * 
 * Sử dụng:
 * const order = await createOrder({
 *   userId: 'user-id',
 *   total: 500000,
 *   shippingFee: 30000,
 *   paymentMethod: 'cod'
 * })
 * 
 * shipping_address sẽ tự động lấy từ addresses table (mặc định)
 */

import { supabase } from './supabase'

export interface CreateOrderParams {
  user_id?: string
  total: number
  shipping_fee: number
  payment_method: string
  shipping_address?: string  // Optional - sẽ tự động lấy nếu có user_id
  note?: string
}

export interface Order {
  id: string
  user_id?: string
  total: number
  shipping_fee: number
  payment_method: string
  order_status: string
  shipping_address?: string
  note?: string
  created_at: string
}

/**
 * Tạo order mới
 * - Nếu có user_id: tự động lấy shipping_address từ addresses (mặc định)
 * - Nếu không có: dùng shipping_address được truyền vào hoặc để trống
 */
export async function createOrder(params: CreateOrderParams): Promise<Order> {
  try {
    let shippingAddress = params.shipping_address

    // Nếu có user_id nhưng không có shipping_address, lấy từ addresses table
    if (params.user_id && !shippingAddress) {
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .select('address_full')
        .eq('user_id', params.user_id)
        .eq('is_default', true)
        .single()

      if (!addressError && addressData) {
        shippingAddress = addressData.address_full
      }
    }

    // Nếu vẫn không có, dùng giá trị mặc định
    if (!shippingAddress) {
      shippingAddress = 'Chưa cập nhật địa chỉ'
    }

    // Insert order
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: params.user_id,
          total: params.total,
          shipping_fee: params.shipping_fee,
          payment_method: params.payment_method,
          order_status: 'pending',
          shipping_address: shippingAddress,
          note: params.note,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`)
    }

    console.log('✅ Order created:', data.id)
    return data
  } catch (err) {
    console.error('❌ Error creating order:', err)
    throw err
  }
}

/**
 * Lấy order theo ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return data
  } catch (err) {
    console.error('❌ Error fetching order:', err)
    return null
  }
}

/**
 * Lấy tất cả orders của user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return data || []
  } catch (err) {
    console.error('❌ Error fetching orders:', err)
    return []
  }
}

/**
 * Cập nhật trạng thái order
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`)
    }

    console.log(`✅ Order ${orderId} status updated to ${newStatus}`)
    return true
  } catch (err) {
    console.error('❌ Error updating order:', err)
    return false
  }
}

/**
 * Xóa order
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      throw new Error(`Failed to delete order: ${error.message}`)
    }

    console.log(`✅ Order ${orderId} deleted`)
    return true
  } catch (err) {
    console.error('❌ Error deleting order:', err)
    return false
  }
}

/**
 * Parse shipping_address thành 4 phần
 */
export interface ParsedAddress {
  detail: string
  ward: string
  district: string
  province: string
}

export function parseShippingAddress(address: string): ParsedAddress {
  if (!address) {
    return {
      detail: '',
      ward: '',
      district: '',
      province: '',
    }
  }

  const parts = address.split(', ')
  return {
    detail: parts[0] || '',
    ward: parts[1] || '',
    district: parts[2] || '',
    province: parts[3] || '',
  }
}
