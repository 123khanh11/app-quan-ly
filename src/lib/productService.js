import { supabase } from './supabaseClient';

/**
 * Product Service - Handle all product CRUD operations
 */

export const productService = {
  // Get all products with category info and variant stock
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          category_id,
          image_url,
          sku,
          created_at,
          categories(id, name, slug),
          product_variants(id, stock)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback if joined query fails
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('products')
          .select('id, name, description, price, category_id, image_url, sku, created_at')
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        return fallbackData?.map(product => ({
          ...product,
          stock_quantity: product.stock_quantity ?? product.stock ?? 0,
        })) || [];
      }
      
      // Transform to include calculated stock and default variant for inventory updates
      return data?.map(product => ({
        ...product,
        stock_quantity: product.stock_quantity ?? product.product_variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0,
        default_variant_id: product.product_variants?.[0]?.id || null,
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
        .select('id, name, description, price, category_id, image_url, sku, created_at')
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
        .select('id, name, description, price, category_id, image_url, sku, created_at')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create new product with default variant for stock
  async createProduct(product) {
    try {
      const initialStock = parseInt(product.initial_stock ?? product.stock_quantity ?? 0, 10) || 0;
      const categoryId = product.category_id || null;
      const skuValue = product.sku?.trim() ? product.sku.trim() : null;

      const basePayload = {
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price) || 0,
          category_id: categoryId,
          image_url: product.image_url || null,
          sku: skuValue,
          created_at: new Date().toISOString(),
      };

      let data = null;
      let error = null;

      // Primary attempt: insert without stock_quantity column using explicit select
      const res1 = await supabase
        .from('products')
        .insert([basePayload])
        .select('id, name, description, price, category_id, image_url, sku, created_at')
        .single();

      data = res1.data;
      error = res1.error;

      // Fallback attempt: if schema cache or DB requires stock_quantity field
      if (error && (error.code === 'PGRST204' || error.message?.includes('stock_quantity'))) {
        console.warn('Retrying product creation with stock_quantity column in payload...');
        const res2 = await supabase
          .from('products')
          .insert([{ ...basePayload, stock_quantity: initialStock }])
          .select()
          .single();

        data = res2.data;
        error = res2.error;
      }

      if (error) throw error;

      // Insert default variant for stock tracking if variant table exists
      try {
        const { data: variant } = await supabase
          .from('product_variants')
          .insert([{
            product_id: data.id,
            stock: initialStock,
            sku: skuValue ? `${skuValue}-default` : null,
            price: parseFloat(product.price) || 0,
          }])
          .select('id, stock')
          .single();

        return { ...data, default_variant_id: variant?.id || null, stock_quantity: initialStock };
      } catch (vErr) {
        console.warn('Could not insert product variant:', vErr);
        return { ...data, stock_quantity: initialStock };
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (no stock field - managed via variants)
  async updateProduct(id, updates) {
    try {
      const categoryId = updates.category_id || null;
      const skuValue = updates.sku?.trim() ? updates.sku.trim() : null;

      const basePayload = {
        name: updates.name,
        description: updates.description || '',
        price: parseFloat(updates.price) || 0,
        category_id: categoryId,
        image_url: updates.image_url || null,
        sku: skuValue,
        updated_at: new Date().toISOString(),
      };

      let { data, error } = await supabase
        .from('products')
        .update(basePayload)
        .eq('id', id)
        .select('id, name, description, price, category_id, image_url, sku')
        .single();

      if (error && (error.code === 'PGRST204' || error.message?.includes('stock_quantity'))) {
        const initialStock = parseInt(updates.initial_stock ?? updates.stock_quantity ?? 0, 10) || 0;
        const res2 = await supabase
          .from('products')
          .update({ ...basePayload, stock_quantity: initialStock })
          .eq('id', id)
          .select()
          .single();

        data = res2.data;
        error = res2.error;
      }

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

  // Get low stock products from variants
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

  // Update stock on a product's default variant
  async updateProductStock(productId, newQuantity) {
    try {
      const { data: variant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
        .limit(1)
        .maybeSingle();

      if (variant) {
        return this.updateStock(variant.id, newQuantity);
      }
      return this.ensureDefaultVariant(productId, newQuantity);
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  },

  // Ensure a product has at least one variant (for legacy products without variants)
  async ensureDefaultVariant(productId, stock = 0, price = 0) {
    try {
      const { data: existing } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
        .limit(1)
        .maybeSingle();

      if (existing) return existing;

      const { data, error } = await supabase
        .from('product_variants')
        .insert([{ product_id: productId, stock, price }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error ensuring default variant:', error);
      throw error;
    }
  },

  // Update stock for a specific variant
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
