import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/product.dart';
import '../services/product_service.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  final _productService = ProductService();
  List<Product> _products = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);
    final products = await _productService.getProducts();
    setState(() {
      _products = products;
      _isLoading = false;
    });
  }

  List<Product> get _filteredProducts {
    if (_searchQuery.isEmpty) return _products;
    return _products
        .where((p) =>
            p.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  Future<void> _deleteProduct(String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa sản phẩm'),
        content: const Text('Bạn có chắc muốn xóa sản phẩm này?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Xóa', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final success = await _productService.deleteProduct(id);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Xóa sản phẩm thành công'),
            backgroundColor: Colors.green,
          ),
        );
        _loadProducts();
      }
    }
  }

  void _showProductForm({Product? product}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => ProductFormSheet(
        product: product,
        onSave: () {
          _loadProducts();
          Navigator.pop(ctx);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    return Scaffold(
      body: Column(
        children: [
          // Search & Header
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.blue.shade50,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '📦 Quản Lý Hàng Hóa',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 12),
                TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  decoration: InputDecoration(
                    hintText: '🔍 Tìm kiếm theo tên hoặc SKU...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Products List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredProducts.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.inbox_outlined,
                              size: 64,
                              color: Colors.grey.shade400,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Chưa có sản phẩm',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadProducts,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _filteredProducts.length,
                          itemBuilder: (ctx, idx) {
                            final product = _filteredProducts[idx];
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
                              child: ListTile(
                                contentPadding: const EdgeInsets.all(12),
                                title: Text(
                                  product.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Text(
                                          'SKU: ${product.sku}',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey.shade600,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: product.stock > 0
                                                ? Colors.green.shade100
                                                : Colors.red.shade100,
                                            borderRadius:
                                                BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            'Tồn: ${product.stock}',
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                              color: product.stock > 0
                                                  ? Colors.green.shade700
                                                  : Colors.red.shade700,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Giá: ${formatter.format(product.price)}',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green.shade600,
                                      ),
                                    ),
                                  ],
                                ),
                                trailing: PopupMenuButton(
                                  itemBuilder: (ctx) => [
                                    PopupMenuItem(
                                      child: const Text('✏️ Sửa'),
                                      onTap: () => _showProductForm(
                                        product: product,
                                      ),
                                    ),
                                    PopupMenuItem(
                                      child: const Text(
                                        '🗑️ Xóa',
                                        style: TextStyle(color: Colors.red),
                                      ),
                                      onTap: () => _deleteProduct(product.id),
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showProductForm(),
        icon: const Icon(Icons.add),
        label: const Text('Thêm sản phẩm'),
        backgroundColor: Colors.blue,
      ),
    );
  }
}

// ===== PRODUCT FORM SHEET =====
class ProductFormSheet extends StatefulWidget {
  final Product? product;
  final VoidCallback onSave;

  const ProductFormSheet({
    this.product,
    required this.onSave,
  });

  @override
  State<ProductFormSheet> createState() => _ProductFormSheetState();
}

class _ProductFormSheetState extends State<ProductFormSheet> {
  late TextEditingController _nameCtrl;
  late TextEditingController _skuCtrl;
  late TextEditingController _priceCtrl;
  late TextEditingController _stockCtrl;
  late TextEditingController _descCtrl;

  final _productService = ProductService();
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.product?.name ?? '');
    _skuCtrl = TextEditingController(text: widget.product?.sku ?? '');
    _priceCtrl =
        TextEditingController(text: widget.product?.price.toString() ?? '');
    _stockCtrl =
        TextEditingController(text: widget.product?.stock.toString() ?? '');
    _descCtrl = TextEditingController(text: widget.product?.description ?? '');
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _skuCtrl.dispose();
    _priceCtrl.dispose();
    _stockCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_nameCtrl.text.isEmpty ||
        _skuCtrl.text.isEmpty ||
        _priceCtrl.text.isEmpty ||
        _stockCtrl.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ Vui lòng điền đủ thông tin!')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final product = Product(
      id: widget.product?.id ?? '',
      name: _nameCtrl.text,
      sku: _skuCtrl.text,
      price: double.parse(_priceCtrl.text),
      stock: int.parse(_stockCtrl.text),
      description: _descCtrl.text,
      createdAt: widget.product?.createdAt ?? DateTime.now(),
    );

    bool success;
    if (widget.product == null) {
      success = await _productService.createProduct(product);
    } else {
      success = await _productService.updateProduct(product);
    }

    setState(() => _isSubmitting = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.product == null
                ? '✅ Thêm sản phẩm thành công'
                : '✅ Cập nhật thành công',
          ),
          backgroundColor: Colors.green,
        ),
      );
      widget.onSave();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('❌ Có lỗi xảy ra!'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.product == null ? '➕ Thêm Sản Phẩm' : '✏️ Sửa Sản Phẩm',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 20),

            // Name
            TextField(
              controller: _nameCtrl,
              decoration: InputDecoration(
                labelText: 'Tên sản phẩm',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // SKU
            TextField(
              controller: _skuCtrl,
              decoration: InputDecoration(
                labelText: 'SKU/Mã hàng',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Price & Stock (Row)
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _priceCtrl,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Giá (₫)',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _stockCtrl,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Tồn kho',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Description
            TextField(
              controller: _descCtrl,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Mô tả',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Hủy'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isSubmitting ? null : _handleSubmit,
                    child: Text(
                      _isSubmitting ? '⏳ Đang lưu...' : '💾 Lưu',
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
