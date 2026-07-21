import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/order.dart';
import '../services/order_service.dart';
import '../utils/address_parser.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final _orderService = OrderService();
  List<Order> _orders = [];
  bool _isLoading = true;
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  Future<void> _loadOrders() async {
    setState(() => _isLoading = true);
    final orders = await _orderService.getOrders();
    setState(() {
      _orders = orders;
      _isLoading = false;
    });
  }

  Future<void> _updateStatus(String id, String status) async {
    await _orderService.updateOrderStatus(id, status);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Cập nhật trạng thái thành công'),
        backgroundColor: Colors.green,
      ),
    );
    _loadOrders();
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'processing':
        return Colors.blue;
      case 'completed':
        return Colors.green;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  List<Order> get _filteredOrders {
    if (_selectedStatus == 'all') return _orders;
    return _orders.where((order) => order.orderStatus == _selectedStatus).toList();
  }

  @override
  Widget build(BuildContext context) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    return Scaffold(
      body: Column(
        children: [
          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                FilterChip(
                  selected: _selectedStatus == 'all',
                  label: const Text('Tất cả'),
                  onSelected: (selected) =>
                      setState(() => _selectedStatus = 'all'),
                ),
                const SizedBox(width: 8),
                FilterChip(
                  selected: _selectedStatus == 'pending',
                  label: const Text('Chờ xử lý'),
                  onSelected: (selected) =>
                      setState(() => _selectedStatus = 'pending'),
                ),
                const SizedBox(width: 8),
                FilterChip(
                  selected: _selectedStatus == 'processing',
                  label: const Text('Đang xử lý'),
                  onSelected: (selected) =>
                      setState(() => _selectedStatus = 'processing'),
                ),
                const SizedBox(width: 8),
                FilterChip(
                  selected: _selectedStatus == 'completed',
                  label: const Text('Hoàn thành'),
                  onSelected: (selected) =>
                      setState(() => _selectedStatus = 'completed'),
                ),
              ],
            ),
          ),
          // Orders List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadOrders,
                    child: _filteredOrders.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.shopping_bag_outlined,
                                  size: 64,
                                  color: Colors.grey.shade400,
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'Chưa có đơn hàng',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: _filteredOrders.length,
                            itemBuilder: (context, index) {
                              final order = _filteredOrders[index];
                              return Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  color: Colors.white,
                                  border: Border.all(
                                    color: Colors.grey.shade200,
                                    width: 1,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.05),
                                      blurRadius: 4,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: ExpansionTile(
                                    title: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Đơn hàng #${order.id.substring(0, 8).toUpperCase()}',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 14,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          DateFormat('dd/MM/yyyy HH:mm')
                                              .format(order.createdAt ?? DateTime.now()),
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey.shade600,
                                          ),
                                        ),
                                      ],
                                    ),
                                    subtitle: Padding(
                                      padding: const EdgeInsets.only(top: 8),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            formatter.format(order.total),
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              color: Colors.green.shade600,
                                              fontSize: 13,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 10,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: _getStatusColor(
                                                      order.orderStatus)
                                                  .withOpacity(0.1),
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              _getStatusText(
                                                  order.orderStatus),
                                              style: TextStyle(
                                                color: _getStatusColor(
                                                    order.orderStatus),
                                                fontWeight: FontWeight.w600,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    children: [
                                      Padding(
                                        padding: const EdgeInsets.all(16),
                                        child: SingleChildScrollView(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              // ===== THÔNG TIN CƠ BẢN =====
                                              Text(
                                                '📋 Thông Tin Đơn Hàng',
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .labelLarge,
                                              ),
                                              const SizedBox(height: 12),
                                              _InfoRow(
                                                label: 'Mã đơn',
                                                value: order.id.substring(0, 8).toUpperCase(),
                                              ),
                                              const SizedBox(height: 8),
                                              _InfoRow(
                                                label: 'Ngày tạo',
                                                value: DateFormat('dd/MM/yyyy HH:mm')
                                                    .format(order.createdAt ?? DateTime.now()),
                                              ),
                                              const SizedBox(height: 8),
                                              _InfoRow(
                                                label: 'Khách hàng',
                                                value: order.userId.isNotEmpty ? order.userId.substring(0, 8) : 'N/A',
                                              ),

                                              const SizedBox(height: 16),
                                              const Divider(),
                                              const SizedBox(height: 16),

                                              // ===== ĐỊA CHỈ GIAO HÀNG =====
                                              Text(
                                                '📍 Địa Chỉ Giao Hàng',
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .labelLarge,
                                              ),
                                              const SizedBox(height: 12),
                                              Container(
                                                padding: const EdgeInsets.all(12),
                                                decoration: BoxDecoration(
                                                  color: Colors.blue.shade50,
                                                  borderRadius: BorderRadius.circular(8),
                                                  border: Border.all(
                                                    color: Colors.blue.shade200,
                                                    width: 1,
                                                  ),
                                                ),
                                                child: _buildAddressSection(
                                                  order.shippingAddress,
                                                  order.customerEmail,
                                                  order.customerPhone,
                                                ),
                                              ),

                                              const SizedBox(height: 16),
                                              const Divider(),
                                              const SizedBox(height: 16),

                                              // ===== THÔNG TIN THANH TOÁN =====
                                              Text(
                                                '💰 Thông Tin Thanh Toán',
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .labelLarge,
                                              ),
                                              const SizedBox(height: 12),
                                              _InfoRow(
                                                label: 'Tổng tiền',
                                                value: formatter.format(order.total),
                                              ),
                                              const SizedBox(height: 8),
                                              _InfoRow(
                                                label: 'Phí giao hàng',
                                                value: formatter
                                                    .format(order.shippingFee),
                                              ),
                                              const SizedBox(height: 8),
                                              _InfoRow(
                                                label: 'Phương thức thanh toán',
                                                value: order.paymentMethod ?? 'N/A',
                                              ),
                                              const SizedBox(height: 8),
                                              _InfoRow(
                                                label: 'Trạng thái thanh toán',
                                                value: order.paymentStatus,
                                              ),

                                              const SizedBox(height: 16),
                                              const Divider(),
                                              const SizedBox(height: 16),

                                              // ===== TRẠNG THÁI ĐƠN HÀNG =====
                                              Text(
                                                '📦 Trạng Thái Đơn Hàng',
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .labelLarge,
                                              ),
                                              const SizedBox(height: 12),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                                decoration: BoxDecoration(
                                                  color: _getStatusColor(order.orderStatus).withOpacity(0.1),
                                                  borderRadius: BorderRadius.circular(8),
                                                  border: Border.all(
                                                    color: _getStatusColor(order.orderStatus),
                                                  ),
                                                ),
                                                child: Text(
                                                  _getStatusText(order.orderStatus),
                                                  style: TextStyle(
                                                    color: _getStatusColor(order.orderStatus),
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 14,
                                                  ),
                                                ),
                                              ),

                                              if (order.note != null && order.note!.isNotEmpty) ...[
                                                const SizedBox(height: 16),
                                                const Divider(),
                                                const SizedBox(height: 16),
                                                Text(
                                                  '📝 Ghi Chú',
                                                  style: Theme.of(context)
                                                      .textTheme
                                                      .labelLarge,
                                                ),
                                                const SizedBox(height: 8),
                                                Container(
                                                  padding: const EdgeInsets.all(12),
                                                  decoration: BoxDecoration(
                                                    color: Colors.grey.shade100,
                                                    borderRadius: BorderRadius.circular(8),
                                                  ),
                                                  child: Text(
                                                    order.note!,
                                                    style: const TextStyle(fontSize: 13),
                                                  ),
                                                ),
                                              ],

                                              const SizedBox(height: 16),
                                              const Divider(),
                                              const SizedBox(height: 16),

                                              // ===== CẬP NHẬT TRẠNG THÁI =====
                                              Text(
                                                '⚙️ Cập Nhật Trạng Thái',
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .labelLarge,
                                              ),
                                              const SizedBox(height: 12),
                                              Wrap(
                                                spacing: 8,
                                                runSpacing: 8,
                                                children: [
                                                  if (order.orderStatus !=
                                                      'processing')
                                                    ElevatedButton(
                                                      style: ElevatedButton.styleFrom(
                                                        backgroundColor:
                                                            Colors.blue,
                                                      ),
                                                      onPressed: () =>
                                                          _updateStatus(
                                                            order.id,
                                                            'processing',
                                                          ),
                                                      child: const Text('🔄 Xử lý'),
                                                    ),
                                                  if (order.orderStatus !=
                                                      'completed')
                                                    ElevatedButton(
                                                      style: ElevatedButton.styleFrom(
                                                        backgroundColor:
                                                            Colors.green,
                                                      ),
                                                      onPressed: () =>
                                                          _updateStatus(
                                                            order.id,
                                                            'completed',
                                                          ),
                                                      child:
                                                          const Text('✅ Hoàn thành'),
                                                    ),
                                                  if (order.orderStatus !=
                                                      'cancelled')
                                                    ElevatedButton(
                                                      style: ElevatedButton.styleFrom(
                                                        backgroundColor:
                                                            Colors.red,
                                                      ),
                                                      onPressed: () =>
                                                          _updateStatus(
                                                            order.id,
                                                            'cancelled',
                                                          ),
                                                      child: const Text('❌ Hủy'),
                                                    ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }
}

Widget _buildAddressSection(String? shippingAddress, String? email, String? phone) {
  // Debug: In ra giá trị
  print('DEBUG: shippingAddress = $shippingAddress');
  print('DEBUG: email = $email');
  print('DEBUG: phone = $phone');
  
  // Nếu có shipping address, parse và hiển thị
  if (shippingAddress != null && shippingAddress.isNotEmpty) {
    final address = parseShippingAddress(shippingAddress);
    print('DEBUG: Parsed address - province=${address.province}, district=${address.district}, ward=${address.ward}, detailed=${address.detailedAddress}');
    
    // Check if all fields are empty
    final allEmpty = address.province.isEmpty &&
        address.district.isEmpty &&
        address.ward.isEmpty &&
        address.detailedAddress.isEmpty;

    if (!allEmpty) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (address.province.isNotEmpty)
            _AddressRow(
              icon: '🏙️',
              label: 'Tỉnh/Thành phố',
              value: address.province,
            ),
          if (address.province.isNotEmpty) const SizedBox(height: 8),
          if (address.district.isNotEmpty)
            _AddressRow(
              icon: '🏘️',
              label: 'Quận/Huyện',
              value: address.district,
            ),
          if (address.district.isNotEmpty) const SizedBox(height: 8),
          if (address.ward.isNotEmpty)
            _AddressRow(
              icon: '🏘️',
              label: 'Xã/Phường',
              value: address.ward,
            ),
          if (address.ward.isNotEmpty) const SizedBox(height: 8),
          if (address.detailedAddress.isNotEmpty)
            _AddressRow(
              icon: '🏠',
              label: 'Địa chỉ chi tiết',
              value: address.detailedAddress,
            ),
        ],
      );
    }
  }

  // Nếu không có shipping address, hiển thị email/phone nếu có
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      if (email != null && email.isNotEmpty)
        _InfoRow(
          label: 'Email',
          value: email,
        ),
      if (email != null && email.isNotEmpty && phone != null && phone.isNotEmpty)
        const SizedBox(height: 8),
      if (phone != null && phone.isNotEmpty)
        _InfoRow(
          label: 'SĐT',
          value: phone,
        ),
      if ((email == null || email.isEmpty) && (phone == null || phone.isEmpty))
        Text(
          'Không có thông tin địa chỉ',
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey.shade500,
            fontStyle: FontStyle.italic,
          ),
        ),
    ],
  );
}

class _AddressRow extends StatelessWidget {
  final String icon;
  final String label;
  final String value;

  const _AddressRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(icon, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 13,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
      ],
    );
  }
}
