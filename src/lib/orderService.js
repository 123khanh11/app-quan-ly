import { supabase } from './supabaseClient';

/**
 * Order Service - Handle all order CRUD operations
 */

export const orderService = {
  // Get all orders with order items and product variant info
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product_variants(
              *,
              products(*)
            )
          )
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
            product_variants(
              *,
              products(*)
            )
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
          total: parseFloat(order.total || order.total_amount) || 0,
          shipping_fee: parseFloat(order.shipping_fee) || 0,
          payment_method: order.payment_method || 'cod',
          payment_status: order.payment_status || 'pending',
          order_status: order.order_status || order.status || 'pending',
          shipping_address: order.shipping_address || '',
          note: order.note || order.notes || '',
          customer_name: order.customer_name || '',
          customer_email: order.customer_email || '',
          customer_phone: order.customer_phone || '',
          tracking_number: order.tracking_number || null,
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
          total: parseFloat(updates.total || updates.total_amount) || 0,
          shipping_fee: parseFloat(updates.shipping_fee) || 0,
          payment_method: updates.payment_method || 'cod',
          payment_status: updates.payment_status || 'pending',
          order_status: updates.order_status || updates.status || 'pending',
          shipping_address: updates.shipping_address || '',
          note: updates.note || updates.notes || '',
          customer_name: updates.customer_name || '',
          customer_email: updates.customer_email || '',
          customer_phone: updates.customer_phone || '',
          updated_at: new Date().toISOString(),
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
      const query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product_variants(
              *,
              products(*)
            )
          )
        `);

      if (status && status !== 'all') {
        query.eq('order_status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

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
      const updates = {
        order_status: status,
        updated_at: new Date().toISOString(),
      };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      } else if (status === 'cancelled') {
        updates.cancelled_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
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
        .or(`customer_name.ilike.%${query}%,customer_email.ilike.%${query}%,customer_phone.ilike.%${query}%,shipping_address.ilike.%${query}%,note.ilike.%${query}%`)
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
