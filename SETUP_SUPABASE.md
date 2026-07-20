# 🚀 SETUP SUPABASE & SEED DATA

## 📋 Bước 1: Tạo bảng trong Supabase

### 1.1 Vào Supabase Dashboard
- Mở: https://supabase.com/dashboard
- Chọn project (hoặc tạo mới)
- Click **"SQL Editor"** (menu bên trái)

### 1.2 Chạy SQL Script
- Click **"New Query"** (nút xanh)
- Xóa text mặc định
- **Copy toàn bộ SQL dưới đây** và paste vào editor

```sql
-- GHN_PROVINCES
CREATE TABLE IF NOT EXISTS ghn_provinces (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL UNIQUE,
  province_name VARCHAR(100) NOT NULL,
  province_name_en VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_province_id ON ghn_provinces(province_id);
CREATE INDEX IF NOT EXISTS idx_province_name ON ghn_provinces(province_name);

-- GHN_DISTRICTS
CREATE TABLE IF NOT EXISTS ghn_districts (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL,
  district_id INTEGER NOT NULL,
  district_name VARCHAR(100) NOT NULL,
  district_name_en VARCHAR(100),
  support_type SMALLINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(province_id, district_id),
  FOREIGN KEY (province_id) REFERENCES ghn_provinces(province_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_province_district ON ghn_districts(province_id);
CREATE INDEX IF NOT EXISTS idx_district_id ON ghn_districts(district_id);
CREATE INDEX IF NOT EXISTS idx_district_name ON ghn_districts(district_name);

-- GHN_WARDS
CREATE TABLE IF NOT EXISTS ghn_wards (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL,
  district_id INTEGER NOT NULL,
  ward_code VARCHAR(20) NOT NULL,
  ward_name VARCHAR(100) NOT NULL,
  ward_name_en VARCHAR(100),
  support_type SMALLINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(district_id, ward_code),
  FOREIGN KEY (district_id) REFERENCES ghn_districts(district_id) ON DELETE CASCADE,
  FOREIGN KEY (province_id) REFERENCES ghn_provinces(province_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_district_ward ON ghn_wards(district_id);
CREATE INDEX IF NOT EXISTS idx_ward_code ON ghn_wards(ward_code);
CREATE INDEX IF NOT EXISTS idx_ward_name ON ghn_wards(ward_name);
CREATE INDEX IF NOT EXISTS idx_province_ward ON ghn_wards(province_id);

-- Enable RLS
ALTER TABLE IF EXISTS ghn_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ghn_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ghn_wards ENABLE ROW LEVEL SECURITY;

-- RLS Policies - cho phép đọc (SELECT)
DROP POLICY IF EXISTS "Allow read provinces" ON ghn_provinces;
DROP POLICY IF EXISTS "Allow read districts" ON ghn_districts;
DROP POLICY IF EXISTS "Allow read wards" ON ghn_wards;

CREATE POLICY "Allow read provinces" ON ghn_provinces FOR SELECT USING (true);
CREATE POLICY "Allow read districts" ON ghn_districts FOR SELECT USING (true);
CREATE POLICY "Allow read wards" ON ghn_wards FOR SELECT USING (true);
```

### 1.3 Chạy Query
- Click nút **"RUN"** (màu xanh phía trên)
- Chờ kết quả ✅ "Query executed successfully"

---

## 🌱 Bước 2: Seed Mock Data

Sau khi bảng được tạo, chạy lệnh này để insert dữ liệu:

```bash
cd "C:\Users\baomu\Downloads\E-commerce website interface"
node scripts/seed-ghn-data.js
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════╗
║   GHN DATA SEEDING - Insert Mock Data            ║
╚═══════════════════════════════════════════════════╝

✅ Inserted 3 provinces
✅ Inserted 12 districts
✅ Inserted 13 wards

✅ Success! Mock data seeded to Supabase database.
   - Hà Nội (6 districts)
   - TP.HCM (4 districts)
   - Đà Nẵng (2 districts)
```

---

## ✅ Bước 3: Verify Data

### Trong Supabase SQL Editor, chạy:

```sql
-- Xem tất cả tỉnh
SELECT * FROM ghn_provinces ORDER BY province_name;

-- Xem quận/huyện của Hà Nội (province_id = 1)
SELECT * FROM ghn_districts WHERE province_id = 1 ORDER BY district_name;

-- Xem phường/xã của Hà Đông (district_id = 1455)
SELECT * FROM ghn_wards WHERE district_id = 1455 ORDER BY ward_name;

-- Thống kê
SELECT 
  COUNT(DISTINCT province_id) as "Tỉnh/TP",
  COUNT(DISTINCT district_id) as "Quận/Huyện",
  COUNT(*) as "Phường/Xã"
FROM ghn_wards;
```

---

## 🔄 Bước 4: Update CheckoutForm (Optional)

Để dùng database thay vì API gọi từ GHN (nhanh hơn):

**File:** `src/app/components/checkout/CheckoutForm.tsx`

Thay đổi từ:
```typescript
import { getDistricts, getWards } from '@/services/ghn-api'
```

Thành:
```typescript
import { getDistrictsFromDB, getWardsFromDB } from '@/services/ghn-db'
```

Sau đó cập nhật gọi:
```typescript
const districts = await getDistrictsFromDB(selectedProvince)
const wards = await getWardsFromDB(selectedDistrict)
```

---

## 🎯 Kết Quả

✅ Supabase đã có dữ liệu tỉnh/quận/phường
✅ Website load data từ DB thay vì gọi GHN API
✅ Faster, reliable, no rate limits

---

## 📞 Troubleshooting

### Query error: "table does not exist"
→ Check SQL script chạy thành công chưa (step 1.3)

### seed-ghn-data.js error: "table not found"
→ Run SQL script trước (step 1.2-1.3)

### Vercel deploy bị lỗi
→ Supabase URL & KEY phải trong Vercel Environment Variables

---

## 💡 Lưu ý

- Mock data chỉ có 3 tỉnh chính (Hà Nội, TP.HCM, Đà Nẵng)
- Để có toàn bộ 63 tỉnh, cần token GHN hợp lệ
- Sau khi có token, chạy: `node scripts/sync-ghn-data.js`

