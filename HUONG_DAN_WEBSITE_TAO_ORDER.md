# 🌐 Hướng Dẫn: E-Commerce Website Lưu Order vào Supabase

## 🎯 Mục Đích

Khi khách **đặt hàng trên website**, cần lưu order vào **Supabase** (cùng database với app quản lý) để:
1. App quản lý có thể query và xem orders
2. Admin có thể cập nhật trạng thái
3. Khách có thể theo dõi order

---

## 🔌 Cấu Hình Website

### 1. Kết Nối Supabase

**Cài dependencies**:
```bash
npm install @supabase/supabase-js
```

**Tạo supabase client** (`src/lib/supabase.js`):
```javascript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

**Tạo `.env.local`**:
```
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

---

## 📦 Flow: Từ Checkout → Supabase

```
1. User chọn sản phẩm → Add to cart
2. User nhấp "Checkout"
3. User nhập địa chỉ + thông tin giao hàng
4. User chọn thanh toán (COD/Transfer)
5. User nhấp "Đặt Hàng"
6. Website gửi order → Supabase
7. ✅ Supabase lưu vào `orders` table
8. Website redirect → Order confirmation page
9. App quản lý query → hiển thị order mới
```

---

## 💾 Lưu Order vào Supabase

### Cấu Trúc Order

```javascript
{
  total: 500000,                    // Tổng tiền (bao gồm ship)
  shipping_fee: 30000,              // Phí vận chuyển
  payment_method: 'cod',            // 'cod' hoặc 'transfer'
  payment_status: 'pending',        // pending / completed / failed
  order_status: 'pending',          // pending / processing / shipped / completed / cancelled
  shipping_address: '...format...', // ← QUAN TRỌNG!
  note: '...',                      // Ghi chú khách
  user_id: null,                    // Nếu user chưa login, để null
}
```

### Định Dạng Shipping Address

**Format**: `detailedAddress, ward, district, province` (cách nhau bằng `, `)

**Ví dụ**:
```
"Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
```

**Phân tích**:
- `detailedAddress`: "Số 123 Đường Lê Lợi"
- `ward`: "Phường Bến Thành"
- `district`: "Quận 1"
- `province`: "TP. Hồ Chí Minh"

---

## 🛒 Code Example: Tạo Order

### HTML Form
```html
<!-- Checkout Form -->
<form id="checkoutForm">
  <!-- Thông tin khách -->
  <input type="email" id="email" placeholder="Email" required>
  <input type="tel" id="phone" placeholder="Số điện thoại" required>
  
  <!-- Địa chỉ -->
  <input type="text" id="detailedAddress" placeholder="Số nhà, tên đường" required>
  <select id="province" required>
    <option>-- Chọn Tỉnh/Thành --</option>
    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
    <option value="Hà Nội">Hà Nội</option>
    <!-- ... -->
  </select>
  <select id="district" required>
    <option>-- Chọn Quận/Huyện --</option>
    <!-- Populated by JS -->
  </select>
  <select id="ward" required>
    <option>-- Chọn Xã/Phường --</option>
    <!-- Populated by JS -->
  </select>
  
  <!-- Thanh toán -->
  <select id="paymentMethod" required>
    <option value="cod">COD (Thanh toán khi nhận)</option>
    <option value="transfer">Chuyển khoản</option>
  </select>
  
  <!-- Ghi chú -->
  <textarea id="note" placeholder="Ghi chú (không bắt buộc)"></textarea>
  
  <button type="submit">Đặt Hàng</button>
</form>
```

### JavaScript: Xử Lý Checkout
```javascript
import { supabase } from './lib/supabase'

const form = document.getElementById('checkoutForm')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  try {
    // 1. Lấy dữ liệu từ form
    const email = document.getElementById('email').value
    const phone = document.getElementById('phone').value
    const detailedAddress = document.getElementById('detailedAddress').value
    const ward = document.getElementById('ward').value
    const district = document.getElementById('district').value
    const province = document.getElementById('province').value
    const paymentMethod = document.getElementById('paymentMethod').value
    const note = document.getElementById('note').value
    
    // 2. Tính tổng tiền từ cart
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = 30000 // Hoặc tính dựa vào địa chỉ
    const total = subtotal + shippingFee
    
    // 3. Tạo shipping_address string
    const shippingAddress = `${detailedAddress}, ${ward}, ${district}, ${province}`
    
    // 4. Tạo ghi chú
    const fullNote = `Email: ${email}\nSĐT: ${phone}${note ? '\nGhi chú: ' + note : ''}`
    
    // 5. Insert order vào Supabase
    const { data, error } = await supabase.from('orders').insert({
      total,
      shipping_fee: shippingFee,
      payment_method: paymentMethod,
      payment_status: 'pending',
      order_status: 'pending',
      shipping_address: shippingAddress,
      note: fullNote,
      user_id: null, // hoặc auth.uid() nếu user đã login
    })
    
    if (error) throw error
    
    // 6. Lưu order_items
    const orderId = data[0].id
    const orderItems = cart.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) throw itemsError
    
    // 7. Clear cart
    localStorage.removeItem('cart')
    
    // 8. Redirect to confirmation
    window.location.href = `/order-confirmation/${orderId}`
    
  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error.message)
    alert('Lỗi khi đặt hàng, vui lòng thử lại')
  }
})
```

