# 🚀 DEPLOY LÊN VERCEL

## ⚡ Status Hiện Tại

✅ **Đã chuẩn bị:**
- Frontend code: Ready (build thành công)
- API endpoints: 5 functions ready
- Supabase: Connected + dữ liệu đầy đủ (62 tỉnh, 620 quận, 5266 phường)
- Environment variables: Configured (.env.local)

❌ **Cần làm:**
- Deploy lên Vercel (push changes)

---

## 📋 Option 1: Push GitHub (Recommended)

### Bước 1: Tạo repository GitHub

1. Vào https://github.com/new
2. Tạo repo tên: `e-commerce-website`
3. Click **Create repository**

### Bước 2: Push code

```bash
cd "C:\Users\baomu\Downloads\E-commerce website interface"

# Set up git remote
git remote add origin https://github.com/YOUR_USERNAME/e-commerce-website.git
git branch -M main
git push -u origin main
```

### Bước 3: Connect Vercel

1. Vào https://vercel.com/dashboard
2. Click **Add New Project**
3. Select **Import Git Repository**
4. Paste GitHub URL
5. Click **Import**
6. Vercel auto-deploys! ✅

---

## 🖥️ Option 2: Vercel CLI (Fastest)

### Bước 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Bước 2: Login

```bash
vercel login
# Opens browser → Login with GitHub/GitLab/Vercel account
```

### Bước 3: Deploy

```bash
cd "C:\Users\baomu\Downloads\E-commerce website interface"
vercel --prod
```

**Result:**
```
✅ Deployed to production
✅ URL: https://e-commerce-website-interface.vercel.app
```

---

## 📌 Option 3: Manual Upload via Dashboard

1. Vào https://vercel.com/dashboard
2. **Remove old project** (E-commerce website interface)
3. Click **Add New Project**
4. Select **Upload** (manual)
5. Drag & drop project folder
6. Click **Deploy**

---

## ⚙️ Vercel Environment Variables

After deploying, set environment variables:

1. Go to Vercel Project Settings
2. Click **Environment Variables**
3. Add these:

```
VITE_SUPABASE_URL=https://edtxexnhpbipcecceoop.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
```

---

## ✅ Verify Deployment

After deployment completes:

1. Open: https://e-commerce-website-interface.vercel.app
2. Test checkout form:
   - Select province → Should show 62 options
   - Select district → Should show many options
   - Select ward → Should show many options
3. Test shipping calculation → Should work ✓

---

## 📊 What Gets Deployed

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend (React) | ✅ Deployed | HTML/CSS/JS |
| API Functions | ✅ Deployed | 5 endpoints in `/api` |
| Supabase Integration | ✅ Connected | Database + Auth |
| GHN Data | ✅ In Supabase | 62 provinces, 620 districts |
| Scripts (seed-*.js) | ⏭️ Local only | Run locally, not on Vercel |
| .env | ✅ From Vercel env vars | Safe (not exposed) |

---

## 🔍 Common Issues & Solutions

### Build fails on Vercel
```
Solution: npm install
```

### Environment variables missing
```
Solution: Add to Vercel Project Settings
→ Environment Variables
```

### Still shows old data
```
Solution: Hard refresh (Ctrl+Shift+R)
```

### API endpoints return 404
```
Solution: Check `/api` folder exists
→ Must have ghn-province.ts, ghn-district.ts, etc.
```

---

## 📞 After Deployment

**Website is LIVE and ready to use!**

Test on:
- https://e-commerce-website-interface.vercel.app

Features working:
- ✅ View products
- ✅ Add to cart
- ✅ Checkout with address selection
- ✅ Shipping fee calculation
- ✅ 62 provinces/620 districts/5266 wards

---

## 🎯 Next Steps

After successful deployment:

1. **Monitor performance** (Vercel Analytics)
2. **Get more GHN token** to sync all 63 provinces
3. **Add payment integration** (Stripe/PayPal)
4. **Set up email notifications**
5. **Add admin dashboard**

---

**Chọn Option 2 (Vercel CLI) là nhanh nhất!** ⚡

