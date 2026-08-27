# ✅ Schema Validation: order_items Table

## 📋 Order Items Schema từ Supabase

```sql
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  variant_id uuid NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  color text,
  size text,
  sku text,
  weight_kg numeric,
  length_cm numeric,
  width_cm numeric,
  height_cm numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
```

---

## ✅ Validation Results

### Column Validation

| # | Column | Type | NOT NULL | Default | FK | Status |
|---|--------|------|----------|---------|----|----|
| 1 | **id** | uuid | YES | gen_random_uuid() | - | ✅ CORRECT |
| 2 | **order_id** | uuid | YES | - | orders(id) | ✅ CORRECT |
| 3 | **product_id** | uuid | YES | - | - | ✅ CORRECT |
| 4 | **variant_id** | uuid | YES | - | - | ✅ CORRECT |
| 5 | **product_name** | text | YES | - | - | ✅ CORRECT |
| 6 | **quantity** | integer | YES | 1 | - | ✅ CORRECT |
| 7 | **price** | numeric | YES | - | - | ✅ CORRECT |
| 8 | **color** | text | NO | - | - | ✅ CORRECT |
| 9 | **size** | text | NO | - | - | ✅ CORRECT |
| 10 | **sku** | text | NO | - | - | ✅ CORRECT |
| 11 | **weight_kg** | numeric | NO | - | - | ✅ CORRECT |
| 12 | **length_cm** | numeric | NO | - | - | ✅ CORRECT |
| 13 | **width_cm** | numeric | NO | - | - | ✅ CORRECT |
| 14 | **height_cm** | numeric | NO | - | - | ✅ CORRECT |
| 15 | **created_at** | timestamp | YES | now() | - | ✅ CORRECT |

---

### Foreign Keys

| FK Name | References | ON DELETE | Status |
|---------|-----------|----------|--------|
| order_items_order_id_fkey | orders(id) | ❓ NOT SPECIFIED | ⚠️ MISSING |
| ❌ MISSING | products(id) | - | ⚠️ REMOVED |
| ❌ MISSING | product_variants(id) | - | ⚠️ REMOVED |

---

## 🔍 Issues Found

### ✅ GOOD: Columns are correct
- All 15 columns match expected schema
- Data types are appropriate
- NOT NULL constraints are on right fields
- Nullable fields for optional data (color, size, dimensions)

### ⚠️ ISSUE 1: Missing ON DELETE CASCADE for order_id FK
**Current:**
```sql
CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
```

**Should be:**
```sql
CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
```

**Why:** When an order is deleted, all its items should be automatically deleted.

**Fix:**
```sql
ALTER TABLE public.order_items
DROP CONSTRAINT order_items_order_id_fkey;

ALTER TABLE public.order_items
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
```

---

### ⚠️ ISSUE 2: No Foreign Keys on product_id and variant_id
**Current:** No FK constraints

**Implications:**
- ✅ GOOD: Can insert any UUID (even if product doesn't exist)
- ✅ GOOD: Avoids 400 Bad Request errors
- ❌ BAD: Data integrity risk (orphaned records)
- ❌ BAD: Can't verify products/variants exist

**Choice:** This is OK for now if data is generated from valid CartItems.

**If you want to add FK later:**
```sql
ALTER TABLE public.order_items
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;

ALTER TABLE public.order_items
ADD CONSTRAINT order_items_variant_id_fkey 
FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE RESTRICT;
```

---

## ✅ Matches with Code

### Code sends these fields:
```typescript
{
  product_id: item.product_id,           // ✅ uuid
  variant_id: item.variant_id,           // ✅ uuid
  product_name: item.name,               // ✅ text
  quantity: item.quantity,               // ✅ integer
  price: item.price,                     // ✅ numeric
  color: item.color || '',               // ✅ text
  size: item.size || '',                 // ✅ text
  sku: item.sku || '',                   // ✅ text
  weight_kg: item.weight / 1000,         // ✅ numeric
  length_cm: item.length,                // ✅ numeric
  width_cm: item.width,                  // ✅ numeric
  height_cm: item.height,                // ✅ numeric
}
```

### Schema expects:
```sql
product_id uuid NOT NULL,               -- ✅ matches
variant_id uuid NOT NULL,               -- ✅ matches
product_name text NOT NULL,             -- ✅ matches
quantity integer NOT NULL DEFAULT 1,    -- ✅ matches
price numeric NOT NULL,                 -- ✅ matches
color text,                             -- ✅ matches (nullable)
size text,                              -- ✅ matches (nullable)
sku text,                               -- ✅ matches (nullable)
weight_kg numeric,                      -- ✅ matches (nullable)
length_cm numeric,                      -- ✅ matches (nullable)
width_cm numeric,                       -- ✅ matches (nullable)
height_cm numeric,                      -- ✅ matches (nullable)
```

**Result:** ✅ **PERFECT MATCH**

---

## 📊 Comparison with Other Tables

### products table
```sql
id uuid PRIMARY KEY
category_id uuid FK
brand_id uuid FK
name text NOT NULL
price numeric
weight_kg numeric
length_cm numeric
width_cm numeric
height_cm numeric
```

### product_variants table
```sql
id uuid PRIMARY KEY
product_id uuid NOT NULL FK
size text
color text
sku text UNIQUE
price numeric
weight_kg numeric
length_cm numeric
width_cm numeric
height_cm numeric
```

### order_items table (your current schema)
```sql
id uuid PRIMARY KEY
order_id uuid NOT NULL FK
product_id uuid NOT NULL (no FK)
variant_id uuid NOT NULL (no FK)
product_name text NOT NULL
quantity integer NOT NULL
price numeric NOT NULL
color text
size text
sku text
weight_kg numeric
length_cm numeric
width_cm numeric
height_cm numeric
```

**Observation:** order_items stores denormalized data (copies from product_variants at order time) ✅ This is correct! It preserves historical data.

---

## ✅ Final Assessment

### Schema Status: **9/10 - ALMOST PERFECT**

**What's Good:**
- ✅ All 15 columns correctly defined
- ✅ Correct data types for all fields
- ✅ NOT NULL on required fields
- ✅ Nullable on optional fields (color, size, dimensions)
- ✅ Defaults for id, created_at, quantity
- ✅ Primary key defined
- ✅ Foreign key on order_id exists
- ✅ Perfect match with code being sent

**What needs fixing (optional):**
- ⚠️ Add `ON DELETE CASCADE` to order_id FK
- ⚠️ Consider adding FK for product_id and variant_id (if you want data integrity)

---

## 🚀 Action Items

### For immediate use (no changes needed):
The schema is **production-ready** as-is. You can:
1. ✅ Test checkout flow
2. ✅ Verify data is saved correctly
3. ✅ View orders in admin page

### For improvement (optional):
```sql
-- Add ON DELETE CASCADE to order_id FK
ALTER TABLE public.order_items
DROP CONSTRAINT order_items_order_id_fkey;

ALTER TABLE public.order_items
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
```

This ensures when you delete an order, all its items are automatically deleted.

---

## 📝 Summary

**Schema validation: ✅ PASSED**

Your `order_items` table schema is **correct and ready to use**. All columns match what the code sends, and data types are appropriate. The only optional improvement is adding `ON DELETE CASCADE` to the order_id foreign key.

You can now proceed to test the full checkout flow! 🎉

