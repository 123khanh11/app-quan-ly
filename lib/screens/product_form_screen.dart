import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../services/product_service.dart';
import '../services/category_service.dart';

class ProductFormScreen extends StatefulWidget {
  final Product? product;

  const ProductFormScreen({super.key, this.product});

  @override
  State<ProductFormScreen> createState() => _ProductFormScreenState();
}

class _ProductFormScreenState extends State<ProductFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _skuController = TextEditingController();
  final _descController = TextEditingController();
  final _priceController = TextEditingController();
  final _salePriceController = TextEditingController();
  final _imageUrlController = TextEditingController();
  
  final _productService = ProductService();
  final _categoryService = CategoryService();
  
  List<Category> _categories = [];
  String? _selectedCategoryId;
  bool _isLoading = false;
  bool _active = true;
  String? _previewImageUrl;

  @override
  void initState() {
    super.initState();
    _loadCategories();
    if (widget.product != null) {
      _nameController.text = widget.product!.name;
      _skuController.text = widget.product!.sku ?? '';
      _descController.text = widget.product!.description ?? '';
      _priceController.text = widget.product!.price.toString();
      _salePriceController.text = widget.product!.salePrice?.toString() ?? '';
      _selectedCategoryId = widget.product!.categoryId;
      _active = widget.product!.active;
      _imageUrlController.text = widget.product!.imageUrl ?? '';
      _previewImageUrl = widget.product!.imageUrl;
    }
  }

  Future<void> _loadCategories() async {
    final categories = await _categoryService.getCategories();
    setState(() => _categories = categories);
  }

  Future<void> _pickImage() async {
    // On web, just update preview
    setState(() {
      _previewImageUrl = _imageUrlController.text;
    });
  }

  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final product = Product(
        id: widget.product?.id ?? '',
        name: _nameController.text,
        sku: _skuController.text,
        description: _descController.text,
        price: double.parse(_priceController.text),
        salePrice: _salePriceController.text.isEmpty 
            ? null 
            : double.parse(_salePriceController.text),
        active: _active,
        categoryId: _selectedCategoryId,
        imageUrl: null,
      );

      String productId;
      if (widget.product == null) {
        await _productService.createProduct(product);
        productId = product.id;
      } else {
        await _productService.updateProduct(widget.product!.id, product);
        productId = widget.product!.id;
      }

      // Lưu hình ảnh vào product_images nếu có URL
      if (_imageUrlController.text.isNotEmpty && _imageUrlController.text != (widget.product?.imageUrl ?? '')) {
        await _productService.saveProductImage(productId, _imageUrlController.text);
      }

      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi: $e')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.product == null ? 'Thêm sản phẩm' : 'Sửa sản phẩm'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Image Preview
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.grey.shade300,
                  width: 2,
                ),
              ),
              child: _previewImageUrl != null && _previewImageUrl!.isNotEmpty
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        _previewImageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.image_not_supported,
                                size: 48,
                                color: Colors.grey.shade400,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'URL không hợp lệ',
                                style: TextStyle(
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  : Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.image,
                            size: 48,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Nhập link ảnh dưới',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _imageUrlController,
              decoration: InputDecoration(
                labelText: 'Link Ảnh (URL)',
                hintText: 'https://example.com/image.jpg',
                prefixIcon: const Icon(Icons.link),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (_) {
                setState(() {
                  _previewImageUrl = _imageUrlController.text;
                });
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Tên sản phẩm *',
                prefixIcon: const Icon(Icons.shopping_bag),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              validator: (v) => v?.isEmpty == true ? 'Bắt buộc' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _skuController,
              decoration: InputDecoration(
                labelText: 'SKU',
                prefixIcon: const Icon(Icons.code),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedCategoryId,
              decoration: InputDecoration(
                labelText: 'Danh mục',
                prefixIcon: const Icon(Icons.category),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              items: _categories.map((cat) {
                return DropdownMenuItem(value: cat.id, child: Text(cat.name));
              }).toList(),
              onChanged: (val) => setState(() => _selectedCategoryId = val),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _priceController,
              decoration: InputDecoration(
                labelText: 'Giá *',
                prefixIcon: const Icon(Icons.attach_money),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              keyboardType: TextInputType.number,
              validator: (v) => v?.isEmpty == true ? 'Bắt buộc' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _salePriceController,
              decoration: InputDecoration(
                labelText: 'Giá khuyến mãi',
                prefixIcon: const Icon(Icons.local_offer),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descController,
              decoration: InputDecoration(
                labelText: 'Mô tả',
                prefixIcon: const Icon(Icons.description),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Kích hoạt'),
              value: _active,
              onChanged: (val) => setState(() => _active = val),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _saveProduct,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: _isLoading 
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Lưu sản phẩm'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _skuController.dispose();
    _descController.dispose();
    _priceController.dispose();
    _salePriceController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }
}
