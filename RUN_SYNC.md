# 🚀 RUN GHN DATA SYNC

## Prerequisites

1. **Node.js** installed (v14+)
2. **Supabase** database created
3. **Tables created** (run SQL from `scripts/create-ghn-tables.sql`)
4. **Environment variables** set in `.env.local`

---

## 1️⃣ Setup Supabase Tables

### Copy SQL code
Open file: `scripts/create-ghn-tables.sql`

Copy **ALL** the SQL code

### Paste into Supabase
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Paste the SQL code
6. Click **"Run"** (blue button)

✅ You should see: "Query executed successfully"

---

## 2️⃣ Check .env.local

Make sure you have:

```
GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e
GHN_SHOP_ID=5430969
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

If you don't have Supabase keys:
1. Go to Supabase Dashboard
2. Click **Settings** → **API**
3. Copy `Project URL` → paste as `VITE_SUPABASE_URL`
4. Copy `anon public` key → paste as `VITE_SUPABASE_ANON_KEY`

---

## 3️⃣ Install Dependencies

```bash
cd "path/to/E-commerce website interface"
npm install
```

Or if already installed, just verify:
```bash
npm list dotenv @supabase/supabase-js
```

---

## 4️⃣ Run Sync Script

**Option A: Windows PowerShell**
```powershell
npx ts-node scripts/sync-ghn-data.ts
```

**Option B: Windows CMD**
```cmd
npx ts-node scripts/sync-ghn-data.ts
```

**Option C: Mac/Linux Terminal**
```bash
npx ts-node scripts/sync-ghn-data.ts
```

---

## 5️⃣ Watch the Magic ✨

Script sẽ:

```
╔═══════════════════════════════════════════════════╗
║   GHN DATA SYNC - Crawl All Locations            ║
╚═══════════════════════════════════════════════════╝

🔍 Checking credentials...
   GHN_TOKEN: ✓ Set
   GHN_SHOP_ID: ✓ Set
   SUPABASE_URL: ✓ Set
   SUPABASE_KEY: ✓ Set

📍 SYNCING PROVINCES...
✓ Fetched 63 provinces
✅ Synced 63 provinces to DB

🏘️ SYNCING DISTRICTS...
  📍 Hà Nội (1)...
    ✓ Fetched 12 districts
    ✅ Inserted 12 districts
  📍 Hà Giang (2)...
    ✓ Fetched 7 districts
    ✅ Inserted 7 districts
  ... (continues for all 63 provinces)

🏘️ SYNCING WARDS...
  ⏳ Processing district 1/720: Hoàn Kiếm
  ⏳ Processing district 10/720: Ba Đình
  ⏳ Processing district 20/720: Thanh Xuân
  ... (continues for all 720 districts)

╔═══════════════════════════════════════════════════╗
║   SYNC COMPLETED ✅                               ║
╠═══════════════════════════════════════════════════╣
║ Provinces: 63
║ Districts: 720
║ Wards: 10,500+
║ Duration: 180.45s
╚═══════════════════════════════════════════════════╝

✅ Success! Data synced to Supabase database.
   Frontend can now query locations instantly!
```

---

## ⏱️ Timing

- **Provinces**: ~2 seconds
- **Districts**: ~30 seconds (63 API calls)
- **Wards**: ~120-150 seconds (720 API calls)
- **Total**: 3-5 minutes

---

## ✅ Verify Success

### In Supabase SQL Editor

```sql
SELECT COUNT(*) FROM ghn_provinces;
-- Should return: 63

SELECT COUNT(*) FROM ghn_districts;
-- Should return: 700+

SELECT COUNT(*) FROM ghn_wards;
-- Should return: 10,000+

SELECT * FROM ghn_provinces LIMIT 5;
SELECT * FROM ghn_districts WHERE province_id = 1;
SELECT * FROM ghn_wards WHERE district_id = 1455;
```

---

## ❌ Troubleshooting

### Error: "GHN_TOKEN is missing"
- [ ] Check `.env.local` has `GHN_TOKEN`
- [ ] Make sure no spaces before/after value
- [ ] Try copying again from GHN Dashboard

### Error: "Cannot connect to Supabase"
- [ ] Check `VITE_SUPABASE_URL` is correct
- [ ] Check `VITE_SUPABASE_ANON_KEY` is correct
- [ ] Check internet connection

### Error: "ts-node not found"
```bash
npm install -g ts-node typescript
```

### Script hangs / takes too long
- [ ] Check network connection
- [ ] Press `Ctrl+C` and try again
- [ ] Check console for specific errors

### Partial sync (some data missing)
- Just run the script again - it's safe to re-run
- Old data is deleted first, then new data inserted

---

## 🎉 After Sync

Your app now has:
- ✅ 63 Provinces instant loaded
- ✅ 700+ Districts queryable
- ✅ 10,000+ Wards ready
- ✅ No more GHN API rate limits
- ✅ Lightning-fast address selection

## Update Frontend (Optional)

To use database instead of API in CheckoutForm:

Change from:
```typescript
import { getDistricts, getWards } from '@/services/ghn-api'
```

To:
```typescript
import { getDistrictsFromDB, getWardsFromDB } from '@/services/ghn-db'
```

Then replace calls:
```typescript
const result = await getDistrictsFromDB(provinceId)
const result = await getWardsFromDB(districtId)
```

---

## 📝 Notes

- Script is **safe to re-run** (always does fresh sync)
- No need to manually delete old data
- GHN has rate limits, but script includes retry logic
- If fails halfway, just run again

---

**Ready? Let's go! 🚀**
