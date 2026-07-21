# 📍 Hướng Dẫn: Lấy & Hiển Thị Địa Chỉ Giao Hàng trong App Quản Lý

## ✅ Tình Trạng Hiện Tại

**ĐÃ IMPLEMENT:**
- ✅ Order model có field `shipping_address`
- ✅ OrderService fetch orders từ Supabase
- ✅ OrdersScreen hiển thị danh sách orders
- ✅ **NEW**: OrdersScreen hiển thị địa chỉ giao hàng đầy đủ
- ✅ **NEW**: ParsedAddress utility để parse địa chỉ
- ✅ **NEW**: _buildAddressSection widget để hiển thị địa chỉ

---

## 🗺️ Cách Hoạt Động

### Flow Dữ Liệu

```
E-Commerce Website
  ↓
[User nhập địa chỉ: Tỉnh/Quận/Xã/Chi tiết]
  ↓
[Ghép thành string: "Chi tiết, Xã, Quận, Tỉnh"]
  ↓
[Lưu vào Supabase table: orders.shipping_address]
  ↓
App Quản Lý
  ↓
[Fetch orders.shipping_address từ Supabase]
  ↓
[parseShippingAddress() tách thành các phần]
  ↓
[_buildAddressSection() hiển thị đẹp]
```

### Format Địa Chỉ Được Lưu

```
"Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
 └─ Chi tiết           └─ Xã              └─ Quận  └─ Tỉnh
```

**Phân tách bằng dấu phẩy + space:** `", "`

---

## 🔧 Code Implementation

### 1. File Utility: `lib/utils/address_parser.dart`

```dart
class ParsedAddress {
  final String detailedAddress;  // "Số 123 Đường Lê Lợi"
  final String ward;             // "Phường Bến Thành"
  final String district;         // "Quận 1"
  final String province;         // "TP. Hồ Chí Minh"

  ParsedAddress({...});

  /// Trả về: "TP. Hồ Chí Minh - Quận 1 - Phường Bến Thành"
  String getFullAddressSummary() { ... }

  /// Trả về: "Quận 1 - Phường Bến Thành"
  String getDistrictWardSummary() { ... }
}

ParsedAddress parseShippingAddress(String? shippingAddress) {
  // Tách string thành 4 phần
  // Format: "detailedAddress, ward, district, province"
}

String buildShippingAddress({...}) {
  // Ghép 4 phần thành 1 string
}
```

### 2. OrdersScreen: Hiển Thị Địa Chỉ

```dart
// Import
import '../utils/address_parser.dart';

// Trong expansion tile children:
if (order.shippingAddress != null && order.shippingAddress!.isNotEmpty) ...[
  Text('📍 Địa Chỉ Giao Hàng'),
  const SizedBox(height: 8),
  _buildAddressSection(parseShippingAddress(order.shippingAddress)),
  const SizedBox(height: 16),
  const Divider(),
]

// Widget helper
Widget _buildAddressSection(ParsedAddress address) {
  return Column(
    children: [
      _AddressRow(icon: '🏙️', label: 'Tỉnh/Thành phố', value: address.province),
      _AddressRow(icon: '🏘️', label: 'Quận/Huyện', value: address.district),
      _AddressRow(icon: '🏘️', label: 'Xã/Phường', value: address.ward),
      _AddressRow(icon: '🏠', label: 'Địa chỉ chi tiết', value: address.detailedAddress),
    ],
  );
}
```

---

## 💡 Các Cách Sử Dụng ParsedAddress

### 1. Lấy Thông Tin Riêng Biệt

```dart
ParsedAddress address = parseShippingAddress(order.shippingAddress);

print(address.province);        // "TP. Hồ Chí Minh"
print(address.district);        // "Quận 1"
print(address.ward);            // "Phường Bến Thành"
print(address.detailedAddress); // "Số 123 Đường Lê Lợi"
```

### 2. Hiển Thị Tóm Tắt

```dart
String summary = address.getFullAddressSummary();
// Kết quả: "TP. Hồ Chí Minh - Quận 1 - Phường Bến Thành"

String summary2 = address.getDistrictWardSummary();
// Kết quả: "Quận 1 - Phường Bến Thành"
```

### 3. Tạo Địa Chỉ Mới

```dart
String newAddress = buildShippingAddress(
  detailedAddress: 'Số 456 Đường Nguyễn Huệ',
  ward: 'Phường Bến Nghé',
  district: 'Quận 1',
  province: 'TP. Hồ Chí Minh',
);
// Kết quả: "Số 456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
```

---

## 🎨 UI Hiển Thị

Khi mở chi tiết order, bạn sẽ thấy:

