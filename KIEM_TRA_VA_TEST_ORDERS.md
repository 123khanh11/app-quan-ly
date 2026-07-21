# ✅ Kiểm Tra & Test - Hệ Thống Orders

## 📋 Checklist Triển Khai

### Phase 1: Database Setup ✅

- [ ] **RLS Policies** 
  - Chạy file: `FIX_RLS_ORDERS_FINAL.sql` trong Supabase SQL Editor
  - Kiểm tra: SELECT * FROM orders LIMIT 1 (có thể query không?)

- [ ] **Test Data**
  - Chạy file: `INSERT_TEST_ORDERS.sql` trong Supabase SQL Editor
  - Kiểm tra: Có 5 test orders trong database

- [ ] **Verify Tables**
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name IN ('orders', 'order_items');
  ```

---

### Phase 2: App Code ✅

- [ ] **OrderService Updated**
  - File: `lib/services/order_service.dart`
  - Có các functions:
    - ✅ `getOrders()` - lấy danh sách
    - ✅ `getOrder(id)` - lấy chi tiết
    - ✅ `getOrdersByStatus(status)` - filter theo status
    - ✅ `searchOrders(query)` - tìm kiếm
    - ✅ `updateOrderStatus(id, status)` - update status
    - ✅ `getOrderStats()` - thống kê

- [ ] **Order Model**
  - File: `lib/models/order.dart`
  - Có fields: shipping_address, shipping_fee, payment_method, note
  - Có `fromJson()` để parse dữ liệu

- [ ] **AddressParser**
  - File: `lib/utils/address_parser.dart`
  - Có `parseShippingAddress()` function

- [ ] **OrdersScreen**
  - File: `lib/screens/orders_screen.dart`
  - Hiển thị danh sách orders
  - Hiển thị chi tiết (expand tile)
  - Hiển thị địa chỉ (parse từ shipping_address)
  - Có nút cập nhật trạng thái

---

### Phase 3: Manual Testing 🧪

#### Test 1: App khởi động
```
1. Mở app quản lý (Flutter)
2. Vào Orders Screen
3. ✅ Nên thấy danh sách orders (từ database)
4. ❌ Nếu không: Kiểm tra RLS policies và console logs
```

#### Test 2: Xem chi tiết order
```
1. Nhấp vào một order
2. Nhấn "Expand" (mũi tên)
3. ✅ Nên thấy:
   - 📍 Địa Chỉ Giao Hàng
   - 💰 Phí Ship
   - 📝 Thanh toán
   - 📌 Trạng thái
4. ❌ Nếu địa chỉ không parse: Kiểm tra format
```

#### Test 3: Parse Địa Chỉ
```
Format database: 
"Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"

Parser nên trả về:
- detailedAddress: "Số 123 Đường Lê Lợi"
- ward: "Phường Bến Thành"
- district: "Quận 1"
- province: "TP. Hồ Chí Minh"

App nên hiển thị:
🏙️ TP. Hồ Chí Minh
🏘️ Quận 1
🏘️ Phường Bến Thành
🏠 Số 123 Đường Lê Lợi
```

#### Test 4: Update Trạng Thái
```
1. Chọn order với status = 'pending'
2. Nhấp nút "Xử lý" (status = 'processing')
3. ✅ SnackBar hiển thị "Cập nhật thành công"
4. Kiểm tra Supabase:
   - SELECT order_status FROM orders WHERE id='...'
   - ✅ Phải thấy 'processing'