---

## 🔍 Ví Dụ Data Thực Tế

### Order trong Supabase
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": null,
  "total": 530000,
  "shipping_fee": 30000,
  "payment_method": "cod",
  "payment_status": "pending",
  "order_status": "pending",
  "shipping_address": "Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
  "note": "Email: khach@example.com\nSĐT: 0912345678\nGhi chú: Giao lúc 9h sáng",
  "created_at": "2025-01-15T10:30:00+00:00"
}
```

### Order Items
```json
[
  {
    "id": "item-1",
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "prod-1",
    "quantity": 2,
    "price": 250000
  },
  {
    "id": "item-2",
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "prod-2",
    "quantity": 1,
    "price": 500000
  }
]
```

---

## ✅ Checklist: Website Checkout

- [ ] **Supabase client** setup đúng (SUPABASE_URL + KEY)
- [ ] **Form checkout** có các fields:
  - Email, phone
  - Địa chỉ chi tiết (detailedAddress)
  - Tỉnh/Quận/Xã (dropdowns)
  - Thanh toán (COD/Transfer)
  - Ghi chú
- [ ] **Format shipping_address**: `detail, ward, district, province`
- [ ] **Insert order** vào table `orders`
- [ ] **Insert order_items** vào table `order_items`
- [ ] **RLS policies** cho phép insert (hoặc dùng service role key)
- [ ] **Test**: 
  - Đặt hàng → order xuất hiện trong Supabase
  - App quản lý query → hiển thị order vừa đặt

---

## 🔐 Security

### Sử Dụng Service Role Key (Recommended)

Nếu website backend có server, dùng **service role key** (không bị RLS limit):

```javascript
// Backend server (Node.js)
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ← Secret key
)

// Insert order
const { data, error } = await supabase
  .from('orders')
  .insert({ /* order data */ })
```

**Cẩn thận**: Service Role Key là SECRET, không được expose trong frontend!

---

## 🔄 Khi Có Order Mới

### 1. Website thực hiện
```javascript
// Insert order + items vào Supabase
```

### 2. App quản lý nhận
```dart
// Query orders từ Supabase
final orders = await orderService.getOrders()
// Hiển thị order mới trong list
```

### 3. Admin cập nhật trạng thái
```dart
// App update status
await orderService.updateOrderStatus(orderId, 'processing')
```

### 4. Website có thể query
```javascript
// Website query order status
const { data } = await supabase
  .from('orders')
  .select('order_status')
  .eq('id', orderId)
  .single()
console.log(data.order_status) // 'processing'
```

---

## 🧪 Test Flow

### Step 1: Website Checkout
1. Vào website
2. Add product to cart
3. Click "Checkout"
4. Nhập thông tin:
   - Email: test@example.com
   - Phone: 0912345678
   - Address: Số 123 Lê Lợi
   - Ward: Phường Bến Thành
   - District: Quận 1
   - Province: TP. Hồ Chí Minh
5. Click "Đặt Hàng"

### Step 2: Kiểm Tra Supabase
1. Vào **Supabase Dashboard**
2. Tab **Editor** → `orders` table
3. **✅ Nên thấy** order vừa tạo với:
   - `shipping_address`: "Số 123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
   - `order_status`: "pending"

### Step 3: Kiểm Tra App Quản Lý
1. **Mở app quản lý**
2. Vào **Orders Screen**
3. **✅ Nên thấy** order mới trong danh sách
4. **Expand** để xem chi tiết
5. **✅ Nên thấy** địa chỉ parse đúng

### Step 4: Update Status
1. Click "Xử lý" trong app
2. Kiểm tra Supabase → `order_status` = "processing"
3. **✅ Thành công**

---

## 🛠️ Troubleshooting

### Lỗi: "PERMISSION DENIED"
**Nguyên nhân**: RLS policies chặn INSERT  
**Giải pháp**:
1. Dùng **service role key** (backend)
2. Hoặc thêm policy: `CREATE POLICY "Public insert orders" ON orders FOR INSERT USING (true);`

### Lỗi: "Shipping address không parse đúng"
**Nguyên nhân**: Format không theo `detail, ward, district, province`  
**Giải pháp**: Kiểm tra code, đảm bảo format đúng

### Lỗi: "Order items không lưu"
**Nguyên nhân**: Order ID sai, hoặc product_id không tồn tại  
**Giải pháp**: 
1. Kiểm tra `product_id` có hợp lệ
2. Kiểm tra `order_id` lấy từ response

### Lỗi: "App quản lý không thấy order"
**Nguyên nhân**: RLS policies chặn SELECT  
**Giải pháp**: Chạy `FIX_RLS_ORDERS_FINAL.sql` trong app quản lý repo

---

## 📞 Liên Hệ

Nếu gặp vấn đề, kiểm tra:
1. **Supabase logs**: Supabase Dashboard → Logs
2. **Browser console**: DevTools → Console
3. **Network requests**: DevTools → Network

