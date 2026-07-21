# 📦 Hướng Dẫn: Lấy Địa Chỉ Order và Chuyển sang App Quản Lý

## 🎯 Tổng Quan

Khi khách đặt hàng trên **E-commerce website**, dữ liệu order (bao gồm địa chỉ) được lưu vào **Supabase**. App quản lý của bạn sẽ kết nối **cùng Supabase** để lấy order và xử lý.

**Flow**:
```
┌─────────────────────────────────────────────────────────┐
│  E-Commerce Website (Checkout)                          │
│  - User nhập địa chỉ (Tỉnh/Quận/Xã)                    │
│  - Lưu order + địa chỉ vào Supabase                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────┐
        │   SUPABASE (Shared DB)   │
        │  - orders (đơn hàng)     │
        │  - order_items (sản phẩm)│
        │  - ghn_* (địa chỉ)       │
        └──────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│  App Quản Lý (Management App)                           │
│  - Query orders từ Supabase                             │
│  - Hiển thị danh sách order + địa chỉ giao hàng        │
│  - Cập nhật trạng thái order                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Bước 1: Order Data Structure

### Order được lưu như thế nào?

Khi khách đặt hàng, hệ thống lưu:

**Table: `orders`**
```
{
  id: uuid,
  user_id: uuid (optional),
  total: number,              // Tổng tiền
  shipping_fee: number,       // Phí vận chuyển
  payment_method: string,     // cod / transfer
  shipping_address: string,   // Địa chỉ đầy đủ (do checkout form tạo)
  note: string,               // Ghi chú
  status: string,             // pending / processing / shipped / delivered
  created_at: timestamp,
  updated_at: timestamp
}
```

**Table: `order_items`**
```
{
  id: uuid,
  order_id: uuid FK,
  product_id: uuid FK,
  quantity: number,
  price: number,
  created_at: timestamp
}
```

### Ví dụ Dữ Liệu Order

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "total": 500000,
  "shipping_fee": 30000,
  "payment_method": "cod",
  "shipping_address": "Số 123, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
  "note": "Email: khach@example.com\nSĐT: 0912345678\nGhi chú: Giao lúc 9h sáng",
  "status": "pending",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

## 🔌 Bước 2: Cấu Hình App Quản Lý

### 2.1 Cài Đặt Supabase Client

**Trong app quản lý của bạn** (React, Vue, hoặc framework khác):

```typescript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xxxxx.supabase.co'
const SUPABASE_KEY = 'sb_publishable_xxxxx'  // Anon key (hoặc service role key)

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

**⚠️ Chú ý**:
- Dùng **cùng SUPABASE_URL** và **SUPABASE_KEY** với e-commerce website
- Nếu cần quyền cao (edit order), dùng **Service Role Key** thay vì Anon key
- Service Role Key có trong Supabase Settings → API

### 2.2 Environment Variables

Tạo `.env` hoặc `.env.local`:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxx
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📥 Bước 3: Query Orders từ Supabase

### 3.1 Lấy Danh Sách Tất Cả Orders

```typescript
import { supabase } from './supabase'

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      total,
      shipping_fee,
      payment_method,
      shipping_address,
      status,
      created_at,
      order_items (
        id,
        product_id,
        quantity,
        price
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return { success: false, orders: [] }
  }

  return { success: true, orders: data || [] }
}
```

### 3.2 Lấy Chi Tiết 1 Order

```typescript
export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      total,
      shipping_fee,
      payment_method,
      shipping_address,
      note,
      status,
      created_at,
      order_items (
        id,
        product_id,
        quantity,
        price
      )
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return { success: false, order: null }
  }

  return { success: true, order: data }
}
```

### 3.3 Cập Nhật Trạng Thái Order

```typescript
export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date() })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order:', error)
    return { success: false }
  }

  return { success: true }
}
```

### 3.4 Lọc Orders theo Trạng Thái

```typescript
export async function getOrdersByStatus(status: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return { success: false, orders: [] }
  }

  return { success: true, orders: data || [] }
}
```

---

## 🗺️ Bước 4: Parse Địa Chỉ từ Order

### 4.1 Cấu Trúc Địa Chỉ được Lưu

Khi checkout, địa chỉ được ghép lại thành 1 string:

```
"Số 123, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
```

Nó được tạo từ:
```
detailedAddress, ward, district, province
```

