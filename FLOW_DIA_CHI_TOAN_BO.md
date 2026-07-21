# 🔄 Quy Trình Toàn Bộ: Từ Website Checkout → App Quản Lý Hiển Thị Địa Chỉ

## 📍 Overview

```
WEBSITE              DATABASE              APP QUẢN LÝ
Checkout Form   →   Supabase Orders   →   Orders Screen
  ↓                      ↓                     ↓
User fills form    Insert shipping_    Display address
  ↓                 address with format   with icons
Sends to DB        "detail, ward,       🏙️ Tỉnh/Thành phố
                    district, province"  🏘️ Quận/Huyện
                                         🏘️ Xã/Phường
                                         🏠 Địa chỉ chi tiết
```

---

## 1️⃣ WEBSITE CHECKOUT (Frontend)

### Location
`web/checkout_page.html` hoặc `website_order_checkout.jsx`

### Code
```javascript
// Step 1: Get values từ form
const detailedAddress = document.getElementById('address').value
const ward = document.getElementById('ward').value
const district = document.getElementById('district').value
const province = document.getElementById('province').value

// Step 2: Build shipping_address string
const shippingAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`

// Step 3: Send to Supabase
const { data, error } = await supabase.from('orders').insert({
  user_id: userId,
  total: orderTotal,
  shipping_fee: shippingFeeAmount,
  payment_method: paymentMethod,
  order_status: 'pending',
  shipping_address: shippingAddress,  // ← CÂU CHUYỆN BẮT ĐẦU TỪ ĐÂY
  note: `Email: ${email}\nSĐT: ${phone}`
})

// Step 4: Verify no error
if (error) console.error('Failed to insert order:', error)
else console.log('Order created:', data)
```

### Example Data Inserted
```
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  user_id: "user-123",
  total: 1500000,
  shipping_fee: 50000,
  payment_method: "COD",
  order_status: "pending",
  shipping_address: "Số 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
  note: "Email: customer@email.com\nSĐT: 0988888888",
  created_at: "2024-07-21T10:30:00+00:00"
}
```

---

## 2️⃣ DATABASE (Supabase)

### Table Structure
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  total NUMERIC(12, 2),
  shipping_fee NUMERIC(12, 2),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',  -- ← MUST USE THIS, NOT "status"
  shipping_address TEXT,                -- ← DATA STORED HERE
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Data at Rest
```
id        | order_status | shipping_address
----------|--------------|------------------------------------------
550e8... | pending      | Số 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh
4a2d... | processing   | Số 456 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
...      | ...          | ...
```

### RLS Policy
```sql
-- Allow public read orders
CREATE POLICY "allow_select_orders" ON public.orders
  FOR SELECT USING (true);

-- Allow authenticated users to insert own orders
CREATE POLICY "allow_insert_orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 3️⃣ APP QUẢN LÝ (Mobile/Web)

### Flow trong App

```
main.dart
  ├─ Initialize Supabase
  │  └─ URL: https://edtxexnhpbipcecceoop.supabase.co
  │  └─ Key: sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
  │
HomeScreen
  └─ [Bottom Navigation]
     ├─ Dashboard
     ├─ Products
     ├─ [Orders]  ← User clicks here
     └─ Categories
        │
        └─ OrdersScreen (orders_screen.dart)
           ├─ _loadOrders()
           │  └─ OrderService.getOrders()
           │     └─ supabase.from('orders').select('*')
           │        └─ Returns: List<Order>
           │
           └─ ListView.builder()
              └─ For each order:
                 └─ ExpansionTile
                    └─ Click expand
                       └─ Show: _buildAddressSection()
                          └─ parseShippingAddress(order.shippingAddress)
                             └─ Split by ", "
                             └─ Display with icons
```

### Code Flow: OrdersScreen.dart

```dart
// Step 1: Load data
Future<void> _loadOrders() async {
  setState(() => _isLoading = true);
  
  // Call service
  final orders = await _orderService.getOrders();
  
  setState(() {
    _orders = orders;  // Update UI
    _isLoading = false;
  });
}

// Step 2: Display in list
ListView.builder(
  itemCount: _filteredOrders.length,
  itemBuilder: (context, index) {
    final order = _filteredOrders[index];
    
    return ExpansionTile(
      title: 'Đơn hàng #${order.id}',
      subtitle: '${order.total}₫',
      children: [
        // Step 3: When user expands, show address
        _buildAddressSection(
          parseShippingAddress(order.shippingAddress)
        )
      ]
    );
  }
)

// Step 4: Parse and display
Widget _buildAddressSection(ParsedAddress address) {
  return Column(
    children: [
      _AddressRow(
        icon: '🏙️',
        label: 'Tỉnh/Thành phố',
        value: address.province,  // "TP. Hồ Chí Minh"
      ),
      _AddressRow(
        icon: '🏘️',
        label: 'Quận/Huyện',
        value: address.district,  // "Quận 1"
      ),
      _AddressRow(
        icon: '🏘️',
        label: 'Xã/Phường',
        value: address.ward,  // "Phường Bến Thành"
      ),
      _AddressRow(
        icon: '🏠',
        label: 'Địa chỉ chi tiết',
        value: address.detailedAddress,  // "Số 123 Lê Lợi"
      ),
    ]
  );
}
```

### Code Flow: OrderService.dart

