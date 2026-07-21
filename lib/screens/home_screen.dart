import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'dashboard_screen.dart';
import 'products_screen.dart';
import 'orders_screen.dart';
import 'categories_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const ProductsScreen(),
    const OrdersScreen(),
    const CategoriesScreen(),
  ];

  final List<String> _titles = [
    'Dashboard',
    'Sản phẩm',
    'Đơn hàng',
    'Danh mục',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_selectedIndex]),
        elevation: 0,
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Center(
              child: Consumer<AuthProvider>(
                builder: (context, auth, _) {
                  return PopupMenuButton<String>(
                    icon: const Icon(Icons.account_circle),
                    itemBuilder: (context) => [
                      PopupMenuItem(
                        enabled: false,
                        child: Text(
                          auth.user?.email ?? 'Người dùng',
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const PopupMenuDivider(),
                      PopupMenuItem(
                        value: 'logout',
                        child: const Row(
                          children: [
                            Icon(Icons.logout, size: 20),
                            SizedBox(width: 8),
                            Text('Đăng xuất'),
                          ],
                        ),
                        onTap: () {
                          context.read<AuthProvider>().signOut();
                        },
                      ),
                    ],
                  );
                },
              ),
            ),
          ),
        ],
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() => _selectedIndex = index);
        },
        elevation: 8,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.inventory_2_outlined),
            selectedIcon: Icon(Icons.inventory_2),
            label: 'Sản phẩm',
          ),
          NavigationDestination(
            icon: Icon(Icons.shopping_bag_outlined),
            selectedIcon: Icon(Icons.shopping_bag),
            label: 'Đơn hàng',
          ),
          NavigationDestination(
            icon: Icon(Icons.category_outlined),
            selectedIcon: Icon(Icons.category),
            label: 'Danh mục',
          ),
        ],
      ),
    );
  }
}
