# 📋 Những Trường Cần Bổ Sung Cho App Quản Lý Đơn Hàng

## 🔴 VẤN ĐỀ NGHIÊM TRỌNG - Fields Đang Dùng Nhưng Không Có Trong Schema

| Table | Field Hiện Tại Dùng | Status | Giải Pháp |
|-------|-------------------|--------|----------|
| `orders` | `customer_name` | ❌ KHÔNG CÓ | Cần thêm |
| `orders` | `customer_email` | ❌ KHÔNG CÓ | Cần thêm |
| `orders` | `customer_phone` | ❌ KHÔNG CÓ | Cần thêm |
| `order_items` | `product_id` | ❌ KHÔNG CÓ | Schema dùng `variant_id` (text) - LỖI TYPE |
| `dashboardService` | `total_amount` | ❌ KHÔNG CÓ | Schema dùng `total` - PHẢI SỬA |

---

## ✅ CẦN THÊM CÁC FIELD SAU

### 1. **Table `orders` - Bổ sung thông tin khách hàng**

```sql
-- Cần thêm 3 cột
ALTER TABLE orders ADD COLUMN customer_name TEXT;
ALTER TABLE orders ADD COLUMN customer_email TEXT;
ALTER TABLE orders ADD COLUMN customer_phone TEXT;
```

**Lý do**: 
- Hiện tại `searchOrders()` tìm kiếm theo `customer_name`, `customer_email`, `customer_phone`
- Cần lưu thông tin này để không phải join với `users` table

---

### 2. **Table `orders` - Bổ sung tracking & management**

```sql
-- Thêm các field hữu ích cho quản lý
ALTER TABLE orders ADD COLUMN tracking_number TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN refund_reason TEXT;
ALTER TABLE orders ADD COLUMN cancelled_reason TEXT;
ALTER TABLE orders ADD COLUMN cancelled_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN completed_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

**Lý do**:
- Theo dõi vận chuyển (GHN, Viettel Post, v.v.)
- Quản lý hoàn hàng & lý do hủy đơn
- Audit log (khi nào hoàn thành/hủy)

---

### 3. **Table `order_items` - Fix kiểu dữ liệu**

```sql
-- Sửa variant_id từ TEXT thành UUID
ALTER TABLE order_items ALTER COLUMN variant_id TYPE UUID USING variant_id::UUID;

-- Thêm constraint foreign key
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_variant 
FOREIGN KEY (variant_id) REFERENCES product_variants(id);
```

**Lý do**:
- Hiện tại `variant_id` là `TEXT` - rất nguy hiểm
- Phải là UUID để join với `product_variants`
- Service code đang dùng `product_id` (sai) thay vì `variant_id`

---

### 4. **Table `product_variants` - Bổ sung thông tin**

```sql
-- Thêm trường UPC/barcode
ALTER TABLE product_variants ADD COLUMN barcode TEXT UNIQUE;

-- Thêm weight & dimensions (cho logistics)
ALTER TABLE product_variants ADD COLUMN weight_kg NUMERIC;
ALTER TABLE product_variants ADD COLUMN length_cm NUMERIC;
ALTER TABLE product_variants ADD COLUMN width_cm NUMERIC;
ALTER TABLE product_variants ADD COLUMN height_cm NUMERIC;

-- Thêm cost & status
ALTER TABLE product_variants ADD COLUMN cost_price NUMERIC;
ALTER TABLE product_variants ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE product_variants ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE product_variants ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

**Lý do**:
- Tính toán lợi nhuận (profit = price - cost_price)
- Tính phí vận chuyển (dựa vào weight & dimensions)
- Thống kê hàng hóa (có bao nhiêu variant đang bán)

---

### 5. **Table `products` - Bổ sung thông tin bán hàng**

```sql
-- Thêm field quan trọng
ALTER TABLE products ADD COLUMN cost_price NUMERIC;
ALTER TABLE products ADD COLUMN weight_kg NUMERIC;
ALTER TABLE products ADD COLUMN length_cm NUMERIC;
ALTER TABLE products ADD COLUMN width_cm NUMERIC;
ALTER TABLE products ADD COLUMN height_cm NUMERIC;
ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

**Lý do**:
- Tính giá vốn & lợi nhuận
- Tính phí vận chuyển đơn hàng
- Disable product mà không cần xóa

---

### 6. **Table `categories` - Bổ sung metadata**

```sql
-- Thêm trường giúp hiển thị tốt hơn
ALTER TABLE categories ADD COLUMN description TEXT;
ALTER TABLE categories ADD COLUMN image_url TEXT;
ALTER TABLE categories ADD COLUMN display_order INT DEFAULT 0;
ALTER TABLE categories ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE categories ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

**Lý do**:
- App hiện tại không có description & image_url cho categories
- Cần display_order để sắp xếp trên UI
- Cần is_active để ẩn category mà không xóa

---

### 7. **Table `brands` - Bổ sung metadata**

```sql
-- Thêm thông tin chi tiết
ALTER TABLE brands ADD COLUMN description TEXT;
ALTER TABLE brands ADD COLUMN image_url TEXT;
ALTER TABLE brands ADD COLUMN website_url TEXT;
ALTER TABLE brands ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE brands ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

---

### 8. **Table `addresses` - Bổ sung mặc định**

```sql
-- Thêm trường tracking
ALTER TABLE addresses ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE addresses ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE addresses ADD COLUMN is_shipping BOOLEAN DEFAULT TRUE;
ALTER TABLE addresses ADD COLUMN is_billing BOOLEAN;
```

---

### 9. **Table `carts` - Bổ sung metadata**

```sql
-- Thêm thông tin tạo cart
ALTER TABLE carts ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE carts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE carts ADD COLUMN notes TEXT;
```

---

### 10. **Table `reviews` - Cần thêm**

```sql
-- Thêm trường tracking
ALTER TABLE reviews ADD COLUMN verified_purchase BOOLEAN DEFAULT FALSE;
ALTER TABLE reviews ADD COLUMN helpful_count INT DEFAULT 0;
ALTER TABLE reviews ADD COLUMN unhelpful_count INT DEFAULT 0;
ALTER TABLE reviews ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

