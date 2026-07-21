class Category {
  final String id;
  final String name;
  final String? slug;
  final DateTime? createdAt;

  Category({
    required this.id,
    required this.name,
    this.slug,
    this.createdAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      slug: json['slug'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'slug': slug,
    };
  }
}
