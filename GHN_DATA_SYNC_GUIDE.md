# 🗄️ GHN Data Sync - Complete Guide

## 📋 Overview

Thay vì gọi GHN API mỗi lần (chậm, tốn quota), chúng ta:
1. **Crawl một lần** toàn bộ dữ liệu GHN (Provinces → Districts → Wards)
2. **Lưu vào Supabase** database
3. **Query từ DB** mỗi lần cần (nhanh, miễn phí)

**Result:**
- ✅ 63 Provinces
- ✅ 700+ Districts
- ✅ 10,000+ Wards
- ✅ All in Supabase database

---

## 🚀 Quick Start

### Step 1: Setup Database
Chạy SQL trong Supabase SQL Editor:

```bash
# Copy toàn bộ code từ scripts/create-ghn-tables.sql
# Paste vào Supabase SQL Editor
# Click "Run"
```

**Hoặc chạy từ terminal:**
```bash
npm install -g psql  # Nếu chưa có PostgreSQL client
```

### Step 2: Run Sync Script
```bash
# Install dependencies
npm install dotenv @supabase/supabase-js

# Run sync
npx ts-node scripts/sync-ghn-data.ts
```

**Output:**
```
╔═══════════════════════════════════════════════════╗
║   GHN DATA SYNC - Crawl All Locations            ║
╚═══════════════════════════════════════════════════╝

📍 SYNCING PROVINCES...
✓ Fetched 63 provinces
✅ Synced 63 provinces to DB

🏘️ SYNCING DISTRICTS...
  📍 Hà Nội (1)...
    ✓ Fetched 12 districts
    ✅ Inserted 12 districts
  ...
✅ Synced 720+ total districts

🏘️ SYNCING WARDS...
  ⏳ Processing district 1/720...
  ⏳ Processing district 10/720...
  ...
✅ Synced 10,000+ total wards

╔═══════════════════════════════════════════════════╗
║   SYNC COMPLETED ✅                               ║
╠═══════════════════════════════════════════════════╣
║ Provinces: 63 cái
║ Districts: 720 cái
║ Wards: 10,500 cái
║ Duration: 180.25s
╚═══════════════════════════════════════════════════╝
```

### Step 3: Update CheckoutForm
Sử dụng `ghn-db.ts` thay vì `ghn-api.ts`:

```typescript
// Before (API calls)
import { getDistricts, getWards } from '@/services/ghn-api'

// After (Database queries)
import { getDistrictsFromDB, getWardsFromDB } from '@/services/ghn-db'
```

---

## 📊 Database Schema

### Table: `ghn_provinces`
```sql
id          BIGINT (Primary Key)
province_id INTEGER (Unique, Indexed)
province_name VARCHAR(100)
province_name_en VARCHAR(100)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

**Sample:**
```sql
| id | province_id | province_name    |
|----|-------------|------------------|
| 1  | 1           | Hà Nội           |
| 2  | 2           | Hà Giang         |
| 3  | 3           | Quảng Ninh       |
| ...
```

### Table: `ghn_districts`
```sql
id              BIGINT (Primary Key)
province_id     INTEGER (Foreign Key)
district_id     INTEGER (Indexed)
district_name   VARCHAR(100)
district_name_en VARCHAR(100)
support_type    SMALLINT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**Sample:**
```sql
| id  | province_id | district_id | district_name |
|-----|-------------|-------------|---------------|
| 1   | 1           | 1           | Hoàn Kiếm    |
| 2   | 1           | 2           | Ba Đình      |
| 13  | 1           | 1455        | Hà Đông      |
| ...
```

