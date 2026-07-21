class OrderItem {
  final String id;
  final String orderId;
  final String productId;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final DateTime createdAt;

  OrderItem({
    required this.id,
    required this.orderId,
    required this.productId,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    required this.createdAt,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] ?? '',
      orderId: json['order_id'] ?? '',
      productId: json['product_id'] ?? '',
      quantity: json['quantity'] ?? 1,
      unitPrice: (json['unit_price'] ?? 0).toDouble(),
      totalPrice: (json['total_price'] ?? 0).toDouble(),
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'order_id': orderId,
      'product_id': productId,
      'quantity': quantity,
      'unit_price': unitPrice,
      'total_price': totalPrice,
    };
  }
}
