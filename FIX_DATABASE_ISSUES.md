# 🔧 FIX - Lỗi Đặt Hàng & Hình Ảnh

## 🚨 Problem 1: RLS Policy Error

```
❌ "Lỗi new row violates row-level security policy for table 'orders'"
```

### ✅ Solution

Vào **Supabase Dashboard** → **SQL Editor** → Chạy query này:

```sql
-- Allow public to insert/select orders
CREATE POLICY "Allow public insert orders"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public select orders"
ON orders FOR SELECT
USING (true);

-- Allow public to insert/select order_items
CREATE POLICY "Allow public insert order_items"
ON order_items FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public select order_items"
ON order_items FOR SELECT
USING (true);

-- Allow public to select products
CREATE POLICY "Allow public select products"
ON products FOR SELECT
USING (true);
```

**After that:** Try placing order again - should work! ✅

---

## 🖼️ Problem 2: Images Not Showing

### Nguyên nhân

Product images không hiển thị sau khi cập nhật ở admin app.

### Giải pháp

**Option 1: Nếu dùng Supabase Storage**

Vào Supabase → Storage → Images Bucket → Policies:

```
+ Add Policy
- Select: "SELECT"
- User: "For all users"
- Create
```

**Option 2: Nếu dùng URL từ ngoài**

Đảm bảo URL accessible:
- Unsplash: ✅ OK
- Cloudinary: ✅ OK
- Local files: ❌ Won't work

### Check Image URL

1. Vào Database → Products table
2. Check `image` column
3. Đảm bảo URLs có format:
   ```
   https://.../.jpg
   ```

---

## 🧪 Test After Fix

### Test 1: Place Order

1. Add product to cart
2. Click "Đặt Hàng"
3. Fill form
4. Click "Đặt Hàng"
5. Should see: ✅ Success message

### Test 2: Check Images

1. Go to shop page
2. Refresh (F5)
3. Product images should show
4. If not, check URL in database

---

## 📊 Database Check

```sql
-- Check orders table has RLS
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- Check products images
SELECT id, name, image FROM products LIMIT 5;

-- Check if order was created
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```

---

## 🚀 After Fixing

If you fixed:
1. ✅ RLS policies
2. ✅ Image storage
3. ✅ Product URLs

Then:
- Push code: `git push`
- Vercel auto-deploys
- Website should work! 🎉

---

## 📞 Common Fixes

| Issue | Fix |
|-------|-----|
| RLS error on order | Add INSERT policy to orders |
| Images not showing | Fix image URLs or add storage policy |
| No products showing | Check products table exists & has data |
| Slow to load | Check Supabase connection |

---

**Do those fixes and everything should work!** ✨
