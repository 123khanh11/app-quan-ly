# 📦 Hướng Dẫn Kết Nối Database Địa Chỉ (GHN)

## 🎯 Tổng Quan

Phần **Địa Chỉ Giao Hàng** trong checkout form kết nối với database **Supabase** để lấy dữ liệu:
- **Tỉnh/Thành phố** (63 cái)
- **Quận/Huyện** (722 cái) 
- **Xã/Phường** (11,980 cái)

---

## 🔑 Bước 1: Tạo Supabase Project

### 1.1 Đăng Ký / Đăng Nhập
- Truy cập: https://supabase.com
- Đăng nhập bằng GitHub

### 1.2 Tạo Project Mới
1. Click **"New Project"** hoặc **"Create new project"**
2. Điền thông tin:
   - **Project Name**: `e-commerce-ghn`
   - **Database Password**: Nhập mật khẩu (lưu giữ kĩ!)
   - **Region**: Chọn `Singapore` (gần Việt Nam nhất)
3. Click **"Create new project"** → Chờ ~30 giây

### 1.3 Lấy Thông Tin Kết Nối
Sau khi project được tạo:
1. Vào **Settings** → **Database**
2. Tìm **Connection string** hoặc **Project URL**
3. Copy URL dạng: `https://xxxxx.supabase.co`
4. Vào **Settings** → **API**
5. Copy **anon public** key (dạng: `sb_publishable_xxxxx`)

---

## 📊 Bước 2: Tạo Database Tables

### 2.1 Mở SQL Editor
1. Vào Supabase Dashboard
2. Click **SQL Editor** (trái sidebar)
3. Click **"New Query"**

### 2.2 Copy SQL Tạo Table

**Chạy SQL này**:

```sql
-- Tạo table Provinces (Tỉnh/Thành phố)
CREATE TABLE IF NOT EXISTS ghn_provinces (
  id SERIAL PRIMARY KEY,
  province_id INTEGER UNIQUE NOT NULL,
  province_name VARCHAR(255) NOT NULL,
  province_name_en VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo table Districts (Quận/Huyện)
CREATE TABLE IF NOT EXISTS ghn_districts (
  id SERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL REFERENCES ghn_provinces(province_id),
  district_id INTEGER UNIQUE NOT NULL,
  district_name VARCHAR(255) NOT NULL,
  district_name_en VARCHAR(255),
  support_type INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo table Wards (Xã/Phường)
CREATE TABLE IF NOT EXISTS ghn_wards (
  id SERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL,
  district_id INTEGER NOT NULL REFERENCES ghn_districts(district_id),
  ward_code VARCHAR(10) UNIQUE NOT NULL,
  ward_name VARCHAR(255) NOT NULL,
  ward_name_en VARCHAR(255),
  support_type INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Click **"Run"** ✅

### 2.3 Fix RLS (Row Level Security) - Cho Phép Public Read

**Chạy SQL này**:

```sql
-- Cho phép anonymous users read data
ALTER TABLE ghn_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghn_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghn_wards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read provinces" ON ghn_provinces FOR SELECT USING (true);
CREATE POLICY "Allow public read districts" ON ghn_districts FOR SELECT USING (true);
CREATE POLICY "Allow public read wards" ON ghn_wards FOR SELECT USING (true);
```

Click **"Run"** ✅

---

## 🔌 Bước 3: Cấu Hình Environment Variables

### 3.1 Tạo/Cập Nhật `.env.local`

Tạo file `.env.local` trong thư mục gốc project:

```
# Supabase Configuration
VITE_SUPABASE_URL="https://xxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_xxxxx"
```

**Thay thế**:
- `xxxxx.supabase.co` → URL từ bước 1.3
- `sb_publishable_xxxxx` → Key từ bước 1.3

---

## 🎣 Bước 4: Code - Query Data từ Database

### 4.1 Supabase Client (`src/services/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

### 4.2 Query Functions (`src/services/ghn-db.ts`)

```typescript
import { supabase } from './supabase'

// Lấy danh sách quận/huyện theo tỉnh
export async function getDistricts(provinceId: number) {
  try {
    const { data, error } = await supabase
      .from('ghn_districts')
      .select('district_id, district_name')
      .eq('province_id', provinceId)
      .order('district_name', { ascending: true })

    if (error) {
      console.error('Error:', error)
      return { success: false, error: error.message, districts: [] }
    }

    return { success: true, districts: data || [] }
  } catch (err) {
    console.error('Error:', err)
    return { success: false, error: 'Network error', districts: [] }
  }
}

// Lấy danh sách xã/phường theo quận
export async function getWards(districtId: number) {
  try {
    const { data, error } = await supabase
      .from('ghn_wards')
      .select('ward_code, ward_name')
      .eq('district_id', districtId)
      .order('ward_name', { ascending: true })

    if (error) {
      console.error('Error:', error)
      return { success: false, error: error.message, wards: [] }
    }

    return { success: true, wards: data || [] }
  } catch (err) {
    console.error('Error:', err)
    return { success: false, error: 'Network error', wards: [] }
  }
}
```

### 4.3 Dùng Trong Component (`CheckoutForm.tsx`)

