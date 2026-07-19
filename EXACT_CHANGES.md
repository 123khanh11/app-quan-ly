# 📝 EXACT CHANGES - Line by Line

## 1. src/services/supabase.ts

### Change 1: CartItem Interface
```typescript
// BEFORE (❌)
export interface CartItem {
  id: string
  variant_id: string        // ← REMOVED
  name: string
  price: number
  quantity: number
  image?: string            // ← CHANGED
}

// AFTER (✅)
export interface CartItem {
  id: string
  product_id: string        // ← ADDED
  name: string
  price: number
  quantity: number
  image_url?: string        // ← RENAMED
}
```

---

## 2. src/app/context/CartContext.tsx

### Change 1: Interface Definition
```typescript
// BEFORE (❌)
interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (variantId: string) => void         // ← CHANGED
  updateQuantity: (variantId: string, quantity: number) => void  // ← CHANGED
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

// AFTER (✅)
interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void         // ← UPDATED
  updateQuantity: (productId: string, quantity: number) => void  // ← UPDATED
  clearCart: () => void
  cartTotal: number
  cartCount: number
}
```

### Change 2: addToCart Function
```typescript
// BEFORE (❌)
const addToCart = (item: CartItem) => {
  setCartItems((prevItems) => {
    const existingItem = prevItems.find((i) => i.variant_id === item.variant_id)
    if (existingItem) {
      return prevItems.map((i) =>
        i.variant_id === item.variant_id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    }
    return [...prevItems, item]
  })
}

// AFTER (✅)
const addToCart = (item: CartItem) => {
  setCartItems((prevItems) => {
    const existingItem = prevItems.find((i) => i.product_id === item.product_id)
    if (existingItem) {
      return prevItems.map((i) =>
        i.product_id === item.product_id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    }
    return [...prevItems, item]
  })
}
```

### Change 3: removeFromCart Function
```typescript
// BEFORE (❌)
const removeFromCart = (variantId: string) => {
  setCartItems((prevItems) => prevItems.filter((i) => i.variant_id !== variantId))
}

// AFTER (✅)
const removeFromCart = (productId: string) => {
  setCartItems((prevItems) => prevItems.filter((i) => i.product_id !== productId))
}
```

### Change 4: updateQuantity Function
```typescript
// BEFORE (❌)
const updateQuantity = (variantId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(variantId)
    return
  }
  setCartItems((prevItems) =>
    prevItems.map((i) =>
      i.variant_id === variantId ? { ...i, quantity } : i
    )
  )
}

// AFTER (✅)
const updateQuantity = (productId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }
  setCartItems((prevItems) =>
    prevItems.map((i) =>
      i.product_id === productId ? { ...i, quantity } : i
    )
  )
}
```

---

## 3. src/app/components/shop/ShopHome.tsx

### Change: handleAddToCart Function
```typescript
// BEFORE (❌)
const handleAddToCart = (product: Product) => {
  addToCart({
    id: product.id,
    variant_id: product.id,           // ← WRONG FIELD
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image_url,         // ← WRONG FIELD NAME
  })
  alert('✅ Đã thêm vào giỏ hàng!')
}

// AFTER (✅)
const handleAddToCart = (product: Product) => {
  addToCart({
    id: product.id,
    product_id: product.id,           // ← CORRECT FIELD
    name: product.name,
    price: product.price,
    quantity: 1,
    image_url: product.image_url,     // ← CORRECT FIELD NAME
  })
  alert('✅ Đã thêm vào giỏ hàng!')
}
```

---

## 4. src/app/components/shop/Cart.tsx

### Change 1: Cart Table - Map Loop
```typescript
// BEFORE (❌)
{cartItems.map((item) => (
  <tr key={item.variant_id} className="...">      // ← WRONG ID
    <td className="...">
      <div className="...">
        {item.image && (                          // ← WRONG FIELD
          <img
            src={item.image}                      // ← WRONG FIELD
            alt={item.name}
            className="..."
          />
        )}
        <div>
          <p className="...">{item.name}</p>
          <p className="...">ID: {item.variant_id}</p>  // ← WRONG ID
        </div>
      </div>
    </td>
    <td>
      <button
        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}  // ← WRONG ID
      >
    </button>
    <button
      onClick={() => removeFromCart(item.variant_id)}  // ← WRONG ID
    >

// AFTER (✅)
{cartItems.map((item) => (
  <tr key={item.product_id} className="...">      // ← CORRECT ID
    <td className="...">
      <div className="...">
        {item.image_url && (                       // ← CORRECT FIELD
          <img
            src={item.image_url}                   // ← CORRECT FIELD
            alt={item.name}
            className="..."
          />
        )}
        <div>
          <p className="...">{item.name}</p>
          <p className="...">ID: {item.product_id}</p>  // ← CORRECT ID
        </div>
      </div>
    </td>
    <td>
      <button
        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}  // ← CORRECT ID
      >
    </button>
    <button
      onClick={() => removeFromCart(item.product_id)}  // ← CORRECT ID
    >
```

