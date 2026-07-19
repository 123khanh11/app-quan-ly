# 🛍️ Hướng Dẫn Sử Dụng Website Bán Hàng Công Khai

## 📋 Tổng Quan

Website bán hàng này là một ứng dụng e-commerce công khai dành cho khách hàng. Nó được tích hợp với cùng database Supabase như ứng dụng quản lý, cho phép khách hàng mua sắm trực tuyến và quản lý các đơn hàng của họ.

---

## 🏗️ Kiến Trúc

```
┌──────────────────────────────────────┐
│   Website Bán Hàng Công Khai         │
│   (Customer / Khách Hàng)            │
│                                      │
│  ├─ ShopHome: Danh sách sản phẩm    │
│  ├─ Cart: Giỏ hàng & checkout      │
│  └─ OrderTracking: Theo dõi đơn      │
└──────────────────┬───────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │   Supabase Database │
         │  (products, orders) │
         └─────────────────────┘
                   ▲
                   │
┌──────────────────────────────────────┐
│   App Quản Lý (Admin)                │
│   (Quản lý đơn hàng)                 │
└──────────────────────────────────────┘
```

---

## 📂 Cấu Trúc Thư Mục

```
src/
├── app/
│   ├── components/
│   │   ├── shop/
│   │   │   ├── ShopHome.tsx          # Trang chủ cửa hàng
│   │   │   ├── Cart.tsx              # Giỏ hàng & thanh toán
│   │   │   └── OrderTracking.tsx     # Theo dõi đơn hàng
│   │   └── figma/
│   ├── context/
│   │   └── CartContext.tsx           # Quản lý giỏ hàng
│   └── App.tsx                       # Component chính
├── services/
│   └── supabase.ts                   # Kết nối & API functions
└── styles/
    └── *.css                         # CSS styling
```

---

## 🔄 Luồng Hoạt Động

### 1️⃣ Duyệt Sản Phẩm

```
ShopHome Component
    ↓
1. Load danh sách sản phẩm từ Supabase
2. Hiển thị grid sản phẩm
3. Cho phép tìm kiếm/filter
4. Hiểm thức thêm vào giỏ hàng
```

**File:** `src/app/components/shop/ShopHome.tsx`

```typescript
// Load sản phẩm
const data = await getProducts()

// Add to cart
addToCart({
  id: product.id,
  variant_id: product.id,
  name: product.name,
  price: product.price,
  quantity: 1,
  image: product.image,
})
```

### 2️⃣ Quản Lý Giỏ Hàng

```
CartContext (React Context)
    ↓
1. Lưu giỏ hàng trong localStorage
2. Quản lý thêm/xóa/cập nhật sản phẩm
3. Tính toán tổng tiền
```

**File:** `src/app/context/CartContext.tsx`

- `addToCart()` - Thêm sản phẩm
- `removeFromCart()` - Xóa sản phẩm
- `updateQuantity()` - Cập nhật số lượng
- `clearCart()` - Xóa tất cả

### 3️⃣ Thanh Toán & Tạo Đơn Hàng

```
Cart Component
    ↓
1. Khách nhập thông tin (email, phone, address)
2. Bấm "Đặt Hàng"
3. Tạo order trong Supabase
4. Thêm chi tiết sản phẩm (order_items)
5. Xóa giỏ hàng
6. Chuyển hướng tới trang tracking
```

**Code:**

```typescript
// Tạo đơn hàng
const order = await createOrder({
  total: cartTotal,
  shipping_fee: 50000,
  payment_method: 'cash',
  shipping_address: formData.address,
  note: formData.note,
  email: formData.email,
  phone: formData.phone,
})

// Thêm sản phẩm
for (const item of cartItems) {
  await addOrderItem({
    order_id: order.id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    price: item.price,
  })
}
```

### 4️⃣ Theo Dõi Đơn Hàng

```
OrderTracking Component
    ↓
1. Tìm đơn hàng từ ID
2. Hiển thị trạng thái (pending → confirmed → shipping → delivered)
3. Hiển thị chi tiết đơn hàng & sản phẩm
```

**File:** `src/app/components/shop/OrderTracking.tsx`

---

## 🔌 API Functions (Supabase)

### Tạo Đơn Hàng

```typescript
createOrder({
  total: number,              // Tổng tiền
  shipping_fee: number,       // Phí vận chuyển
  payment_method: string,     // 'cash' | 'transfer'
  shipping_address: string,   // Địa chỉ giao
  note?: string,              // Ghi chú
  email?: string,             // Email khách
  phone?: string,             // SĐT khách
})
```

### Thêm Chi Tiết Đơn Hàng

```typescript
addOrderItem({
  order_id: string,           // ID đơn hàng
  variant_id: string,         // ID sản phẩm
  quantity: number,           // Số lượng
  price: number,              // Giá
})
```