```

#### Test 5: Filter Orders
```
1. Chọn FilterChip "Chờ xử lý"
2. ✅ Danh sách chỉ hiển thị orders với status='pending'
3. Chọn "Đang xử lý"
4. ✅ Danh sách chỉ hiển thị orders với status='processing'
```

#### Test 6: Refresh
```
1. Kéo xuống (pull to refresh)
2. ✅ Danh sách tải lại từ database
3. ❌ Nếu lỗi: Kiểm tra network
```

---

## 🔍 Troubleshooting

### Vấn đề 1: "No rows returned"
**Triệu chứng**: App mở lên không thấy orders  
**Nguyên nhân**: Không có test data trong database  
**Giải pháp**:
1. Chạy `INSERT_TEST_ORDERS.sql` để thêm test data
2. Verify: `SELECT COUNT(*) FROM orders;`

### Vấn đề 2: "Permission denied"
**Triệu chứng**: Console log: `Error: new row violates row-level security policy`  
**Nguyên nhân**: RLS policies chặn read/update  
**Giải pháp**:
1. Chạy `FIX_RLS_ORDERS_FINAL.sql`
2. Verify: Vào Supabase Dashboard → policies → kiểm tra "orders"

### Vấn đề 3: "Địa chỉ hiển thị trống"
**Triệu chứng**: Order detail mở nhưng không thấy địa chỉ  
**Nguyên nhân**: Format shipping_address không đúng  
**Giải pháp**:
1. Kiểm tra database:
   ```sql
   SELECT shipping_address FROM orders LIMIT 1;
   ```
2. Format phải là: `"detail, ward, district, province"`
3. Nếu sai: UPDATE lại hoặc chạy INSERT_TEST_ORDERS.sql

### Vấn đề 4: "Update status không work"
**Triệu chứng**: Nhấp update nhưng status không thay đổi  
**Nguyên nhân**: UpdateOrderStatus function lỗi  
**Giải pháp**:
1. Kiểm tra console logs: `Error updating order status`
2. Verify RLS policies cho UPDATE
3. Check: Supabase Dashboard → Authentication → User có session không?

### Vấn đề 5: "App bị hang/lag"
**Triệu chứm**: Mở Orders Screen lâu, hoặc update chậm  
**Nguyên nhân**: Query quá nhiều data  
**Giải pháp**:
1. Dùng `limit` parameter: `getOrders(limit: 50)` thay vì toàn bộ
2. Thêm pagination
3. Dùng .range(0, 49) để chunk data

---

## 🔧 Quick Fix Commands

### Reset RLS Policies
```sql
DROP POLICY IF EXISTS "Public can read orders" ON public.orders;
CREATE POLICY "Public can read orders" ON public.orders 
FOR SELECT USING (true);
```

### Insert Test Data
Chạy file: `INSERT_TEST_ORDERS.sql`

### Delete All Test Orders
```sql
DELETE FROM public.orders WHERE note LIKE 'Email:%';
```

### Verify Data
```sql
-- Kiểm tra orders
SELECT id, total, order_status, shipping_address FROM orders LIMIT 5;

-- Kiểm tra stats
SELECT COUNT(*) as total, 
       COUNT(CASE WHEN order_status='pending' THEN 1 END) as pending
FROM orders;
```

---

## 📊 Dữ Liệu Test

Sau khi chạy `INSERT_TEST_ORDERS.sql`, bạn sẽ có:

| ID | Total | Status | Address |
|----|-------|--------|---------|
| 1 | 500K | pending | Số 123 Lê Lợi, Bến Thành, Q1, TP.HCM |
| 2 | 1.2M | completed | Số 456 Nguyễn Huệ, Đa Kao, Q1, TP.HCM |
| 3 | 350K | processing | Số 789 Trần Hưng Đạo, Q1, TP.HCM |
| 4 | 750K | shipped | Số 321 Đinh Tiên Hoàng, Q1, TP.HCM |
| 5 | 900K | pending | Số 654 Pasteur, Bến Nghé, Q1, TP.HCM |

---

## 📱 Expected UI

### Orders List Screen
```
┌─────────────────────────────────┐
│ [Tất cả] [Chờ xử lý] [...]     │
├─────────────────────────────────┤
│ 📦 Đơn hàng #550E8400          │
│ 15/01/2025 10:30                │
│ ₫ 500.000      🟠 Chờ xử lý    │
├─────────────────────────────────┤
│ 📦 Đơn hàng #E29B41D4          │
│ 12/01/2025 15:45                │
│ ₫ 1.200.000    🟢 Hoàn thành   │
└─────────────────────────────────┘
```

### Order Detail (Expanded)
```
┌─────────────────────────────────┐
│ 📍 Địa Chỉ Giao Hàng            │
│ 🏙️ TP. Hồ Chí Minh              │
│ 🏘️ Quận 1                        │
│ 🏘️ Phường Bến Thành             │
│ 🏠 Số 123 Đường Lê Lợi          │
├─────────────────────────────────┤
│ Phí ship: ₫ 30.000              │
│ Thanh toán: COD                 │
│ Ghi chú: Email: khach@...       │
├─────────────────────────────────┤
│ [Xử lý] [Hoàn thành] [Hủy]     │
└─────────────────────────────────┘
```

---

## 🚀 Khi Mọi Thứ Hoạt Động

✅ App hiển thị orders  
✅ Địa chỉ parse đúng  
✅ Update trạng thái work  
✅ Filter hoạt động  

**Tiếp theo**: Đồng bộ với E-commerce website:
1. Website lưu order → Supabase
2. App quản lý query → hiển thị
3. Admin cập nhật status
4. Website có thể query status mới

---

## 📞 Cần Hỗ Trợ?

1. **Kiểm tra console logs** trong app (DevTools)
2. **Kiểm tra Supabase logs** (Supabase Dashboard → Logs)
3. **Kiểm tra network requests** (DevTools → Network)
4. **So sánh với guide**: `HUONG_DAN_LAY_ORDER_VA_DIA_CHI.md`