### Change 2: Checkout Form - handleSubmit
```typescript
// BEFORE (❌)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const { createOrder, addOrderItem } = await import('@/services/supabase')

    // Create order with WRONG fields
    const order = await createOrder({
      total: cartTotal,                    // ❌ WRONG
      shipping_fee: 50000,                 // ❌ WRONG
      payment_method: 'cash',              // ❌ WRONG
      shipping_address: formData.address,  // ❌ WRONG
      note: formData.note,                 // ❌ WRONG
      email: formData.email,               // ❌ WRONG FIELD NAME
      phone: formData.phone,               // ❌ WRONG FIELD NAME
    })

    // Add items with WRONG field
    for (const item of cartItems) {
      await addOrderItem({
        order_id: order.id,
        variant_id: item.variant_id,       // ❌ WRONG
        quantity: item.quantity,
        price: item.price,
      })
    }

    clearCart()
    alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: ${order.id}\n\n...`)  // ❌ WRONG ID
    window.location.href = `/order/${order.id}`
  } catch (error) {
    ...
  } finally {
    setLoading(false)
  }
}

// AFTER (✅)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const { createOrder, addOrderItem } = await import('@/services/supabase')

    // Create order with CORRECT fields
    const order = await createOrder({
      customer_name: formData.email.split('@')[0],        // ✅ CORRECT
      customer_email: formData.email,                     // ✅ CORRECT
      customer_phone: formData.phone,                     // ✅ CORRECT
      total_amount: cartTotal + SHIPPING_FEE,            // ✅ CORRECT
    })

    // Add items with CORRECT field
    for (const item of cartItems) {
      await addOrderItem({
        order_id: order.id,
        product_id: item.product_id,       // ✅ CORRECT
        quantity: item.quantity,
        price: item.price,
      })
    }

    clearCart()
    alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: ${order.order_number}\n\n...`)  // ✅ CORRECT
    window.location.href = `/order/${order.id}`
  } catch (error) {
    ...
  } finally {
    setLoading(false)
  }
}
```

---

## 5. src/app/components/shop/OrderTracking.tsx

### Change 1: STATUS_STEPS
```typescript
// BEFORE (❌)
const STATUS_STEPS = [
  { key: 'pending', label: 'Chờ Xác Nhận', icon: Clock },
  { key: 'confirmed', label: 'Đã Xác Nhận', icon: CheckCircle2 },        // ❌ WRONG STATUS
  { key: 'shipping', label: 'Đang Giao Hàng', icon: Truck },              // ❌ WRONG STATUS
  { key: 'delivered', label: 'Đã Giao Hàng', icon: CheckCircle2 },
]

// AFTER (✅)
const STATUS_STEPS = [
  { key: 'pending', label: 'Chờ Xác Nhận', icon: Clock },
  { key: 'processing', label: 'Đang Xử Lý', icon: CheckCircle2 },        // ✅ CORRECT STATUS
  { key: 'shipped', label: 'Đang Giao Hàng', icon: Truck },              // ✅ CORRECT STATUS
  { key: 'delivered', label: 'Đã Giao Hàng', icon: CheckCircle2 },
]
```

### Change 2: Order Details Section
```typescript
// BEFORE (❌)
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-bold mb-4">Chi Tiết Đơn Hàng</h3>
  <div className="space-y-3">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Ngày Đặt:</span>
      <span className="font-semibold">
        {new Date(order.created_at).toLocaleDateString('vi-VN')}
      </span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Trạng Thái Thanh Toán:</span>
      <span className={`font-semibold ${
        order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'  // ❌ FIELD NOT EXIST
      }`}>
        {order.payment_status === 'paid' ? '✅ Đã Thanh Toán' : '⏳ Chờ Thanh Toán'}  // ❌
      </span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Phương Thức Thanh Toán:</span>
      <span className="font-semibold">
        {order.payment_method === 'cash' ? 'Tiền Mặt' : 'Chuyển Khoản'}  // ❌ FIELD NOT EXIST
      </span>
    </div>
  </div>
</div>

// AFTER (✅)
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-bold mb-4">Chi Tiết Đơn Hàng</h3>
  <div className="space-y-3">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Mã Đơn:</span>
      <span className="font-semibold font-mono">{order.order_number}</span>  // ✅ ADDED
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Ngày Đặt:</span>
      <span className="font-semibold">
        {new Date(order.created_at).toLocaleDateString('vi-VN')}
      </span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Trạng Thái:</span>
      <span className={`font-semibold ${
        order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'  // ✅ CORRECT FIELD
      }`}>
        {order.status === 'pending' && '⏳ Chờ Xác Nhận'}                    // ✅ CORRECT
        {order.status === 'processing' && '📦 Đang Xử Lý'}                  // ✅ CORRECT
        {order.status === 'shipped' && '🚚 Đang Giao Hàng'}                 // ✅ CORRECT
        {order.status === 'delivered' && '✅ Đã Giao Hàng'}                 // ✅ CORRECT
      </span>
    </div>
  </div>
</div>
```

