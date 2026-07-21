import '../config/supabase_config.dart';
import '../models/order.dart';

class OrderService {
  /// Lấy danh sách tất cả orders
  /// Sorted by created_at DESC (mới nhất trước)
  Future<List<Order>> getOrders({int limit = 100, int offset = 0}) async {
    try {
      final response = await supabase
          .from('orders')
          .select('*')  // Lấy tất cả fields từ orders
          .order('created_at', ascending: false)
          .range(offset, offset + limit - 1);
      return (response as List).map((json) => Order.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching orders: $e');
      return [];
    }
  }

  /// Lấy chi tiết 1 order
  Future<Order?> getOrder(String id) async {
    try {
      final response = await supabase
          .from('orders')
          .select()
          .eq('id', id)
          .single();
      return Order.fromJson(response);
    } catch (e) {
      print('Error fetching order $id: $e');
      return null;
    }
  }

  /// Lấy orders theo trạng thái
  Future<List<Order>> getOrdersByStatus(String status,
      {int limit = 100, int offset = 0}) async {
    try {
      final response = await supabase
          .from('orders')
          .select()
          .eq('order_status', status)
          .order('created_at', ascending: false)
          .range(offset, offset + limit - 1);
      return (response as List).map((json) => Order.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching orders by status: $e');
      return [];
    }
  }

  /// Tìm kiếm orders (theo địa chỉ hoặc ghi chú)
  Future<List<Order>> searchOrders(String query,
      {int limit = 100, int offset = 0}) async {
    try {
      final searchQuery = '%$query%';
      final response = await supabase
          .from('orders')
          .select()
          .or('shipping_address.ilike.$searchQuery,note.ilike.$searchQuery')
          .order('created_at', ascending: false)
          .range(offset, offset + limit - 1);
      return (response as List).map((json) => Order.fromJson(json)).toList();
    } catch (e) {
      print('Error searching orders: $e');
      return [];
    }
  }

  /// Cập nhật trạng thái order
  Future<bool> updateOrderStatus(String id, String status) async {
    try {
      await supabase
          .from('orders')
          .update({'order_status': status, 'updated_at': DateTime.now().toIso8601String()})
          .eq('id', id);
      return true;
    } catch (e) {
      print('Error updating order status: $e');
      return false;
    }
  }

  /// Cập nhật payment status
  Future<bool> updatePaymentStatus(String id, String status) async {
    try {
      await supabase
          .from('orders')
          .update({'payment_status': status, 'updated_at': DateTime.now().toIso8601String()})
          .eq('id', id);
      return true;
    } catch (e) {
      print('Error updating payment status: $e');
      return false;
    }
  }

  /// Cập nhật ghi chú order
  Future<bool> updateOrderNote(String id, String note) async {
    try {
      await supabase
          .from('orders')
          .update({'note': note, 'updated_at': DateTime.now().toIso8601String()})
          .eq('id', id);
      return true;
    } catch (e) {
      print('Error updating order note: $e');
      return false;
    }
  }

  /// Lấy chi tiết order kèm order_items
  Future<Map<String, dynamic>?> getOrderDetail(String id) async {
    try {
      final order = await getOrder(id);
      if (order == null) return null;

      final itemsResponse =
          await supabase.from('order_items').select().eq('order_id', id);

      return {
        'order': order,
        'items': itemsResponse as List? ?? [],
      };
    } catch (e) {
      print('Error fetching order detail: $e');
      return null;
    }
  }

  /// Lấy thống kê orders
  Future<Map<String, dynamic>> getOrderStats() async {
    try {
      final orders = await getOrders(limit: 10000);
      final total = orders.fold<double>(0, (sum, order) => sum + order.total);
      final pending =
          orders.where((o) => o.orderStatus == 'pending').length;
      final processing =
          orders.where((o) => o.orderStatus == 'processing').length;
      final completed =
          orders.where((o) => o.orderStatus == 'completed').length;
      final shipped =
          orders.where((o) => o.orderStatus == 'shipped').length;
      final cancelled =
          orders.where((o) => o.orderStatus == 'cancelled').length;

      return {
        'totalOrders': orders.length,
        'totalRevenue': total,
        'pending': pending,
        'processing': processing,
        'completed': completed,
        'shipped': shipped,
        'cancelled': cancelled,
      };
    } catch (e) {
      print('Error getting order stats: $e');
      return {
        'totalOrders': 0,
        'totalRevenue': 0,
        'pending': 0,
        'processing': 0,
        'completed': 0,
        'shipped': 0,
        'cancelled': 0,
      };
    }
  }

  /// Lấy tổng doanh thu
  Future<double> getTotalRevenue() async {
    try {
      final orders = await getOrders(limit: 10000);
      return orders.fold<double>(0, (sum, order) => sum + order.total);
    } catch (e) {
      print('Error getting total revenue: $e');
      return 0;
    }
  }

  /// Lấy orders theo date range
  Future<List<Order>> getOrdersByDateRange(DateTime startDate, DateTime endDate,
      {int limit = 100, int offset = 0}) async {
    try {
      final response = await supabase
          .from('orders')
          .select()
          .gte('created_at', startDate.toIso8601String())
          .lte('created_at', endDate.toIso8601String())
          .order('created_at', ascending: false)
          .range(offset, offset + limit - 1);
      return (response as List).map((json) => Order.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching orders by date range: $e');
      return [];
    }
  }

  /// Tạo order mới với shipping_address tự động
  Future<Order?> createOrder({
    required String userId,
    required double total,
    required double shippingFee,
    required String? paymentMethod,
    String? shippingAddress,
    String? note,
  }) async {
    try {
      // Nếu không có shipping_address, lấy từ bảng addresses
      String? finalShippingAddress = shippingAddress;
      
      if (finalShippingAddress == null || finalShippingAddress.isEmpty) {
        try {
          final addressResponse = await supabase
              .from('addresses')
              .select('detail, ward, district, province')
              .eq('user_id', userId)
              .eq('is_default', true)
              .single();
          
          if (addressResponse != null) {
            final detail = addressResponse['detail'] ?? '';
            final ward = addressResponse['ward'] ?? '';
            final district = addressResponse['district'] ?? '';
            final province = addressResponse['province'] ?? '';
            finalShippingAddress = '$detail, $ward, $district, $province';
          }
        } catch (e) {
          print('Note: Could not fetch default address: $e');
          finalShippingAddress = 'Địa chỉ sẽ được cập nhật sau';
        }
      }

      final orderData = {
        'user_id': userId,
        'total': total,
        'shipping_fee': shippingFee,
        'payment_method': paymentMethod,
        'payment_status': 'pending',
        'order_status': 'pending',
        'shipping_address': finalShippingAddress,
        'note': note,
        'created_at': DateTime.now().toIso8601String(),
      };

      final response = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

      print('Order created successfully: ${response['id']}');
      return Order.fromJson(response);
    } catch (e) {
      print('Error creating order: $e');
      return null;
    }
  }
}
