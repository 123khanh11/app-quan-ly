class Order {
  final String id;
  final String userId;
  final double total;
  final double shippingFee;
  final String? paymentMethod;
  final String paymentStatus;
  final String orderStatus;
  final String? shippingAddress;
  final String? customerEmail;
  final String? customerPhone;
  final String? note;
  final DateTime? createdAt;

  Order({
    required this.id,
    required this.userId,
    required this.total,
    this.shippingFee = 0,
    this.paymentMethod,
    this.paymentStatus = 'pending',
    this.orderStatus = 'pending',
    this.shippingAddress,
    this.customerEmail,
    this.customerPhone,
    this.note,
    this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      userId: json['user_id'] ?? '',
      total: (json['total'] ?? 0).toDouble(),
      shippingFee: (json['shipping_fee'] ?? 0).toDouble(),
      paymentMethod: json['payment_method'],
      paymentStatus: json['payment_status'] ?? 'pending',
      orderStatus: json['order_status'] ?? 'pending',
      shippingAddress: json['shipping_address'],
      customerEmail: json['customer_email'],
      customerPhone: json['customer_phone'],
      note: json['note'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }
}
