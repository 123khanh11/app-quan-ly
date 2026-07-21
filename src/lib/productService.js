import { supabase } from './supabaseClient';

/**
 * Product Service - Handle all product CRUD operations
 */

export const productService = {
  // Get all products with category info
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug),
          product_variants(id, size, color, sku, stock, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to include total stock
      return data?.map(product => ({
        ...product,
        stock_quantity: product.product_variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0,
      })) || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get single product
  async getProduct(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create new product
  async createProduct(product) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price),
          category_id: product.category_id,
          image_url: product.image_url || null,
          sku: product.sku || '',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description || '',
          price: parseFloat(updates.price),
          category_id: updates.category_id,
          image_url: updates.image_url || null,
          sku: updates.sku || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get low stock products (stock < minimum threshold) from variants
  async getLowStockProducts(threshold = 10) {
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
      
      // Transform data
      return data?.map(variant => ({
        id: variant.products?.id,
        name: variant.products?.name,
        price: variant.products?.price,
        sku: variant.products?.sku,
        image_url: variant.products?.image_url,
        stock_quantity: variant.stock,
        variant_id: variant.id,
        size: variant.size,
        color: variant.color,
      })) || [];
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  },

  // Update stock quantity for a variant
  async updateStock(variantId, newQuantity) {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .update({
          stock: newQuantity,
        })
        .eq('id', variantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },
};

export default productService;
