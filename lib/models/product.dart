class Product {
  final String id;
  final String name;
  final String sku;
  final double price;
  final int stock;
  final String description;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.name,
    required this.sku,
    required this.price,
    required this.stock,
    required this.description,
    required this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      sku: json['sku'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      stock: json['stock'] ?? 0,
      description: json['description'] ?? '',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'sku': sku,
      'price': price,
      'stock': stock,
      'description': description,
    };
  }
}
