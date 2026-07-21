import 'dart:io';
import '../config/supabase_config.dart';
import '../models/product.dart';

class ProductService {
  Future<List<Product>> getProducts() async {
    final response = await supabase
        .from('products')
        .select()
        .order('created_at', ascending: false);
    return (response as List).map((json) => Product.fromJson(json)).toList();
  }

  Future<Product?> getProduct(String id) async {
    final response = await supabase
        .from('products')
        .select()
        .eq('id', id)
        .single();
    return Product.fromJson(response);
  }

  Future<void> createProduct(Product product) async {
    await supabase.from('products').insert(product.toJson());
  }

  Future<void> updateProduct(String id, Product product) async {
    await supabase.from('products').update(product.toJson()).eq('id', id);
  }

  Future<void> deleteProduct(String id) async {
    await supabase.from('products').delete().eq('id', id);
  }

  Future<List<Product>> searchProducts(String query) async {
    final response = await supabase
        .from('products')
        .select()
        .or('name.ilike.%$query%,sku.ilike.%$query%');
    return (response as List).map((json) => Product.fromJson(json)).toList();
  }

  // Lưu hình ảnh vào product_images table
  Future<void> saveProductImage(String productId, String imageUrl) async {
    try {
      await supabase.from('product_images').insert({
        'product_id': productId,
        'image_url': imageUrl,
        'alt_text': 'Product Image',
      });
    } catch (e) {
      print('Lỗi lưu hình ảnh: $e');
      throw Exception('Lỗi lưu hình ảnh: $e');
    }
  }

  // Lấy ảnh của sản phẩm
  Future<List<Map<String, dynamic>>> getProductImages(String productId) async {
    try {
      final response = await supabase
          .from('product_images')
          .select()
          .eq('product_id', productId)
          .order('created_at', ascending: true);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Lỗi lấy ảnh: $e');
      return [];
    }
  }

  // Xóa hình ảnh
  Future<void> deleteProductImage(String imageId) async {
    try {
      await supabase.from('product_images').delete().eq('id', imageId);
    } catch (e) {
      print('Lỗi xóa ảnh: $e');
    }
  }
}
