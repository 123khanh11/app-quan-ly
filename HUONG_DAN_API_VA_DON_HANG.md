# 📱 Hướng Dẫn API & Xử Lý Đơn Hàng

## 🎯 Mục Tiêu

Khi khách hàng bấm **"MUA"** → Ứng dụng sẽ:
1. Gửi yêu cầu tới server
2. Server xử lý đơn hàng
3. Lưu vào database
4. Quản lý từ dashboard

---

## 📊 LUỒNG XỬ LÝ ĐƠN HÀNG

```
KHÁCH HÀNG                    SERVER                    DATABASE
    |                            |                          |
    |-- Bấm "MUA" -->            |                          |
    |                      Nhận yêu cầu                      |
    |                            |-- Lưu đơn hàng -->        |
    |                            |                      Lưu vào DB
    |                            |<-- Trả về thành công --   |
    |<-- Thành công --           |
    |   (Hiện thông báo)         |
```

---

## 🔌 API ENDPOINTS

### 1. **TẠO ĐƠN HÀNG** (POST)

**URL:**
```
POST https://edtxexnhpbipcecceoop.supabase.co/rest/v1/orders
```

**Headers:**
```
Authorization: Bearer [ANON_KEY]
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "user_id": "abc123",
  "total": 500000,
  "shipping_fee": 50000,
  "payment_method": "cash",
  "payment_status": "pending",
  "order_status": "pending",
  "shipping_address": "123 Đường ABC, Quận 1, TP.HCM",
  "note": "Giao vào buổi tối"
}
```

**Response (Thành công - 201):**
```json
{
  "id": "xyz789",
  "user_id": "abc123",
  "total": 500000,
  "created_at": "2024-07-18T10:30:00Z",
  "order_status": "pending"
}
```

---

### 2. **THÊM CHI TIẾT ĐƠN HÀNG** (POST)

**URL:**
```
POST https://edtxexnhpbipcecceoop.supabase.co/rest/v1/order_items
```

**Body:**
```json
{
  "order_id": "xyz789",
  "variant_id": "product123",
  "quantity": 2,
  "price": 250000
}
```

---

### 3. **LẤY DANH SÁCH ĐƠN HÀNG** (GET)

**URL:**
```
GET https://edtxexnhpbipcecceoop.supabase.co/rest/v1/orders
```

**Headers:**
```
Authorization: Bearer [ANON_KEY]
```

**Response:**
```json
[
  {
    "id": "xyz789",
    "user_id": "abc123",
    "total": 500000,
    "order_status": "pending",
    "created_at": "2024-07-18T10:30:00Z"
  }
]
```

---

### 4. **CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG** (PATCH)

**URL:**
```
PATCH https://edtxexnhpbipcecceoop.supabase.co/rest/v1/orders?id=eq.xyz789
```

**Body:**
```json
{
  "order_status": "completed",
  "payment_status": "paid"
}
```

---

## 💻 CODE EXAMPLE - FLUTTER

### Tạo Đơn Hàng

```dart
Future<void> createOrder(String userId, int total, String address) async {
  try {
    final response = await supabase
        .from('orders')
        .insert({
          'user_id': userId,
          'total': total,
          'shipping_fee': 50000,
          'payment_method': 'cash',
          'payment_status': 'pending',
          'order_status': 'pending',
          'shipping_address': address,
        })
        .select()
        .single();

    print('✅ Đơn hàng tạo thành công: ${response['id']}');
    
    // Hiện thông báo thành công
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('✅ Đặt hàng thành công!')),
    );
  } catch (e) {
    print('❌ Lỗi: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Lỗi: $e')),
    );
  }
}
```

### Thêm Chi Tiết Đơn Hàng

```dart
Future<void> addOrderItem(String orderId, String variantId, int quantity, int price) async {
  try {
    await supabase
        .from('order_items')
        .insert({
          'order_id': orderId,
          'variant_id': variantId,
          'quantity': quantity,
          'price': price,
        });

    print('✅ Thêm sản phẩm vào đơn hàng');
  } catch (e) {
    print('❌ Lỗi: $e');
  }
}
```

### Lấy Danh Sách Đơn Hàng

```dart
Future<List<Map>> getOrders(String userId) async {
  try {
    final response = await supabase
        .from('orders')
        .select()
        .eq('user_id', userId)
        .order('created_at', ascending: false);

    return List<Map>.from(response);
  } catch (e) {
    print('❌ Lỗi: $e');
    return [];
  }
}
```

