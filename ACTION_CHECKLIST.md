# ✅ Action Checklist - Hệ Thống Orders

## 🎯 Mục Tiêu Cuối Cùng
App quản lý & website hoàn toàn đồng bộ thông qua Supabase.

---

## 🚀 NGAY HÔM NAY (30 phút)

### ⚡ Bước 1: Setup Database (5 phút)

**Vào Supabase Dashboard:**
1. **SQL Editor** tab
2. **Copy code này:**
   ```sql
   -- 1. RLS Policies
   DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
   DROP POLICY IF EXISTS "Authenticated can view all orders" ON public.orders;
   DROP POLICY IF EXISTS "Authenticated can update orders" ON public.orders;
   
   CREATE POLICY "Public can read orders" ON public.orders 
   FOR SELECT USING (true);
   
   CREATE POLICY "Authenticated can update orders" ON public.orders 
   FOR UPDATE USING (auth.role() = 'authenticated') 
   WITH CHECK (auth.role() = 'authenticated');
   
   CREATE POLICY "Authenticated can insert orders" ON public.orders 
   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
   
   CREATE POLICY "Authenticated can delete orders" ON public.orders 
   FOR DELETE USING (auth.role() = 'authenticated');
   
   -- 2. Order Items policies
   DROP POLICY IF EXISTS "Public can view order_items" ON public.order_items;
   
   CREATE POLICY "Public can read order_items" ON public.order_items 
   FOR SELECT USING (true);
   
   CREATE POLICY "Authenticated can manage order_items" ON public.order_items 
   FOR ALL USING (auth.role() = 'authenticated') 
   WITH CHECK (auth.role() = 'authenticated');
   ```

3. **Paste vào SQL Editor**
4. **Click "Run"** (phải thấy: "Success")

✅ **Verify:**
```sql
SELECT * FROM orders LIMIT 1;
```

---

### ⚡ Bước 2: Insert Test Data (5 phút)

1. **SQL Editor** → **New query**
2. **Copy code này:**
   ```sql
   INSERT INTO public.orders (
     user_id,
     total,
     shipping_fee,
     payment_method,
     payment_status,
     order_status,
     shipping_address,
     note,
     created_at
   ) VALUES
   (NULL, 500000, 30000, 'cod', 'pending', 'pending', 
    'Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    'Email: khach1@example.com' || E'\n' || 'SĐT: 0912345678', NOW()),
   (NULL, 1200000, 50000, 'transfer', 'completed', 'completed',
    'Số 456 Nguyễn Huệ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
    'Email: khach2@example.com' || E'\n' || 'SĐT: 0987654321', NOW() - INTERVAL '3 days'),
   (NULL, 350000, 25000, 'cod', 'pending', 'processing',
    'Số 789 Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh',
    'Email: khach3@example.com' || E'\n' || 'SĐT: 0909999999', NOW() - INTERVAL '1 day'),
   (NULL, 750000, 40000, 'transfer', 'pending', 'shipped',
    'Số 321 Đinh Tiên Hoàng, Phường Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
    'Email: khach4@example.com' || E'\n' || 'SĐT: 0933333333', NOW() - INTERVAL '2 days'),
   (NULL, 900000, 45000, 'cod', 'pending', 'pending',
    'Số 654 Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    'Email: khach5@example.com' || E'\n' || 'SĐT: 0944444444', NOW() - INTERVAL '5 days');
   ```

3. **Paste & Run**

✅ **Verify:**
```sql
SELECT COUNT(*) FROM orders;  -- Nên = 5
```

---

### ⚡ Bước 3: Test App Quản Lý (10 phút)

1. **Mở app quản lý** (Flutter)
2. **Thoát & reload app** (hotkey hoặc restart)
3. **Vào Orders Screen**
4. **Kéo xuống (pull to refresh)**

✅ **Nên thấy:**
- [x] Danh sách 5 orders
- [x] Mỗi order hiển thị: ID, ngày, tổng tiền, status
- [x] Status hiển thị bằng badge màu

5. **Click vào một order để expand:**
   - [x] 📍 Địa Chỉ Giao Hàng (4 dòng: Tỉnh, Quận, Xã, Chi tiết)
   - [x] 💰 Phí Ship
   - [x] 📝 Thanh toán (COD/Transfer)
   - [x] 📌 Trạng thái
   - [x] Nút cập nhật (Xử lý, Hoàn thành, Hủy)

✅ **Nếu lỗi:**
- Check console logs (DevTools)
- Verify RLS policies ran successfully
- Verify test data inserted

---

### ⚡ Bước 4: Test Update Status (5 phút)

1. **Expand một order** có status = "pending"
2. **Click nút "Xử lý"**
3. ✅ **Nên thấy:** SnackBar xanh "Cập nhật trạng thái thành công"
4. **Quay lại Supabase → orders table**
5. ✅ **Verify:** order status = "processing"

**Nếu không thấy thay đổi:**
- Refresh browser / app
- Kiểm tra console logs
- Verify RLS UPDATE policy

