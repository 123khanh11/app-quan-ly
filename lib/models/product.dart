class Product {
  final String id;
  final String name;
  final String? slug;
  final String? sku;
  final String? description;
  final double price;
  final double? salePrice;
  final bool active;
  final String? categoryId;
  final String? brandId;
  final String? imageUrl;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Product({
    required this.id,
    required this.name,
    this.slug,
    this.sku,
    this.description,
    required this.price,
    this.salePrice,
    this.active = true,
    this.categoryId,
    this.brandId,
    this.imageUrl,
    this.createdAt,
    this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      slug: json['slug'],
      sku: json['sku'],
      description: json['description'],
      price: (json['price'] ?? 0).toDouble(),
      salePrice: json['sale_price']?.toDouble(),
      active: json['active'] ?? true,
      categoryId: json['category_id'],
      brandId: json['brand_id'],
      imageUrl: json['image_url'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'slug': slug,
      'sku': sku,
      'description': description,
      'price': price,
      'sale_price': salePrice,
      'active': active,
      'category_id': categoryId,
      'brand_id': brandId,
      'image_url': imageUrl,
    };
  }
}
