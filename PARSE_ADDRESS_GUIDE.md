# 🗺️ Hướng Dẫn Parse và Hiển Thị Địa Chỉ trong App Quản Lý

## ❌ Vấn Đề Hiện Tại

App quản lý của bạn hiển thị orders nhưng **thiếu địa chỉ giao hàng**.

Dữ liệu `shipping_address` trong Supabase được lưu dạng string:
```
"Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
```

---

## ✅ Giải Pháp

### Bước 1: Tạo Hàm Parse Địa Chỉ

**File: `src/utils/parseAddress.js` hoặc `src/utils/parseAddress.ts`**

```javascript
/**
 * Parse shipping_address string thành object
 * Format: "detailedAddress, ward, district, province"
 */
export function parseShippingAddress(shippingAddress) {
  if (!shippingAddress) {
    return {
      detailedAddress: '',
      ward: '',
      district: '',
      province: ''
    }
  }

  const parts = shippingAddress.split(', ')
  
  return {
    detailedAddress: parts[0] || '',     // "Số 123 Đường Lê Lợi"
    ward: parts[1] || '',                 // "Phường Bến Thành"
    district: parts[2] || '',             // "Quận 1"
    province: parts[3] || ''              // "TP. Hồ Chí Minh"
  }
}

// Test:
const addr = "Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
const parsed = parseShippingAddress(addr)
console.log(parsed)
// Output:
// {
//   detailedAddress: "Số 123 Đường Lê Lợi",
//   ward: "Phường Bến Thành",
//   district: "Quận 1",
//   province: "TP. Hồ Chí Minh"
// }
```

---

### Bước 2: Hiển Thị Địa Chỉ trong Order Detail

**Nếu app quản lý dùng React:**

```jsx
import { parseShippingAddress } from '../utils/parseAddress'

function OrderDetail({ order }) {
  const address = parseShippingAddress(order.shipping_address)

  return (
    <div className="order-detail">
      <h2>Đơn Hàng #{order.id.substring(0, 8)}</h2>

      {/* 📍 THÊM PHẦN NÀY: Địa Chỉ Giao Hàng */}
      <section className="shipping-address-section">
        <h3>📍 Địa Chỉ Giao Hàng</h3>
        <div className="address-box">
          <p>
            <strong>Tỉnh/Thành phố:</strong> {address.province}
          </p>
          <p>
            <strong>Quận/Huyện:</strong> {address.district}
          </p>
          <p>
            <strong>Xã/Phường:</strong> {address.ward}
          </p>
          <p>
            <strong>Địa chỉ chi tiết:</strong> {address.detailedAddress}
          </p>
        </div>
      </section>

      {/* Phần còn lại */}
      <section>
        <h3>💰 Thông Tin Chi Phí</h3>
        <p>Tổng tiền: {order.total.toLocaleString()} VNĐ</p>
      </section>

      {/* ... còn lại ... */}
    </div>
  )
}
```

---

### Bước 3: Hiển Thị Địa Chỉ trong Danh Sách Orders

**Nếu bạn có table hiển thị orders:**

```jsx
import { parseShippingAddress } from '../utils/parseAddress'

function OrdersList({ orders }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Mã Đơn</th>
          <th>Địa Chỉ Giao Hàng</th>  {/* THÊM CỘT NÀY */}
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
              <td>
                <div>
                  <strong>{address.province}</strong>
                  <br />
                  {address.district}, {address.ward}
                  <br />
                  <small>{address.detailedAddress}</small>
                </div>
              </td>
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

---

### Bước 4: CSS Styling (Optional)

```css
.shipping-address-section {
  background-color: #f0f4ff;
  padding: 16px;
  border-left: 4px solid #007bff;
  border-radius: 4px;
  margin: 16px 0;
}