### 4.2 Hàm Parse Địa Chỉ

```typescript
export interface ParsedAddress {
  detailedAddress: string
  ward: string
  district: string
  province: string
}

export function parseShippingAddress(shippingAddress: string): ParsedAddress {
  // Format: "detailedAddress, ward, district, province"
  const parts = shippingAddress.split(', ')
  
  return {
    detailedAddress: parts[0] || '',
    ward: parts[1] || '',
    district: parts[2] || '',
    province: parts[3] || ''
  }
}

// Dùng:
const order = await getOrderById('...')
const address = parseShippingAddress(order.shipping_address)
console.log(address)
// Output:
// {
//   detailedAddress: "Số 123, Đường Lê Lợi",
//   ward: "Phường Bến Thành",
//   district: "Quận 1",
//   province: "TP. Hồ Chí Minh"
// }
```

### 4.3 Hiển Thị Địa Chỉ trong UI

```jsx
import { parseShippingAddress } from './utils'

function OrderDetails({ order }) {
  const address = parseShippingAddress(order.shipping_address)
  
  return (
    <div className="order-details">
      <h3>Thông Tin Giao Hàng</h3>
      <div>
        <p><strong>Tỉnh/Thành phố:</strong> {address.province}</p>
        <p><strong>Quận/Huyện:</strong> {address.district}</p>
        <p><strong>Xã/Phường:</strong> {address.ward}</p>
        <p><strong>Địa chỉ chi tiết:</strong> {address.detailedAddress}</p>
      </div>
    </div>
  )
}
```

---

## 📋 Bước 5: Hiển Thị Orders trong App Quản Lý

### 5.1 Danh Sách Orders

```jsx
import { getAllOrders, parseShippingAddress } from './services'
import { useEffect, useState } from 'react'

function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getAllOrders()
      if (result.success) {
        setOrders(result.orders)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) return <p>Đang tải...</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Mã Đơn</th>
          <th>Địa Chỉ</th>
          <th>Tổng Tiền</th>
          <th>Trạng Thái</th>
          <th>Ngày Đặt</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const address = parseShippingAddress(order.shipping_address)
          return (
            <tr key={order.id}>
              <td>{order.id.substring(0, 8)}</td>
              <td>{address.province} - {address.district}</td>
              <td>{order.total.toLocaleString()} VNĐ</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
```

### 5.2 Chi Tiết Order

```jsx
import { getOrderById, updateOrderStatus, parseShippingAddress } from './services'
import { useEffect, useState } from 'react'

function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await getOrderById(orderId)
      if (result.success) {
        setOrder(result.order)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

  const handleStatusUpdate = async (newStatus) => {
    await updateOrderStatus(orderId, newStatus)
    setOrder({ ...order, status: newStatus })
  }

  if (loading) return <p>Đang tải...</p>
  if (!order) return <p>Không tìm thấy đơn hàng</p>

  const address = parseShippingAddress(order.shipping_address)

  return (
    <div className="order-detail">
      <h2>Đơn Hàng #{order.id.substring(0, 8)}</h2>
      
      {/* Địa Chỉ Giao Hàng */}
      <section>
        <h3>📍 Địa Chỉ Giao Hàng</h3>
        <p><strong>Tỉnh/Thành phố:</strong> {address.province}</p>
        <p><strong>Quận/Huyện:</strong> {address.district}</p>
        <p><strong>Xã/Phường:</strong> {address.ward}</p>
        <p><strong>Địa chỉ chi tiết:</strong> {address.detailedAddress}</p>
      </section>

      {/* Sản Phẩm */}
      <section>
        <h3>📦 Sản Phẩm</h3>
        <ul>
          {order.order_items.map((item) => (
            <li key={item.id}>
              Sản phẩm {item.product_id} x {item.quantity} = {(item.price * item.quantity).toLocaleString()} VNĐ
            </li>
          ))}
        </ul>
      </section>

      {/* Thông Tin Chi Phí */}
      <section>
        <h3>💰 Thông Tin Chi Phí</h3>
        <p>Tiền hàng: {(order.total - order.shipping_fee).toLocaleString()} VNĐ</p>
        <p>Phí vận chuyển: {order.shipping_fee.toLocaleString()} VNĐ</p>
        <p><strong>Tổng cộng: {order.total.toLocaleString()} VNĐ</strong></p>
      </section>

      {/* Trạng Thái */}
      <section>
        <h3>📌 Trạng Thái</h3>
        <p>Hiện tại: <strong>{order.status}</strong></p>
        <select onChange={(e) => handleStatusUpdate(e.target.value)}>
          <option value="">-- Chọn trạng thái --</option>
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đã gửi</option>
          <option value="delivered">Đã giao</option>
        </select>
      </section>
    </div>
  )
}
```

