# 🚀 DEPLOY LÊN VERCEL

**Hướng dẫn:** Deploy frontend lên Vercel  
**Thời gian:** ~10 phút  
**Yêu cầu:** Git + GitHub account + Vercel account  

---

## 📋 BƯỚC 1: Chuẩn Bị Repository

### 1.1 Kiểm tra Git Status
```bash
git status
```

Expected: Tất cả files đã commit

### 1.2 Nếu chưa commit
```bash
git add .
git commit -m "Ready for Vercel deployment"
```

### 1.3 Kiểm tra xem có remote chưa
```bash
git remote -v
```

**Nếu không có remote → Bước 1.4**

### 1.4 Tạo Repository GitHub (nếu chưa có)

1. Mở: https://github.com/new
2. Repository name: `e-commerce-website-interface`
3. Chọn Public
4. Click "Create repository"

### 1.5 Add Remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/e-commerce-website-interface.git
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn**

### 1.6 Push lên GitHub
```bash
git branch -M main
git push -u origin main
```

**⚠️ Lưu ý:** Đóng `.env.local` trước khi push!

---

## 🔒 BƯỚC 2: Bảo Vệ Environment Variables

### 2.1 Kiểm tra .gitignore
```bash
cat .gitignore
```

**Phải có:**
```
.env.local
.env.*.local
```

### 2.2 Nếu chưa có
Thêm vào `.gitignore`:
```
.env.local
.env.*.local
*.env
```

### 2.3 Xóa .env.local khỏi Git (nếu được commit)
```bash
git rm --cached .env.local
git commit -m "Remove .env.local from git"
git push
```

---

## 🌐 BƯỚC 3: Deploy lên Vercel

### 3.1 Đăng ký Vercel
1. Mở: https://vercel.com
2. Click "Sign Up"
3. Chọn "Continue with GitHub"
4. Authorize Vercel

### 3.2 Tạo Project
1. Sau khi đăng ký, click "New Project"
2. Chọn repository GitHub (ví dụ: `e-commerce-website-interface`)
3. Click "Import"

### 3.3 Cấu Hình Project
**Mục "Configure Project":**

- **Framework Preset:** Vite
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Để mặc định là được!

### 3.4 Environment Variables
Thêm variables cho **Frontend** (nếu cần):

```
# Không cần GHN_TOKEN ở Vercel!
# GHN_TOKEN nên ở backend
# Frontend sẽ gọi backend API
```

**Cho PRODUCTION:**
```
VITE_API_URL=https://your-backend-api.com/api
```

(Thay `your-backend-api.com` bằng URL backend của bạn)

### 3.5 Deploy
Click "Deploy"

**Chờ 2-3 phút...**

---

## ✅ HOÀN THÀNH!

Sau khi deploy thành công:

- **URL Frontend:** https://your-project.vercel.app
- **URL Backend:** Cần deploy riêng (Railway/Render)

---

## 🔌 KẾT NỐI FRONTEND VỚI BACKEND

### Bước 1: Deploy Backend

Chọn một:

#### Option A: Railway (Recommended)
1. Mở: https://railway.app
2. Sign up → Connect GitHub
3. New → GitHub Repo
4. Chọn repo của bạn
5. Deploy

Output: `https://your-backend.railway.app`

#### Option B: Render
1. Mở: https://render.com
2. Sign up → Connect GitHub
3. New → Web Service
4. Chọn repo
5. Deploy

Output: `https://your-backend.onrender.com`

### Bước 2: Update Frontend API URL

1. Mở Vercel Project Settings
2. Environment Variables
3. Thêm:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
4. Redeploy

### Bước 3: Update Backend .env

Railway/Render sẽ tự load từ `.env.local`, nhưng cần thêm Environment Variables:

```
GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e
GHN_SHOP_ID=5430969
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
GHN_FROM_DISTRICT_ID=1455
GHN_FROM_WARD_CODE=21617
```

---

## 🧪 TEST PRODUCTION

### 1. Frontend
Mở: https://your-project.vercel.app

- Thêm sản phẩm
- Thanh toán
- Chọn địa chỉ
- Xem phí tính tự động

### 2. Backend API
Mở: https://your-backend.railway.app/api/ghn/province

- Thấy danh sách tỉnh → ✅ Backend hoạt động

### 3. Integrated Test
1. Frontend: Add product → Checkout
2. Select address
3. Shipping fee tính từ backend API ✅

---

## 🔄 CI/CD PIPELINE

Sau khi setup, mỗi lần `git push`:

```
1. GitHub nhận push
2. Vercel tự động rebuild
3. npm run build
4. Deploy to production
5. Tất cả tự động! ✨
```

**Không cần làm gì, tất cả automatic!**

---

## 📊 FINAL DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────┐
│     Your Domain (optional)          │
│     myshop.com                      │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ↓             ↓
┌──────────────┐  ┌──────────────────┐
│   Frontend   │  │   Backend API    │
│   Vercel     │  │   Railway/Render │
│   myshop.    │  │   myapi.railway  │
│   vercel.app │  │   .app           │
└──────┬───────┘  └────────┬─────────┘
       │                   │
       └───────────┬───────┘
                   │
                   ↓
            ┌────────────────┐
            │   GHN API      │
            │ (with token)   │
            └────────────────┘
```

---

## 🎯 NEXT STEPS

### Immediately
- [ ] Push code to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Test at https://your-project.vercel.app

### After Frontend Works
- [ ] Deploy backend to Railway
- [ ] Update environment variables
- [ ] Test integration
- [ ] Monitor production

### Optional (Later)
- [ ] Setup custom domain
- [ ] Setup monitoring/logging
- [ ] Setup auto-scaling
- [ ] Setup backups

---

## 🐛 TROUBLESHOOTING

### "Build failed"
→ Check `npm run build` locally works  
→ Check all dependencies installed  
→ Check dist/ folder generated  

### "API not found"
→ Check backend deployed  
→ Check VITE_API_URL correct  
→ Restart both frontend & backend  

### "Shipping fee not calculating"
→ Check backend logs  
→ Check GHN token valid  
→ Check network tab (F12)  

### "Cannot access Vercel URL"
→ Wait 2-3 minutes for deployment  
→ Check deployment status in Vercel dashboard  
→ Refresh page  

---

## ✨ CHÚC MỪNG!

Hệ thống của bạn giờ live trên internet! 🎉

**Frontend:** https://your-project.vercel.app  
**Backend:** https://your-backend.railway.app  

---

## 📚 REFERENCE

**Vercel Docs:** https://vercel.com/docs  
**Railway Docs:** https://docs.railway.app  
**GitHub Pages:** https://pages.github.com  

---

**Ready? Let's go! 🚀**
