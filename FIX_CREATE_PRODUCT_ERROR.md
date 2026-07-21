# 🔧 Fix Lỗi "Could not find 'stock_quantity' column"

## ⚠️ Vấn Đề

Khi thêm sản phẩm, hiện lỗi:
```
Could not find the 'stock_quantity' column of 'products' in the schema cache
```

## 🎯 Nguyên Nhân

- Code đã được fix (không dùng stock_quantity)
- Nhưng **Supabase schema cache còn lưu reference cũ**
- Cache chưa được refresh

## ✅ Giải Pháp

### **Bước 1: Vào Supabase SQL Editor**

1. Vào: https://supabase.com → Đăng nhập
2. Chọn project của bạn
3. Bên trái → **SQL Editor**
4. Click **New Query**

### **Bước 2: Copy SQL Script**

Copy toàn bộ từ file: `FIX_STOCK_QUANTITY_ERROR.sql`

Hoặc chạy các lệnh này:

```sql
-- OPTION 1: Drop old policies
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;

-- OPTION 2: Create clean policies
CREATE POLICY "Allow authenticated to insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all to read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated to update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- OPTION 3: Check if stock_quantity column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY column_name;
```

### **Bước 3: Run Query**

1. Click **Run** button (hoặc Ctrl+Enter)
2. Wait for result
3. ✅ Done!

### **Bước 4: Test App**

1. Refresh browser: https://app-ql-v2.vercel.app
2. Go to Products page
3. Click "Thêm Sản Phẩm"
4. Nhập dữ liệu & click "Thêm"
5. ✅ Should work now!

---

## 🔍 Verify

Nếu vẫn lỗi, kiểm tra:

1. **Products table có `stock_quantity` column không?**
   ```sql
   \d products;
   ```
   
   Nếu có, xóa nó:
   ```sql
   ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;
   ```

2. **RLS policies đúng không?**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'products';
   ```

3. **Truncate table để reset:**
   ```sql
   TRUNCATE TABLE products CASCADE;
   ```

---

## 📝 Tómlược

| Bước | Tác Vụ |
|------|--------|
| 1 | Vào Supabase SQL Editor |
| 2 | Copy script từ FIX_STOCK_QUANTITY_ERROR.sql |
| 3 | Run query |
| 4 | Refresh app & test |

---

**Thực hiện xong báo tôi!** 🚀
