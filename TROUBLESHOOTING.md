# 🔧 TROUBLESHOOTING - Các Lỗi Thường Gặp

## ❓ Lỗi gì?

Vui lòng mô tả lỗi chi tiết:
- Error message là gì?
- Xảy ra ở đâu? (Local / Vercel / Browser)
- Khi nào xảy ra?

---

## 🔴 LỖI THƯỜNG GẶP & GIẢI PHÁP

### 1. "Cannot read properties of undefined (reading 'readFile')"

**Nguyên nhân:** ts-node config sai

**Giải pháp:**
```bash
# Fix tsconfig.json
# Thêm: "module": "commonjs" và "ts-node" section
# File: tsconfig.json

npm run build
# Nếu vẫn lỗi:
npm install -g @types/node
```

---

### 2. Checkout form không hiển thị tỉnh/quận/phường

**Nguyên nhân:** 
- Supabase chưa kết nối
- RLS policies block SELECT
- Data chưa được insert

**Giải pháp:**
```bash
# 1. Check Supabase connection
# Vào browser console (F12)
// Trong inspect → Console:
supabase.from('ghn_provinces').select('*').limit(1)

# 2. Check data
# Vào Supabase → Table Editor
SELECT COUNT(*) FROM ghn_provinces;
# Kỳ vọng: 62

# 3. Chạy seed script lại
node scripts/seed-complete-data.js
```

---

### 3. API endpoints return 404

**Nguyên nhân:**
- `/api` folder chưa deploy
- vercel.json config sai
- Build chưa hoàn thành

**Giải pháp:**
```bash
# 1. Check /api folder exists
ls -la api/

# 2. Rebuild
npm run build

# 3. Test locally
npm run dev
# Mở: http://localhost:5000/api/ghn-province

# 4. Check Vercel deployment
# Vercel Dashboard → Deployments → View Function logs
```

---

### 4. Build fails on Vercel

**Nguyên nhân:**
- Dependencies missing
- .env variables chưa set
- TypeScript config sai

**Giải pháp:**
```bash
# 1. Check dependencies locally
npm install

# 2. Build locally
npm run build
# Nếu pass → Vercel cũng pass

# 3. Add environment variables to Vercel
# Vercel Dashboard → Settings → Environment Variables
# Add:
VITE_SUPABASE_URL=https://edtxexnhpbipcecceoop.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7

# 4. Rebuild on Vercel
# Click: "Redeploy"
```

---

### 5. Supabase connection error

**Nguyên nhân:**
- URL hoặc Key sai
- RLS policies block
- Internet connection

**Giải pháp:**
```bash
# 1. Check credentials in .env.local
cat .env.local | grep VITE_SUPABASE

# 2. Verify in code
# File: src/services/supabase.ts
// Check: SUPABASE_URL and SUPABASE_ANON_KEY

# 3. Test connection
# Browser Console (F12):
const { data, error } = await supabase.from('ghn_provinces').select('*').limit(1);
console.log(data, error);

# 4. Check RLS policies in Supabase
# Supabase → SQL Editor → Run:
SELECT * FROM pg_policies WHERE tablename = 'ghn_provinces';
```

---

### 6. "Module not found" errors

**Nguyên nhân:**
- Import path sai
- File chưa được tạo
- Node modules chưa cài

**Giải pháp:**
```bash
# 1. Clean install
rm -r node_modules package-lock.json
npm install

# 2. Check imports
# Kiểm tra @supabase/supabase-js đã cài?
npm list @supabase/supabase-js

# 3. TypeScript check
npx tsc --noEmit
```

---

### 7. Shipping fee calculation không hoạt động

**Nguyên nhân:**
- GHN token hết hạn
- API endpoint không responding
- Fallback data không có

**Giải pháp:**
```bash
# 1. Check GHN API status
# File: api/ghn-fee.ts
# Test endpoint: /api/ghn-fee?from_district=1455&to_district=1&weight=1000

# 2. Check fallback data in code
# File: api/ghn-fee.ts
// If GHN API fails, should use fallback prices

# 3. Use test data
# Example:
// from_district: 1455 (Hà Đông)
// to_district: 101 (Hoàn Kiếm)
// weight: 1000g (1kg)
// Expected fee: ~30,000 VND
```

---

### 8. Vercel deployment stuck/slow

**Nguyên nhân:**
- Build cache issue
- Too many files
- Node version mismatch

**Giải pháp:**
```bash
# 1. Clear Vercel cache
# Vercel Dashboard → Settings → Git → Clear Cache

# 2. Specify Node version
# File: vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "nodeVersion": "18.x"
}

# 3. Redeploy
# Click: "Redeploy"
```

---

### 9. CORS errors in browser

**Nguyên nhân:**
- API không có CORS headers
- Request từ different domain

**Giải pháp:**
```bash
# 1. Check API headers
# File: api/ghn-fee.ts
// Add header:
res.setHeader('Access-Control-Allow-Origin', '*');

# 2. Verify in browser
# F12 → Network tab → Check response headers

# 3. Test with curl
curl -H "Origin: https://yourdomain.com" \
  https://api.example.com/api/ghn-province
```

---

### 10. Data sync script fails

**Nguyên nhân:**
- Supabase credentials missing
- RLS policies block INSERT
- Rate limiting

**Giải pháp:**
```bash
# 1. Check .env.local
grep VITE_SUPABASE .env.local

# 2. Verify RLS
# Supabase → SQL Editor:
SELECT * FROM pg_policies WHERE tablename = 'ghn_provinces';
# Should see: "Allow all on provinces"

# 3. Run with logging
node scripts/seed-complete-data.js

# 4. If fails halfway, just rerun
# Script clears old data and reinserts
node scripts/seed-complete-data.js
```

---

## 📞 QUICK DIAGNOSTICS

Chạy các lệnh này để kiểm tra:

```bash
# 1. Check Node/npm version
node --version    # Should be >= 14
npm --version     # Should be >= 6

# 2. Check dependencies
npm list @supabase/supabase-js
npm list vite

# 3. Build test
npm run build     # Should complete in < 10s

# 4. Check TypeScript
npx tsc --noEmit  # Should have 0 errors

# 5. Check Git status
git status        # Should be clean
git log --oneline # Should see recent commits

# 6. Vercel CLI check
vercel whoami      # Should show logged-in user
vercel projects    # Should list your projects
```

---

## 🆘 CẦN GIÚP?

Cung cấp:
1. **Error message** (đầy đủ)
2. **Screenshot** hoặc terminal output
3. **Khi nào xảy ra** (deploy/local/runtime)
4. **Browser console** (F12 → Console)

---

## 📊 STATUS CHECK

Kiểm tra trạng thái của các component:

```javascript
// In browser console (F12):

// 1. Supabase connection
console.log(supabase.getSession())

// 2. Check data
const { data } = await supabase.from('ghn_provinces').select('COUNT');
console.log('Provinces:', data)

// 3. Check API
fetch('/api/ghn-province')
  .then(r => r.json())
  .then(d => console.log('API works:', d.length))

// 4. Check environment
console.log(import.meta.env.VITE_SUPABASE_URL)
```

---

**Mô tả lỗi chi tiết + terminal output để tôi giúp nhanh hơn!** 🚀