### Change 3: Shipping Address Section
```typescript
// BEFORE (❌)
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
    <MapPin size={20} className="text-primary" />
    Địa Chỉ Giao Hàng
  </h3>
  <div className="space-y-2 text-sm">
    {order.email && (                      // ❌ FIELD NOT EXIST
      <div>
        <p className="text-muted-foreground">Email:</p>
        <p className="font-semibold">{order.email}</p>
      </div>
    )}
    {order.phone && (                      // ❌ FIELD NOT EXIST
      <div>
        <p className="text-muted-foreground">Số Điện Thoại:</p>
        <p className="font-semibold">{order.phone}</p>
      </div>
    )}
    <div>
      <p className="text-muted-foreground">Địa Chỉ:</p>
      <p className="font-semibold">{order.shipping_address}</p>  // ❌ FIELD NOT EXIST
    </div>
    {order.note && (                       // ❌ FIELD NOT EXIST
      <div>
        <p className="text-muted-foreground">Ghi Chú:</p>
        <p className="font-semibold">{order.note}</p>
      </div>
    )}
  </div>
</div>

// AFTER (✅)
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
    <MapPin size={20} className="text-primary" />
    Thông Tin Khách Hàng
  </h3>
  <div className="space-y-2 text-sm">
    {order.customer_name && (              // ✅ CORRECT FIELD
      <div>
        <p className="text-muted-foreground">Tên Khách:</p>
        <p className="font-semibold">{order.customer_name}</p>
      </div>
    )}
    {order.customer_email && (             // ✅ CORRECT FIELD
      <div>
        <p className="text-muted-foreground">Email:</p>
        <p className="font-semibold">{order.customer_email}</p>
      </div>
    )}
    {order.customer_phone && (             // ✅ CORRECT FIELD
      <div>
        <p className="text-muted-foreground">Số Điện Thoại:</p>
        <p className="font-semibold">{order.customer_phone}</p>
      </div>
    )}
  </div>
</div>
```

### Change 4: Order Items Table
```typescript
// BEFORE (❌)
<tr key={item.id} className="hover:bg-muted/30 transition-colors">
  <td className="px-6 py-4 text-sm font-mono">{item.variant_id}</td>  // ❌ WRONG FIELD
  ...
</tr>

// AFTER (✅)
<tr key={item.id} className="hover:bg-muted/30 transition-colors">
  <td className="px-6 py-4 text-sm font-mono">{item.product_id}</td>  // ✅ CORRECT FIELD
  ...
</tr>
```

### Change 5: Order Summary
```typescript
// BEFORE (❌)
<div className="border-t border-border px-6 py-4 space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Tạm Tính:</span>
    <span className="font-semibold">{(order.total - order.shipping_fee).toLocaleString('vi-VN')}đ</span>  // ❌ WRONG
  </div>
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Phí Vận Chuyển:</span>
    <span className="font-semibold">{order.shipping_fee.toLocaleString('vi-VN')}đ</span>  // ❌ FIELD NOT EXIST
  </div>
  <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
    <span>Tổng Cộng:</span>
    <span className="text-primary">{order.total.toLocaleString('vi-VN')}đ</span>  // ❌ FIELD NOT EXIST
  </div>
</div>

// AFTER (✅)
<div className="border-t border-border px-6 py-4 space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Tổng Tiền:</span>
    <span className="font-semibold">{order.total_amount.toLocaleString('vi-VN')}đ</span>  // ✅ CORRECT
  </div>
  <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
    <span>Cần Thanh Toán:</span>
    <span className="text-primary">{order.total_amount.toLocaleString('vi-VN')}đ</span>  // ✅ CORRECT
  </div>
</div>
```

---

## Summary

**Total Changes**: 
- 5 files modified
- ~20 field name corrections
- ~15 type updates
- All focused on aligning code with actual database schema

**Build Result**: ✅ Success
