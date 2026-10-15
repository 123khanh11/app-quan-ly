# Hướng Dẫn Cập Nhật Weight Cho Product Variants

## ⚠️ Vấn Đề
Khi tính phí vận chuyển, hệ thống chỉ lấy được weight = **500g (default)** thay vì **100kg** thực tế.

**Nguyên nhân:** Column `weight_kg` trong bảng `product_variants` chưa được điền hoặc đang **NULL**.

---

## 🔧 Cách Fix

### **Cách 1: Dùng Supabase SQL Editor (Dễ nhất)**

1. **Vào Supabase Dashboard**
   - URL: https://app.supabase.com
   - Đăng nhập account
   - Chọn project e-commerce

2. **Mở SQL Editor**
   - Click **SQL Editor** (bên trái)
   - Click **+ New query**

3. **Chạy query cập nhật weight**

   ```sql
   -- Cập nhật weight cho tất cả variants chưa có weight
   UPDATE public.product_variants
   SET 
     weight_kg = 100,           -- Thay 100 bằng weight thực tế (kg)
     length_cm = 50,            -- Thay 50 bằng length thực tế (cm)
     width_cm = 40,             -- Thay 40 bằng width thực tế (cm)
     height_cm = 30,            -- Thay 30 bằng height thực tế (cm)
     updated_at = now()
   WHERE 
     weight_kg IS NULL;         -- Chỉ cập nhật những cái chưa có weight
   ```

4. **Kiểm tra kết quả**
   ```sql
   SELECT id, sku, color, size, weight_kg, length_cm, width_cm, height_cm
   FROM public.product_variants
   LIMIT 20;
   ```

---

### **Cách 2: Cập Nhật Theo SKU Cụ Thể**

Nếu bạn muốn cập nhật từng sản phẩm:

```sql
-- Cập nhật sản phẩm có SKU = 'PRODUCT-001'
UPDATE public.product_variants
SET 
  weight_kg = 100,
  length_cm = 50,
  width_cm = 40,
  height_cm = 30,
  updated_at = now()
WHERE 
  sku = 'PRODUCT-001';
```

---

### **Cách 3: Dùng Data Editor (GUI)**

1. **Vào Supabase Dashboard**
2. **Click Table Editor** (bên trái)
3. **Chọn bảng `product_variants`**
4. **Click vào variant cần cập nhật**
5. **Sửa cột `weight_kg`** → Nhập giá trị (kg)
6. **Sửa `length_cm`, `width_cm`, `height_cm`** (tùy chọn)
7. **Click Save**

---

## 📋 Giá Trị Recommendation

### **Nếu sản phẩm là 100kg:**
```sql
weight_kg = 100,       -- 100 kg
length_cm = 50,        -- 50 cm (dài)
width_cm = 40,         -- 40 cm (rộng)
height_cm = 30         -- 30 cm (cao)
```

### **Nếu sản phẩm nhỏ (< 1kg):**
```sql
weight_kg = 0.5,       -- 500g
length_cm = 20,        -- 20 cm
width_cm = 15,         -- 15 cm
height_cm = 10         -- 10 cm
```

### **Nếu sản phẩm trung bình (1-5kg):**
```sql
weight_kg = 2,         -- 2 kg
length_cm = 30,        -- 30 cm
width_cm = 25,         -- 25 cm
height_cm = 15         -- 15 cm
```

---

## ✅ Kiểm Tra Sau Khi Cập Nhật

1. **Vào website**
2. **Thêm sản phẩm vào giỏ**
3. **Vào Checkout → Chọn địa chỉ**
4. **Mở DevTools (F12) → Console**
5. **Xem log:**
   ```
   📦 Item: Sản phẩm - Weight: 100000g, L:50cm, W:40cm, H:30cm
   📊 Tổng cộng - Khối lượng: 100000g, L:50cm, W:40cm, H:30cm, Số item: 1
   ✅ Phí ship từ API: 150000đ
   ```

   **Nếu weight vẫn 500g → check lại database**

---

## 🔍 Debug: Xem Weight Hiện Tại

```sql
-- Xem tất cả variants và weight của chúng
SELECT 
  product_id,
  sku,
  color,
  size,
  weight_kg,          -- ← Check giá trị này
  length_cm,
  width_cm,
  height_cm,
  stock,
  price
FROM public.product_variants
ORDER BY created_at DESC
LIMIT 50;
```

---

## 🚀 Hoặc Dùng API Debug

```
GET /api/debug-variants?product_id=<YOUR_PRODUCT_ID>

Ví dụ:
https://e-commerce-website-interface.vercel.app/api/debug-variants?product_id=550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "variants": [
    {
      "sku": "PRODUCT-001",
      "weight_kg": 100,    -- ← Check here!
      "length_cm": 50,
      "width_cm": 40,
      "height_cm": 30
    }
  ]
}
```

---

## 💡 Nếu Vẫn Không Work

1. **Hard refresh website:** Ctrl+Shift+R
2. **Clear cache:** DevTools → Application → Clear storage
3. **Check Console logs:**
   ```
   📦 Item: ... Weight: XXXg
   ```
   
4. **Nếu vẫn là 500g → weight_kg vẫn NULL trong database**

---

## ⚡ Quick Fix (Nhanh nhất)

**Vào Supabase SQL Editor, chạy:**

```sql
UPDATE product_variants
SET weight_kg = 100, length_cm = 50, width_cm = 40, height_cm = 30, updated_at = now()
WHERE weight_kg IS NULL;

SELECT * FROM product_variants LIMIT 5;
```

Xong! 🎉