---

## 🚨 BẢNG TÓMLƯỢC CÁC THAY ĐỔI

### Bắt Buộc (Critical)

| Table | Thêm | Sửa | Xóa |
|-------|------|-----|-----|
| `orders` | `customer_name`, `customer_email`, `customer_phone`, `tracking_number`, `updated_at`, `completed_at`, `cancelled_at`, `refund_reason`, `cancelled_reason` | — | — |
| `order_items` | — | `variant_id` (TEXT → UUID) | — |
| `product_variants` | `cost_price`, `is_active`, `created_at`, `updated_at` | — | — |
| `products` | `cost_price`, `weight_kg`, `dimensions`, `is_active`, `updated_at` | — | — |

### Nên Có (Important)

| Table | Thêm | Lý do |
|-------|------|-------|
| `product_variants` | `barcode`, `weight_kg`, dimensions | Logistics & inventory |
| `categories` | `description`, `image_url`, `display_order`, `is_active` | UI/UX tốt hơn |
| `brands` | `description`, `image_url`, `website_url` | Quản lý brand tốt hơn |

---

## 📝 CÓ LỖI CẦN SỬA NGAY

### 1. **dashboardService.js - Field sai**

```javascript
// ❌ SAI - dùng total_amount (không tồn tại)
const { data, error } = await supabase
  .from('orders')
  .select('created_at, total_amount')  // KHÔNG CÓ FIELD NÀY

// ✅ ĐÚNG - phải dùng total
const { data, error } = await supabase
  .from('orders')
  .select('created_at, total')
```

### 2. **orderService.js - Field sai trong search**

```javascript
// ❌ SAI - searchOrders dùng field không có
.or(`customer_name.ilike.%${query}%,customer_email.ilike.%${query}%,customer_phone.ilike.%${query}%`)

// ✅ ĐÚNG - nhưng cần thêm những field này vào table orders trước
```

---

## 🔧 SQL SCRIPT ĐỂ THÊM TẤT CẢ FIELDS

```sql
-- 1. Bổ sung thông tin khách hàng vào orders
ALTER TABLE orders 
ADD COLUMN customer_name TEXT,
ADD COLUMN customer_email TEXT,
ADD COLUMN customer_phone TEXT,
ADD COLUMN tracking_number TEXT UNIQUE,
ADD COLUMN refund_reason TEXT,
ADD COLUMN cancelled_reason TEXT,
ADD COLUMN cancelled_at TIMESTAMPTZ,
ADD COLUMN completed_at TIMESTAMPTZ,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Fix variant_id từ TEXT thành UUID
ALTER TABLE order_items ALTER COLUMN variant_id TYPE UUID USING variant_id::UUID;
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_variant 
FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT;

-- 3. Bổ sung product_variants
ALTER TABLE product_variants 
ADD COLUMN barcode TEXT UNIQUE,
ADD COLUMN weight_kg NUMERIC,
ADD COLUMN length_cm NUMERIC,
ADD COLUMN width_cm NUMERIC,
ADD COLUMN height_cm NUMERIC,
ADD COLUMN cost_price NUMERIC,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Bổ sung products
ALTER TABLE products 
ADD COLUMN cost_price NUMERIC,
ADD COLUMN weight_kg NUMERIC,
ADD COLUMN length_cm NUMERIC,
ADD COLUMN width_cm NUMERIC,
ADD COLUMN height_cm NUMERIC,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Bổ sung categories
ALTER TABLE categories 
ADD COLUMN description TEXT,
ADD COLUMN image_url TEXT,
ADD COLUMN display_order INT DEFAULT 0,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 6. Bổ sung brands
ALTER TABLE brands 
ADD COLUMN description TEXT,
ADD COLUMN image_url TEXT,
ADD COLUMN website_url TEXT,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 7. Bổ sung addresses
ALTER TABLE addresses 
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN is_shipping BOOLEAN DEFAULT TRUE,
ADD COLUMN is_billing BOOLEAN;

-- 8. Bổ sung carts
ALTER TABLE carts 
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN notes TEXT;

-- 9. Bổ sung reviews
ALTER TABLE reviews 
ADD COLUMN verified_purchase BOOLEAN DEFAULT FALSE,
ADD COLUMN helpful_count INT DEFAULT 0,
ADD COLUMN unhelpful_count INT DEFAULT 0,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

---

## 📊 TÓMLƯỢC SCHEMA MỚI

**Trước**: 12 bảng, ~60 columns
**Sau**: 12 bảng, ~100+ columns (đầy đủ cho quản lý bán hàng)

**Những gì sẽ có thêm**:
✅ Thông tin khách hàng tự chứa trong order (không cần join users)
✅ Theo dõi vận chuyển (tracking_number)
✅ Quản lý lý do hủy/hoàn hàng
✅ Tính toán lợi nhuận (cost_price)
✅ Tính phí ship (weight + dimensions)
✅ Thống kê & audit log (created_at, updated_at, completed_at)
✅ Kiến hàng (is_active, display_order)

---

**Liên hệ**: Bạn muốn tôi chạy SQL script để thêm tất cả fields này không?
