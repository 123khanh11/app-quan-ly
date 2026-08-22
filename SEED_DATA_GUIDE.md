# Hướng Dẫn Seed Dữ Liệu GHN Vào Supabase

## Phương Pháp 1: Seed dữ liệu qua Vercel Endpoint (Dễ nhất)

Gọi endpoint này qua browser hoặc curl:

```
POST https://e-commerce-website-interface.vercel.app/api/seed-ghn
```

Sẽ tự động insert dữ liệu vào các bảng:
- `ghn_provinces` - 4 tỉnh
- `ghn_districts` - 14 quận/huyện
- `ghn_wards` - 16 phường/xã

**Cách làm:**
1. Mở link: `https://e-commerce-website-interface.vercel.app/api/seed-ghn?debug=1`
2. Hoặc dùng cURL:
```bash
curl -X POST https://e-commerce-website-interface.vercel.app/api/seed-ghn
```

---

## Phương Pháp 2: Seed dữ liệu qua Supabase SQL Editor

1. Vào https://supabase.com → Project `edtxexnhpbipcecceoop`
2. Bên trái chọn **SQL Editor**
3. Click **New Query**
4. Copy toàn bộ nội dung file `scripts/seed-locations.sql`
5. Paste vào editor
6. Click **Run** (Ctrl+Enter)
7. Kết quả: ✅ Dữ liệu đã insert thành công

---

## Phương Pháp 3: Seed dữ liệu từ Node.js

```bash
cd "E-commerce website interface"
node scripts/seed-ghn-direct.js
```

---

## Kiểm Tra Dữ Liệu

Sau khi seed, kiểm tra dữ liệu:

```bash
# Quận/Huyện của Hà Nội (province_id = 1)
curl "https://e-commerce-website-interface.vercel.app/api/ghn-districts?province_id=1"

# Phường/Xã của Hà Đông (district_id = 1455)
curl "https://e-commerce-website-interface.vercel.app/api/ghn-wards?district_id=1455"
```

---

## Dữ Liệu được Seed

### Tỉnh (4):
- Hà Nội (1)
- TP. Hồ Chí Minh (58)
- Đà Nẵng (48)
- Hải Phòng (40)

### Quận/Huyện (14):
- **Hà Nội:** Hoàn Kiếm, Ba Đình, Tây Hồ, Long Biên, Hà Đông, Thanh Trì
- **TP.HCM:** Q1, Q3, Q4, Bình Chánh, Tân Phú
- **Đà Nẵng:** Hải Châu, Thanh Khê, Sơn Trà

### Phường/Xã (16):
Mỗi quận/huyện có 2-3 phường/xã

---

## Troubleshooting

**Lỗi: "Column "id" has type bigserial but expression has type integer"**
- Nguyên nhân: Constraint unique key bị conflict
- Cách sửa: Xóa dữ liệu cũ rồi insert lại

**Lỗi: "Invalid API key"**
- Nguyên nhân: Service role key hết hạn
- Cách sửa: Dùng Supabase SQL Editor (Phương Pháp 2) thay vì Node.js

**API trả về mock data thay vì Supabase data**
- Nguyên nhân: Dữ liệu chưa được seed vào DB
- Cách sửa: Chạy một trong 3 phương pháp seed ở trên