.address-box {
  background-color: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.address-box p {
  margin: 8px 0;
  line-height: 1.6;
}

.address-box strong {
  color: #333;
  min-width: 120px;
  display: inline-block;
}
```

---

## 🔍 Debug: Kiểm Tra Dữ Liệu

Nếu địa chỉ vẫn không hiển thị, hãy kiểm tra:

### 1. Xem dữ liệu order trong console

```javascript
// Trong component React
useEffect(() => {
  console.log('Order data:', order)
  console.log('Shipping address:', order?.shipping_address)
  console.log('Parsed address:', parseShippingAddress(order?.shipping_address))
}, [order])
```

### 2. Query trực tiếp từ Supabase

```bash
# Dùng curl để test
curl -H "apikey: sb_publishable_..." \
  "https://edtxexnhpbipcecceoop.supabase.co/rest/v1/orders?select=id,shipping_address&limit=1"
```

### 3. Kiểm tra SELECT query

Khi query orders, đảm bảo include `shipping_address`:

```typescript
// ❌ SAI - thiếu shipping_address
const { data } = await supabase
  .from('orders')
  .select('id, total, status')

// ✅ ĐÚNG
const { data } = await supabase
  .from('orders')
  .select('id, total, status, shipping_address')
```

---

## 📋 Ví Dụ Đầy Đủ (React Component)

```jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { parseShippingAddress } from '../utils/parseAddress'

export default function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            shipping_fee,
            status,
            shipping_address,
            note,
            created_at
          `)
          .eq('id', orderId)
          .single()

        if (queryError) throw queryError
        setOrder(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) return <div>Đang tải...</div>
  if (error) return <div>Lỗi: {error}</div>
  if (!order) return <div>Không tìm thấy đơn hàng</div>

  const address = parseShippingAddress(order.shipping_address)

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>Đơn Hàng #{order.id.substring(0, 8)}</h1>

      {/* 📍 ĐỊA CHỈ GIAO HÀNG */}
      <div style={{
        background: '#f0f4ff',
        padding: '16px',
        borderLeft: '4px solid #007bff',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3>📍 Địa Chỉ Giao Hàng</h3>
        <p><strong>Tỉnh/Thành phố:</strong> {address.province}</p>
        <p><strong>Quận/Huyện:</strong> {address.district}</p>
        <p><strong>Xã/Phường:</strong> {address.ward}</p>
        <p><strong>Địa chỉ chi tiết:</strong> {address.detailedAddress}</p>
      </div>

      {/* 💰 CHI PHÍ */}
      <div style={{
        background: '#f9f9f9',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3>💰 Thông Tin Chi Phí</h3>
        <p>
          Tiền hàng: <strong>{(order.total - order.shipping_fee).toLocaleString()} VNĐ</strong>
        </p>
        <p>
          Phí vận chuyển: <strong>{order.shipping_fee.toLocaleString()} VNĐ</strong>
        </p>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
          Tổng cộng: {order.total.toLocaleString()} VNĐ
        </p>
      </div>

      {/* 📌 TRẠNG THÁI */}
      <div>
        <h3>📌 Trạng Thái</h3>
        <p>
          <span style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: order.status === 'pending' ? '#ffc107' : '#28a745',
            color: 'white',
            borderRadius: '4px'
          }}>
            {order.status === 'pending' ? 'Chờ xử lý' : 'Đã giao'}
          </span>
        </p>
      </div>

      {/* GHI CHÚ */}
      {order.note && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
          <h3>📝 Ghi Chú</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{order.note}</p>
        </div>
      )}

      {/* NGÀY TẠO */}
      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        <p>Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
      </div>
    </div>
  )
}
```

---

## 🚀 Áp Dụng

**Nếu bạn dùng**:

- **React**: Copy component ở trên, dùng hàm `parseShippingAddress()`
- **Vue**: Dùng computed property để parse address
- **Angular**: Dùng pipe để format address
- **HTML/JS thuần**: Dùng JavaScript để split address

---

## ✅ Kết Quả

**Trước**:
```
Đơn hàng #7D660316
Tổng tiền: 500.000 VNĐ
(Không có địa chỉ)
```

**Sau**:
```
Đơn hàng #7D660316
📍 Địa Chỉ Giao Hàng
Tỉnh/Thành phố: TP. Hồ Chí Minh
Quận/Huyện: Quận 1
Xã/Phường: Phường Bến Thành
Địa chỉ chi tiết: Số 123 Đường Lê Lợi

💰 Tổng tiền: 500.000 VNĐ
```

---

**Bạn dùng framework nào? Tôi có thể code chi tiết hơn!** 🎉
