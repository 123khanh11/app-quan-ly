// ========================================
// Order Service Functions
// File: src/lib/orderService.js
// ========================================

import { supabase } from './supabaseClient'

// ✅ Lấy tất cả orders
export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Lỗi lấy orders:', error.message)
      return []
    }
    
    console.log('✅ Lấy được', data.length, 'orders')
    return data || []
  } catch (err) {
    console.error('❌ Exception:', err)
    return []
  }
}

// ✅ Lấy 1 order theo ID
export async function getOrderById(id) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Lỗi lấy order:', error.message)
      return null
    }
    
    return data
  } catch (err) {
    console.error('❌ Exception:', err)
    return null
  }
}

// ✅ Cập nhật trạng thái order
export async function updateOrderStatus(id, status) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        order_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('❌ Lỗi cập nhật:', error.message)
      return false
    }
    
    console.log('✅ Cập nhật status thành công')
    return true
  } catch (err) {
    console.error('❌ Exception:', err)
    return false
  }
}

// ✅ Lấy orders theo trạng thái
export async function getOrdersByStatus(status) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_status', status)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Lỗi:', error.message)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('❌ Exception:', err)
    return []
  }
}

// ✅ Tìm kiếm orders theo địa chỉ hoặc ghi chú
export async function searchOrders(query) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`shipping_address.ilike.%${query}%,note.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Lỗi:', error.message)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('❌ Exception:', err)
    return []
  }
}

// ✅ Lấy order items
export async function getOrderItems(orderId) {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
    
    if (error) {
      console.error('❌ Lỗi:', error.message)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('❌ Exception:', err)
    return []
  }
}

// ✅ Subscribe to real-time updates
export function subscribeToOrders(callback) {
  const subscription = supabase
    .from('orders')
    .on('*', (payload) => {
      console.log('📡 Order update:', payload)
      callback(payload)
    })
    .subscribe()
  
  return subscription
}

// ✅ Unsubscribe
export function unsubscribeFromOrders(subscription) {
  supabase.removeSubscription(subscription)
}
