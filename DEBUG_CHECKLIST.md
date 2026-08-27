# 🔍 Quick Debug Checklist

## Before Testing

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor:
-- Verify order_items table exists
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'order_items';

-- Should return 1 row. If 0 rows, run:
-- scripts/create-order-items-table.sql
```

### 2. Required Files Created
- [ ] `src/app/api/orders/route.ts` ✅ API endpoint for order creation
- [ ] `src/app/admin/orders/page.tsx` ✅ Admin orders page
- [ ] `src/app/admin/layout.tsx` ✅ Admin layout
- [ ] `scripts/create-order-items-table.sql` ✅ SQL schema

### 3. Code Changes Made
- [ ] `src/app/components/checkout/CheckoutForm.tsx` - Updated to use `/api/orders` endpoint
- [ ] `src/app/context/CartContext.tsx` - Added `variant_id` to CartItem interface
- [ ] `src/app/components/shop/ProductDetailModal.tsx` - Pass `variant_id` when adding to cart
- [ ] `src/services/supabase.ts` - Updated functions for getAllOrders()

---

## During Testing

### Console Logs to Look For

**Successful Checkout:**
```
📝 Preparing order data...
📦 Order items prepared: 1
✅ Order created successfully: abc123...
✅ Items saved: 1
```

**Failed Checkout:**
```
❌ Checkout error: [ERROR_MESSAGE]
```

---

## Data Flow Verification

### Step 1: Check CartItem has variant_id
Open DevTools → Application → Local Storage → `shopping_cart`

Should see:
```json
[
  {
    "product_id": "...",
    "variant_id": "uuid-here",  // ← MUST NOT BE NULL
    "name": "Product Name",
    "color": "Red",
    "size": "M",
    "quantity": 2,
    "price": 50000
  }
]
```

### Step 2: Check API Request Payload
DevTools → Network → Filter: `/api/orders`
Look at **Request** tab → Payload should have:
```json
{
  "order": {
    "total": 100000,
    "shipping_fee": 30000,
    "customer_email": "test@example.com",
    ...
  },
  "items": [
    {
      "product_id": "uuid...",
      "variant_id": "uuid...",  // ← Check this
      "product_name": "...",
      "quantity": 2,
      "price": 50000,
      "color": "Red",
      "size": "M",
      ...
    }
  ]
}
```

### Step 3: Check API Response
DevTools → Network → `/api/orders` → **Response** tab

Success (201):
```json
{
  "success": true,
  "order": { "id": "order-uuid", ... },
  "items": [{ "id": "item-uuid", ... }]
}
```

Error (500):
```json
{
  "error": "Order creation failed: [ERROR_REASON]"
}
```

---

## Database Verification

### Check Orders Table
```sql
SELECT id, customer_email, total, shipping_fee, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check Order Items Table
```sql
-- Get latest order
SELECT order_id, product_name, quantity, price, color, size 
FROM order_items 
WHERE order_id = 'your-order-id'
ORDER BY created_at;

-- Count total items
SELECT COUNT(*) FROM order_items;
```

### Check Foreign Keys
```sql
-- Verify order_id references exist
SELECT oi.order_id, o.id 
FROM order_items oi 
LEFT JOIN orders o ON oi.order_id = o.id 
WHERE o.id IS NULL;
-- Should return 0 rows
```

---

## Common Issues & Fixes

| Issue | Check |
|-------|-------|
| No items in order_items | ① variant_id is null? ② order_items table exists? ③ RLS policy blocking? |
| 400 Bad Request | ① Foreign key constraint? ② Invalid data type? ③ Missing required field? |
| Order created but items fail | API catches error and continues - check server logs |
| Admin page shows no orders | ① orders table has data? ② getAllOrders() working? ③ Network error? |
| Admin page shows order but no items | ① order_items table empty? ② Order ID mismatch? |

---

## Quick Test Script

Run in browser console at `http://localhost:3000`:

```javascript
// 1. Check cart data
const cart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
console.log('Cart items:', cart);
console.log('Has variant_id?', cart.every(i => i.variant_id));

// 2. Check if admin page loads
fetch('/admin/orders').then(r => r.ok ? console.log('✅ Admin page accessible') : console.log('❌ Admin page error'));

// 3. Check Supabase client
console.log('Supabase available?', window.location.pathname.includes('admin'));
```

---

## Reset Data for Testing

If you need to clear all orders and items:

```sql
-- WARNING: This deletes ALL data!
DELETE FROM order_items;
DELETE FROM orders;

-- Then verify empty
SELECT COUNT(*) as order_count FROM orders;
SELECT COUNT(*) as item_count FROM order_items;
```

