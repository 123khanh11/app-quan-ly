# 📋 Hướng Dẫn Tích Hợp Khuyến Mại

## ✅ Tính Năng Đã Triển Khai

### App Bán Hàng (Customer)
- ✅ **Hiển thị khuyến mại hiện tại** - Badge màu cam với giá trị khuyến mại
- ✅ **Liệt kê tất cả khuyến mại** - Danh sách tất cả ưu đãi có sẵn
- ✅ **Cập nhật giá động** - Giá tự động thay đổi khi chọn số lượng
- ✅ **Hiển thị tiền tiết kiệm** - Tính toán số tiền khách hàng tiết kiệm được
- ✅ **Hỗ trợ 3 loại khuyến mại**:
  - Miễn phí ship (📦 Free Shipping)
  - Giảm theo % (💰 Percentage Discount)
  - Giảm cố định (💵 Fixed Discount)

---

## 🔧 Bước 1: Chạy SQL Tạo Table

### 1.1 Mở Supabase Dashboard
1. Truy cập: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Click **New Query**

### 1.2 Copy & Chạy SQL

Copy toàn bộ nội dung từ file `scripts/create-product-promotions-table.sql` hoặc chạy trực tiếp:

```sql
-- Create product_promotions table
CREATE TABLE IF NOT EXISTS product_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('free_shipping', 'percentage_discount', 'fixed_discount')),
  promotion_value DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_promotions_product_id ON product_promotions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_promotions_active ON product_promotions(is_active);

ALTER TABLE product_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON product_promotions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage" ON product_promotions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_product_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_product_promotions_updated_at ON product_promotions;
CREATE TRIGGER trigger_product_promotions_updated_at
  BEFORE UPDATE ON product_promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_product_promotions_updated_at();
```

### 1.3 Chạy Query
- Click **Run** (hoặc Ctrl+Enter)
- Chờ 2-3 giây
- Khi thấy ✅ **Success**, table đã được tạo

---

## 📊 Cấu Trúc Table

| Trường | Kiểu | Mô Tả |
|--------|------|-------|
| `id` | UUID | ID khuyến mại |
| `product_id` | UUID | ID sản phẩm |
| `min_quantity` | INTEGER | Số lượng tối thiểu để áp dụng |
| `promotion_type` | TEXT | Loại: `free_shipping`, `percentage_discount`, `fixed_discount` |
| `promotion_value` | DECIMAL | Giá trị (% hoặc tiền) |
| `description` | TEXT | Mô tả khuyến mại |
| `is_active` | BOOLEAN | Kích hoạt/Tắt |
| `created_at` | TIMESTAMP | Lúc tạo |
| `updated_at` | TIMESTAMP | Lúc cập nhật |

---

## 🛍️ Các Loại Khuyến Mại

### 1️⃣ Miễn Phí Ship (Free Shipping)
```json
{
  "product_id": "...",
  "min_quantity": 2,
  "promotion_type": "free_shipping",
  "promotion_value": 0,
  "description": "Miễn phí ship khi mua từ 2 sản phẩm"
}
```

### 2️⃣ Giảm Theo % (Percentage Discount)
```json
{
  "product_id": "...",
  "min_quantity": 3,
  "promotion_type": "percentage_discount",
  "promotion_value": 10,
  "description": "Giảm 10% khi mua từ 3 cái trở lên"
}
```

### 3️⃣ Giảm Cố Định (Fixed Discount)
```json
{
  "product_id": "...",
  "min_quantity": 5,
  "promotion_type": "fixed_discount",
  "promotion_value": 50000,
  "description": "Giảm 50,000₫ khi mua từ 5 cái"
}
```

---

## 🧪 Hướng Dẫn Test

### Test 1: Tạo Khuyến Mại Giảm %

**Bước 1: Thêm Khuyến Mại Vào Database**

Vào Supabase SQL Editor:

```sql
INSERT INTO product_promotions (product_id, min_quantity, promotion_type, promotion_value, description, is_active)
VALUES (
  '6e88c5a1-f3c0-456e-9e1c-7d8bb3c0c9a0', -- Thay bằng ID sản phẩm thực tế
  2,
  'percentage_discount',
  10,
  'Giảm 10% khi mua từ 2 cái',
  true
);
```

**Bước 2: Kiểm Tra Trên App**
1. Mở app bán hàng
2. Vào trang chi tiết sản phẩm
3. Thay đổi số lượng thành 2
4. Kiểm tra:
   - ✅ Badge khuyến mại hiển thị: "💰 Giảm 10%"
   - ✅ Giá gốc bị gạch bỏ
   - ✅ Giá mới = Giá gốc × 90%
   - ✅ Hiển thị tiền tiết kiệm

### Test 2: Miễn Phí Ship

```sql
INSERT INTO product_promotions (product_id, min_quantity, promotion_type, promotion_value, description, is_active)
VALUES (
  '6e88c5a1-f3c0-456e-9e1c-7d8bb3c0c9a0',
  5,
  'free_shipping',
  0,
  'Miễn phí ship khi mua từ 5 cái',
  true
);
```

Kiểm tra: Khi mua 5 cái, phí ship = 0

### Test 3: Giảm Cố Định

```sql
INSERT INTO product_promotions (product_id, min_quantity, promotion_type, promotion_value, description, is_active)
VALUES (
  '6e88c5a1-f3c0-456e-9e1c-7d8bb3c0c9a0',
  10,
  'fixed_discount',
  100000,
  'Giảm 100,000₫ khi mua từ 10 cái',
  true
);
```

