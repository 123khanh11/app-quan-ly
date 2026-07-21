# ✨ CÁC TÍNH NĂNG MỚI ĐƯỢC THÊM VÀO

## 📦 1. ORDER ITEMS - Chi Tiết Sản Phẩm Trong Đơn

### Bảng: `order_items`
```sql
- id (UUID, Primary Key)
- order_id (FK to orders)
- product_id (FK to products)
- quantity (Integer)
- unit_price (Numeric)
- total_price (Numeric)
- created_at (Timestamp)
```

### Tính Năng
- ✅ Thêm nhiều sản phẩm vào một đơn hàng
- ✅ Quản lý số lượng từng sản phẩm
- ✅ Tự động tính toán tổng tiền
- ✅ Xóa sản phẩm khỏi đơn
- ✅ Cập nhật số lượng

### File SQL
```
CREATE_ORDER_ITEMS_TABLE.sql
```

### Model & Service
```
lib/models/order_item.dart
lib/services/order_item_service.dart
```

---

## 📊 2. SALES REPORT - Báo Cáo Bán Hàng

### Tab 1: 🏆 Sản Phẩm Bán Chạy
- Xếp hạng sản phẩm theo số lượng bán
- Hiển thị top 20 sản phẩm
- Số lượng bán, SKU

**Ví dụ:**
```
#1 Áo Phông Nam (SKU001) - 📦 150 đơn
#2 Quần Jeans (SKU002) - 📦 120 đơn
#3 Giày Thể Thao (SKU004) - 📦 95 đơn
...
```

### Tab 2: 💰 Doanh Thu Cao
- Xếp hạng sản phẩm theo doanh thu
- Hiển thị top 20 theo tiền bán
- Tổng doanh thu, số lượng đơn

**Ví dụ:**
```
#1 Giày Thể Thao (SKU004)
   Doanh thu: 8.985.000₫ (15 đơn)

#2 Quần Jeans (SKU002)
   Doanh thu: 7.200.000₫ (12 đơn)
```

### Tổng Doanh Thu
- Hiển thị tổng doanh thu từ tất cả đơn hàng
- Update realtime
- Định dạng tiền VND

### Screen
```
lib/screens/sales_report_screen.dart
```

---

## 🎯 CÁCH SỬ DỤNG

### Xem Báo Cáo Bán Hàng
1. Mở app Flutter
2. Click tab **Sales Report** (cần thêm vào main.dart)
3. Xem 2 tab:
   - **🏆 Sản Phẩm Bán Chạy** - Sản phẩm bán nhiều nhất
   - **💰 Doanh Thu Cao** - Sản phẩm thu tiền nhiều nhất
4. Kéo để làm mới

---

## 📝 CÀI ĐẶT & SETUP

### Bước 1: Chạy SQL
Vào Supabase Dashboard → SQL Editor:

```sql
-- Copy nội dung từ CREATE_ORDER_ITEMS_TABLE.sql
-- Paste vào SQL Editor
-- Click Run
```

### Bước 2: Cập Nhật App
Thêm screen mới vào `main.dart` (hoặc navigation):

```dart
import 'lib/screens/sales_report_screen.dart';

// Thêm tab mới
const SalesReportScreen(),
```

### Bước 3: Build & Test
```bash
flutter pub get
flutter run
```

---

## 📈 THỐNG KÊ & QUERY

### Sản Phẩm Bán Chạy (Top 10)
```sql
SELECT 
  p.name, 
  p.sku,
  COUNT(oi.id) as orders,
  SUM(oi.quantity) as total_quantity
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name, p.sku
ORDER BY total_quantity DESC
LIMIT 10;
```

### Doanh Thu Theo Sản Phẩm (Top 10)
```sql
SELECT 
  p.name, 
  p.sku,
  COUNT(oi.id) as orders,
  SUM(oi.total_price) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name, p.sku
ORDER BY revenue DESC
LIMIT 10;
```

### Tổng Doanh Thu Tất Cả
```sql
SELECT SUM(total_price) as total_revenue 
FROM order_items;
```

---

## 🔄 API FUNCTIONS

### OrderItemService

#### getOrderItems(orderId)
```dart
final items = await _orderItemService.getOrderItems('order-id');
// Trả về List<OrderItem>
```