---

## 🛒 LUỒNG MUA HÀNG HOÀN CHỈNH

### Bước 1: Tính Tổng Tiền (Frontend)

```dart
int totalPrice = 0;
for (var item in cartItems) {
  totalPrice += item.price * item.quantity;
}
totalPrice += 50000; // Phí ship
```

### Bước 2: Gửi Yêu Cầu Tạo Đơn (Frontend → Server)

```dart
// Tạo đơn hàng
final order = await createOrder(
  userId: currentUser.id,
  total: totalPrice,
  address: shippingAddress,
);

final orderId = order['id'];
```

### Bước 3: Thêm Chi Tiết Sản Phẩm (Frontend → Server)

```dart
for (var item in cartItems) {
  await addOrderItem(
    orderId: orderId,
    variantId: item.variantId,
    quantity: item.quantity,
    price: item.price,
  );
}
```

### Bước 4: Xóa Giỏ Hàng (Frontend)

```dart
await supabase
    .from('carts')
    .delete()
    .eq('user_id', currentUser.id);
```

### Bước 5: Hiển Thị Thông Báo (Frontend)

```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(content: Text('✅ Đơn hàng được tạo thành công! Mã: $orderId')),
);
```

---

## 📊 DATABASE SCHEMA

### Bảng: `orders`

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  total NUMERIC,
  shipping_fee NUMERIC DEFAULT 50000,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Bảng: `order_items`

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  variant_id UUID,
  quantity INTEGER,
  price NUMERIC
);
```

---

## 🔐 SECURITY - RLS POLICIES

### Cho phép users xem đơn hàng của họ:

```sql
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## 🚀 FLOW HOÀN CHỈNH - CODE

```dart
Future<void> handleCheckout() async {
  try {
    setState(() => isLoading = true);

    // 1. Tính tổng
    int total = calculateTotal();

    // 2. Tạo đơn hàng
    final orderResponse = await supabase
        .from('orders')
        .insert({
          'user_id': currentUser.id,
          'total': total,
          'shipping_fee': 50000,
          'payment_method': selectedPayment,
          'order_status': 'pending',
          'shipping_address': shippingAddress,
        })
        .select()
        .single();

    final orderId = orderResponse['id'];

    // 3. Thêm các sản phẩm
    for (var item in cartItems) {
      await supabase.from('order_items').insert({
        'order_id': orderId,
        'variant_id': item.variantId,
        'quantity': item.quantity,
        'price': item.price,
      });
    }

    // 4. Xóa giỏ hàng
    await supabase
        .from('carts')
        .delete()
        .eq('user_id', currentUser.id);

    // 5. Hiển thị thành công
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('✅ Đơn hàng thành công! Mã: $orderId')),
    );

    // 6. Chuyển hướng
    Navigator.pop(context);

  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('❌ Lỗi: $e')),
    );
  } finally {
    setState(() => isLoading = false);
  }
}
```

---

## 📱 UI WORKFLOW

```
[ Giỏ Hàng ]
     ↓
[ Nhập Địa Chỉ ]
     ↓
[ Chọn Phương Thức Thanh Toán ]
     ↓
[ Xác Nhận Đơn Hàng ]
     ↓
[ Bấm MUA ]
     ↓
[Gửi Yêu Cầu → Server]
     ↓
[Server Lưu Vào DB]
     ↓
[✅ Thành Công - Hiển Thị Thông Báo]
     ↓
[Chuyển Hướng → Orders List]
```

---

## 🔍 KIỂM TRA TỪ DASHBOARD

Sau khi tạo đơn hàng:
1. Vào Dashboard
2. Chọn "Đơn Hàng"
3. Sẽ thấy đơn vừa tạo
4. Có thể cập nhật trạng thái

---

## ✨ SUMMARY

**Khi khách bấm MUA:**
1. ✅ Gửi request tới Supabase API
2. ✅ Tạo record trong bảng `orders`
3. ✅ Thêm chi tiết sản phẩm trong `order_items`
4. ✅ Xóa giỏ hàng
5. ✅ Hiển thị thông báo thành công
6. ✅ Quản lý từ dashboard

---

**Bạn đã có đủ thông tin để xây dựng tính năng mua hàng! 🚀**
