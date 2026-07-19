# 🛍️ E-Commerce Website Bán Hàng Công Khai

Website bán hàng trực tuyến hiện đại, dành cho khách hàng mua sắm. Được xây dựng với React, TypeScript, Tailwind CSS và tích hợp với Supabase.

---

## ⭐ Tính Năng

### 🏪 Cửa Hàng
- ✅ Danh sách sản phẩm động từ database
- ✅ Tìm kiếm & filter sản phẩm
- ✅ Responsive design (desktop, tablet, mobile)

### 🛒 Giỏ Hàng
- ✅ Lưu giỏ hàng persistent (localStorage)
- ✅ Thêm/xóa/cập nhật sản phẩm
- ✅ Tính toán tổng tiền tự động
- ✅ Hiển thị số sản phẩm trong giỏ

### 💳 Thanh Toán
- ✅ Form checkout với xác thực
- ✅ Tạo đơn hàng tự động
- ✅ Lưu thông tin khách hàng (email, phone, address)
- ✅ Ghi chú đơn hàng

### 📦 Theo Dõi Đơn
- ✅ Timeline trạng thái (pending → confirmed → shipping → delivered)
- ✅ Hiển thị thông tin giao hàng
- ✅ Danh sách sản phẩm đã đặt
- ✅ Tóm tắt tài chính đơn hàng

### 💖 Yêu Thích
- ✅ Lưu yêu thích (wishlist) trong localStorage
- ✅ Hiệu ứng visual khi thêm yêu thích

---

## 🛠️ Tech Stack

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | Latest | Type Safety |
| Vite | 6.3.5 | Build Tool |
| Tailwind CSS | 4.1.12 | Styling |
| Radix UI | Latest | UI Components |
| Lucide React | 0.487.0 | Icons |
| Supabase | Latest | Backend/Database |

---

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js >= 18
- npm hoặc pnpm

### Bước 1: Clone/Download

```bash
# Nếu sử dụng Git
git clone <repository-url>
cd E-commerce\ website\ interface

# Hoặc extract ZIP file
```

### Bước 2: Cài Dependencies

```bash
npm install
# hoặc
pnpm install
```

### Bước 3: Chạy Development Server

```bash
npm run dev
```

Truy cập: **http://localhost:5173**

### Bước 4: Build untuk Production

```bash
npm run build
```

---

## 📁 Cấu Trúc Dự Án

```
src/
├── app/
│   ├── components/
│   │   ├── shop/
│   │   │   ├── ShopHome.tsx          # Trang chủ - Danh sách sản phẩm
│   │   │   ├── Cart.tsx              # Giỏ hàng & thanh toán
│   │   │   └── OrderTracking.tsx     # Theo dõi đơn hàng
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/                        # shadcn/ui components
│   ├── context/
│   │   └── CartContext.tsx           # React Context cho giỏ hàng
│   └── App.tsx                       # Main app component
├── services/
│   └── supabase.ts                   # Supabase client & API functions
├── styles/
│   ├── globals.css
│   ├── index.css
│   └── tailwind.css
└── main.tsx
```

---

## 🔌 API Functions

### Import

```typescript
import {
  getProducts,
  getProductById,
  searchProducts,
  createOrder,
  addOrderItem,
  getOrderDetails,
  getOrders,
} from '@/services/supabase'
```

### Sản Phẩm

```typescript
// Lấy tất cả sản phẩm active
const products = await getProducts()

// Lấy sản phẩm theo ID
const product = await getProductById('product-id')

// Tìm kiếm sản phẩm
const results = await searchProducts('áo')
```

### Đơn Hàng

```typescript
// Tạo đơn hàng
const order = await createOrder({
  total: 500000,
  shipping_fee: 50000,
  payment_method: 'cash',
  shipping_address: '123 Đường ABC, TP.HCM',
  note: 'Giao vào buổi tối',
  email: 'customer@example.com',
  phone: '0123456789',
})

// Thêm sản phẩm vào đơn
await addOrderItem({
  order_id: order.id,
  variant_id: 'product-1',
  quantity: 2,
  price: 250000,
})

// Lấy chi tiết đơn
const { order, items } = await getOrderDetails(orderId)

// Lấy tất cả đơn
const allOrders = await getOrders('email@example.com')
```

---

## 🎯 Cart Context API

```typescript
import { useCart } from '@/app/context/CartContext'

function MyComponent() {
  const {
    // State
    cartItems,      // CartItem[] - Các sản phẩm trong giỏ
    cartTotal,      // number - Tổng tiền sản phẩm
    cartCount,      // number - Tổng số sản phẩm
    
    // Methods
    addToCart,      // (item: CartItem) => void
    removeFromCart, // (variantId: string) => void
    updateQuantity, // (variantId: string, qty: number) => void
    clearCart,      // () => void
  } = useCart()

  return (
    // Component JSX
  )
}
```

---

## 🎨 UI Components

### ShopHome
Trang chủ hiển thị danh sách sản phẩm

```tsx
<ShopHome />
```

Props: Không có

### CartPage
Hiển thị giỏ hàng và form checkout

