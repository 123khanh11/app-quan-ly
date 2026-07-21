# ⚡ Quick Start: Orders System

## 🎯 Mục Đích
Hệ thống Orders cho phép:
- 🌐 Website tạo order
- 📱 App quản lý xem orders
- 👨‍💼 Admin cập nhật trạng thái
- 📍 Hiển thị địa chỉ đầy đủ

---

## ⏱️ Setup Nhanh (5 phút)

### Bước 1: RLS Policies (1 phút)
Supabase Dashboard → SQL Editor:
```sql
-- Copy từ file: FIX_RLS_ORDERS_FINAL.sql
-- Paste vào SQL Editor
-- Click "Run"
```

### Bước 2: Test Data (1 phút)
Supabase Dashboard → SQL Editor:
```sql
-- Copy từ file: INSERT_TEST_ORDERS.sql
-- Paste vào SQL Editor
-- Click "Run"
```

### Bước 3: Code (3 phút)
Đã cập nhật:
- ✅ `lib/services/order_service.dart` - thêm methods
- ✅ `lib/screens/orders_screen.dart` - đã hiển thị đúng

---

## 🧪 Test (2 phút)

### Mobile App
```
1. Mở app quản lý
2. Vào Orders Screen
3. ✅ Thấy 5 test orders
4. Expand một order
5. ✅ Thấy địa chỉ đầy đủ
6. Click "Xử lý"
7. ✅ Status thay đổi
```

### Verify Database
```sql
SELECT COUNT(*) FROM orders;  -- ✅ Nên = 5
SELECT order_status FROM orders WHERE id='...';  -- ✅ Check status
```

---

## 🔌 Kết Nối Website

**Website checkout → Insert order:**

```javascript
// Supabase client
import { supabase } from './lib/supabase'

// Lấy dữ liệu checkout form
const shippingAddress = `${detail}, ${ward}, ${district}, ${province}`

// Insert order
const { data } = await supabase.from('orders').insert({
  total: 500000,
  shipping_fee: 30000,
  payment_method: 'cod',
  order_status: 'pending',
  shipping_address: shippingAddress,  // ← FORMAT: "detail, ward, district, province"
  note: `Email: ${email}\nSĐT: ${phone}`
})

// Insert order items
await supabase.from('order_items').insert(orderItems)
```

**Chi tiết**: `HUONG_DAN_WEBSITE_TAO_ORDER.md`

---

## 📁 Files

| File | Mục đích |
|------|---------|
| `FIX_RLS_ORDERS_FINAL.sql` | RLS policies |
| `INSERT_TEST_ORDERS.sql` | Test data (5 orders) |
| `lib/services/order_service.dart` | ✅ Updated - Query orders |
| `lib/models/order.dart` | ✅ Order model |
| `lib/utils/address_parser.dart` | ✅ Parse địa chỉ |
| `lib/screens/orders_screen.dart` | ✅ UI hiển thị |
| `HUONG_DAN_LAY_ORDER_VA_DIA_CHI.md` | Full guide |
| `KIEM_TRA_VA_TEST_ORDERS.md` | Testing guide |
| `HUONG_DAN_WEBSITE_TAO_ORDER.md` | Website guide |

---

## ✅ Checklist

- [ ] Chạy `FIX_RLS_ORDERS_FINAL.sql`
- [ ] Chạy `INSERT_TEST_ORDERS.sql`
- [ ] Mở app → Orders Screen
- [ ] Thấy orders + địa chỉ + update status work
- [ ] Kiểm tra status thay đổi trong Supabase
- [ ] Website lưu orders vào Supabase (code guide)
- [ ] Test flow: Website → Supabase → App

---

## 🚀 Khi Hoàn Thành

✅ App quản lý lấy orders từ Supabase  
✅ Hiển thị địa chỉ đầy đủ  
✅ Update trạng thái  
✅ Website có thể tạo orders  

**Next**: Deploy app + website

---

## 🆘 Có Vấn đề?

1. Kiểm tra **console logs** (DevTools)
2. Kiểm tra **Supabase logs**
3. Xem **KIEM_TRA_VA_TEST_ORDERS.md**
4. Xem **HUONG_DAN_LAY_ORDER_VA_DIA_CHI.md**

---

## 📞 Support

Nếu gặp lỗi:
1. Verify RLS policies: Supabase Dashboard → Authentication → Policies
2. Verify data: `SELECT * FROM orders LIMIT 1`
3. Verify permissions: Try update status manually

