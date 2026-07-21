import { supabase } from './supabaseClient';

/**
 * Order Service - Handle all order CRUD operations
 */

export const orderService = {
  // Get all orders with order items
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get single order with items
  async getOrder(id) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Create new order
  async createOrder(order) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          user_id: order.user_id || null,
          total: parseFloat(order.total) || 0,
          shipping_fee: parseFloat(order.shipping_fee) || 0,
          payment_method: order.payment_method || 'cod',
          payment_status: order.payment_status || 'pending',
          order_status: order.order_status || 'pending',
          shipping_address: order.shipping_address || '',
          note: order.note || '',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order
  async updateOrder(id, updates) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          total: parseFloat(updates.total) || 0,
          shipping_fee: parseFloat(updates.shipping_fee) || 0,
          payment_method: updates.payment_method || 'cod',
          payment_status: updates.payment_status || 'pending',
          order_status: updates.order_status || 'pending',
          shipping_address: updates.shipping_address || '',
          note: updates.note || '',
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(id) {
    try {
      // First delete order items
      await supabase.from('order_items').delete().eq('order_id', id);

      // Then delete order
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get orders by status
  async getOrdersByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          order_status: status,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get orders by date range
  async getOrdersByDateRange(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders by date range:', error);
      throw error;
    }
  },

  // Search orders
  async searchOrders(query) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .or(`customer_name.ilike.%${query}%,customer_email.ilike.%${query}%,customer_phone.ilike.%${query}%,shipping_address.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  },
};

export default orderService;
