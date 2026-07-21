import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/product_service.dart';

class InventoryDashboardScreen extends StatefulWidget {
  const InventoryDashboardScreen({super.key});

  @override
  State<InventoryDashboardScreen> createState() =>
      _InventoryDashboardScreenState();
}

class _InventoryDashboardScreenState extends State<InventoryDashboardScreen> {
  final _productService = ProductService();
  Map<String, dynamic>? _stats;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final stats = await _productService.getProductStats();
    setState(() {
      _stats = stats;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
    final totalProducts = _stats?['totalProducts'] ?? 0;
    final lowStockItems = _stats?['lowStockItems'] ?? 0;
    final outOfStockItems = _stats?['outOfStockItems'] ?? 0;
    final totalValue = _stats?['totalValue'] ?? 0;

    return RefreshIndicator(
      onRefresh: _loadStats,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header
          Text(
            '📦 Tổng Quan Hàng Hóa',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 20),

          // Stats Grid
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            children: [
              _StatCard(
                title: 'Tổng Sản Phẩm',
                value: '$totalProducts',
                icon: Icons.inventory_2_outlined,
                color: Colors.blue,
                backgroundColor: Colors.blue.shade50,
              ),
              _StatCard(
                title: 'Giá Trị Kho',
                value: formatter.format(totalValue),
                icon: Icons.trending_up,
                color: Colors.green,
                backgroundColor: Colors.green.shade50,
              ),
              _StatCard(
                title: 'Sắp Hết Hàng',
                value: '$lowStockItems',
                icon: Icons.warning_outlined,
                color: Colors.orange,
                backgroundColor: Colors.orange.shade50,
              ),
              _StatCard(
                title: 'Hết Hàng',
                value: '$outOfStockItems',
                icon: Icons.error_outline,
                color: Colors.red,
                backgroundColor: Colors.red.shade50,
              ),
            ],
          ),
          const SizedBox(height: 32),

          // Info Card
          Container(
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Colors.blue.shade200,
                width: 1,
              ),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '💡 Gợi Ý',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.blue.shade700,
                      ),
                ),
                const SizedBox(height: 12),
                if (outOfStockItems > 0)
                  Text(
                    '⚠️ Có $outOfStockItems sản phẩm hết hàng. Vui lòng nhập thêm!',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.blue.shade700,
                    ),
                  ),
                if (lowStockItems > 0) ...[
                  const SizedBox(height: 8),
                  Text(
                    '📉 Có $lowStockItems sản phẩm sắp hết hàng (tồn < 20). Cần chuẩn bị nhập hàng!',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.blue.shade700,
                    ),
                  ),
                ],
                if (outOfStockItems == 0 && lowStockItems == 0) ...[
                  const SizedBox(height: 8),
                  Text(
                    '✅ Tình hình tồn kho tốt. Hàng hóa dồi dào!',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.green.shade700,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final Color backgroundColor;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.2),
          width: 1.5,
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 40, color: color),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade700,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
