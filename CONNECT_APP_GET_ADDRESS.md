# 📍 Kết Nối App Quản Lý - Lấy Địa Chỉ Giao Hàng

## 🎯 Mục Đích
App quản lý của bạn sẽ **kết nối Supabase** để lấy orders + địa chỉ giao hàng từ e-commerce website.

---

## 📋 Thông Tin Supabase

```
URL: https://edtxexnhpbipcecceoop.supabase.co
KEY: sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
```

---

## ⚙️ BƯỚC 1: Cài Supabase

Trong app quản lý của bạn, chạy:

```bash
npm install @supabase/supabase-js
```

---

## 📄 BƯỚC 2: Tạo File Kết Nối

Tạo file `src/lib/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

---

## 🔧 BƯỚC 3: Tạo Hàm Lấy Orders

Tạo file `src/lib/orderService.js`:

```javascript
import { supabase } from './supabaseClient'

// Lấy tất cả orders
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) console.error('Lỗi:', error)
  return data || []
}

// Lấy 1 order theo ID
export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) console.error('Lỗi:', error)
  return data
}

// Cập nhật trạng thái
export async function updateOrderStatus(id, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date() })
    .eq('id', id)
  
  if (error) console.error('Lỗi:', error)
  return !error
}
```

---

## 🗺️ BƯỚC 4: Parse Địa Chỉ

Tạo file `src/lib/parseAddress.js`:

```javascript
// Chia địa chỉ thành từng phần
export function parseAddress(address) {
  if (!address) return { detail: '', ward: '', district: '', province: '' }
  
  const parts = address.split(', ')
  return {
    detail: parts[0] || '',      // Số nhà, đường
    ward: parts[1] || '',         // Phường/Xã
    district: parts[2] || '',     // Quận/Huyện
    province: parts[3] || ''      // Tỉnh/Thành phố
  }
}
```

---

## 💻 BƯỚC 5: Hiển Thị trong UI

### Nếu dùng React:

```jsx
import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus } from '../lib/orderService'
import { parseAddress } from '../lib/parseAddress'

