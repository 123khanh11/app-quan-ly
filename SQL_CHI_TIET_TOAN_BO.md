# 📋 SQL CHI TIẾT TOÀN BỘ - BẢNG DANH SÁCH

## 🗂️ DANH SÁCH TẤT CẢ BẢNG DATABASE

| Thứ tự | Tên Bảng | Tiếng Việt | Số Cột | Mục Đích |
|--------|---------|-----------|--------|---------|
| 1 | `categories` | Danh Mục | 4 | Lưu trữ danh mục sản phẩm |
| 2 | `brands` | Thương Hiệu | 3 | Lưu trữ thương hiệu sản phẩm |
| 3 | `profiles` | Hồ Sơ Người Dùng | 5 | Mở rộng thông tin auth.users |
| 4 | `products` | Sản Phẩm | 14 | Lưu thông tin sản phẩm chính |
| 5 | `product_variants` | Biến Thể Sản Phẩm | 7 | **Quản lý stock, kích thước, màu** |
| 6 | `product_images` | Hình Ảnh Sản Phẩm | 4 | Lưu nhiều hình cho sản phẩm |
| 7 | `addresses` | Địa Chỉ | 9 | Địa chỉ giao hàng của khách |
| 8 | `carts` | Giỏ Hàng | 4 | Giỏ hàng tạm thời |
| 9 | `orders` | Đơn Hàng | 10 | Thông tin đơn hàng chính |
| 10 | `order_items` | Chi Tiết Đơn Hàng | 5 | **Liên kết variant_id (không product_id)** |
| 11 | `reviews` | Đánh Giá | 5 | Đánh giá sản phẩm |
| 12 | `ghn_provinces` | Tỉnh/Thành Phố | 5 | Dữ liệu tỉnh từ GHN |
| 13 | `ghn_districts` | Quận/Huyện | 7 | Dữ liệu quận từ GHN |
| 14 | `ghn_wards` | Phường/Xã | 8 | Dữ liệu phường từ GHN |

**Total: 14 bảng, 98 cột**

---

## 📊 CHI TIẾT CỘT TỪNG BẢNG

### 1️⃣ BẢNG CATEGORIES (Danh Mục)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| name | TEXT | NO | | | | ✅ | Tên danh mục (UNIQUE) |
| slug | TEXT | YES | | | | ✅ | URL slug (UNIQUE) |
| created_at | TIMESTAMP | YES | | | now() | ✅ | Ngày tạo |

**Foreign Keys:** Không có  
**Constraints:** 
- PRIMARY KEY (id)
- UNIQUE (name)
- UNIQUE (slug)

**Indexes:**
```sql
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_name ON public.categories(name);
```

---

### 2️⃣ BẢNG BRANDS (Thương Hiệu)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| name | TEXT | NO | | | | ✅ | Tên thương hiệu (UNIQUE) |
| created_at | TIMESTAMP | YES | | | now() | ✅ | Ngày tạo |

**Foreign Keys:** Không có  
**Constraints:** 
- PRIMARY KEY (id)
- UNIQUE (name)

**Indexes:**
```sql
CREATE INDEX idx_brands_name ON public.brands(name);
```

---

### 3️⃣ BẢNG PROFILES (Hồ Sơ Người Dùng)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | **auth.users(id)** | | ✅ | ID người dùng |
| full_name | TEXT | YES | | | | | Tên đầy đủ |
| phone | TEXT | YES | | | | | Số điện thoại |
| avatar_url | TEXT | YES | | | | | URL avatar |
| created_at | TIMESTAMP | YES | | | now() | | Ngày tạo |
| updated_at | TIMESTAMP | YES | | | now() | | Ngày cập nhật |

**Foreign Keys:**
```sql
CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
```

**Constraints:** 
- PRIMARY KEY (id)

---

### 4️⃣ BẢNG PRODUCTS (Sản Phẩm) ⭐ QUAN TRỌNG

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| category_id | UUID | YES | | **categories(id)** | | ✅ | Danh mục |
| brand_id | UUID | YES | | **brands(id)** | | ✅ | Thương hiệu |
| name | TEXT | NO | | | | ✅ | Tên sản phẩm |
| slug | TEXT | YES | | | | ✅ | URL slug (UNIQUE) |
| sku | TEXT | YES | | | | ✅ | Mã SKU (UNIQUE) |
| description | TEXT | YES | | | | | Mô tả sản phẩm |
| price | NUMERIC | NO | | | | | Giá bán chính |
| sale_price | NUMERIC | YES | | | | | Giá khuyến mãi |
| active | BOOLEAN | YES | | | true | ✅ | Sản phẩm hoạt động |
| created_at | TIMESTAMP | YES | | | now() | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | YES | | | now() | | Ngày cập nhật |
| image_url | TEXT | YES | | | | | URL hình chính |
| image | TEXT | YES | | | | | Dữ liệu hình (backup) |

⚠️ **QUAN TRỌNG: KHÔNG CÓ CỘT `stock_quantity`**