#### addOrderItem(item)
```dart
await _orderItemService.addOrderItem(item);
// Thêm sản phẩm vào đơn
```

#### updateQuantity(itemId, quantity)
```dart
await _orderItemService.updateQuantity('item-id', 5);
// Cập nhật số lượng
```

#### removeOrderItem(itemId)
```dart
await _orderItemService.removeOrderItem('item-id');
// Xóa sản phẩm khỏi đơn
```

#### getSalesStats()
```dart
final stats = await _orderItemService.getSalesStats();
// Trả về Map<String, dynamic> thống kê
```

#### getTopProducts(limit)
```dart
final top = await _orderItemService.getTopProducts(limit: 10);
// Sản phẩm bán chạy top 10
```

#### getRevenueByProduct(limit)
```dart
final revenue = await _orderItemService.getRevenueByProduct(limit: 10);
// Sản phẩm doanh thu cao top 10
```

#### getTotalRevenue()
```dart
final total = await _orderItemService.getTotalRevenue();
// Tổng doanh thu (double)
```

---

## 🎨 UI/UX

### Sales Report Screen

**Màu sắc:**
- 🟣 Deep Purple - Chủ đề
- 🟡 Amber - Rank #1
- ⚫ Gray - Rank #2
- 🟠 Orange - Rank #3
- 🔵 Blue - Rank từ #4+

**Icons:**
- 🏆 Sản phẩm bán chạy
- 💰 Doanh thu cao
- 📊 Tổng doanh thu
- 📦 Số lượng
- 🔄 Làm mới

---

## 📊 TÍCH HỢP VỚI DASHBOARD

Có thể thêm widget vào Dashboard:

```dart
// Card sản phẩm bán chạy
_StatCard(
  title: 'Sản Phẩm #1',
  value: 'Áo Phông (150 cái)',
  icon: Icons.trending_up,
  color: Colors.amber,
)

// Card doanh thu
_StatCard(
  title: 'Doanh Thu',
  value: formatter.format(totalRevenue),
  icon: Icons.attach_money,
  color: Colors.green,
)
```

---

## ✅ CHECKLIST

### Setup
- [ ] Chạy SQL tạo bảng `order_items`
- [ ] Enable RLS policies
- [ ] Tạo indexes
- [ ] Thêm file models
- [ ] Thêm file services
- [ ] Thêm screen báo cáo

### Testing
- [ ] Test thêm order items
- [ ] Test xóa order items
- [ ] Test cập nhật quantity
- [ ] Xem báo cáo bán hàng
- [ ] Kiểm tra top products
- [ ] Kiểm tra top revenue
- [ ] Refresh data

### UI/UX
- [ ] Hiển thị đúng rank
- [ ] Màu sắc hợp lý
- [ ] Icons rõ ràng
- [ ] Responsive trên mobile

---

## 🐛 KHẮC PHỤC SỰ CỐ

### Lỗi: Foreign Key Constraint
**Giải pháp:** Kiểm tra `product_id` tồn tại trong bảng `products`

### Lỗi: RLS Policy Violation
**Giải pháp:** Đảm bảo user đã authenticated

### Không thấy dữ liệu bán hàng
**Giải pháp:**
1. Kiểm tra đã có `order_items` trong DB
2. Refresh app
3. Xem SQL logs

---

## 📚 FILE MỚI

```
✨ CREATE_ORDER_ITEMS_TABLE.sql
   lib/models/order_item.dart
   lib/services/order_item_service.dart
   lib/screens/sales_report_screen.dart
   TINH_NANG_MOI_THEM.md (file này)
```

---

## 🎯 PHÁT TRIỂN TIẾP

### Có thể thêm:
- [ ] Export báo cáo (PDF, Excel)
- [ ] Biểu đồ (Charts)
- [ ] Lọc theo ngày
- [ ] Thống kê theo danh mục
- [ ] Dự báo bán hàng
- [ ] Khuyến mại/Giảm giá
- [ ] Commission/Hoa hồng
- [ ] Tích hợp kho tự động

---

**Hoàn thành! Tính năng báo cáo bán hàng đã sẵn sàng.** ✅