### Table: `ghn_wards`
```sql
id              BIGINT (Primary Key)
province_id     INTEGER (Foreign Key)
district_id     INTEGER (Foreign Key, Indexed)
ward_code       VARCHAR(20) (Indexed)
ward_name       VARCHAR(100)
ward_name_en    VARCHAR(100)
support_type    SMALLINT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**Sample:**
```sql
| id      | district_id | ward_code | ward_name           |
|---------|-------------|-----------|---------------------|
| 1       | 1455        | 21617     | Phường Phúc Diễn   |
| 2       | 1455        | 21618     | Phường Dương Nội   |
| 10000   | 206         | 1A        | Phường Thủ Đức     |
| ...
```

---

## 🔍 Query Examples

### Get all provinces
```typescript
const result = await getProvincesFromDB()
// Returns: { success: true, provinces: [...] }
```

### Get districts of Hà Nội
```typescript
const result = await getDistrictsFromDB(1)
// Returns: { success: true, districts: [Hoàn Kiếm, Ba Đình, ...] }
```

### Get wards of Hà Đông
```typescript
const result = await getWardsFromDB(1455)
// Returns: { success: true, wards: [Phường Phúc Diễn, Phường Dương Nội, ...] }
```

### Get stats
```typescript
const result = await getLocationStats()
// Returns: {
//   success: true,
//   stats: {
//     provinces: 63,
//     districts: 720,
//     wards: 10500
//   }
// }
```

### Validate address
```typescript
const result = await validateAddress(
  provinceId = 1,
  districtId = 1455,
  wardCode = '21617'
)
// Returns: { success: true, valid: true, ward: {...} }
```

---

## 📝 Files Created

| File | Mô Tả |
|------|--------|
| `scripts/sync-ghn-data.ts` | Script crawl & sync dữ liệu |
| `scripts/create-ghn-tables.sql` | SQL để tạo tables |
| `src/services/ghn-db.ts` | Query functions |
| `GHN_DATA_SYNC_GUIDE.md` | Hướng dẫn này |

---

## ⚡ Flow Checkout (Mới)

```
Khách vào website
    ↓
Component load → getProvincesFromDB()
    ↓ (Query Supabase, instant)
Hiển thị 63 tỉnh
    ↓
Khách chọn "Hà Nội"
    ↓
getDistrictsFromDB(1)
    ↓ (Query Supabase, instant)
Hiển thị 12 quận
    ↓
Khách chọn "Hà Đông"
    ↓
getWardsFromDB(1455)
    ↓ (Query Supabase, instant)
Hiển thị 8 phường
    ↓
Khách chọn "Phường Dương Nội"
    ↓
calculateShipping() (gọi GHN API tính phí)
    ↓
Hiển thị phí vận chuyển
    ↓
Khách submit
```

**Performance:**
- Province load: **< 100ms**
- District load: **< 100ms**
- Ward load: **< 100ms**
- Shipping fee: **500-1000ms** (GHN API)

---

## 🔄 Update Data

Nếu GHN có update (districts/wards mới), chỉ cần chạy lại:

```bash
npx ts-node scripts/sync-ghn-data.ts
```

Script sẽ:
1. Delete dữ liệu cũ
2. Crawl dữ liệu mới từ GHN
3. Insert vào DB

---

## 🛡️ Security

### RLS Policies
- ✅ Everyone can READ (public)
- ❌ Only backend can INSERT/UPDATE/DELETE

### Query Permissions
```sql
-- Users can SELECT
SELECT * FROM ghn_provinces; -- ✅

-- Users cannot write
INSERT INTO ghn_provinces VALUES (...); -- ❌
```

---

## 🎯 Benefits

| Trước | Sau |
|-------|-----|
| Gọi GHN API mỗi lần | Query DB (instant) |
| Chậm (~1s/request) | Nhanh (< 100ms) |
| Tốn quota GHN | Miễn phí |
| Phức tạp, nhiều retry logic | Đơn giản, reliable |
| Có thể bị rate limit | Không bị limit |
| Data thay đổi khó track | Version control |

---

## ❌ Troubleshooting

### Script fails: "GHN API error"
**Nguyên nhân:** Token không hợp lệ hoặc IP bị block
**Giải pháp:** 
1. Check `.env.local` có `GHN_TOKEN` không
2. Add Vercel IP vào GHN whitelist

### Script fails: "Supabase connection error"
**Nguyên nhân:** Credentials sai hoặc network issue
**Giải pháp:**
1. Check `.env.local` có `VITE_SUPABASE_URL` không
2. Check firewall/proxy

### Tables already exist
**Giải pháp:** Script sẽ delete cũ rồi create mới, no problem

### Query returns empty
**Nguyên nhân:** Chưa chạy sync hoặc data chưa insert
**Giải pháp:** Chạy `npx ts-node scripts/sync-ghn-data.ts`

---

## 📞 Support

Nếu có lỗi:
1. Check console output của script
2. Check Supabase logs
3. Verify GHN credentials
4. Check network connectivity

---

## 🚀 Next Steps

1. ✅ Create tables: `scripts/create-ghn-tables.sql`
2. ✅ Run sync: `npx ts-node scripts/sync-ghn-data.ts`
3. ✅ Update CheckoutForm: import từ `ghn-db` thay vì `ghn-api`
4. ✅ Test: Chọn tỉnh/quận/phường → Nên nhanh như tia chớp ⚡

---

**Total time to complete:** ~5-10 minutes (3 min sync + 2 min setup)

Done! 🎉