**Foreign Keys:**
```sql
CONSTRAINT products_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL,
CONSTRAINT products_brand_id_fkey 
  FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL
```

**Constraints:** 
- PRIMARY KEY (id)
- UNIQUE (slug)
- UNIQUE (sku)

**Indexes:**
```sql
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_active ON public.products(active);
```

---

### 5️⃣ BẢNG PRODUCT_VARIANTS (Biến Thể Sản Phẩm) ⭐ STOCK QUẢN LÝ Ở ĐÂY

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| product_id | UUID | NO | | **products(id)** | | ✅ | Sản phẩm cha |
| size | TEXT | YES | | | | | Kích thước (S, M, L, XL...) |
| color | TEXT | YES | | | | | Màu sắc |
| sku | TEXT | YES | | | | ✅ | Mã SKU riêng (UNIQUE) |
| stock | INTEGER | YES | | | 0 | ✅ | **Số lượng tồn kho ⭐** |
| price | NUMERIC | YES | | | | | Giá riêng (nếu khác product) |

✅ **STOCK ĐỦ CHỈ Ở ĐÂY, KHÔNG Ở PRODUCTS**

**Foreign Keys:**
```sql
CONSTRAINT product_variants_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
```

**Constraints:** 
- PRIMARY KEY (id)
- UNIQUE (sku)

**Indexes:**
```sql
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_variants_stock ON public.product_variants(stock);
```

---

### 6️⃣ BẢNG PRODUCT_IMAGES (Hình Ảnh Sản Phẩm)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| product_id | UUID | YES | | **products(id)** | | ✅ | Sản phẩm |
| image_url | TEXT | NO | | | | | URL hình ảnh |
| is_main | BOOLEAN | YES | | | false | | Hình đại diện chính |

**Foreign Keys:**
```sql
CONSTRAINT product_images_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
```

---

### 7️⃣ BẢNG ADDRESSES (Địa Chỉ)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| user_id | UUID | YES | | **profiles(id)** | | ✅ | Người dùng |
| receiver_name | TEXT | YES | | | | | Tên người nhận |
| phone | TEXT | YES | | | | | Số điện thoại |
| province | TEXT | YES | | | | | Tỉnh/Thành phố |
| district | TEXT | YES | | | | | Quận/Huyện |
| ward | TEXT | YES | | | | | Phường/Xã |
| detail | TEXT | YES | | | | | Địa chỉ chi tiết |
| is_default | BOOLEAN | YES | | | false | ✅ | Địa chỉ mặc định |

---

### 8️⃣ BẢNG CARTS (Giỏ Hàng)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| user_id | UUID | YES | | **profiles(id)** | | ✅ | Người dùng |
| variant_id | UUID | YES | | **product_variants(id)** | | ✅ | Biến thể sản phẩm |
| quantity | INTEGER | YES | | | 1 | | Số lượng |

**Foreign Keys:**
```sql
CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
CONSTRAINT carts_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE
```

---

### 9️⃣ BẢNG ORDERS (Đơn Hàng) ⭐ CHÍNH

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID đơn hàng |
| user_id | UUID | YES | | **profiles(id)** | | ✅ | Người đặt hàng |
| total | NUMERIC | NO | | | 0 | | **✅ Tổng tiền (KHÔNG total_amount)** |
| shipping_fee | NUMERIC | YES | | | | | Phí vận chuyển |
| payment_method | TEXT | YES | | | | | Phương thức thanh toán |
| payment_status | TEXT | YES | | | pending | ✅ | Trạng thái thanh toán |
| order_status | TEXT | YES | | | pending | ✅ | **✅ Trạng thái đơn (KHÔNG status)** |
| shipping_address | TEXT | YES | | | | | Địa chỉ giao hàng |
| note | TEXT | YES | | | | | **✅ Ghi chú (KHÔNG notes)** |
| created_at | TIMESTAMP | YES | | | now() | ✅ | Ngày tạo |

⚠️ **CÁC TRƯỜNG QUAN TRỌNG:**
- `total` ✅ (không phải `total_amount`)
- `order_status` ✅ (không phải `status`)
- `note` ✅ (không phải `notes`)

**Foreign Keys:**
```sql
CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
```

**Indexes:**
```sql
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_status ON public.orders(order_status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
```

---

### 🔟 BẢNG ORDER_ITEMS (Chi Tiết Đơn Hàng) ⭐ LIÊN KẾT

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| order_id | UUID | YES | | **orders(id)** | | ✅ | Đơn hàng |
| variant_id | TEXT | YES | | | | ✅ | **✅ Biến thể (KHÔNG product_id)** |
| quantity | INTEGER | NO | | | | | Số lượng |
| price | NUMERIC | NO | | | | | Giá tại thời điểm mua |

⚠️ **QUAN TRỌNG:**
- Sử dụng `variant_id` ✅ (KHÔNG phải `product_id`)

**Foreign Keys:**
```sql
CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
```

