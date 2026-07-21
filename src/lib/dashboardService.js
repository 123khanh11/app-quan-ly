import { supabase } from './supabaseClient';

/**
 * Dashboard Service - Handle dashboard statistics and analytics
 */

export const dashboardService = {
  // Get dashboard summary
  async getDashboardSummary() {
    try {
      // Get total orders and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total, order_status, created_at');

      // Get total products
      const { data: products } = await supabase
        .from('products')
        .select('id');

      // Get product variants stock
      const { data: variants } = await supabase
        .from('product_variants')
        .select('stock');

      // Get categories count
      const { data: categories } = await supabase
        .from('categories')
        .select('id');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const todayOrders = orders?.filter(o => new Date(o.created_at) >= today).length || 0;
      const todayRevenue = orders
        ?.filter(o => new Date(o.created_at) >= today)
        .reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const totalProducts = products?.length || 0;
      const totalStock = variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
      const totalCategories = categories?.length || 0;

      // Get status breakdown
      const statusBreakdown = {
        pending: orders?.filter(o => o.order_status === 'pending').length || 0,
        processing: orders?.filter(o => o.order_status === 'processing').length || 0,
        completed: orders?.filter(o => o.order_status === 'completed').length || 0,
        cancelled: orders?.filter(o => o.order_status === 'cancelled').length || 0,
      };

      return {
        totalOrders,
        totalRevenue,
        todayOrders,
        todayRevenue,
        totalProducts,
        totalStock,
        totalCategories,
        statusBreakdown,
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // Get sales by date
  async getSalesByDate(days = 30) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const salesByDate = {};
      data?.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString();
        if (!salesByDate[date]) {
          salesByDate[date] = { total: 0, count: 0 };
        }
        salesByDate[date].total += order.total || 0;
        salesByDate[date].count += 1;
      });

      return Object.entries(salesByDate).map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
      }));
    } catch (error) {
      console.error('Error fetching sales by date:', error);
      throw error;
    }
  },

  // Get top products by sales
  async getTopProductsBySales(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          variant_id,
          quantity,
          price,
          product_variants(
            id,
            product_id,
            products(id, name, price)
          )
        `)
        .order('quantity', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Group by product
      const productSales = {};
      data?.forEach(item => {
        const productId = item.product_variants?.product_id;
        const productName = item.product_variants?.products?.name || 'Unknown';
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            name: productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      });

      return Object.values(productSales).sort((a, b) => b.revenue - a.revenue);
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // Get low stock alerts
  async getLowStockAlerts(threshold = 10) {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          products(id, name, price, sku, image_url)
        `)
        .lt('stock', threshold)
        .order('stock', { ascending: true });

      if (error) throw error;
      
      // Transform data to include product info
      return data?.map(variant => ({
        ...variant,
        productName: variant.products?.name,
        productPrice: variant.products?.price,
      })) || [];
    } catch (error) {
      console.error('Error fetching low stock alerts:', error);
      throw error;
    }
  },

  // Get revenue by category
  async getRevenueByCategory() {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          price,
          quantity,
          product_variants(
            product_id,
            products(
              category_id,
              categories(id, name)
            )
          )
        `);

      if (error) throw error;

      // Group by category
      const categoryRevenue = {};
      data?.forEach(item => {
        const categoryId = item.product_variants?.products?.category_id;
        const categoryName = item.product_variants?.products?.categories?.name || 'Unknown';
        if (!categoryRevenue[categoryId]) {
          categoryRevenue[categoryId] = {
            categoryId,
            categoryName,
            revenue: 0,
            items: 0,
          };
        }
        categoryRevenue[categoryId].revenue += item.price * item.quantity;
        categoryRevenue[categoryId].items += item.quantity;
      });

      return Object.values(categoryRevenue).sort((a, b) => b.revenue - a.revenue);
    } catch (error) {
      console.error('Error fetching revenue by category:', error);
      throw error;
    }
  },
};

export default dashboardService;
