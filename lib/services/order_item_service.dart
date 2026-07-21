import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/order_item.dart';

class OrderItemService {
  final _supabase = Supabase.instance.client;

  // ✅ Lấy tất cả items của một đơn
  Future<List<OrderItem>> getOrderItems(String orderId) async {
    try {
      final response = await _supabase
          .from('order_items')
          .select()
          .eq('order_id', orderId)
          .order('created_at', ascending: true);

      if (response.isEmpty) return [];

      return (response as List)
          .map((item) => OrderItem.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('❌ Lỗi lấy order items: $e');
      return [];
    }
  }

  // ✅ Thêm item vào đơn hàng
  Future<bool> addOrderItem(OrderItem item) async {
    try {
      await _supabase.from('order_items').insert({
        'order_id': item.orderId,
        'product_id': item.productId,
        'quantity': item.quantity,
        'unit_price': item.unitPrice,
        'total_price': item.totalPrice,
      });

      print('✅ Thêm item thành công');
      return true;
    } catch (e) {
      print('❌ Lỗi thêm item: $e');
      return false;
    }
  }

  // ✅ Cập nhật quantity
  Future<bool> updateQuantity(String itemId, int newQuantity) async {
    try {
      // Lấy item để tính lại total_price
      final item = await _supabase
          .from('order_items')
          .select()
          .eq('id', itemId)
          .single();

      final unitPrice = (item['unit_price'] ?? 0).toDouble();
      final newTotal = unitPrice * newQuantity;

      await _supabase.from('order_items').update({
        'quantity': newQuantity,
        'total_price': newTotal,
      }).eq('id', itemId);

      print('✅ Cập nhật quantity thành công');
      return true;
    } catch (e) {
      print('❌ Lỗi cập nhật: $e');
      return false;
    }
  }

  // ✅ Xóa item khỏi đơn
  Future<bool> removeOrderItem(String itemId) async {
    try {
      await _supabase.from('order_items').delete().eq('id', itemId);

      print('✅ Xóa item thành công');
      return true;
    } catch (e) {
      print('❌ Lỗi xóa: $e');
      return false;
    }
  }

  // ✅ Lấy thống kê bán hàng
  Future<List<Map<String, dynamic>>> getSalesStats() async {
    try {
      final response = await _supabase
          .from('order_items')
          .select('product_id, quantity, total_price, products(name, sku)')
          .order('created_at', ascending: false);

      if (response.isEmpty) return [];

      // Group by product
      Map<String, dynamic> grouped = {};
      for (var item in response) {
        final productId = item['product_id'];
        if (!grouped.containsKey(productId)) {
          grouped[productId] = {
            'product_id': productId,
            'product_name': item['products']['name'],
            'product_sku': item['products']['sku'],
            'total_quantity': 0,
            'total_revenue': 0,
          };
        }
        grouped[productId]['total_quantity'] += item['quantity'];
        grouped[productId]['total_revenue'] += (item['total_price'] ?? 0);
      }

      return grouped.values.toList().cast<Map<String, dynamic>>();
    } catch (e) {
      print('❌ Lỗi: $e');
      return [];
    }
  }

  // ✅ Lấy sản phẩm bán chạy nhất
  Future<List<Map<String, dynamic>>> getTopProducts({int limit = 10}) async {
    try {
      final stats = await getSalesStats();
      stats.sort((a, b) =>
          (b['total_quantity'] as int).compareTo(a['total_quantity'] as int));
      return stats.take(limit).toList();
    } catch (e) {
      print('❌ Lỗi: $e');
      return [];
    }
  }

  // ✅ Lấy doanh thu theo sản phẩm
  Future<List<Map<String, dynamic>>> getRevenueByProduct(
      {int limit = 10}) async {
    try {
      final stats = await getSalesStats();
      stats.sort((a, b) =>
          (b['total_revenue'] as num).compareTo(a['total_revenue'] as num));
      return stats.take(limit).toList();
    } catch (e) {
      print('❌ Lỗi: $e');
      return [];
    }
  }

  // ✅ Tính tổng doanh thu
  Future<double> getTotalRevenue() async {
    try {
      final response = await _supabase
          .from('order_items')
          .select('total_price');

      if (response.isEmpty) return 0;

      double total = 0;
      for (var item in response) {
        total += (item['total_price'] ?? 0).toDouble();
      }
      return total;
    } catch (e) {
      print('❌ Lỗi: $e');
      return 0;
    }
  }
}