Kiểm tra: Khi mua 10 cái, giá = Giá gốc - 100,000₫

---

## 💻 Architecture

### Thành Phần Chính

```
app-ban-hang (Customer)
├── src/services/
│   ├── promotionService.ts       // ⭐ Service xử lý khuyến mại
│   └── supabase.ts               // Service Supabase
├── src/app/components/
│   └── shop/ProductDetailPage.tsx // ⭐ Hiển thị khuyến mại
└── scripts/
    └── create-product-promotions-table.sql  // ⭐ SQL tạo table
```

### Data Flow

```
Supabase Database (product_promotions table)
         ↓
promotionService.getProductPromotions()
         ↓
calculatePromotion() → tìm khuyến mại phù hợp theo số lượng
         ↓
calculateDiscountedPrice() → tính giá sau khuyến mại
         ↓
ProductDetailPage hiển thị:
  - Badge khuyến mại
  - Giá gốc (gạch bỏ) + Giá mới
  - Tiền tiết kiệm
  - Danh sách tất cả khuyến mại
```

---

## 🎨 Giao Diện Hiển Thị

### 1. Badge Khuyến Mại Hiện Tại
```
┌─────────────────────────────────────┐
│ 📦 Miễn phí ship                     │
│ Miễn phí ship khi mua từ 2 cái trở lên │
└─────────────────────────────────────┘
```

### 2. Danh Sách Tất Cả Khuyến Mại
```
⚡ Các Khuyến Mại Khả Dụng
• Mua từ 2 sản phẩm: 📦 Miễn phí ship
• Mua từ 3 sản phẩm: 💰 Giảm 10%
• Mua từ 5 sản phẩm: 💵 Giảm 50,000₫
```

### 3. Hiển Thị Giá
```
Giá gốc:          450,000đ (gạch bỏ)
Khuyến mại:       -10%
Giá mới:          405,000đ
Tiền tiết kiệm:   💰 45,000đ

Số lượng: 2
Tổng:             810,000đ
```

---

## 📱 Mobile View

Trên mobile, khuyến mại hiển thị:
1. Badge khuyến mại (đầu tiên)
2. Danh sách khuyến mại (nếu có)
3. Giá với tiền tiết kiệm (responsive)
4. Thanh thanh toán nhanh (ở dưới)

---

## ⚙️ Các Hàm Chính

### `promotionService.getProductPromotions(productId)`
**Lấy tất cả khuyến mại của sản phẩm**

```typescript
const promotions = await promotionService.getProductPromotions(productId)
// Returns: ProductPromotion[]
```

### `promotionService.calculatePromotion(promotions, quantity)`
**Tìm khuyến mại phù hợp dựa trên số lượng**

```typescript
const promo = promotionService.calculatePromotion(promotions, 3)
// Returns: ProductPromotion | null
```

### `promotionService.calculateDiscountedPrice(price, promotion)`
**Tính giá sau khuyến mại**

```typescript
const finalPrice = promotionService.calculateDiscountedPrice(100000, promo)
// Nếu giảm 10%: Returns 90000
// Nếu giảm 20,000₫: Returns 80000
```

### `promotionService.calculateShippingFee(fee, promotion)`
**Tính phí ship sau khuyến mại**

```typescript
const shippingFee = promotionService.calculateShippingFee(30000, promo)
// Nếu khuyến mại miễn ship: Returns 0
// Nếu khuyến mại khác: Returns 30000
```

---

## 🔄 Tính Năng Real-Time

Supabase hỗ trợ **real-time subscription**, nên:
- ✅ Khi admin tạo khuyến mại → Khách hàng sẽ thấy ngay (không cần reload)
- ✅ Khi admin tắt khuyến mại → Khách hàng sẽ thấy ngay
- ✅ Khi admin cập nhật giá trị khuyến mại → Khách hàng sẽ thấy ngay

---

## ❓ Câu Hỏi Thường Gặp

**Q: Áp dụng bao nhiêu khuyến mại cùng lúc?**
A: Hiện tại chỉ áp dụng 1 khuyến mại tốt nhất (theo số lượng cao nhất). Có thể cập nhật logic để áp dụng nhiều trong tương lai.

**Q: Thứ tự khuyến mại như thế nào?**
A: Khuyến mại được sắp xếp theo `min_quantity` tăng dần. Khi khách hàng chọn số lượng X, hệ thống tìm khuyến mại có `min_quantity` cao nhất ≤ X.

**Q: Nếu xóa khuyến mại?**
A: Vào Supabase, tìm row khuyến mại, click Delete hoặc set `is_active = false`.

**Q: Có thể áp dụng khuyến mại cho nhiều sản phẩm?**
A: Hiện tại tạo từng khuyến mại cho từng sản phẩm. Có thể mở rộng để tạo khuyến mại theo danh mục.

---

## 🚀 Tiếp Theo

### Có thể thêm sau:
- [ ] Khuyến mại theo danh mục sản phẩm
- [ ] Khuyến mại theo thời gian (flash sale)
- [ ] Kết hợp nhiều khuyến mại
- [ ] Mã coupon riêng
- [ ] Dashboard quản lý khuyến mại tại admin
- [ ] Lịch sử khuyến mại

---

**✅ Setup hoàn tất!** 

Bây giờ:
1. Chạy SQL tạo table ✓
2. Test tạo khuyến mại ✓
3. Kiểm tra hiển thị trên app ✓

Hãy cho tôi biết nếu có vấn đề! 🎉
