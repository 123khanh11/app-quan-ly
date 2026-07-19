# 🚀 Hướng Dẫn Deploy Lên Vercel

## ✅ Step 1: Code Đã Được Commit (DONE!)

```bash
✓ git init - Initialized
✓ git add . - Files staged
✓ git commit - 88 files committed
```

Status: **✅ READY**

---

## 📤 Step 2: Push Lên GitHub

### 2.1: Tạo GitHub Repository

1. **Vào https://github.com/new**
2. **Tạo repo mới:**
   - Name: `ecommerce-shop`
   - Description: `E-commerce Shop - Customer Website`
   - Public
   - Click **Create repository**

3. **Copy HTTPS URL** từ GitHub
   ```
   https://github.com/YOUR_USERNAME/ecommerce-shop.git
   ```

### 2.2: Add Remote & Push

```bash
# Replace YOUR_GITHUB_URL với URL từ step 2.1
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```

**Ví dụ:**
```bash
git remote add origin https://github.com/baomu/ecommerce-shop.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy Lên Vercel

### Cách 1: Via Web UI (Easiest)

1. **Vào https://vercel.com/new**

2. **Import Repository:**
   - Click "Import Git Repository"
   - Login GitHub
   - Choose: `ecommerce-shop`
   - Click "Import"

3. **Configure Project:**
   - Project Name: `shop-web` (hoặc tên khác)
   - Framework: Vercel sẽ detect → **Vite**
   - Root Directory: `.` (default)
   - Environment Variables: (bỏ qua, không cần)
   - Click "Deploy"

4. **Wait for Build:**
   - Vercel sẽ build & deploy
   - Mất 1-2 phút
   - Success page sẽ hiện ra

5. **Get URL:**
   ```
   https://shop-web-xxx.vercel.app
   ```

---

### Cách 2: Via Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow prompts:
#    - Login to Vercel account
#    - Link to existing project (no)
#    - Set project name: shop-web
#    - Select: ./
#    - Deploy
```

---

## ✅ Verify Deployment

### Check on Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on `shop-web` project
3. Check **Deployments** tab
4. Should see **✅ Success** status

### Test Live Website

1. Click the URL: `https://shop-web-xxx.vercel.app`
2. Website loads? ✅
3. All features working? ✅

---

## 📋 Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads in browser
- [ ] Products showing (or you need to add to DB)
- [ ] Search works
- [ ] Add to cart works
- [ ] Cart displays items
- [ ] Checkout form shows
- [ ] No console errors (F12)

---

## 🔄 Update & Redeploy

After this, every time you:
```bash
git add .
git commit -m "New feature"
git push
```

**Vercel sẽ automatically redeploy!** ✨

---

## 🎯 Important URLs

After deployment:

| Resource | URL |
|----------|-----|
| Website | https://shop-web-xxx.vercel.app |
| GitHub | https://github.com/YOUR_USERNAME/ecommerce-shop |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase DB | https://supabase.com/dashboard |

---

## ⚠️ Troubleshooting

### Build Failed?

1. Check Vercel logs: **Deployments** → **Failed** → **View Logs**
2. Common issues:
   - TypeScript errors → Fix locally, push again
   - Missing env vars → Add to Vercel Settings → Environment Variables
   - Package issues → Delete node_modules, npm install

### Website Not Showing Products?

1. Check Supabase database has products
2. Insert test product manually
3. Refresh website

### Slow Load?

1. First load caches everything (slow)
2. Subsequent loads are fast (Vercel CDN)

---

## 🎉 Success!

Your website is now **LIVE** on:
```
https://shop-web-xxx.vercel.app
```

**Share this URL with anyone!** 🚀

---

## 📱 Next Steps

1. ✅ Add your products to Supabase
2. ✅ Test all features on live site
3. ✅ Customize branding (colors, logo)
4. ✅ Setup custom domain (optional)
5. ✅ Monitor analytics

---

## 🔗 Custom Domain (Optional)

Want your own domain like `shop.example.com`?

1. **Buy domain** (GoDaddy, Namecheap, etc)
2. **In Vercel:** Settings → Domains
3. **Add domain**
4. **Update DNS** in your domain provider
5. **Vercel issues SSL cert** (automatic)

---

## 📝 Commands Summary

```bash
# Local: Make changes
npm run dev

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub (auto deploys)
git push origin main

# View deployment status
vercel logs

# Open live site
vercel --prod
```

---

## ✨ Congratulations!

Your e-commerce shop is now **LIVE** and **PRODUCTION READY**! 🎉

**Website:** https://shop-web-xxx.vercel.app  
**Status:** ✅ Active  
**SSL:** ✅ Automatic  
**CDN:** ✅ Global  

---

**Happy selling!** 🛍️