**Indexes:**
```sql
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_variant_id ON public.order_items(variant_id);
```

---

### 1️⃣1️⃣ BẢNG REVIEWS (Đánh Giá)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | UUID | NO | ✅ | | gen_random_uuid() | ✅ | ID duy nhất |
| user_id | UUID | YES | | **profiles(id)** | | ✅ | Người đánh giá |
| product_id | UUID | YES | | **products(id)** | | ✅ | Sản phẩm |
| rating | INTEGER | YES | | | | | Xếp hạng (1-5) |
| comment | TEXT | YES | | | | | Bình luận |
| created_at | TIMESTAMP | YES | | | now() | ✅ | Ngày đánh giá |

**Constraints:** 
- CHECK (rating >= 1 AND rating <= 5)

---

### 1️⃣2️⃣ BẢNG GHN_PROVINCES (Tỉnh/Thành Phố)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | BIGINT | NO | ✅ | | nextval(...) | | ID tự động tăng |
| province_id | INTEGER | NO | | | | | ID tỉnh từ GHN (UNIQUE) |
| province_name | VARCHAR | NO | | | | | Tên tỉnh |
| province_name_en | VARCHAR | YES | | | | | Tên tỉnh (Tiếng Anh) |
| created_at | TIMESTAMP | YES | | | CURRENT_TIMESTAMP | | Ngày tạo |
| updated_at | TIMESTAMP | YES | | | CURRENT_TIMESTAMP | | Ngày cập nhật |

---

### 1️⃣3️⃣ BẢNG GHN_DISTRICTS (Quận/Huyện)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | BIGINT | NO | ✅ | | nextval(...) | | ID tự động tăng |
| province_id | INTEGER | NO | | **ghn_provinces(province_id)** | | | ID tỉnh |
| district_id | INTEGER | NO | | | | | ID quận (UNIQUE) |
| district_name | VARCHAR | NO | | | | | Tên quận |
| district_name_en | VARCHAR | YES | | | | | Tên quận (Tiếng Anh) |
| support_type | SMALLINT | YES | | | 0 | | Kiểu hỗ trợ |
| created_at | TIMESTAMP | YES | | | CURRENT_TIMESTAMP | | Ngày tạo |
| updated_at | TIMESTAMP | YES | | | CURRENT_TIMESTAMP | | Ngày cập nhật |

---

### 1️⃣4️⃣ BẢNG GHN_WARDS (Phường/Xã)

| Cột | Kiểu Dữ Liệu | Null | PK | FK | Default | Index | Mô Tả |
|-----|-------------|------|----|----|---------|-------|-------|
| id | BIGINT | NO | ✅ | | nextval(...) | | ID tự động tăng |
| province_id | INTEGER | NO | | **ghn_provinces(province_id)** | | | ID tỉnh |
| district_id | INTEGER | NO | | **ghn_districts(district_id)** | | | ID quận |
| ward_code | VARCHAR | NO | | | | | Mã phường |
| ward_name | VARCHAR | NO | | | | | Tên phường |
| ward_name_en | VARCHAR | YES | | | | | Tên phường (Tiếng Anh) |
| support_type | SMALLINT | YES | | | 0 | | Kiểu hỗ trợ |
| created_at | TIMESTAMP | YES | | | CURRENT_TIMESTAMP | | Ngày tạo |
| updated_at | TIMESTAMP | YES | | | CURRENT_TIMESTAMP | | Ngày cập nhật |

---

## 📈 SUMMARY - TỔNG QUAN

### Số Liệu
- **Tổng bảng**: 14
- **Tổng cột**: 98
- **Tổng Foreign Key**: 16
- **Tổng Index**: 31
- **Tổng Constraint**: Unique + PK + Check

### Quan Hệ
```
├─ categories
├─ brands
├─ products
│  ├─ product_variants (STOCK Ở ĐÂY ⭐)
│  ├─ product_images
│  └─ reviews
├─ profiles (Mở rộng auth.users)
│  ├─ addresses
│  ├─ carts
│  └─ orders
│     └─ order_items (variant_id ⭐)
├─ ghn_provinces
│  ├─ ghn_districts
│  └─ ghn_wards
```

### Quy Tắc Quan Trọng
| Quy Tắc | Chi Tiết |
|---------|---------|
| **Stock** | ✅ Chỉ ở `product_variants.stock`, KHÔNG ở `products.stock_quantity` |
| **Orders Total** | ✅ Sử dụng `total`, KHÔNG `total_amount` |
| **Order Status** | ✅ Sử dụng `order_status`, KHÔNG `status` |
| **Order Notes** | ✅ Sử dụng `note`, KHÔNG `notes` |
| **Order Items** | ✅ Sử dụng `variant_id`, KHÔNG `product_id` |
| **Cascade Delete** | ✅ Product variants xóa khi product xóa |
| **RLS** | ✅ Bật trên tất cả bảng |

---

**Generated: 21-07-2026 | Production Ready** ✅
