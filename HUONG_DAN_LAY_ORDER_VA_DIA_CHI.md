# 📦 Hướng Dẫn: Lấy Địa Chỉ Order và Chuyển sang App Quản Lý

## ✅ Tình Trạng Hiện Tại

Ứng dụng Flutter quản lý của bạn **đã có hầu hết tính năng cần thiết**:

- ✅ Database schema có `orders` table với fields: `shipping_address`, `shipping_fee`, `payment_method`, `note`
- ✅ Model `Order` đã parse các fields
- ✅ `AddressParser` utility parse địa chỉ từ string
- ✅ `OrderService` query orders từ Supabase
- ✅ `OrdersScreen` hiển thị danh sách orders + chi tiết

---

## 🔧 Cần Làm Gì

### 1. Đảm Bảo RLS Policies cho Orders Table

**Vấn đề**: Nếu app quản lý dùng khác database hoặc không có user_id, cần cho phép read/update orders.

**Giải pháp**: Chạy SQL sau trong Supabase:

```sql
-- Cho phép public đọc orders (cho app quản lý)
CREATE POLICY "Public can read orders" ON public.orders 
FOR SELECT USING (true);

-- Cho phép authenticated update orders
CREATE POLICY "Authenticated can update orders" ON public.orders 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Cho phép authenticated insert orders
CREATE POLICY "Authenticated can insert orders" ON public.orders 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Order items: public read
CREATE POLICY "Public can read order_items" ON public.order_items 
FOR SELECT USING (true);
```

---

### 2. Cải Thiện OrderService

Current `OrderService` chỉ query `orders` table, **không lấy order_items**.

**Đề xuất**: Cập nhật để lấy order_items nếu cần:

```dart
// lib/services/order_service.dart

Future<Map<String, dynamic>> getOrderDetail(String id) async {
  // Lấy order
  final orderResponse = await supabase
      .from('orders')
      .select()
      .eq('id', id)
      .single();

  // Lấy order_items
  final itemsResponse = await supabase
      .from('order_items')
      .select('id, quantity, price')
      .eq('order_id', id);

  return {
    'order': Order.fromJson(orderResponse),
    'items': itemsResponse as List,
  };
}
```

---

### 3. Chuẩn Bị Dữ Liệu Test

Trước khi test, **đảm bảo có data sample trong Supabase**:

```sql
-- Tạo order test từ e-commerce website
INSERT INTO public.orders (
  user_id,
  total,
  shipping_fee,
  payment_method,
  order_status,
  shipping_address,
  note
) VALUES (
  NULL,  -- hoặc user_id nếu có
  500000,
  30000,
  'cod',
  'pending',
  'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  'Email: khach@example.com\nSĐT: 0912345678'
);
```

---

## 🧪 Quy Trình Test

### Bước 1: Kiểm Tra Database
1. Vào **Supabase Dashboard** → **SQL Editor**
2. Chạy câu lệnh để kiểm tra `orders` table có data không:
   ```sql
   SELECT id, shipping_address, shipping_fee, payment_method, order_status FROM orders LIMIT 5;
   ```

### Bước 2: Kiểm Tra App Quản Lý
1. **Mở app quản lý** (Flutter)
2. Vào **Orders Screen**
3. Kéo xuống để refresh
4. **Nên thấy** danh sách orders

### Bước 3: Kiểm Tra Chi Tiết Order
1. Nhấp vào một order
2. Nhấn **Expand** để xem chi tiết
3. **Nên thấy**:
   - 📍 Địa Chỉ Giao Hàng (Tỉnh, Quận, Xã, Chi tiết)
   - 💰 Phí ship
   - 📝 Thanh toán (COD/Transfer)
   - 📌 Trạng thái
   - Nút cập nhật trạng thái

### Bước 4: Cập Nhật Trạng Thái
1. Nhấp nút "Xử lý" → "Hoàn thành" → "Hủy"
2. Kiểm tra **Supabase** → table `orders` → `order_status` có thay đổi

---

## 🔌 Kết Nối E-Commerce Website

### Khi E-Commerce Website Tạo Order

**Website phải lưu như này:**

```javascript
// Trên website checkout form
const shippingAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`;

// Insert order vào Supabase
await supabase.from('orders').insert({
  total: cartTotal,
  shipping_fee: 30000,
  payment_method: paymentMethod, // 'cod' or 'transfer'
  order_status: 'pending',
  shipping_address: shippingAddress, // ← FORMAT QUAN TRỌNG
  note: `Email: ${email}\nSĐT: ${phone}`,
});
```

---

## 📊 Cấu Trúc Địa Chỉ

**Định dạng lưu trong `shipping_address`:**

```
"Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
```

**Format**: `detailedAddress, ward, district, province` (cách nhau bằng `, `)

**App sẽ parse thành**:
- 🏙️ **Province**: TP. Hồ Chí Minh
- 🏘️ **District**: Quận 1
- 🏘️ **Ward**: Phường Bến Thành
- 🏠 **Detailed**: Số 123 Đường Lê Lợi

---

## 🎯 Checklist

- [ ] **Supabase**: Chạy SQL để kiểm tra RLS policies
- [ ] **Database**: Có order test data trong `orders` table
- [ ] **App**: Chạy app quản lý
- [ ] **UI**: Hiển thị orders trong danh sách
- [ ] **Detail**: Expand order → xem địa chỉ đầy đủ
- [ ] **Update**: Click nút update trạng thái → kiểm tra Supabase
- [ ] **Website**: E-commerce website lưu order với format đúng

---

## 🚀 Nếu Có Lỗi

### Lỗi 1: "No rows returned"
**Nguyên nhân**: Không có orders trong database  
**Giải pháp**: Thêm order test bằng SQL

### Lỗi 2: "PERMISSION DENIED"
**Nguyên nhân**: RLS policies chặn read/update  
**Giải pháp**: Chạy SQL ở bước 1 để thêm policies

### Lỗi 3: "Địa chỉ không parse đúng"
**Nguyên nhân**: Format shipping_address không đúng  
**Giải pháp**: Kiểm tra format: `detail, ward, district, province`

### Lỗi 4: "App không hiển thị orders"
**Nguyên nhân**: OrderService query lỗi hoặc chưa fetch  
**Giải pháp**: 
- Kiểm tra **console logs**
- Reload app
- Kiểm tra `.env` có SUPABASE_URL + KEY đúng không

---

## 💡 Tips Bổ Sung

### Lọc Orders theo Trạng Thái

```dart
Future<List<Order>> getOrdersByStatus(String status) async {
  final response = await supabase
      .from('orders')
      .select()
      .eq('order_status', status)
      .order('created_at', ascending: false);
  return (response as List).map((json) => Order.fromJson(json)).toList();
}
```

### Tìm Kiếm Orders

```dart
Future<List<Order>> searchOrders(String query) async {
  final response = await supabase
      .from('orders')
      .select()
      .or('shipping_address.ilike.%$query%, note.ilike.%$query%')
      .order('created_at', ascending: false);
  return (response as List).map((json) => Order.fromJson(json)).toList();
}
```

### Real-Time Updates

```dart
final subscription = supabase
    .from('orders')
    .on(RealtimeListenTypes.all, (payload) {
      print('Order updated: ${payload.newRecord}');
      // Update UI
    })
    .subscribe();
```

---

## 📞 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra **Supabase logs**
2. Xem **console logs** của app
3. Kiểm tra **network requests** (DevTools)

