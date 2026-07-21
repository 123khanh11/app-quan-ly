import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/order_item_service.dart';

class SalesReportScreen extends StatefulWidget {
  const SalesReportScreen({super.key});

  @override
  State<SalesReportScreen> createState() => _SalesReportScreenState();
}

class _SalesReportScreenState extends State<SalesReportScreen> {
  final _orderItemService = OrderItemService();
  List<Map<String, dynamic>> _topProducts = [];
  List<Map<String, dynamic>> _topRevenue = [];
  double _totalRevenue = 0;
  bool _isLoading = true;
  int _selectedTab = 0; // 0 = Top Products, 1 = Top Revenue

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    setState(() => _isLoading = true);

    final topProducts = await _orderItemService.getTopProducts(limit: 20);
    final topRevenue = await _orderItemService.getRevenueByProduct(limit: 20);
    final totalRevenue = await _orderItemService.getTotalRevenue();

    setState(() {
      _topProducts = topProducts;
      _topRevenue = topRevenue;
      _totalRevenue = totalRevenue;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      body: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.deepPurple.shade50,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '📊 Báo Cáo Bán Hàng',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.trending_up,
                        color: Colors.deepPurple.shade600,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Tổng Doanh Thu',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.deepPurple.shade600,
                              ),
                            ),
                            Text(
                              formatter.format(_totalRevenue),
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.deepPurple.shade700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Tabs
          Container(
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () => setState(() => _selectedTab = 0),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: _selectedTab == 0
                                ? Colors.deepPurple
                                : Colors.grey.shade300,
                            width: 3,
                          ),
                        ),
                      ),
                      child: Text(
                        '🏆 Sản Phẩm Bán Chạy',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: _selectedTab == 0
                              ? Colors.deepPurple
                              : Colors.grey.shade600,
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: InkWell(
                    onTap: () => setState(() => _selectedTab = 1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: _selectedTab == 1
                                ? Colors.deepPurple
                                : Colors.grey.shade300,
                            width: 3,
                          ),
                        ),
                      ),
                      child: Text(
                        '💰 Doanh Thu Cao',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: _selectedTab == 1
                              ? Colors.deepPurple
                              : Colors.grey.shade600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: RefreshIndicator(
              onRefresh: _loadStats,
              child: _selectedTab == 0
                  ? _buildTopProductsList()
                  : _buildTopRevenueList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopProductsList() {
    if (_topProducts.isEmpty) {
      return Center(
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
              'Chưa có dữ liệu bán hàng',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _topProducts.length,
      itemBuilder: (ctx, idx) {
        final product = _topProducts[idx];
        final rank = idx + 1;
        final quantity = product['total_quantity'] ?? 0;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: Colors.white,
            border: Border.all(
              color: Colors.grey.shade200,
              width: 1,
            ),
          ),
          child: ListTile(
            leading: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: rank <= 3
                    ? [Colors.amber, Colors.grey.shade300, Colors.orange][
                        rank - 1]
                    : Colors.blue.shade100,
              ),
              child: Center(
                child: Text(
                  '#$rank',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: rank <= 3 ? Colors.white : Colors.blue.shade700,
                  ),
                ),
              ),
            ),
            title: Text(
              product['product_name'] ?? 'N/A',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
            subtitle: Text(
              'SKU: ${product['product_sku']}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 6,
              ),
              decoration: BoxDecoration(
                color: Colors.deepPurple.shade100,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                '📦 $quantity',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.deepPurple.shade700,
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildTopRevenueList() {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    if (_topRevenue.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.attach_money_outlined,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              'Chưa có dữ liệu doanh thu',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _topRevenue.length,
      itemBuilder: (ctx, idx) {
        final product = _topRevenue[idx];
        final rank = idx + 1;
        final revenue = (product['total_revenue'] ?? 0).toDouble();
        final quantity = product['total_quantity'] ?? 0;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: Colors.white,
            border: Border.all(
              color: Colors.grey.shade200,
              width: 1,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: rank <= 3
                            ? [Colors.amber, Colors.grey.shade300,
                                Colors.orange][rank - 1]
                            : Colors.green.shade100,
                      ),
                      child: Center(
                        child: Text(
                          '#$rank',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: rank <= 3
                                ? Colors.white
                                : Colors.green.shade700,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product['product_name'] ?? 'N/A',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          Text(
                            'SKU: ${product['product_sku']}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Doanh thu: ${formatter.format(revenue)}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.green.shade600,
                        fontSize: 14,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade100,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '$quantity đơn',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
