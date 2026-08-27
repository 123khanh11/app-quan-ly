# 🔍 Debug Checklist: Check product_id & variant_id

## Step 1: Open DevTools Console (F12)
Mở DevTools Console, rồi chạy:

```javascript
// Check cart data
const cart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
console.log('=== CART DATA ===');
cart.forEach((item, idx) => {
  console.log(`Item ${idx + 1}:`);
  console.log('  product_id:', item.product_id ? `✅ ${item.product_id}` : '❌ MISSING');
  console.log('  variant_id:', item.variant_id ? `✅ ${item.variant_id}` : '❌ MISSING');
  console.log('  name:', item.name);
  console.log('  color:', item.color);
  console.log('  size:', item.size);
});
```

**Output should be:**
- ✅ `product_id`: UUID format (36 characters with dashes)
- ✅ `variant_id`: UUID format (36 characters with dashes)

---

## Step 2: Check Supabase Database

### Query 1: Get sample products
Go to Supabase → SQL Editor, run:

```sql
SELECT id, name FROM products LIMIT 5;
```

**Expected output:** Get some product IDs (copy one, e.g., `abc-123-def`)

### Query 2: Get sample product_variants
```sql
SELECT id, product_id, color, size FROM product_variants LIMIT 5;
```

**Expected output:** Get variant IDs and their product_id references

### Query 3: Compare with cart data
If cart has `product_id = "xyz-123"`, check if it exists:

```sql
SELECT id FROM products WHERE id = 'xyz-123';
-- Should return 1 row. If 0 rows, product_id doesn't exist!
```

If cart has `variant_id = "abc-456"`, check if it exists:

```sql
SELECT id FROM product_variants WHERE id = 'abc-456';
-- Should return 1 row. If 0 rows, variant_id doesn't exist!
```

---

## Step 3: Test Checkout & Monitor Logs

1. Add product to cart
2. Open DevTools → Console
3. Click **Checkout**
4. Look for logs:

```
📝 Preparing order data...
📦 Order items prepared: 1
Item 1:
  product_id: ✅ [UUID]
  variant_id: ✅ [UUID]
  product_name: ...
  quantity: ...
  price: ...
```

**If you see ❌ NULL or ❌ EMPTY for variant_id:**
→ Problem is in ProductDetailModal - not passing variant_id!

**If you see ✅ for both product_id and variant_id but still get 400 error:**
→ Problem is Foreign Key constraint - those IDs don't exist in database!

---

## Step 4: Check API Response Error

In DevTools Console, when you see the error:

```
❌ Checkout error: [ERROR_MESSAGE]
❌ API Error Response: {error: "..."}
```

Common errors:
1. **"violates foreign key constraint on product_id"** → Product doesn't exist
2. **"violates foreign key constraint on variant_id"** → Variant doesn't exist
3. **"RLS policy is blocking insert"** → Need to fix RLS
4. **"syntax error"** → Data format wrong

---

## Solution Based on Error

### If variant_id is NULL/EMPTY:
Fix `ProductDetailModal.tsx` → Make sure `variant_id` is being passed to `addToCart()`:

```typescript
addToCart({
  product_id: product.product_id,
  variant_id: selectedVariant.variant_id,  // ← Must pass this!
  name: product.product_name,
  // ... other fields
})
```

### If variant_id is set but still 400 error:
The ID doesn't exist in database. Solutions:

**Option A: Remove Foreign Key constraints (temporary)**
```sql
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_variant_id_fkey;
```

**Option B: Use valid IDs from database**
- Get real product_id from Supabase `products` table
- Get real variant_id from Supabase `product_variants` table
- Make sure those are what cart items contain

---

## Quick Fix: Remove Foreign Keys

Run this in Supabase SQL Editor:

```sql
-- Remove FK constraints
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_variant_id_fkey;

-- Keep the main order_id FK since that one should always be valid
-- ALTER TABLE public.order_items 
-- DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
```

Then test checkout again. If it works now, you know the issue is invalid product/variant IDs.

