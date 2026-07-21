# 📋 Hướng Dẫn Fix Schema Database

## 🎯 Tómlược Những Gì Bạn Cần Làm

1. **Chạy SQL Script** để thêm các column thiếu
2. **Deploy code mới** lên Vercel
3. **Test các function** dashboard & search

---

## ✅ BƯỚC 1: Chạy SQL Script Thêm Columns

### Vào Supabase SQL Editor

1. Vào https://supabase.com → Login → Project của bạn
2. Chọn tab **"SQL Editor"**
3. Click **"New Query"**

### Copy-Paste SQL Script

Tôi đã tạo file: `ADD_MISSING_COLUMNS.sql`

**Chỉ cần copy toàn bộ script này vào SQL Editor rồi click "Run"**

```sql
-- ✅ SQL Script: Thêm các column thiếu (chỉ add nếu chưa có)
-- Chạy từng lệnh, nếu lỗi "column already exists" thì bỏ qua và chạy tiếp

-- ============================================
-- 1. Bổ sung ORDERS table
-- ============================================

-- Thêm thông tin khách hàng
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Thêm tracking & management
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 2. Bổ sung PRODUCT_VARIANTS table
-- ============================================

ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS barcode TEXT UNIQUE;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS weight_kg NUMERIC;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS length_cm NUMERIC;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS width_cm NUMERIC;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS height_cm NUMERIC;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS cost_price NUMERIC;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 3. Bổ sung PRODUCTS table
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_kg NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS length_cm NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS width_cm NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS height_cm NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- ============================================
-- 4. Bổ sung CATEGORIES table
-- ============================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 5. Bổ sung BRANDS table
-- ============================================

ALTER TABLE brands ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 6. Bổ sung ADDRESSES table
-- ============================================

ALTER TABLE addresses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS is_shipping BOOLEAN DEFAULT TRUE;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS is_billing BOOLEAN;

-- ============================================
-- 7. Bổ sung CARTS table
-- ============================================

ALTER TABLE carts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE carts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE carts ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- 8. Bổ sung REVIEWS table
-- ============================================

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT FALSE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count INT DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS unhelpful_count INT DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 9. Bổ sung PROFILES table
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 10. Bổ sung PRODUCT_IMAGES table
-- ============================================

ALTER TABLE product_images ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 11. Bổ sung GHN tables
-- ============================================

ALTER TABLE ghn_provinces ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE ghn_districts ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE ghn_wards ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
```

### 📝 Dùng IF NOT EXISTS?

Script dùng `IF NOT EXISTS` để tránh lỗi nếu column đã có. Nếu vẫn gặp lỗi, copy từng lệnh riêng biệt.

---

## 🔧 BƯỚC 2: Những Gì Đã Được Sửa Trong Code

### ✅ dashboardService.js

**Sửa lỗi 1**: `getSalesByDate()` 
- ❌ Dùng `total_amount` (không tồn tại)
- ✅ Sửa thành `total`

**Sửa lỗi 2**: `getTopProductsBySales()`
- ❌ Dùng `product_id` trực tiếp từ order_items (sai)
- ✅ Sửa thành join qua `product_variants` → `products`

**Sửa lỗi 3**: `getRevenueByCategory()`
- ❌ Dùng `product_id` trực tiếp (sai)
- ✅ Sửa thành join qua `product_variants` → `products`

### ✅ orderService.js

**Sửa lỗi**: `searchOrders()`
- ❌ Tìm kiếm theo `customer_name`, `customer_email`, `customer_phone` (chưa có)
- ✅ Thêm `shipping_address` vào search, và lưu ý: phải thêm 3 field này vào `orders` table trước

---

## 🚀 BƯỚC 3: Deploy Code Mới

### Option A: Git + Vercel (Tự động)

```bash
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"
git add -A
git commit -m "Fix: Sửa dashboard queries, thêm customer_name/email/phone support"
git push origin main
```

Vercel sẽ tự động deploy.

### Option B: Drag-drop dist folder

1. Build lại (đã chạy xong ✅)
2. Vào https://vercel.com → Project → Deploy → Drag drop folder `dist`

---

## ✅ BƯỚC 4: Verify Mọi Thứ Hoạt Động

### Test trong Web App

1. Vào Dashboard → Xem có data không?
2. Xem Top Products By Sales → Có dữ liệu không?
3. Xem Revenue By Category → Có dữ liệu không?
4. Vào Orders → Search theo tên → Tìm được không?

---

## 📊 Schema Mới (Sau Khi Thêm Columns)

### orders table
```
id, user_id, total, shipping_fee, payment_method, 
payment_status, order_status, shipping_address, note, 
created_at, 
✨ NEW: customer_name, customer_email, customer_phone,
✨ NEW: tracking_number, refund_reason, cancelled_reason,
✨ NEW: cancelled_at, completed_at, updated_at
```

### product_variants table
```
id, product_id, size, color, sku, stock, price,
✨ NEW: barcode, weight_kg, length_cm, width_cm, height_cm,
✨ NEW: cost_price, is_active, created_at, updated_at
```

### products table
```
id, category_id, brand_id, name, slug, sku, description, price, sale_price,
active, created_at, updated_at, image_url, image,
✨ NEW: cost_price, weight_kg, length_cm, width_cm, height_cm, is_active
```

---

## 🎯 Tómlược Lợi Ích

✅ Dashboard sẽ hiển thị đúng dữ liệu (không lỗi 42703)
✅ Search orders sẽ hoạt động (có fields customer_name/email/phone)
✅ Revenue by category tính đúng (join qua product_variants)
✅ Quản lý bán hàng hoàn chỉnh (có cost_price, weight, dimensions)

---

## 🔴 Nếu Có Lỗi

### Lỗi: "column already exists"
→ Bỏ qua, không ảnh hưởng (dùng IF NOT EXISTS rồi)

### Lỗi: "type mismatch"
→ Contact tôi, cần check variant_id type

### Lỗi: Dashboard không load
→ Clear cache browser, hard refresh (Ctrl+Shift+R)

---

## 📝 Files Liên Quan

- `ADD_MISSING_COLUMNS.sql` - SQL script thêm columns
- `src/lib/dashboardService.js` - Đã sửa
- `src/lib/orderService.js` - Đã sửa
- `NHUNG_TRUONG_CAN_THEM.md` - Chi tiết đầy đủ

---

**Bước tiếp theo**: Chạy SQL script, deploy, test! 🚀
