# 🚀 RUN AUTO SHIPPING ADDRESS TRIGGER

Hướng dẫn chi tiết cách chạy SQL trigger để tự động lấy `shipping_address` từ bảng `addresses`.

---

## 📋 BƯỚC 1: Chạy SQL Trigger trong Supabase

### ✅ Cách làm (5 phút):

1. **Mở Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Click vào project của bạn

2. **Vào SQL Editor:**
   - Menu trái → Click **"SQL Editor"**
   - Click **"New Query"** (nút bên phải)
   - Hoặc Ctrl+K → Tìm "New Query"

3. **Copy SQL từ file này:**
   ```
   AUTO_SHIPPING_ADDRESS_TRIGGER.sql
   ```
   - **Mở file:** `AUTO_SHIPPING_ADDRESS_TRIGGER.sql`
   - **Copy toàn bộ nội dung** (Ctrl+A → Ctrl+C)

4. **Paste vào SQL Editor:**
   - Click vào text editor trong Supabase
   - Paste nội dung (Ctrl+V)

5. **Chạy SQL:**
   - Click nút **"RUN"** (bên phải phía trên, hoặc Ctrl+Enter)
   - Chờ khoảng 2-3 giây

6. **Xác minh kết quả:**
   - Bạn sẽ thấy:
   ```
   Query executed successfully
   Rows affected: 0
   ```
   - Hoặc thấy chi tiết các function/trigger được tạo

### ❌ Nếu có lỗi:

**Lỗi 1: "relation "addresses" does not exist"**
```
→ Giải pháp: Tạo bảng addresses trước
  Chạy: CREATE TABLE addresses (...) trong SQL Editor
```

**Lỗi 2: "syntax error"**
```
→ Giải pháp: Kiểm tra lại SQL có paste đúng không
  - Xóa hết → Copy lại từ file
  - Hoặc chạy từng câu SELECT/CREATE riêng biệt
```

**Lỗi 3: "Permission denied"**
```
→ Giải pháp: Kiểm tra user permissions trong Supabase
  - Vào Settings → Database → Roles
  - Thêm quyền CREATE cho user
```

---

## 📊 BƯỚC 2: Xác minh Trigger Đã Được Tạo

Chạy các query sau để kiểm tra:

### Query 1: Kiểm tra Trigger

```sql
-- Kiểm tra trigger đã được tạo
SELECT tgname, tgrelname 
FROM pg_trigger 
WHERE tgname = 'trigger_auto_shipping_address';
```

**Kết quả kỳ vọng:**
```
tgname                          | tgrelname
---------------------------------+----------
trigger_auto_shipping_address   | orders
```

### Query 2: Kiểm tra Function

```sql
-- Kiểm tra function đã được tạo
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'auto_shipping_address';
```

**Kết quả kỳ vọng:**
```
proname                 | prosrc
------------------------+----------
auto_shipping_address   | BEGIN IF NEW.user_id IS NOT NULL ...
```

### Query 3: Kiểm tra Orders Table

```sql
-- Kiểm tra orders table có shipping_address column
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND column_name = 'shipping_address';
```

**Kết quả kỳ vọng:**
```
column_name       | data_type
------------------+-----------
shipping_address  | text
```

---

## 🧪 BƯỚC 3: Test Auto Shipping Address System

### ✅ Test 1: Tạo Order từ Website Checkout

1. **Truy cập website:**
   - https://e-commerce-website-interface.vercel.app

2. **Thêm sản phẩm vào giỏ** → Click "Giỏ Hàng"

3. **Click "Thanh Toán":**
   - Nhập Email: `test@example.com`
   - Nhập SĐT: `0123456789`
   - Chọn Tỉnh: `Hà Nội`
   - Chọn Quận: `Hà Đông`
   - Chọn Xã: `Phường Dương Nội`
   - Nhập địa chỉ chi tiết: `Số 123 Lê Lợi`

4. **Click "Đặt Hàng"**
   - Chờ xử lý (3-5 giây)
   - Thấy: `✅ Đặt hàng thành công!`

5. **Kiểm tra trong Supabase:**
   ```sql
   SELECT id, shipping_address, order_status 
   FROM orders 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
   
   **Kết quả kỳ vọng:**
   ```
   id                | shipping_address                                  | order_status
   ------------------+---------------------------------------------------+----------
   550e8400-e29b...  | Số 123 Lê Lợi, Phường Dương Nội, Hà Đông, Hà Nội | pending
   ```

### ✅ Test 2: Tạo Order Từ OrderService (TypeScript)

**Trong file `src/services/orderService.ts`:**

```typescript
// Test: Tạo order
const order = await createOrder({
  user_id: 'test-user-123',
  total: 500000,
  shipping_fee: 30000,
  paymentMethod: 'cod'
})

console.log('✅ Order created:', order.id)
console.log('📍 Shipping address:', order.shipping_address)
```

**Kết quả kỳ vọng:**
```
✅ Order created: 550e8400-e29b-41d4-a716-446655440000
📍 Shipping address: Chưa cập nhật địa chỉ
```
(Hoặc địa chỉ từ `addresses` table nếu có)

### ✅ Test 3: Parse Shipping Address

**Sử dụng hàm `parseShippingAddress()`:**

```typescript
import { parseShippingAddress } from '@/services/orderService'

