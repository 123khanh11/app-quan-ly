import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/product.dart';

class ProductService {
  final _supabase = Supabase.instance.client;

  // ✅ Lấy tất cả sản phẩm
  Future<List<Product>> getProducts() async {
    try {
      final response = await _supabase
          .from('products')
          .select()
          .order('created_at', ascending: false);

      if (response.isEmpty) return [];

      return (response as List)
          .map((p) => Product.fromJson(p as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('❌ Lỗi lấy sản phẩm: $e');
      return [];
    }
  }

  // ✅ Lấy 1 sản phẩm theo ID
  Future<Product?> getProductById(String id) async {
    try {
      final response = await _supabase
          .from('products')
          .select()
          .eq('id', id)
          .single();

      return Product.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      print('❌ Lỗi: $e');
      return null;
    }
  }

  // ✅ Thêm sản phẩm mới
  Future<bool> createProduct(Product product) async {
    try {
      await _supabase.from('products').insert({
        'name': product.name,
        'sku': product.sku,
        'price': product.price,
        'stock': product.stock,
        'description': product.description,
      });

      print('✅ Thêm sản phẩm thành công');
      return true;
    } catch (e) {
      print('❌ Lỗi thêm sản phẩm: $e');
      return false;
    }
  }

  // ✅ Cập nhật sản phẩm
  Future<bool> updateProduct(Product product) async {
    try {
      await _supabase.from('products').update({
        'name': product.name,
        'sku': product.sku,
        'price': product.price,
        'stock': product.stock,
        'description': product.description,
      }).eq('id', product.id);

      print('✅ Cập nhật sản phẩm thành công');
      return true;
    } catch (e) {
      print('❌ Lỗi cập nhật: $e');
      return false;
    }
  }

  // ✅ Xóa sản phẩm
  Future<bool> deleteProduct(String id) async {
    try {
      await _supabase.from('products').delete().eq('id', id);

      print('✅ Xóa sản phẩm thành công');
      return true;
    } catch (e) {
      print('❌ Lỗi xóa: $e');
      return false;
    }
  }

  // ✅ Tìm kiếm sản phẩm theo tên/SKU
  Future<List<Product>> searchProducts(String query) async {
    try {
      final response = await _supabase
          .from('products')
          .select()
          .or('name.ilike.%$query%,sku.ilike.%$query%')
          .order('created_at', ascending: false);

      if (response.isEmpty) return [];

      return (response as List)
          .map((p) => Product.fromJson(p as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('❌ Lỗi tìm kiếm: $e');
      return [];
    }
  }

  // ✅ Cập nhật tồn kho
  Future<bool> updateStock(String productId, int newStock) async {
    try {
      await _supabase
          .from('products')
          .update({'stock': newStock}).eq('id', productId);

      print('✅ Cập nhật tồn kho thành công');
      return true;
    } catch (e) {
      print('❌ Lỗi cập nhật tồn kho: $e');
      return false;
    }
  }

  // ✅ Lấy số liệu thống kê sản phẩm
  Future<Map<String, dynamic>> getProductStats() async {
    try {
      final products = await getProducts();

      int totalProducts = products.length;
      int lowStockItems = products.where((p) => p.stock < 10).length;
      int outOfStockItems = products.where((p) => p.stock == 0).length;
      double totalValue =
          products.fold(0, (sum, p) => sum + (p.price * p.stock));

      return {
        'totalProducts': totalProducts,
        'lowStockItems': lowStockItems,
        'outOfStockItems': outOfStockItems,
        'totalValue': totalValue,
      };
    } catch (e) {
      print('❌ Lỗi: $e');
      return {
        'totalProducts': 0,
        'lowStockItems': 0,
        'outOfStockItems': 0,
        'totalValue': 0,
      };
    }
  }
}
