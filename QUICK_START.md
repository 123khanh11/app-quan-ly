# ⚡ Quick Start - Website Bán Hàng

## 🎯 Trong 5 Phút

### 1. Chạy Local

```bash
npm install
npm run dev
```

Truy cập: `http://localhost:5173`

### 2. Thử Tính Năng

- **Trang Chủ:** Xem danh sách sản phẩm
- **Tìm Kiếm:** Dùng search box
- **Yêu Thích:** Click ❤️ trên sản phẩm
- **Giỏ Hàng:** Click 🛒 thêm vào giỏ
- **Thanh Toán:** Click giỏ hàng → nhập info → Đặt hàng
- **Tracking:** Xem trạng thái đơn hàng

---

## 📁 File Quan Trọng

| File | Mục Đích |
|------|---------|
| `src/services/supabase.ts` | API functions |
| `src/app/context/CartContext.tsx` | Quản lý giỏ hàng |
| `src/app/components/shop/ShopHome.tsx` | Trang chủ |
| `src/app/components/shop/Cart.tsx` | Giỏ hàng |
| `src/app/components/shop/OrderTracking.tsx` | Tracking |
| `src/app/App.tsx` | Routing/Navigation |

---

## 🔌 API Functions

### Lấy Sản Phẩm
```typescript
import { getProducts } from '@/services/supabase'
const products = await getProducts()
```

### Tạo Đơn Hàng
```typescript
import { createOrder, addOrderItem } from '@/services/supabase'

const order = await createOrder({
  total: 500000,
  shipping_fee: 50000,
  payment_method: 'cash',
  shipping_address: '123 Đường ABC',
})

await addOrderItem({
  order_id: order.id,
  variant_id: 'product-1',
  quantity: 2,
  price: 250000,
})
```

### Lấy Đơn Hàng
```typescript
import { getOrderDetails } from '@/services/supabase'

const { order, items } = await getOrderDetails(orderId)
```

---

## 🛒 Cart Context

```typescript
import { useCart } from '@/app/context/CartContext'

function MyComponent() {
  const { 
    cartItems,      // Mảng sản phẩm
    addToCart,      // Thêm
    removeFromCart, // Xóa
    updateQuantity, // Cập nhật
    clearCart,      // Xóa tất
    cartTotal,      // Tổng tiền
    cartCount,      // Số sản phẩm
  } = useCart()
}
```

---

## 🌍 Deploy Trên Vercel

```bash
# 1. Push lên GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy
npm install -g vercel
vercel

# Vercel tự động deploy sau này khi push
```

**URL:** `https://yourproject.vercel.app`

---

## 📊 Database

### Supabase Tables

```
products
├── id (UUID)
├── name (TEXT)
├── price (NUMERIC)
├── image (TEXT)
├── description (TEXT)
└── active (BOOLEAN)

orders
├── id (UUID)
├── total (NUMERIC)
├── order_status (TEXT)
├── payment_status (TEXT)
├── shipping_address (TEXT)
├── email (TEXT)
├── phone (TEXT)
└── created_at (TIMESTAMP)

order_items
├── id (UUID)
├── order_id (FK)
├── variant_id (TEXT)
├── quantity (INTEGER)
└── price (NUMERIC)
```

---

## 🎨 Customize

### Thay Đổi Logo

```typescript
// src/app/App.tsx
<span className="text-xl font-extrabold">
  Your Shop<span className="text-primary"> Name</span>
</span>
```

### Thay Đổi Màu

Edit `default_shadcn_theme.css` hoặc `tailwind.css`

### Thêm Sản Phẩm

Insert vào table `products` trong Supabase

---

## ❌ Lỗi Thường Gặp

### "Cannot find module '@/services/supabase'"
- Kiểm tra alias trong `vite.config.ts`
- Kiểm tra file có tồn tại

### "Supabase connection failed"
- Kiểm tra SUPABASE_URL đúng
- Kiểm tra SUPABASE_ANON_KEY đúng
- Kiểm tra network

### "localStorage is not defined"
- Error này ở server-side (không quan trọng)
- Client-side hoạt động bình thường

---

## 📚 Tài Liệu Thêm

- **Hướng dẫn Chi Tiết:** `SHOP_GUIDE.md`
- **Deployment:** `DEPLOYMENT_GUIDE.md`
- **Architecture:** `guidelines/Guidelines.md`

---

## ✨ Tính Năng Chính

✅ Danh sách sản phẩm  
✅ Tìm kiếm & filter  
✅ Yêu thích (wishlist)  
✅ Giỏ hàng persistent  
✅ Checkout form  
✅ Tạo đơn hàng  
✅ Theo dõi đơn hàng  
✅ Timeline trạng thái  
✅ Responsive design  
✅ Database Supabase  

---

## 🚀 Next Steps

1. **Test Local** → npm run dev
2. **Add Products** → Insert vào Supabase
3. **Test Checkout** → Tạo đơn test
4. **Deploy** → Push lên GitHub + Vercel
5. **Monitor** → Check logs & analytics

---

**Happy Coding! 🎉**
