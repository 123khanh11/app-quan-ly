# 🔍 Debug: 400 Bad Request Error

## Error Information
```
URL: https://edtxexnhpbipcecceoop.supabase.co/rest/v1/order_items?columns=...
Method: POST
Status: 400 (Bad Request)
```

---

## 🔎 Root Causes (Top 3)

### 1. Missing or Invalid Required Fields

**Database expects (NOT NULL):**
```sql
order_id uuid NOT NULL
product_id uuid NOT NULL
variant_id uuid NOT NULL
product_name text NOT NULL
quantity integer NOT NULL
price numeric NOT NULL
```

**Check in request:**
- ✅ order_id = valid UUID?
- ✅ product_id = valid UUID?
- ✅ variant_id = valid UUID? (or empty string?)
- ✅ product_name = not empty text?
- ✅ quantity = integer number?
- ✅ price = valid number?

---

### 2. Data Type Mismatch

**Request sends:**
```json
{
  "product_id": "string-instead-of-uuid",
  "variant_id": "",  // ← Empty string instead of UUID!
  "price": "50000",  // ← String instead of number!
}
```

**Should send:**
```json
{
  "product_id": "550e8400-e29b-41d4-a716-446655440000",  // UUID
  "variant_id": "660e8400-e29b-41d4-a716-446655440000",  // UUID (NOT empty!)
  "price": 50000,  // Number, not string
}
```

---

### 3. Invalid UUID Format

**Valid UUID:**
```
550e8400-e29b-41d4-a716-446655440000  ✅
```

**Invalid UUID:**
```
550e8400e29b41d4a716446655440000      ❌ (no dashes)
"550e8400-e29b-41d4-a716-446655440000" ❌ (extra quotes)
""                                      ❌ (empty)
null                                    ❌ (null for NOT NULL field)
```

---

## 🛠️ How to Debug

### Step 1: Check DevTools Network
1. Open DevTools (F12)
2. Go to Network tab
3. Click on POST request to `order_items`
4. Check **Request** tab → **Payload**

Look for:
```json
{
  "order_id": "???",          // Check this
  "product_id": "???",        // Check this
  "variant_id": "???",        // Check this - PROBLEM?
  "product_name": "???",
  "quantity": ???,
  "price": ???
}
```

### Step 2: Log Before Send
Add this in CheckoutForm.tsx before fetch:

```typescript
console.log('=== ORDER ITEMS TO SEND ===')
orderItems.forEach((item, idx) => {
  console.log(`Item ${idx + 1}:`)
  console.log('  product_id:', item.product_id, typeof item.product_id)
  console.log('  variant_id:', item.variant_id, typeof item.variant_id)
  console.log('  product_id length:', item.product_id?.length)
  console.log('  variant_id length:', item.variant_id?.length)
  console.log('  price:', item.price, typeof item.price)
  console.log('  quantity:', item.quantity, typeof item.quantity)
})
```

---

## ⚠️ Most Likely Problem: variant_id

**Current code:**
```typescript
variant_id: item.variant_id || '',  // ← PROBLEM! Empty string!
```

**When variant_id is missing:**
```
item.variant_id = undefined
item.variant_id || '' = ""  // Empty string!
```

**Database expects:**
```sql
variant_id uuid NOT NULL  -- Cannot be empty string!
```

**Fix:**
```typescript
// Option 1: Skip items without variant_id
if (!item.variant_id) {
  console.warn('Skipping item without variant_id')
  continue
}

// Option 2: Generate a dummy UUID (not recommended)
variant_id: item.variant_id || '00000000-0000-0000-0000-000000000000'

// Option 3: Make variant_id nullable in database
ALTER TABLE public.order_items
ALTER COLUMN variant_id DROP NOT NULL;
```

---

## 📝 Step-by-Step Fix

### Option A: Make variant_id nullable (Easiest)
```sql
ALTER TABLE public.order_items
ALTER COLUMN variant_id DROP NOT NULL;
```

Then test checkout again.

### Option B: Validate variant_id before send (Better)
Update `src/app/components/checkout/CheckoutForm.tsx`:

```typescript
const orderItems = cartItems
  .filter((item) => {
    const itemKey = `${item.product_id}-${item.color}-${item.size}`
    if (!selectedItems.has(itemKey)) return false
    
    // ✅ Validate variant_id
    if (!item.variant_id) {
      console.warn('⚠️ Skipping item without variant_id:', item.name)
      return false  // Don't include this item
    }
    
    return true
  })
  .map((item) => ({
    product_id: item.product_id,
    variant_id: item.variant_id,    // ✅ No fallback to ''
    // ... rest
  }))

// Check if any items left
if (orderItems.length === 0) {
  setError('No valid items to order')
  setLoading(false)
  return
}
```

---

## 🔧 Immediate Action

**Try this first (easiest):**

Run in Supabase SQL Editor:

```sql
-- Make variant_id nullable temporarily to test
ALTER TABLE public.order_items
ALTER COLUMN variant_id DROP NOT NULL;
```

Then test checkout again. If it works, you know the issue is variant_id being empty.

If it still fails with 400, then log the actual data being sent using the console logs above.

---

## 📊 Common 400 Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| `variant_id` empty | Code sends '' | Make nullable OR validate |
| `price` is string | Type error | Convert to number |
| `quantity` is string | Type error | Convert to number |
| `product_id` is wrong format | Not UUID | Check CartItem source |
| Column doesn't exist | Schema mismatch | Check table definition |

---

## ✅ Next Steps

1. **Check Network tab** - See actual request payload
2. **Check console logs** - See data types being sent
3. **Run SQL fix** - Make variant_id nullable
4. **Test again** - Should work!

Let me know what you find in the Network tab! 🔍