```dart
Future<List<Order>> getOrders({int limit = 100, int offset = 0}) async {
  try {
    // Query Supabase for ALL fields from orders table
    final response = await supabase
        .from('orders')
        .select('*')  // ← IMPORTANT: fetch everything
        .order('created_at', ascending: false)
        .range(offset, offset + limit - 1);
    
    // Convert JSON to Order objects
    return (response as List)
      .map((json) => Order.fromJson(json))  // ← Convert each record
      .toList();
  } catch (e) {
    print('Error fetching orders: $e');
    return [];
  }
}
```

### Code Flow: Order.dart (Model)

```dart
class Order {
  final String id;
  final String userId;
  final double total;
  final double shippingFee;
  final String? paymentMethod;
  final String paymentStatus;
  final String orderStatus;  // ← "pending", "processing", etc.
  final String? shippingAddress;  // ← "Số 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
  final String? note;
  final DateTime? createdAt;

  // Convert JSON from Supabase to Dart object
  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      userId: json['user_id'],
      total: (json['total'] ?? 0).toDouble(),
      shippingFee: (json['shipping_fee'] ?? 0).toDouble(),
      paymentMethod: json['payment_method'],
      paymentStatus: json['payment_status'] ?? 'pending',
      orderStatus: json['order_status'] ?? 'pending',  // ← Use order_status not status
      shippingAddress: json['shipping_address'],  // ← Get from DB
      note: json['note'],
      createdAt: json['created_at'] != null 
        ? DateTime.parse(json['created_at']) 
        : null,
    );
  }
}
```

### Code Flow: AddressParser.dart

```dart
ParsedAddress parseShippingAddress(String? shippingAddress) {
  if (shippingAddress == null || shippingAddress.isEmpty) {
    return ParsedAddress(
      detailedAddress: '',
      ward: '',
      district: '',
      province: '',
    );
  }

  // Split by ", " (comma + space)
  final parts = shippingAddress.split(', ');
  
  return ParsedAddress(
    detailedAddress: parts.isNotEmpty ? parts[0].trim() : '',      // "Số 123 Lê Lợi"
    ward: parts.length > 1 ? parts[1].trim() : '',                 // "Phường Bến Thành"
    district: parts.length > 2 ? parts[2].trim() : '',             // "Quận 1"
    province: parts.length > 3 ? parts[3].trim() : '',             // "TP. Hồ Chí Minh"
  );
}

// Example:
// Input: "Số 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
// Output: ParsedAddress(
//   detailedAddress: "Số 123 Lê Lợi",
//   ward: "Phường Bến Thành",
//   district: "Quận 1",
//   province: "TP. Hồ Chí Minh",
// )
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEBSITE CHECKOUT                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Form:                                                      │ │
│  │ - Detailed Address: "Số 123 Lê Lợi"                      │ │
│  │ - Ward: "Phường Bến Thành"                               │ │
│  │ - District: "Quận 1"                                     │ │
│  │ - Province: "TP. Hồ Chí Minh"                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                    │
│  Concatenate: "Số 123 Lê Lợi, Phường Bến Thành, Quận 1,..."    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Table: orders                                              │ │
│  │ - id: UUID                                                │ │
│  │ - shipping_address: "Số 123 Lê Lợi, Phường..."           │ │
│  │ - order_status: "pending"                                │ │
│  │ - created_at: 2024-07-21...                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                APP QUẢN LÝ (Flutter)                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ OrdersScreen                                              │ │
│  │                                                            │ │
│  │ [Đơn hàng #550e8400]  ← Click to expand                  │ │
│  │ ├─ 1,500,000₫ [Pending]                                  │ │
│  │ └─ [EXPANDED]:                                           │ │
│  │    📍 Địa Chỉ Giao Hàng                                 │ │
│  │    🏙️ Tỉnh/Thành phố: TP. Hồ Chí Minh                  │ │
│  │    🏘️ Quận/Huyện: Quận 1                               │ │
│  │    🏘️ Xã/Phường: Phường Bến Thành                      │ │
│  │    🏠 Địa chỉ chi tiết: Số 123 Lê Lợi                  │ │
│  │                                                            │ │
│  │    Phí ship: 50,000₫                                    │ │
│  │    Thanh toán: COD                                       │ │
│  │    [Xử lý] [Hoàn thành] [Hủy]                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Points

| Component | Format | Example |
|-----------|--------|---------|
| Shipping Address (DB) | `"detail, ward, district, province"` | `"Số 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"` |
| Order Status | `order_status` NOT `status` | `"pending"`, `"processing"`, etc. |
| Split Delimiter | `", "` (comma + space) | Uses `.split(', ')` |
| Icon Order | Detail → Ward → District → Province | 🏠 🏘️ 🏘️ 🏙️ |
| App Restart | Required after code changes | `flutter clean && flutter pub get && flutter run` |

---

## ❌ Common Mistakes & Fixes

| ❌ Wrong | ✅ Correct | Issue |
|---------|-----------|-------|
| Use `status` field | Use `order_status` | Column doesn't exist |
| `.select('id, status, total')` | `.select('*')` | Missing `shipping_address` |
| Format: `"tỉnh, quận, xã, chi tiết"` | Format: `"chi tiết, xã, quận, tỉnh"` | Wrong order in parser |
| `.split(', ')` with single space | `.split(', ')` with comma+space | Parse error |
| Hot reload | Full app restart | Cache not cleared |

---

## ✅ Verification Steps

1. **Website**: Place an order with address
2. **Database**: Check Supabase → orders table → shipping_address column
3. **App**: Restart → Orders tab → Expand order → See address

---

**Status:** 🟢 Ready to use! Just restart the app.