```tsx
<CartPage />
```

Props: Không có

### OrderTrackingPage
Theo dõi đơn hàng theo ID

```tsx
<OrderTrackingPage orderId="order-uuid" />
```

Props:
- `orderId: string` - UUID của đơn hàng

---

## 💾 Supabase Database

### Tables Structure

#### `products`
```sql
id          UUID PRIMARY KEY
name        TEXT
price       NUMERIC
image       TEXT
description TEXT
active      BOOLEAN DEFAULT true
created_at  TIMESTAMP
```

#### `orders`
```sql
id                  UUID PRIMARY KEY
user_id             UUID (optional)
total               NUMERIC
shipping_fee        NUMERIC
payment_method      TEXT ('cash', 'transfer')
payment_status      TEXT ('pending', 'paid')
order_status        TEXT ('pending', 'confirmed', 'shipping', 'delivered')
shipping_address    TEXT
note                TEXT
email               TEXT
phone               TEXT
created_at          TIMESTAMP
```

#### `order_items`
```sql
id          UUID PRIMARY KEY
order_id    UUID REFERENCES orders(id)
variant_id  UUID
quantity    INTEGER
price       NUMERIC
```

---

## 🔐 Supabase Connection

```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

⚠️ Để security, nên dùng environment variables thay vì hardcode.

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

### GitHub Pages

```bash
npm run build
# Upload dist folder
```

---

## 📱 Responsive Design

Website tự động responsive cho:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

Test: F12 → Toggle Device Toolbar

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```
VITE_SUPABASE_URL=https://edtxexnhpbipcecceoop.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Vite Config

File: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindPlugin from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindPlugin()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

---

## 🎯 Use Cases

### 1. Khách hàng mua sắm

```
1. Vào website
2. Duyệt sản phẩm
3. Thêm vào giỏ
4. Checkout
5. Đặt hàng
```

### 2. Admin quản lý

Dùng ứng dụng quản lý riêng:
- Xem đơn hàng
- Cập nhật trạng thái
- Quản lý sản phẩm

### 3. Theo dõi đơn

Khách có thể:
- Vào tracking page
- Nhập order ID
- Xem realtime status

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module @/services/supabase"

**Giải pháp:**
1. Kiểm tra file tồn tại: `src/services/supabase.ts`
2. Kiểm tra `vite.config.ts` có alias `@` không
3. Restart dev server: `npm run dev`

### Lỗi: "Supabase connection failed"

**Giải pháp:**
1. Kiểm tra internet connection
2. Kiểm tra Supabase credentials đúng
3. Kiểm tra Supabase project online
4. Check browser console for details

### Lỗi: "localStorage is not defined"

**Giải pháp:**
- Đây là warning từ server-side rendering
- Client-side hoạt động bình thường
- Có thể bỏ qua

### Giỏ hàng không lưu

**Giải pháp:**
1. Kiểm tra Private/Incognito mode
2. Kiểm tra localStorage enabled
3. Check browser storage limits

---

## 📊 Performance Tips

1. **Lazy Load Images**
   ```tsx
   <img loading="lazy" src={url} />
   ```

2. **Minimize API Calls**
   - Dùng caching
   - Batch requests

3. **Code Splitting**
   - Vite tự động split
   - Dynamic imports

4. **Monitor Bundle Size**
   ```bash
   npm run build -- --visualizer
   ```

---

## 🔄 Tích Hợp với App Quản Lý

### Kiến Trúc
```
Website Bán Hàng ─┐
                  │
App Quản Lý ──────┤─→ Supabase Database
                  │
Admin Dashboard ──┘
```

### Luồng Dữ Liệu
1. Khách tạo đơn hàng (website) → Insert orders table
2. Admin xem đơn (app) → Query orders table
3. Admin cập nhật status → Update orders table
4. Khách tracking (website) → Query updated order

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Vite Docs:** https://vitejs.dev
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

## 📖 Documentation

- `QUICK_START.md` - Quick reference
- `SHOP_GUIDE.md` - Detailed guide
- `DEPLOYMENT_GUIDE.md` - Deployment steps
- `.env.example` - Environment variables template

---

## 🤝 Support

Gặp vấn đề?

1. Kiểm tra documentation
2. Xem browser console
3. Xem Supabase logs
4. Xem Vite build errors

---

## 📝 License

MIT License - Feel free to use for personal or commercial projects

---

## ✨ Roadmap

Tính năng có thể thêm:
- [ ] User authentication
- [ ] Order history dashboard
- [ ] Product reviews & ratings
- [ ] Coupon/voucher system
- [ ] Payment integration (Stripe, Momo, VNPay)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Inventory management
- [ ] Product variants (size, color)
- [ ] Wishlist sharing
- [ ] Social login

---

## 🎉 Getting Started

```bash
# 1. Install
npm install

# 2. Run
npm run dev

# 3. Open
http://localhost:5173

# 4. Build
npm run build

# 5. Deploy
vercel
```

---

**Version:** 1.0.0  
**Last Updated:** July 19, 2026  
**Status:** Production Ready ✅

Happy Shopping! 🛍️
