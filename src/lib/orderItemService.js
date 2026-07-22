import { supabase } from './supabaseClient';

/**
 * Order Item Service - Handle order items management
 */

export const orderItemService = {
  // Get all order items for an order with variant and product info
  async getOrderItems(orderId) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product_variants(
            *,
            products(*)
          )
        `)
        .eq('order_id', orderId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  },

  // Add item to order
  async addOrderItem(orderItem) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .insert([{
          order_id: orderItem.order_id,
          variant_id: orderItem.variant_id,
          quantity: parseInt(orderItem.quantity, 10) || 1,
          price: parseFloat(orderItem.price) || 0,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding order item:', error);
      throw error;
    }
  },

  // Update order item
  async updateOrderItem(id, updates) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .update({
          quantity: parseInt(updates.quantity, 10) || 1,
          price: parseFloat(updates.price) || 0,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order item:', error);
      throw error;
    }
  },

  // Delete order item
  async deleteOrderItem(id) {
    try {
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting order item:', error);
      throw error;
    }
  },

  // Calculate order total
  calculateTotal(items) {
    return items?.reduce((total, item) => {
      return total + ((item.price || 0) * (item.quantity || 0));
    }, 0) || 0;
  },
};

export default orderItemService;