---

## 📅 TUẦN TIẾP (Website)

### 🌐 Bước 1: Website Checkout Form

**File:** `HUONG_DAN_WEBSITE_TAO_ORDER.md`

Cần implement:
- [ ] Form nhập thông tin giao hàng
- [ ] Dropdowns cho Tỉnh/Quận/Xã
- [ ] Format shipping_address: `"detail, ward, district, province"`
- [ ] Insert order vào Supabase
- [ ] Insert order_items vào Supabase

**Code template:**
```javascript
const shippingAddress = `${detail}, ${ward}, ${district}, ${province}`
const { data } = await supabase.from('orders').insert({
  total, shipping_fee, payment_method, order_status: 'pending',
  shipping_address, note
})
```

### 🌐 Bước 2: Test Website → App

**Test flow:**
1. Website: Đặt hàng
2. ✅ Order xuất hiện trong Supabase
3. App quản lý: Load orders
4. ✅ Thấy order vừa tạo từ website
5. App: Update status → 'processing'
6. Website: Query → thấy status mới

---

## 🎓 TUẦN 2+ (Optimization)

### 📱 App Quản Lý Enhancement
- [ ] Add search functionality (đã có service)
- [ ] Add date range filter (đã có service)
- [ ] Add pagination
- [ ] Add real-time updates
- [ ] Export to CSV

### 🌐 Website Enhancement
- [ ] Order tracking page
- [ ] Customer notifications
- [ ] Payment confirmation

### 🔧 System Enhancement
- [ ] Shipper integration
- [ ] SMS notifications
- [ ] Email confirmations

---

## 📊 Progress Tracking

| Phase | Status | Timeline |
|-------|--------|----------|
| Database Setup | ✅ Ready | Today |
| RLS Policies | 📋 To-do | Today |
| Test Data | 📋 To-do | Today |
| App Testing | 📋 To-do | Today |
| Website Code | 📋 To-do | This week |
| Integration Test | 📋 To-do | This week |
| Deployment | 📋 To-do | Next week |

---

## 🎯 Success Criteria

### ✅ Core (Must Have)
- [x] App loads orders from Supabase
- [x] Address parses correctly
- [ ] App updates order status
- [ ] Website creates orders
- [ ] Website-App sync works

### ⏳ Nice to Have
- [ ] Real-time updates
- [ ] Search functionality
- [ ] Export orders
- [ ] Analytics dashboard

---

## 🆘 Troubleshooting Quick Links

**Problem** | **Solution** | **File**
---|---|---
No orders showing | RLS policies not applied | `KIEM_TRA_VA_TEST_ORDERS.md`
Permission denied | Check policies | `FIX_RLS_ORDERS_FINAL.sql`
Address parsing wrong | Check format | `HUONG_DAN_LAY_ORDER_VA_DIA_CHI.md`
Update status fails | Check network | Console logs
Website not inserting | Check client setup | `HUONG_DAN_WEBSITE_TAO_ORDER.md`

---

## 📞 Quick Reference

### Files Created Today
1. ✅ `FIX_RLS_ORDERS_FINAL.sql` - RLS setup
2. ✅ `INSERT_TEST_ORDERS.sql` - Test data
3. ✅ `HUONG_DAN_LAY_ORDER_VA_DIA_CHI.md` - Full guide
4. ✅ `KIEM_TRA_VA_TEST_ORDERS.md` - Testing
5. ✅ `HUONG_DAN_WEBSITE_TAO_ORDER.md` - Website
6. ✅ `QUICK_START_ORDERS.md` - Quick start
7. ✅ `IMPLEMENTATION_SUMMARY.md` - Summary
8. ✅ `lib/services/order_service.dart` - Updated ✨

### Commands You'll Need
```bash
# Test SQL queries
SELECT COUNT(*) FROM orders;
SELECT * FROM orders LIMIT 5;
UPDATE orders SET order_status = 'processing' WHERE id = '...';

# Check RLS
SELECT * FROM auth.authorization_policies;
```

---

## 🏁 Completion Checklist

### Today (30 min)
- [ ] Run RLS policies SQL ✅
- [ ] Insert test data SQL ✅
- [ ] Open app → Orders Screen ✅
- [ ] Expand order → See address ✅
- [ ] Update status → Verify Supabase ✅

### This Week
- [ ] Website checkout code
- [ ] Website insert order
- [ ] End-to-end test

### Next Week
- [ ] Deploy app
- [ ] Deploy website
- [ ] Go live

---

## 🎉 When Complete

✅ **App Quản Lý:**
- Hiển thị danh sách orders từ Supabase
- Parse địa chỉ đầy đủ
- Update trạng thái
- Filter & search

✅ **Website:**
- Tạo orders vào Supabase
- Sync với app quản lý

✅ **Database:**
- Shared Supabase
- RLS policies
- Full data sync

**Result:** Orders flow từ website → Supabase → app quản lý ✨

