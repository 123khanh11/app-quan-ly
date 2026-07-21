# ✅ TODO: HOÀN THÀNH TASK 7 (AUTO SHIPPING ADDRESS SYSTEM)

**Mục tiêu:** Tự động lấy shipping_address từ bảng addresses khi tạo order.

**Thời gian:** ~15 phút

**Status:** ✅ Sẽ hoàn thành trong hôm nay!

---

## 📋 CÁC BƯỚC LÀM (Chi tiết)

### ⏱️ BƯỚC 1: Chạy SQL Trigger (5 phút)

**NGAY BÂY GIỜ:**

1. **Mở link Supabase:**
   ```
   https://supabase.com/dashboard
   ```
   → Đăng nhập → Chọn project

2. **Vào SQL Editor:**
   - Menu trái → Click "SQL Editor"
   - Click "New Query" (nút bên phải)

3. **Mở file SQL:**
   ```
   AUTO_SHIPPING_ADDRESS_TRIGGER.sql
   ```
   - Copy toàn bộ nội dung
   - Ctrl+A → Ctrl+C

4. **Paste vào Supabase:**
   - Click vào text editor
   - Ctrl+V → Paste

5. **Chạy:**
   - Click "RUN" (hoặc Ctrl+Enter)
   - Chờ 2-3 giây

6. **Kết quả:**
   - Nếu thấy: `Query executed successfully` ✅ → Ok rồi!
   - Nếu có lỗi: → Gọi cho tôi

---

### ⏱️ BƯỚC 2: Xác minh Trigger (3 phút)

**Chạy query này trong SQL Editor để kiểm tra:**

```sql
SELECT tgname, tgrelname 
FROM pg_trigger 
WHERE tgname = 'trigger_auto_shipping_address';
```

**Kết quả kỳ vọng:**
```
tgname                          | tgrelname
---------------------------------+----------
trigger_auto_shipping_address   | orders
```

✅ Nếu thấy dòng này → Trigger đã được tạo thành công!

---

### ⏱️ BƯỚC 3: Test từ Website (5 phút)

**Truy cập website:**
```
https://e-commerce-website-interface.vercel.app
```

**Làm theo các bước:**
1. Chọn một sản phẩm → Click "Thêm vào giỏ"
2. Click "Giỏ Hàng" (cart button)
3. Click "Thanh Toán"
4. Điền thông tin:
   - Email: `test@example.com`
   - SĐT: `0123456789`
   - Tỉnh: `Hà Nội`
   - Quận: `Hà Đông`
   - Xã: `Phường Dương Nội`
   - Địa chỉ: `Số 123 Lê Lợi`
5. Click "Đặt Hàng"

**Kết quả kỳ vọng:**
```
✅ Đặt hàng thành công!
Mã đơn hàng: (một chuỗi ID)
Phí vận chuyển: 30,000 - 50,000 VNĐ
```

✅ Nếu thấy thông báo này → Order đã được tạo!

---

### ⏱️ BƯỚC 4: Kiểm tra trong Supabase (2 phút)

**Chạy query này để xem order vừa tạo:**

```sql
SELECT 
  id,
  total,
  shipping_fee,
  shipping_address,
  order_status,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 1;
```

**Kết quả kỳ vọng:**
```
id                                  | total    | shipping_fee | shipping_address                                    | order_status | created_at
------------------------------------|----------|--------------|-----------------------------------------------------|-------------|----------
550e8400-e29b-41d4-a716-446655440000| 530000   | 30000        | Số 123 Lê Lợi, Phường Dương Nội, Hà Đông, Hà Nội   | pending     | 2024-07-21...
```

✅ Nếu thấy `shipping_address` có giá trị → HOÀN THÀNH!

---

## 🎯 SUMMARY

| Bước | Task | Thời gian | Status |
|------|------|----------|--------|
| 1 | Chạy SQL trigger | 5 min | ⏳ TODO |
| 2 | Xác minh trigger | 3 min | ⏳ TODO |
| 3 | Test từ website | 5 min | ⏳ TODO |
| 4 | Kiểm tra Supabase | 2 min | ⏳ TODO |
| **TOTAL** | | **15 min** | ⏳ TODO |

---

## ❓ CÓ CÂU HỎI?

### Q: Trigger là gì?
- A: Một hàm database tự động chạy khi có sự kiện nhất định (ví dụ: insert order).

### Q: Nó làm gì?
- A: Khi tạo order, trigger tự động lấy `shipping_address` từ bảng `addresses`.

### Q: Nếu không có `addresses` table?
- A: Trigger sẽ set `shipping_address = "Chưa cập nhật địa chỉ"`

### Q: Nếu có lỗi?
- A: Gửi screenshot lỗi cho tôi, tôi sẽ fix.

### Q: Trigger sẽ chạy tự động không?
- A: Vâng, mỗi khi tạo order mới.

### Q: Có thể dùng được ngay trên production không?
- A: Vâng, production website đã hoạt động.

---

## 🚀 TIẾP THEO SAU KHI HOÀN THÀNH

Sau khi hoàn thành 4 bước:

1. ✅ **App Management** sẽ có thể lấy `shipping_address` từ orders table
2. ✅ **Website** sẽ tự động lưu địa chỉ giao hàng
3. ✅ **Trigger** sẽ tự động chạy cho mỗi order mới

---

## 📞 LIÊN HỆ

Nếu gặp vấn đề:
1. Screenshot lỗi
2. Gửi cho tôi
3. Tôi sẽ fix ngay

---

**⏱️ Bắt đầu ngay bây giờ! Chỉ cần 15 phút để hoàn thành.** 🚀
