# 🚀 DEPLOYMENT CHECKLIST - E-Commerce Website

## ✅ Code Ready: YES
All code updated ✓
Build verified ✓
No errors ✓

---

## 📋 STEP-BY-STEP DEPLOYMENT

### Step 1️⃣: Setup Database (Supabase)

1. Open Supabase Dashboard: https://app.supabase.com
2. Go to your project: `edtxexnhpbipcecceoop`
3. Click **SQL Editor** in left sidebar
4. Copy and paste ALL these commands:

```sql
-- Create RLS Policies for ORDERS
CREATE POLICY "Allow public insert on orders"
ON orders FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public select orders"
ON orders FOR SELECT TO public USING (true);

-- Create RLS Policies for ORDER_ITEMS
CREATE POLICY "Allow public insert on order_items"
ON order_items FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public select order_items"
ON order_items FOR SELECT TO public USING (true);

-- Create RLS Policies for PRODUCTS
CREATE POLICY "Allow public select products"
ON products FOR SELECT TO public USING (true);

-- Enable RLS (if not already enabled)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

5. Click **Run** button
6. Wait for success ✓

### Step 2️⃣: Push Code to GitHub

In your terminal:

```bash
cd "c:\Users\baomu\Downloads\E-commerce website interface"

# Stage all changes
git add .

# Commit with message
git commit -m "Fix: Align code with actual database schema (product_id, customer_*, total_amount)"

# Push to GitHub
git push origin main
```

If you get error about "main" branch not existing:
```bash
git push origin HEAD -u
```

### Step 3️⃣: Deploy to Vercel

Option A - Using CLI (Recommended):
```bash
vercel deploy --prod
```

Option B - Manual:
1. Go to: https://vercel.com/new
2. Import GitHub repo
3. Select project folder
4. Click Deploy

### Step 4️⃣: Test Website

After deployment (takes 2-3 minutes):

1. **Visit your new website**: Check Vercel dashboard for URL
2. **Add a product to cart**: 
   - Search for a product
   - Click "Thêm Vào Giỏ" (Add to Cart)
   - See product in cart
3. **Checkout**:
   - Fill in email, phone, address
   - Click "Đặt Hàng" (Place Order)
   - Should get success message
4. **Check Order in Database**:
   - Go to Supabase Dashboard
   - Click `orders` table
   - Should see your new order

---

## ✅ Success Indicators

**Checkout works if:**
- ✓ No error about "RLS policy" 
- ✓ No error about "foreign key"
- ✓ See success message with order number
- ✓ Can see order in Supabase dashboard

**Website works if:**
- ✓ Products load
- ✓ Can search products
- ✓ Can add to cart
- ✓ Can view cart
- ✓ Can checkout

---

## ❌ Troubleshooting

### Error: "RLS policy" or "row-level security"
**Solution**: RLS policies not created. Go back to Step 1 and run SQL commands.

### Error: "foreign key" on variant_id
**Solution**: Still has old schema. Delete and recreate orders/order_items table OR contact support.

### Website doesn't load
**Solution**: 
- Check Vercel build logs
- Make sure git commit was successful
- Verify GitHub repo has latest code

### Products don't show
**Solution**: Database might have no products. Add products in your admin app first.

---

## 📞 Quick Reference

**Your Supabase Project**: edtxexnhpbipcecceoop
**Supabase URL**: https://edtxexnhpbipcecceoop.supabase.co
**Database Tables**:
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Items in each order

**Your GitHub Repo**: (check Vercel settings)

---

## 🎯 Expected Result

After these 4 steps, you'll have:
- ✅ Working e-commerce website deployed to Vercel
- ✅ Fully functional shopping cart
- ✅ Working checkout system
- ✅ Order tracking system
- ✅ All data synced with Supabase

---

**Estimated Time**: 10-15 minutes
**Difficulty**: Very Easy ⭐

Good luck! 🎉