```typescript
import { getDistricts, getWards } from '@/services/ghn-db'

// Khi user chọn tỉnh
const handleProvinceChange = async (provinceId: number) => {
  const result = await getDistricts(provinceId)
  if (result.success) {
    setDistricts(result.districts)  // Hiển thị danh sách quận
  }
}

// Khi user chọn quận
const handleDistrictChange = async (districtId: number) => {
  const result = await getWards(districtId)
  if (result.success) {
    setWards(result.wards)  // Hiển thị danh sách xã/phường
  }
}
```

---

## 📥 Bước 5: Thêm Dữ Liệu (Đã Có Sẵn)

Dữ liệu được sync từ GHN API:
- **63 tỉnh/thành phố**
- **722 quận/huyện**
- **11,980 xã/phường**

Dữ liệu này đã được import vào Supabase bằng script `sync-ghn-data.js`

---

## 🧪 Bước 6: Test Kết Nối

### 6.1 Test Trực Tiếp Supabase

1. Vào **Table Editor** trong Supabase Dashboard
2. Click vào table `ghn_provinces`
3. Kiểm tra xem có dữ liệu không

### 6.2 Test Frontend

1. Chạy dev server: `npm run dev`
2. Mở checkout form
3. Chọn tỉnh → Kiểm tra xem quận có load không
4. Chọn quận → Kiểm tra xem xã/phường có load không

---

## 🔗 UI Flow - Địa Chỉ

```
┌─────────────────────────────────────────────┐
│         CHECKOUT FORM - ĐỊA CHỈ            │
├─────────────────────────────────────────────┤
│                                             │
│  Tỉnh/Thành phố:  [Select Province ▼]      │
│                                             │
│  Quận/Huyện:      [Select District ▼]      │
│                   (Load từ ghn_districts)   │
│                                             │
│  Xã/Phường:       [Select Ward ▼]          │
│                   (Load từ ghn_wards)       │
│                                             │
│  Địa chỉ chi tiết: [Text area]             │
│                                             │
│  [Đặt Hàng]  [Hủy]                          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ❌ Troubleshooting

### ❌ Lỗi: "No data appears in select dropdown"

**Nguyên nhân**: RLS policy chặn public read

**Fix**:
1. Vào SQL Editor
2. Chạy lệnh fix RLS từ bước 2.3

### ❌ Lỗi: "SUPABASE_URL is undefined"

**Nguyên nhân**: `.env.local` chưa có hoặc sai tên biến

**Fix**:
1. Kiểm tra `.env.local` tồn tại
2. Đảm bảo đúng tên: `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
3. Restart dev server: `npm run dev`

### ❌ Lỗi: "403 Forbidden - Insufficient privileges"

**Nguyên nhân**: RLS policy chưa được setup đúng

**Fix**:
1. Chạy lại SQL fix RLS từ bước 2.3
2. Hoặc thay đổi policy thành: `ALTER TABLE ghn_xxx DISABLE ROW LEVEL SECURITY;`

---

## 📝 Database Schema

### ghn_provinces
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary Key (auto) |
| province_id | INTEGER | GHN Province ID (201-269) |
| province_name | VARCHAR(255) | Tên tỉnh |
| province_name_en | VARCHAR(255) | Tên tiếng Anh |
| created_at | TIMESTAMP | Ngày tạo |

### ghn_districts
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary Key (auto) |
| province_id | INTEGER | FK to ghn_provinces |
| district_id | INTEGER | GHN District ID |
| district_name | VARCHAR(255) | Tên quận/huyện |
| district_name_en | VARCHAR(255) | Tên tiếng Anh |
| support_type | INTEGER | Loại hỗ trợ |
| created_at | TIMESTAMP | Ngày tạo |

### ghn_wards
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary Key (auto) |
| province_id | INTEGER | FK to ghn_provinces |
| district_id | INTEGER | FK to ghn_districts |
| ward_code | VARCHAR(10) | GHN Ward Code |
| ward_name | VARCHAR(255) | Tên xã/phường |
| ward_name_en | VARCHAR(255) | Tên tiếng Anh |
| support_type | INTEGER | Loại hỗ trợ |
| created_at | TIMESTAMP | Ngày tạo |

---

## 🎯 Kết Nối Với Phần Còn Lại

### Shipping Fee Calculation
Sau khi user chọn địa chỉ, hệ thống tính phí vận chuyển:
- District ID + Ward Code được gửi đến `calculateShippingFee()`
- Phí được tính dựa trên khoảng cách và trọng lượng

### Order Tracking
Khi đặt hàng:
1. Lưu shipping address từ form
2. Lưu district_id + ward_code vào database
3. Gửi đến GHN API để tạo đơn vận chuyển

---

## 📚 Tài Liệu Tham Khảo

- **Supabase Docs**: https://supabase.com/docs
- **GHN API**: https://api.ghn.vn/home/docs
- **React + Supabase**: https://supabase.com/docs/guides/getting-started/quickstarts/react

---

**✅ Xong!** Bạn đã có hướng dẫn đầy đủ để kết nối database cho phần địa chỉ.

Nếu có thắc mắc, hãy kiểm tra troubleshooting ở trên! 🎉