### Lấy Sản Phẩm

```typescript
// Lấy tất cả
getProducts()

// Lấy theo ID
getProductById(id)

// Tìm kiếm
searchProducts(query)
```

### Lấy Đơn Hàng

```typescript
// Lấy chi tiết đơn
getOrderDetails(orderId)
// Returns: { order, items }

// Lấy tất cả đơn
getOrders(email?)
```

---

## 💾 Database Schema

### Bảng `products`

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT,
  price NUMERIC,
  image TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Bảng `orders`

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  total NUMERIC,
  shipping_fee NUMERIC DEFAULT 50000,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  note TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Bảng `order_items`

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  variant_id UUID,
  quantity INTEGER,
  price NUMERIC
);
```

---

## 🎯 Trạng Thái Đơn Hàng

| Trạng Thái | Mô Tả |
|-----------|-------|
| `pending` | Chờ xác nhận |
| `confirmed` | Đã xác nhận |
| `shipping` | Đang giao hàng |
| `delivered` | Đã giao hàng |

---

## 🚀 Chạy Ứng Dụng

### Development

```bash
npm run dev
```

Truy cập `http://localhost:5173`

### Build

```bash
npm run build
```

---

## 📱 Các Component Chính

### ShopHome

**Props:** Không có
**State:**
- `products` - Danh sách sản phẩm
- `filteredProducts` - Sản phẩm đã filter
- `searchQuery` - Tìm kiếm
- `wishlist` - Yêu thích
- `loading` - Đang tải

**Chức năng:**
- Hiển thị danh sách sản phẩm
- Tìm kiếm
- Yêu thích (lưu vào localStorage)
- Thêm vào giỏ hàng

### CartPage

**Chức năng:**
- Hiển thị giỏ hàng
- Cập nhật số lượng
- Xóa sản phẩm
- Checkout (nhập thông tin & tạo đơn)

### OrderTracking

**Props:**
- `orderId: string` - ID đơn hàng cần tracking

**Chức năng:**
- Hiển thị timeline trạng thái
- Hiển thị thông tin đơn hàng
- Hiển thị danh sách sản phẩm
- Tính tổng tiền

---

## 🔐 Bảo Mật

### Supabase Credentials

```typescript
// src/services/supabase.ts
const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'
```

⚠️ **Lưu ý:** Anon key này là public, chỉ dùng cho các operation không nhạy cảm.

### RLS Policies

Supabase nên có RLS policies:

```sql
-- Cho phép mọi người tạo đơn hàng
CREATE POLICY "Allow all to create orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Cho phép xem đơn hàng
CREATE POLICY "Allow all to view orders"
ON orders FOR SELECT
USING (true);
```

---

## 🐛 Troubleshooting

### Không load được sản phẩm

1. Kiểm tra Supabase connection
2. Kiểm tra bảng `products` có dữ liệu không
3. Kiểm tra RLS policies

### Checkout bị lỗi

1. Kiểm tra form data đã valid
2. Kiểm tra Supabase có lỗi gì
3. Mở browser console để xem chi tiết lỗi

### Giỏ hàng không lưu

1. Kiểm tra localStorage có available
2. Kiểm tra browser console

---

## 📊 Thống Kê & Monitoring

Để theo dõi các đơn hàng:

1. **Dashboard Admin:** Xem tất cả đơn hàng
2. **Database:** Query trực tiếp Supabase
3. **Browser Console:** Xem logs

---

## 🔄 Tích Hợp với App Quản Lý

Cả hai ứng dụng cùng dùng:
- Database: `https://edtxexnhpbipcecceoop.supabase.co`
- Tables: `products`, `orders`, `order_items`

**Luồng:**
```
Website Bán Hàng:
  1. Khách tạo đơn hàng
  2. Data lưu vào database
  3. Order status = 'pending'

App Quản Lý:
  1. Xem đơn hàng pending
  2. Xác nhận → status = 'confirmed'
  3. Cập nhật shipping → status = 'shipping'
  4. Delivered → status = 'delivered'

Website Bán Hàng:
  1. Khách vào tracking
  2. Thấy status được cập nhật realtime
```

---

## 📝 Notes

- Giỏ hàng lưu trong `localStorage` (client-side)
- Phí vận chuyển: 50,000đ cố định
- Phương thức thanh toán: Tiền mặt (default)
- Wishlist lưu trong `localStorage`

---

## ✨ Tính Năng Có Thể Thêm

- [ ] Đăng nhập/Đăng ký khách hàng
- [ ] Theo dõi nhiều đơn hàng
- [ ] Tích hợp thanh toán trực tuyến
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Review & rating sản phẩm
- [ ] Voucher/Coupon codes
- [ ] Shipping address book
- [ ] Order history

---

**Tài liệu này được cập nhật vào: 19/07/2026**