```
📍 Địa Chỉ Giao Hàng
━━━━━━━━━━━━━━━━━━━━━━
🏙️  Tỉnh/Thành phố
     TP. Hồ Chí Minh

🏘️  Quận/Huyện
     Quận 1

🏘️  Xã/Phường
     Phường Bến Thành

🏠  Địa chỉ chi tiết
     Số 123 Đường Lê Lợi
```

---

## 🔌 Integration với Supabase

### Database Schema

**Table: `orders`**

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  total DECIMAL,
  shipping_fee DECIMAL,
  payment_method TEXT,
  shipping_address TEXT,    -- <-- Lưu địa chỉ ghép sẵn
  note TEXT,
  order_status TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Query từ Supabase

```dart
// OrderService.getOrders()
final response = await supabase
    .from('orders')
    .select()  // Lấy tất cả fields, bao gồm shipping_address
    .order('created_at', ascending: false);

return (response as List)
    .map((json) => Order.fromJson(json))
    .toList();
```

---

## 🧪 Test

### Test Cách 1: Local Testing

1. **Thêm order test vào Supabase**

```sql
INSERT INTO orders (id, user_id, total, shipping_fee, payment_method, shipping_address, order_status, created_at)
VALUES (
  gen_random_uuid(),
  'user_id_here',
  500000,
  30000,
  'cod',
  'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  'pending',
  NOW()
);
```

2. **Chạy app quản lý (Flutter web)**

```bash
flutter run -d chrome --release
```

3. **Đăng nhập → Orders**
   - Bạn sẽ thấy order mới
   - Click expand → xem địa chỉ giao hàng

### Test Cách 2: Từ Website Bán Hàng

1. **Đặt hàng trên website e-commerce**
   - Nhập địa chỉ đầy đủ (Tỉnh/Quận/Xã/Chi tiết)
   - Click "Đặt Hàng"

2. **Kiểm tra Supabase Dashboard**
   - Vào table `orders`
   - Kiểm tra `shipping_address` có dữ liệu đúng format

3. **Chạy app quản lý**
   - Orders → Expand order mới
   - Kiểm tra địa chỉ hiển thị đúng

---

## 🐛 Troubleshooting

### Problem 1: Địa chỉ không hiển thị

**Nguyên nhân**: `shipping_address` là NULL hoặc rỗng

**Giải pháp**:
```dart
if (order.shippingAddress != null && order.shippingAddress!.isNotEmpty) {
  // Hiển thị
} else {
  Text('Không có địa chỉ')
}
```

### Problem 2: Địa chỉ hiển thị không đầy đủ

**Nguyên nhân**: Format không đúng (không có dấu phẩy + space)

**Format đúng**: `"Chi tiết, Xã, Quận, Tỉnh"`

**Format sai**: `"Chi tiết,Xã,Quận,Tỉnh"` (thiếu space)

**Giải pháp**: Fix lại cách ghép trong website e-commerce
```typescript
// Sai
const address = `${detailedAddress},${ward},${district},${province}`;

// Đúng
const address = `${detailedAddress}, ${ward}, ${district}, ${province}`;
```

### Problem 3: Một số phần địa chỉ bị cut off

**Nguyên nhân**: Text bị tràn, dùng `Expanded` để wrap

**Giải pháp**: Đã được handle trong `_AddressRow` widget

---

## 📝 Checklist

- [x] Order model có field `shipping_address`
- [x] OrderService fetch orders từ Supabase
- [x] ParsedAddress utility được tạo
- [x] OrdersScreen hiển thị địa chỉ
- [x] _AddressRow widget để format đẹp
- [x] Import parseShippingAddress trong OrdersScreen
- [ ] Test với order thực từ website
- [ ] Kiểm tra format địa chỉ từ website

---

## 📚 Các File Liên Quan

| File | Mô tả |
|------|-------|
| `lib/utils/address_parser.dart` | Utility parse địa chỉ |
| `lib/screens/orders_screen.dart` | Orders list + hiển thị địa chỉ |
| `lib/services/order_service.dart` | Fetch orders từ Supabase |
| `lib/models/order.dart` | Order model |
| `lib/config/supabase_config.dart` | Supabase config |

---

## 🎉 Xong!

App quản lý của bạn giờ đã có thể:
- ✅ Fetch orders từ Supabase
- ✅ Parse địa chỉ giao hàng
- ✅ Hiển thị địa chỉ đầy đủ (Tỉnh/Quận/Xã/Chi tiết)
- ✅ Update trạng thái order
- ✅ Xem ghi chú + phí ship

**Bước tiếp theo**: Tạo website e-commerce để phát sinh orders!
