# 🧪 Order Flow End-to-End Test Guide

## Prerequisites
- ✅ SQL script `scripts/create-order-items-table.sql` đã được chạy trong Supabase
- ✅ Bảng `order_items` đã được tạo trong Supabase
- ✅ App đang chạy tại `http://localhost:3000`

---

## 📋 Step-by-Step Test Checklist

### Step 1: Prepare Test Data
- [ ] Vào http://localhost:3000 (shop home page)
- [ ] Kiểm tra có sản phẩm nào hiển thị không
- [ ] Tìm một sản phẩm có **màu sắc và size**

### Step 2: Add to Cart
- [ ] Click vào sản phẩm → Mở chi tiết modal
- [ ] Chọn **màu sắc** (ví dụ: "Đỏ")
- [ ] Chọn **size** (ví dụ: "M")
- [ ] Chọn **số lượng** (ví dụ: 2)
- [ ] Click **"Thêm vào giỏ"**
- [ ] Thấy alert "✅ Đã thêm vào giỏ hàng!"

### Step 3: Verify Cart Items
- [ ] Vào giỏ hàng (click icon giỏ hoặc vào /cart)
- [ ] Xem sản phẩm vừa thêm:
  - [ ] Tên sản phẩm hiển thị đúng
  - [ ] Màu sắc: "Đỏ"
  - [ ] Size: "M"
  - [ ] Số lượng: 2
  - [ ] Giá hiển thị đúng

### Step 4: Checkout Flow
- [ ] Click **"Thanh Toán Ngay"**
- [ ] Form checkout hiển thị
- [ ] Điền thông tin:
  - [ ] Email: `test@example.com`
  - [ ] Phone: `0123456789`
  - [ ] Chọn Province (ví dụ: Hà Nội)
  - [ ] Chọn District (ví dụ: Hoàn Kiếm)
  - [ ] Chọn Ward
  - [ ] Địa chỉ chi tiết: "123 Đường ABC"
  - [ ] Ghi chú (optional)

### Step 5: Verify Shipping Fee
- [ ] Phí vận chuyển được tính (xem **"Đang tính..."** → số tiền)
- [ ] Tổng tiền được cập nhật = Sản phẩm + Phí ship

### Step 6: Submit Order
- [ ] Check **"Select All"** để chọn tất cả sản phẩm
- [ ] Click **"Checkout"**
- [ ] Mở **DevTools (F12) → Console**
- [ ] Xem logs:
  - [ ] Log "📝 Preparing order data..."
  - [ ] Log "📦 Order items prepared: 1"
  - [ ] Log "✅ Order created successfully: [ORDER_ID]"
  - [ ] Log "✅ Items saved: 1"
- [ ] Thấy alert: `✅ Order placed! ID: [ORDER_ID] Total: ... VND Items: 1`
- [ ] Redirect về trang chủ

### Step 7: Verify in Admin Orders Page
- [ ] Vào http://localhost:3000/admin/orders
- [ ] Xem danh sách orders - đơn hàng vừa tạo phải ở **đầu list** (newest first)
- [ ] Click expand order vừa tạo
- [ ] Verify thông tin:
  - [ ] **Mã đơn**: Hiển thị (8 ký tự đầu của ID)
  - [ ] **Khách hàng**: test@example.com
  - [ ] **Điện thoại**: 0123456789
  - [ ] **Trạng thái**: ⏳ Chờ (pending)
  - [ ] **Thanh toán**: ⏳ Chờ Thanh Toán
  - [ ] **Phương thức**: COD
  - [ ] **Địa chỉ**: "123 Đường ABC, [Ward], [District], [Province]"

### Step 8: Verify Order Items
Trong admin order details, section **"Sản phẩm"**:
- [ ] **Số lượng sản phẩm**: 1 (nếu chỉ thêm 1 loại)
- [ ] **Tên sản phẩm**: Đúng tên
- [ ] **Màu**: Đỏ
- [ ] **Size**: M
- [ ] **SKU**: Hiển thị
- [ ] **Số lượng**: 2
- [ ] **Giá**: Hiển thị đúng (giá 1 cái)
- [ ] **Tổng**: Số lượng × Giá = đúng

### Step 9: Verify in Supabase
**Bảng `orders`:**
- [ ] Vào Supabase → Table Editor → `orders`
- [ ] Tìm order mới (filter bằng email hoặc ID)
- [ ] Verify:
  - [ ] `customer_email`: test@example.com
  - [ ] `customer_phone`: 0123456789
  - [ ] `total`: Tổng tiền đúng
  - [ ] `shipping_fee`: Phí ship đúng
  - [ ] `payment_method`: cod
  - [ ] `payment_status`: pending
  - [ ] `order_status`: pending
  - [ ] `shipping_address`: Địa chỉ đúng
  - [ ] `created_at`: Thời gian gần đây

**Bảng `order_items`:**
- [ ] Vào Supabase → Table Editor → `order_items`
- [ ] Filter: `order_id = [ORDER_ID]`
- [ ] Verify:
  - [ ] `product_name`: Tên sản phẩm đúng
  - [ ] `quantity`: 2
  - [ ] `price`: Giá 1 cái
  - [ ] `color`: Đỏ
  - [ ] `size`: M
  - [ ] `sku`: SKU đúng
  - [ ] `variant_id`: UUID (không null)
  - [ ] `product_id`: UUID (không null)

---

## 🐛 Troubleshooting

### Problem: Order created but NO items in order_items table

**Solution:**
1. Check console (F12) for error logs
2. Verify `order_items` table exists in Supabase:
   - Go to Table Editor
   - Look for `order_items` in table list
   - If NOT there, run `scripts/create-order-items-table.sql` again
3. Check Supabase RLS policy:
   - Go to `order_items` table → Policies
   - Should see "Allow all access" policy
   - If missing, create it manually

### Problem: 400 Bad Request error during checkout

**Solution:**
1. Check console (F12) for exact error message
2. Possible causes:
   - `variant_id` is NULL or empty string
   - Foreign key constraint error (product/variant doesn't exist)
   - RLS policy blocking insert
3. Verify:
   - When adding to cart, does `variant_id` get set? (Check localStorage: `shopping_cart`)
   - ProductDetailModal must pass `variant_id` when calling `addToCart()`

### Problem: Admin orders page shows order but NO items

**Solution:**
1. Check Supabase `order_items` table - is it empty?
2. If empty, likely `variant_id` issue (see above)
3. If table has data but not showing in UI:
   - Check browser console for fetch errors
   - Verify `getAllOrders()` function in supabase.ts
   - Check admin page query logic

### Problem: Variant doesn't have variant_id in CartContext

**Solution:**
1. Check `ProductDetailModal.tsx` line 46 - must pass `variant_id: selectedVariant.variant_id`
2. Check `ShopHome.tsx` - if adding from list view, variant may be missing
3. For list view, either:
   - Don't set variant_id (leave as undefined)
   - Or force open modal to select variant first

---

## ✅ Success Criteria

All of the following must be true:

1. ✅ Order created in `orders` table with correct customer info
2. ✅ Order items created in `order_items` table with product details
3. ✅ Admin page shows order with all product details (name, color, size, qty, price)
4. ✅ Supabase shows data in both tables
5. ✅ No console errors or warnings
6. ✅ Giỏ hàng được xóa sau checkout

---

## 📞 Next Steps After Success

Once all tests pass:
1. Test with multiple items in one order
2. Test with different colors/sizes of same product
3. Create a refund/cancellation flow
4. Add payment gateway integration (if needed)
5. Set up order notifications (email, SMS)
6. Create customer order tracking page

