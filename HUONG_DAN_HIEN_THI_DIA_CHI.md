# 📍 Hướng Dẫn Hiển Thị Địa Chỉ Giao Hàng trong App Quản Lý

## Tình Trạng Hiện Tại

✅ **ĐÃ HOÀN THÀNH:**
- Cơ sở dữ liệu có `shipping_address` với 3+ orders test
- OrderService.dart có code fetch data đúng
- Order model mapping fields đúng (`order_status`, `shipping_address`)
- Address parser parse format: `"detail, ward, district, province"` 
- UI code hiển thị địa chỉ đã được implement

❌ **CHƯA HOẠT ĐỘNG:**
- App chưa được rebuild/restart để load code mới

---

## 🔧 Cách Fix (Bắt Buộc Làm)

### Bước 1: Stop App
Nếu app đang chạy, bấm `Ctrl+C` trong terminal để dừng

### Bước 2: Xóa Build Cũ
Chạy lệnh này để xóa tất cả build cũ:

```cmd
flutter clean
```

### Bước 3: Download Dependencies Mới
```cmd
flutter pub get
```

### Bước 4: Rebuild và Run App
```cmd
flutter run -d chrome
```

**Hoặc nếu dùng emulator:**
```cmd
flutter run
```

---

## ✅ Xác Nhận Đã Fix Thành Công

Sau khi app restart, kiểm tra:

1. **Vào Orders Screen** (Tab "Đơn Hàng")
2. **Mở một đơn hàng** (bấm vào)
3. **Kiếm dòng "📍 Địa Chỉ Giao Hàng"**
4. **Xem thông tin chi tiết:**
   - 🏙️ Tỉnh/Thành phố: `TP. Hồ Chí Minh`
   - 🏘️ Quận/Huyện: `Quận 1`
   - 🏘️ Xã/Phường: `Phường Bến Thành`
   - 🏠 Địa chỉ chi tiết: `Số 123 Lê Lợi`

---

## 📊 Kiến Trúc Hệ Thống

### Database Layer (Supabase)
```
orders table
├── id (UUID)
├── user_id
├── total
├── shipping_fee
├── payment_method
├── payment_status
├── order_status        ← ĐÂY (chứ không phải "status")
├── shipping_address    ← ĐÂY (format: "detail, ward, district, province")
├── note
└── created_at
```

### Application Layer
```
1. OrderService.getOrders()
   └─ SELECT * FROM orders (lấy tất cả fields)
   
2. Order.fromJson(json)
   └─ Map: json['shipping_address'] → order.shippingAddress
   
3. OrdersScreen._buildAddressSection()
   └─ parseShippingAddress(order.shippingAddress)
   └─ Hiển thị địa chỉ với icon và format đẹp
```

### Frontend: Website Checkout (đã có)
```javascript
const shippingAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`
await supabase.from('orders').insert({
  ...orderData,
  shipping_address: shippingAddress  // Format này
})
```

---

## 🐛 Nếu Vẫn Không Hiển Thị Địa Chỉ

### Debug Step 1: Kiểm tra Console Log
Khi app start, xem console có lỗi gì:
```
❌ Error fetching orders: ...
❌ Error updating order status: ...
```

### Debug Step 2: Verify Database
Chạy SQL query này trên Supabase để xác nhận data:

```sql
SELECT id, shipping_address, order_status FROM public.orders LIMIT 5;
```

**Kết quả phải là:**
```
| id | shipping_address | order_status |
|----|------------------|--------------|
| ... | "Số 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh" | pending |
| ... | "..." | ... |
```

### Debug Step 3: Check RLS Policy
RLS policy phải cho phép app đọc orders:

```sql
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

**Phải có policy cho phép SELECT** (đã được setup rồi)

---

## 📝 Lưu Ý Quan Trọng

| Điều Cần | Sai ❌ | Đúng ✅ |
|---------|--------|--------|
| Field name | `status` | `order_status` |
| Query | `.select('id, status, total')` | `.select('*')` |
| Address format | `"tỉnh, quận, xã, chi tiết"` | `"chi tiết, xã, quận, tỉnh"` |
| Database | Lấy từ POST API | Supabase.co |

---

## 🚀 Deployment

Sau khi verify local hoạt động:

### 1. Build Web
```cmd
flutter build web
```

### 2. Deploy lên Vercel
```cmd
vercel deploy --prod
```

### 3. Kiểm tra Live
Vào https://appmanagement-six.vercel.app → Orders tab

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Chưa có thông tin địa chỉ" | Database không có shipping_address, hoặc format sai |
| Address trống nhưng DB có data | Cache Flutter cũ, cần `flutter clean` |
| Error "Cannot find column" | Dùng `status` thay vì `order_status` |
| App crash khi mở Orders | Order model không parse field nào đó |

---

## ✨ File Liên Quan

- `lib/screens/orders_screen.dart` - UI hiển thị
- `lib/services/order_service.dart` - Fetch data từ DB
- `lib/models/order.dart` - Data model
- `lib/utils/address_parser.dart` - Parse address string
- `lib/config/supabase_config.dart` - Supabase config

---

**BƯỚC TIẾP THEO:** 
1. Chạy `flutter clean && flutter pub get && flutter run`
2. Mở app → Orders tab
3. Xem địa chỉ hiển thị chưa? ✅