const address = parseShippingAddress('Số 123 Lê Lợi, Phường Dương Nội, Hà Đông, Hà Nội')

console.log(address)
// Output:
// {
//   detail: 'Số 123 Lê Lợi',
//   ward: 'Phường Dương Nội',
//   district: 'Hà Đông',
//   province: 'Hà Nội'
// }
```

---

## 🔍 BƯỚC 4: Xác Minh Data Trong Supabase

### Query 1: Kiểm tra Orders với Shipping Address

```sql
SELECT 
  id,
  user_id,
  total,
  shipping_fee,
  shipping_address,
  order_status,
  created_at
FROM orders
WHERE shipping_address IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

### Query 2: Kiểm tra Addresses Table (nếu có)

```sql
SELECT 
  id,
  user_id,
  address_full,
  is_default,
  created_at
FROM addresses
LIMIT 5;
```

### Query 3: Parse Address từ Orders

```sql
SELECT 
  id,
  shipping_address,
  SPLIT_PART(shipping_address, ', ', 1) as detail,
  SPLIT_PART(shipping_address, ', ', 2) as ward,
  SPLIT_PART(shipping_address, ', ', 3) as district,
  SPLIT_PART(shipping_address, ', ', 4) as province
FROM orders
WHERE shipping_address IS NOT NULL
LIMIT 10;
```

---

## 💾 BƯỚC 5: Backup & Deploy

### Backup SQL

Lưu lại SQL trigger:
```bash
# Copy file để lưu trữ
cp AUTO_SHIPPING_ADDRESS_TRIGGER.sql backups/trigger-$(date +%Y%m%d).sql
```

### Deploy lên Vercel

```bash
# Terminal
cd "c:\Users\baomu\Downloads\E-commerce website interface"

# Commit code
git add .
git commit -m "✨ Add auto shipping address trigger"

# Deploy
vercel deploy --prod
```

**Kết quả kỳ vọng:**
```
✅ Deployed to: https://e-commerce-website-interface.vercel.app
```

---

## 📋 CHECKLIST

- [ ] **Bước 1**: Chạy SQL trigger trong Supabase ✅
  - [ ] Mở SQL Editor
  - [ ] Copy SQL từ `AUTO_SHIPPING_ADDRESS_TRIGGER.sql`
  - [ ] Paste & Run
  - [ ] Kiểm tra "Query executed successfully"

- [ ] **Bước 2**: Xác minh trigger ✅
  - [ ] Chạy Query 1 → Thấy trigger `trigger_auto_shipping_address`
  - [ ] Chạy Query 2 → Thấy function `auto_shipping_address`
  - [ ] Chạy Query 3 → Thấy column `shipping_address`

- [ ] **Bước 3**: Test hệ thống ✅
  - [ ] Test 1: Tạo order từ website
  - [ ] Kiểm tra `shipping_address` trong Supabase
  - [ ] Test 2: Chạy `createOrder()` function
  - [ ] Test 3: Parse address thành công

- [ ] **Bước 4**: Xác minh data ✅
  - [ ] Chạy các query kiểm tra
  - [ ] Orders có `shipping_address` đầy đủ

- [ ] **Bước 5**: Deploy ✅
  - [ ] Commit code
  - [ ] Deploy lên Vercel
  - [ ] Test trên production

---

## 🆘 TROUBLESHOOTING

### ❌ Trigger không tự động chạy?

**Kiểm tra:**
```sql
-- Xem logs trigger
SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_shipping_address';

-- Xem trigger definition
SELECT pg_get_triggerdef(oid) 
FROM pg_trigger 
WHERE tgname = 'trigger_auto_shipping_address';
```

**Giải pháp:**
- DROP trigger cũ: `DROP TRIGGER trigger_auto_shipping_address ON orders;`
- Tạo lại: Chạy lại SQL từ `AUTO_SHIPPING_ADDRESS_TRIGGER.sql`

### ❌ `shipping_address` vẫn NULL?

**Kiểm tra:**
```sql
-- Xem trigger đã chạy không
SELECT trigger_event, trigger_manipulation, action_timing 
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_auto_shipping_address';

-- Insert test order
INSERT INTO orders (user_id, total, shipping_fee, payment_method, order_status)
VALUES ('test-user', 100000, 30000, 'cod', 'pending')
RETURNING shipping_address;
```

**Giải pháp:**
- Kiểm tra bảng `addresses` có data không
- Hoặc thêm hardcoded default value vào trigger

### ❌ Permission denied?

**Giải pháp:**
```sql
-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;
```

---

## 🎯 CÓ VẤN ĐỀ?

Hãy screenshot lỗi và gửi cho tôi:
1. SQL error message
2. Trigger definition
3. Orders table sample data

---

**✅ Hoàn thành cả 5 bước để hệ thống auto shipping address hoạt động!** 🚀