export function OrderList() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      const data = await getOrders()
      setOrders(data)
    }
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus)
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ))
  }

  return (
    <div>
      <h1>📦 Đơn Hàng</h1>
      {orders.map(order => {
        const addr = parseAddress(order.shipping_address)
        return (
          <div key={order.id} style={{ border: '1px solid #ddd', padding: '16px', marginBottom: '16px' }}>
            <h3>Đơn #{order.id.substring(0, 8)}</h3>
            
            {/* 📍 ĐỊA CHỈ */}
            <div style={{ background: '#f0f4ff', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
              <h4>📍 Địa Chỉ Giao Hàng</h4>
              <p><strong>Tỉnh:</strong> {addr.province}</p>
              <p><strong>Quận:</strong> {addr.district}</p>
              <p><strong>Phường:</strong> {addr.ward}</p>
              <p><strong>Chi tiết:</strong> {addr.detail}</p>
            </div>

            {/* 💰 TIỀN */}
            <div style={{ marginBottom: '12px' }}>
              <p>Tổng tiền: <strong>{order.total.toLocaleString()} VNĐ</strong></p>
              <p>Phí ship: {order.shipping_fee.toLocaleString()} VNĐ</p>
            </div>

            {/* 📌 TRẠNG THÁI */}
            <div>
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="pending">⏳ Chờ xử lý</option>
                <option value="processing">🔄 Đang xử lý</option>
                <option value="shipped">📦 Đã gửi</option>
                <option value="delivered">✅ Đã giao</option>
              </select>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

### Nếu dùng Vue:

```vue
<template>
  <div>
    <h1>📦 Đơn Hàng</h1>
    <div v-for="order in orders" :key="order.id" class="order-card">
      <h3>Đơn #{{ order.id.substring(0, 8) }}</h3>
      
      <!-- 📍 ĐỊA CHỈ -->
      <div class="address-box">
        <h4>📍 Địa Chỉ Giao Hàng</h4>
        <p><strong>Tỉnh:</strong> {{ parseAddress(order.shipping_address).province }}</p>
        <p><strong>Quận:</strong> {{ parseAddress(order.shipping_address).district }}</p>
        <p><strong>Phường:</strong> {{ parseAddress(order.shipping_address).ward }}</p>
        <p><strong>Chi tiết:</strong> {{ parseAddress(order.shipping_address).detail }}</p>
      </div>

      <!-- 💰 TIỀN -->
      <div>
        <p>Tổng tiền: <strong>{{ order.total.toLocaleString() }} VNĐ</strong></p>
        <p>Phí ship: {{ order.shipping_fee.toLocaleString() }} VNĐ</p>
      </div>

      <!-- 📌 TRẠNG THÁI -->
      <select @change="(e) => updateStatus(order.id, e.target.value)">
        <option value="pending">⏳ Chờ xử lý</option>
        <option value="processing">🔄 Đang xử lý</option>
        <option value="shipped">📦 Đã gửi</option>
        <option value="delivered">✅ Đã giao</option>
      </select>
    </div>
  </div>
</template>

<script>
import { getOrders, updateOrderStatus } from '../lib/orderService'
import { parseAddress } from '../lib/parseAddress'

export default {
  data() {
    return { orders: [] }
  },
  methods: {
    parseAddress,
    async updateStatus(id, status) {
      await updateOrderStatus(id, status)
      const order = this.orders.find(o => o.id === id)
      if (order) order.status = status
    }
  },
  mounted() {
    getOrders().then(data => this.orders = data)
  }
}
</script>

<style scoped>
.order-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
}

.address-box {
  background: #f0f4ff;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}
</style>
```

### Nếu dùng HTML thuần:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Đơn Hàng</title>
</head>
<body>
  <h1>📦 Đơn Hàng</h1>
  <div id="orders"></div>

  <script type="module">
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

    const supabase = createClient(
      'https://edtxexnhpbipcecceoop.supabase.co',
      'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'
    )

    async function loadOrders() {
      const { data } = await supabase.from('orders').select('*')
      
      const html = data.map(order => {
        const addr = order.shipping_address.split(', ')
        return `
          <div style="border: 1px solid #ddd; padding: 16px; margin-bottom: 16px;">
            <h3>Đơn #${order.id.substring(0, 8)}</h3>
            <div style="background: #f0f4ff; padding: 12px; border-radius: 4px;">
              <h4>📍 Địa Chỉ Giao Hàng</h4>
              <p><strong>Tỉnh:</strong> ${addr[3] || 'N/A'}</p>
              <p><strong>Quận:</strong> ${addr[2] || 'N/A'}</p>
              <p><strong>Phường:</strong> ${addr[1] || 'N/A'}</p>
              <p><strong>Chi tiết:</strong> ${addr[0] || 'N/A'}</p>
            </div>
            <p>Tổng tiền: <strong>${order.total.toLocaleString()} VNĐ</strong></p>
          </div>
        `
      }).join('')
      
      document.getElementById('orders').innerHTML = html
    }

    loadOrders()
  </script>
</body>
</html>
```

---

## ✅ Kiểm Tra

1. **App quản lý có hiển thị orders không?** ✓
2. **Mỗi order hiển thị địa chỉ giao hàng không?** ✓
3. **Có thể cập nhật trạng thái không?** ✓

---

## 🐛 Nếu Lỗi

**Lỗi: "Cannot find module"**
- Kiểm tra import path đúng không

**Lỗi: "No data"**
- Mở DevTools F12 → Console
- Paste: `fetch('https://edtxexnhpbipcecceoop.supabase.co/rest/v1/orders', { headers: { apikey: 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7' } }).then(r => r.json()).then(d => console.log(d))`
- Xem có data không?

---

## 🎉 Xong!

App quản lý giờ **hiển thị orders + địa chỉ giao hàng** từ e-commerce website!
