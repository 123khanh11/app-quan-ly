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
-- 2. SỬA ORDER_ITEMS table - Fix variant_id
-- ============================================

-- ⚠️ Backup dữ liệu trước khi chuyển type
-- Tạo column tạm để lưu dữ liệu cũ
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_id_text TEXT;

-- Copy dữ liệu cũ sang column tạm (nếu variant_id là TEXT)
UPDATE order_items SET variant_id_text = variant_id::TEXT WHERE variant_id_text IS NULL;

-- Bộ sung product_variants
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
-- 3. Bổ sung PRODUCTS table (updated_at đã có)
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_kg NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS length_cm NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS width_cm NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS height_cm NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
-- updated_at already exists, skip

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
