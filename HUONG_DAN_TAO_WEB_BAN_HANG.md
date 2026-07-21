# 🛍️ Hướng Dẫn Tạo Web Bán Hàng Công Khai & Liên Kết

## 🎯 Mục Tiêu

Bạn sẽ có:
- **Website Bán Hàng** (Customer) - Khách hàng mua sắm
- **App Quản Lý** (Admin) - Quản lý đơn hàng
- **Cùng Database** - Dữ liệu đồng bộ

---

## 📊 KIẾN TRÚC

```
┌─────────────────┐         ┌──────────────────┐
│  Website Bán    │         │  App Quản Lý     │
│  Hàng Công Khai │         │  (Current App)   │
│  (Khách Hàng)   │         │  (Nhân Viên)     │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │      ┌──────────────┐     │
         └─────→│   Supabase   │←────┘
                │   Database   │
                └──────────────┘
```

---

## 🚀 BƯỚC 1: TẠO WEB BÁN HÀNG (Next.js/React)

### Option A: Dùng Next.js (Khuyến nghị)

```bash
npx create-next-app@latest shop-web
cd shop-web
npm install @supabase/supabase-js
```

### Option B: Dùng React

```bash
npx create-react-app shop-web
cd shop-web
npm install @supabase/supabase-js
```

---

## 📁 CẤU TRÚC PAGES

**Website Bán Hàng cần có:**

```
shop-web/
├── pages/
│   ├── index.js           (Trang chủ - Hiển thị sản phẩm)
│   ├── products/          (Danh sách sản phẩm)
│   ├── product/[id].js    (Chi tiết sản phẩm)
│   ├── cart.js            (Giỏ hàng)
│   ├── checkout.js        (Thanh toán)
│   ├── orders.js          (Đơn hàng của tôi)
│   └── auth/              (Đăng nhập/Đăng ký)
└── lib/
    └── supabase.js        (Kết nối Supabase)
```

---

## 🔌 BƯỚC 2: KẾT NỐI SUPABASE

### File: `lib/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://edtxexnhpbipcecceoop.supabase.co'
const supabaseAnonKey = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 📱 BƯỚC 3: MAIN PAGES

### 1. Trang Chủ - Hiển Thị Sản Phẩm

**`pages/index.js`:**

```javascript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)

    setProducts(data || [])
  }

  return (
    <div>
      <h1>🛍️ Cửa Hàng Bán Hàng</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Giá: {product.price.toLocaleString()} đ</p>
            <p>{product.description}</p>
            <Link href={`/product/${product.id}`}>
              <a className="btn">Xem Chi Tiết</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 2. Chi Tiết Sản Phẩm

**`pages/product/[id].js`:**

```javascript
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    setProduct(data)
  }

  const addToCart = () => {
    // Lưu vào localStorage hoặc state management
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('✅ Thêm vào giỏ hàng thành công!')
    router.push('/cart')
  }

  if (!product) return <p>Đang tải...</p>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Giá: {product.price.toLocaleString()} đ</p>
      <p>{product.description}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min="1"
      />
      <button onClick={addToCart}>🛒 Thêm Vào Giỏ Hàng</button>
    </div>
  )
}
```

### 3. Giỏ Hàng

**`pages/cart.js`:**

```javascript
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }, [])

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div>
      <h1>🛒 Giỏ Hàng</h1>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Sản Phẩm</th>
                <th>Giá</th>
                <th>Số Lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Tổng Cộng: {total.toLocaleString()} đ</h3>
          <Link href="/checkout">
            <a className="btn btn-primary">Thanh Toán</a>
          </Link>
        </>
      )}
    </div>
  )
}
```

### 4. Thanh Toán - Tạo Đơn Hàng

**`pages/checkout.js`:**

```javascript
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Checkout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    note: ''
  })

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      // 1. Tạo đơn hàng
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: null, // Nếu khách hàng chưa đăng nhập
          total: total,
          shipping_fee: 50000,
          payment_method: 'cash',
          payment_status: 'pending',
          order_status: 'pending',
          shipping_address: formData.address,
          note: formData.note
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Thêm chi tiết đơn hàng
      for (const item of cartItems) {
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            variant_id: item.id,
            quantity: item.quantity,
            price: item.price
          })
      }

      // 3. Xóa giỏ hàng
      localStorage.removeItem('cart')

      alert('✅ Đơn hàng được tạo thành công! Mã: ' + order.id)
      router.push(`/order/${order.id}`)

    } catch (error) {
      alert('❌ Lỗi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>💳 Thanh Toán</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
        <textarea
          placeholder="Địa chỉ giao hàng"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
        />
        <textarea
          placeholder="Ghi chú"
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : '✅ Đặt Hàng'}
        </button>
      </form>
    </div>
  )
}
```

---

## 🔄 BƯỚC 4: LIÊN KẾT VỚI APP QUẢN LÝ

### Cùng Supabase Database

**Cả hai ứng dụng dùng:**
- URL: `https://edtxexnhpbipcecceoop.supabase.co`
- Key: `sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7`

### Dữ liệu Đồng Bộ

```
Website Bán Hàng          App Quản Lý
  (Customer)               (Admin)
     |                         |
     └─→ Tạo đơn hàng ←────────┘
         ↓
      Database
         ↓
     ← Cập nhật ←
     trạng thái
```

---

## 📊 FLOW HOÀN CHỈNH

```
1. Khách Hàng Vào Website
   ↓
2. Duyệt & Chọn Sản Phẩm
   ↓
3. Thêm Vào Giỏ Hàng
   ↓
4. Thanh Toán
   ↓
5. Tạo Đơn Hàng (Save vào Database)
   ↓
6. Nhân Viên Xem Trong App Quản Lý
   ↓
7. Cập Nhật Trạng Thái "Đang Giao"
   ↓
8. Khách Hàng Xem "Đang Giao" Trên Website
```

---

## 🚀 DEPLOY WEBSITE

### Dùng Vercel (Giống App Quản Lý)

```bash
# 1. Push lên GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy lên Vercel
vercel deploy --prod
```

### Kết Quả

```
Website Bán Hàng: https://shop-web.vercel.app
App Quản Lý:      https://appmanagement-dwvarzq1p-quanly1.vercel.app
```

---

## 📱 OPTIONAL: CUSTOM DOMAIN

Nếu bạn có domain riêng:

```
domain.com          → Website bán hàng
admin.domain.com    → App quản lý
```

Cấu hình trong Vercel:
1. Settings → Domains
2. Thêm domain chính
3. Thêm subdomain `admin`

---

## ✨ SUMMARY

**Bạn sẽ có 2 ứng dụng:**

| | Website Bán Hàng | App Quản Lý |
|---|---|---|
| URL | shop-web.vercel.app | appmanagement...vercel.app |
| Người Dùng | Khách Hàng | Nhân Viên/Quản Lý |
| Chức Năng | Mua Sắm | Quản Lý Đơn |
| Database | Chung (Supabase) | Chung (Supabase) |

---

## 🎯 TIẾP THEO

1. **Tạo React/Next.js project mới**
2. **Sao chép code trên**
3. **Kết nối Supabase**
4. **Deploy lên Vercel**
5. **Liên kết với App Quản Lý**

---

**Bạn đã sẵn sàng tạo website bán hàng công khai! 🚀**