---

## 🔄 Bước 6: Real-Time Updates (Optional)

Nếu muốn app quản lý cập nhật **real-time** khi có order mới:

```typescript
export function subscribeToOrders(callback) {
  const subscription = supabase
    .from('orders')
    .on('*', payload => {
      callback(payload)
    })
    .subscribe()

  return subscription
}

// Dùng:
useEffect(() => {
  const subscription = subscribeToOrders((payload) => {
    console.log('Có order mới:', payload)
    // Cập nhật UI
  })

  return () => {
    supabase.removeSubscription(subscription)
  }
}, [])
```

---

## 📤 Bước 7: Export Order Data

### 7.1 Export sang CSV

```typescript
export function exportOrdersToCSV(orders) {
  const headers = ['Mã Đơn', 'Địa Chỉ', 'Tổng Tiền', 'Trạng Thái', 'Ngày Đặt']
  const rows = orders.map((order) => {
    const address = parseShippingAddress(order.shipping_address)
    return [
      order.id.substring(0, 8),
      `${address.province}, ${address.district}`,
      order.total,
      order.status,
      new Date(order.created_at).toLocaleDateString('vi-VN')
    ]
  })

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'orders.csv'
  a.click()
}
```

### 7.2 Export sang JSON

```typescript
export function exportOrdersToJSON(orders) {
  const data = orders.map((order) => ({
    ...order,
    address: parseShippingAddress(order.shipping_address)
  }))

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'orders.json'
  a.click()
}
```

---

## 🔐 Bước 8: Security & Permissions

### 8.1 RLS Policies cho Orders

**Trong Supabase SQL**:

```sql
-- Cho phép public read orders (để app quản lý xem)
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);

-- Cho phép public update orders (để app quản lý cập nhật)
CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- Cho phép public read order_items
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);
```

### 8.2 Authentication (Optional)

Nếu muốn chỉ app quản lý được access:

```typescript
// Thêm auth vào app quản lý
import { Auth } from '@supabase/auth-ui-react'

function AdminLogin() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: 'dark' }}
    />
  )
}
```

---

## ✅ Checklist

- [ ] **E-commerce website** tạo order + lưu vào Supabase
- [ ] **App quản lý** kết nối cùng Supabase database
- [ ] **App quản lý** query orders với `getAllOrders()`
- [ ] **App quản lý** parse địa chỉ với `parseShippingAddress()`
- [ ] **App quản lý** hiển thị orders trong table
- [ ] **App quản lý** có nút cập nhật trạng thái
- [ ] **RLS policies** được setup cho orders table
- [ ] **Testing**: Đặt hàng → Xuất hiện trong app quản lý

---

## 🧪 Test Flow

1. **Đặt hàng trên website**
   - Nhập địa chỉ đầy đủ
   - Chọn Tỉnh/Quận/Xã
   - Click "Đặt Hàng"

2. **Kiểm tra Supabase**
   - Vào Supabase Dashboard
   - Kiểm tra table `orders` có record mới
   - Kiểm tra `shipping_address` có đầy đủ info

3. **Kiểm tra App Quản Lý**
   - Chạy app quản lý
   - Danh sách orders có xuất hiện order mới không?
   - Click vào xem chi tiết
   - Địa chỉ hiển thị đúng không?

4. **Cập nhật Trạng Thái**
   - Chọn "Đang xử lý"
   - Kiểm tra Supabase, status có thay đổi không?

---

## 💡 Tips

- **Performance**: Dùng pagination để query orders (limit 50, offset)
- **Search**: Filter orders theo ngày, tỉnh, hoặc trạng thái
- **Caching**: Dùng React Query hoặc SWR để cache orders
- **Real-time**: Dùng Supabase Realtime để cập nhật khi có order mới
- **Mobile**: Responsive design cho app quản lý (table → cards trên mobile)

---

**🎉 Xong!** Bây giờ app quản lý của bạn có thể lấy order + địa chỉ từ Supabase và quản lý!
