# 🌱 Hướng Dẫn Seed Dữ Liệu GHN Vào Supabase

## ✨ Phương Pháp Dễ Nhất: Dùng Supabase Dashboard

### Bước 1: Vào Supabase
Mở link: https://supabase.com/

### Bước 2: Đăng nhập vào Project
- Chọn project **edtxexnhpbipcecceoop**

### Bước 3: Mở SQL Editor
- Bên trái panel → **SQL Editor**
- Click **New Query** (hoặc Ctrl+K)

### Bước 4: Copy SQL Script
Copy toàn bộ nội dung file này:
👉 `scripts/seed-locations.sql`

### Bước 5: Paste và Run
- Paste vào editor
- Click **Run** (hoặc Ctrl+Enter)
- Kết quả: ✅ Query thành công

---

## 🔍 Kiểm Tra Dữ Liệu

Sau khi seed xong, kiểm tra bằng cách mở SQL Editor mới và chạy:

```sql
-- Check provinces
SELECT COUNT(*) as total_provinces FROM public.ghn_provinces;

-- Check districts
SELECT COUNT(*) as total_districts FROM public.ghn_districts;

-- Check wards
SELECT COUNT(*) as total_wards FROM public.ghn_wards;
```

**Kết quả mong đợi:**
- total_provinces: 4
- total_districts: 14
- total_wards: 16

---

## 🧪 Test API Endpoints

Sau khi seed, test các endpoint này:

### 1. Danh sách Quận/Huyện của Hà Nội
```
https://e-commerce-website-interface.vercel.app/api/ghn-districts?province_id=1
```

**Response mong đợi:**
```json
{
  "success": true,
  "data": [
    { "district_id": 1, "district_name": "Hoàn Kiếm" },
    { "district_id": 2, "district_name": "Ba Đình" },
    { "district_id": 1455, "district_name": "Hà Đông" },
    ...
  ],
  "source": "supabase"
}
```

### 2. Danh sách Phường/Xã của Hà Đông
```
https://e-commerce-website-interface.vercel.app/api/ghn-wards?district_id=1455
```

**Response mong đợi:**
```json
{
  "success": true,
  "data": [
    { "ward_code": "21617", "ward_name": "Phúc Diễn" },
    { "ward_code": "21618", "ward_name": "Dương Nội" },
    { "ward_code": "21619", "ward_name": "Hà Cầu" }
  ],
  "source": "supabase"
}
```

### 3. Checkout Form
Mở: https://e-commerce-website-interface.vercel.app
- Thêm sản phẩm vào cart
- Click Checkout
- Chọn Province → District → Ward
- Kiểm tra xem dropdown có dữ liệu từ DB không
- Tính phí vận chuyển

---

## 📊 Dữ Liệu Được Seed

### 4 Tỉnh:
1. **Hà Nội** (1)
2. **TP. Hồ Chí Minh** (58)
3. **Đà Nẵng** (48)
4. **Hải Phòng** (40)

### 14 Quận/Huyện:
- **Hà Nội:** Hoàn Kiếm, Ba Đình, Tây Hồ, Long Biên, Hà Đông, Thanh Trì
- **TP.HCM:** Q1, Q3, Q4, Bình Chánh, Tân Phú
- **Đà Nẵng:** Hải Châu, Thanh Khê, Sơn Trà

### 16 Phường/Xã:
Mỗi quận/huyện có 2-3 phường/xã

---

## 🆘 Troubleshooting

### Lỗi: "duplicate key value violates unique constraint"
**Nguyên nhân:** Dữ liệu đã tồn tại  
**Cách sửa:** Xóa dữ liệu cũ trước
```sql
DELETE FROM public.ghn_wards;
DELETE FROM public.ghn_districts;
DELETE FROM public.ghn_provinces;
```
Rồi run seed script lại.

### API trả về mock data thay vì Supabase data
**Nguyên nhân:** Dữ liệu chưa được seed vào DB  
**Cách sửa:** Chạy script seed ở trên (Bước 1-5)

### "source": "mock" trong response
**Nguyên nhân:** Supabase query failed, API fallback về mock  
**Cách sửa:** 
1. Check connection đến Supabase
2. Check API key có valid không
3. Check table có dữ liệu không (dùng SQL query ở trên)

---

## 📝 Notes
- Seed script chỉ chứa dữ liệu cơ bản
- Để thêm thêm Tỉnh/Quận/Phường, edit `scripts/seed-locations.sql`
- Chỉ cần run 1 lần (dữ liệu không thay đổi)
