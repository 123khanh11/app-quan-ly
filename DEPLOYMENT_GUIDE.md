# 🚀 Hướng Dẫn Deploy Website Bán Hàng

## 📋 Yêu Cầu

- GitHub Account (để push code)
- Vercel Account (để deploy)
- Git cài trên máy

---

## 🔧 Bước 1: Chuẩn Bị Local

### 1. Clone hoặc tạo Git repo

```bash
# Nếu chưa có git
git init
git add .
git commit -m "Initial commit: E-commerce shop"
```

### 2. Tạo `.env.local` (nếu cần)

```bash
# .env.local (không commit file này)
VITE_SUPABASE_URL=https://edtxexnhpbipcecceoop.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7
```

### 3. Test chạy local

```bash
npm install
npm run dev
```

Truy cập: `http://localhost:5173`

---

## 📤 Bước 2: Push Lên GitHub

### 1. Tạo repository trên GitHub

- Vào https://github.com/new
- Tên: `ecommerce-shop` (hoặc tên khác)
- Description: "E-commerce Shop - Customer Frontend"
- Public
- Không chọn "Initialize with README"

### 2. Push code lên

```bash
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-shop.git
git branch -M main
git push -u origin main
```

---

## 🌐 Bước 3: Deploy Lên Vercel

### Cách 1: Dùng Vercel CLI (Nhanh nhất)

```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow các hướng dẫn
# - Chọn "Create a new project"
# - Chọn "Link to existing Git repository"
# - Chọn GitHub account
# - Chọn repo
```

### Cách 2: Dùng Vercel Web UI (Dễ hơn)

1. Vào https://vercel.com/new
2. Click "Import Git Repository"
3. Chọn GitHub repo của bạn
4. Settings:
   - **Project Name:** `shop-web` (hoặc tên khác)
   - **Framework:** Detect Vite
   - **Environment Variables:** (để trống, không cần)
5. Click "Deploy"

---

## ✅ Xác Minh Deployment

### 1. Kiểm tra URL

Sau khi deploy xong, Vercel sẽ cho URL như:
```
https://shop-web-abc123.vercel.app
```

### 2. Test các tính năng

- [ ] Trang chủ load được
- [ ] Sản phẩm hiển thị
- [ ] Tìm kiếm hoạt động
- [ ] Thêm vào giỏ hàng
- [ ] Xem giỏ hàng
- [ ] Checkout form có
- [ ] Theo dõi đơn hàng

---

## 🔄 Cập Nhật Code

### Sau khi thay đổi code:

```bash
# Commit changes
git add .
git commit -m "Add new feature"

# Push lên GitHub
git push origin main

# Vercel tự động deploy (Automatic Deployments)
```

---

## 🌍 Custom Domain (Tùy Chọn)

### Nếu bạn có domain riêng:

1. Vào Vercel Dashboard
2. Chọn project
3. Settings → Domains
4. Add domain
5. Theo hướng dẫn cập nhật DNS

**Ví dụ:**
```
shop.example.com  →  https://shop.example.com (Website Bán Hàng)
admin.example.com →  https://admin.example.com (App Quản Lý)
```

---

## 📊 Kiến Trúc Deployment

```
┌─────────────────────────────────────┐
│   GitHub Repository                 │
│   (Code Source)                     │
└────────────────────┬────────────────┘
                     │
                     ▼
        ┌────────────────────┐
        │  Vercel            │
        │  (Auto Deploy)     │
        └────────────────────┘
                     │
        ┌────────────┴──────────────┐
        ▼                           ▼
   ┌─────────────┐         ┌──────────────┐
   │ Website     │         │ Admin App    │
   │ Bán Hàng    │         │ (Quản Lý)    │
   │ shop.com    │         │ admin.com    │
   └─────────────┘         └──────────────┘
        │                           │
        └───────────────┬───────────┘
                        ▼
            ┌─────────────────────┐
            │  Supabase Database  │
            │  (Dữ liệu chung)    │
            └─────────────────────┘
```

---

## 🔒 Bảo Mật Deployment

### 1. Secrets / Environment Variables

⚠️ **Hiện tại:** API Key hardcoded trong code
✅ **Nên làm:** Dùng environment variables

```bash
# Trong Vercel Settings → Environment Variables
VITE_SUPABASE_URL=https://edtxexnhpbipcecceoop.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### 2. Cập nhật Code

```typescript
// src/services/supabase.ts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
```

---

## 📈 Monitoring & Analytics

### Vercel Provide:

- Deployment history
- Build logs
- Performance metrics
- Edge Functions monitoring

Truy cập: Dashboard → Analytics

### Supabase Provide:

- Database query performance
- Realtime subscriptions
- Storage metrics

---

## 🐛 Troubleshooting Deployment

### Build Failed

1. Kiểm tra logs trên Vercel
2. Run `npm run build` local để test
3. Kiểm tra TypeScript errors

### Page Not Loading

1. Kiểm tra browser console
2. Kiểm tra Network tab
3. Kiểm tra API calls

### Database Connection Error

1. Kiểm tra Supabase URL
2. Kiểm tra Anon Key
3. Kiểm tra RLS policies
4. Kiểm tra database tables

---

## 📋 Deployment Checklist

- [ ] Code tested locally
- [ ] No console errors
- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] Vercel project linked
- [ ] Environment variables set (nếu cần)
- [ ] Initial deploy successful
- [ ] All pages accessible
- [ ] Shop features working
- [ ] Database connected
- [ ] Orders can be created
- [ ] Custom domain setup (nếu cần)

---

## 🔄 CI/CD Pipeline

### Automatic Workflow:

```
Push to GitHub
        ↓
GitHub Webhook to Vercel
        ↓
Vercel builds project
        ↓
Run tests (nếu có)
        ↓
Deploy to production
        ↓
Preview URL available
        ↓
Production URL updated
```

---

## 📱 Mobile Responsive

Website tự động responsive cho:
- Desktop
- Tablet
- Mobile

Test bằng:
```bash
# Chrome DevTools
F12 → Toggle Device Toolbar
```

---

## 🚀 Performance Optimization (Nâng Cao)

### 1. Image Optimization
- Dùng next/image hoặc img lazy loading
- Compress images

### 2. Code Splitting
- Vite tự động split code
- Dynamic imports

### 3. Caching
- Browser cache
- CDN cache (Vercel)

### 4. Database
- Add indexes
- Optimize queries

---

## 📞 Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev

---

## ✨ Tiếp Theo

Sau khi deploy thành công:

1. **Thêm Admin Features:**
   - Dashboard thống kê
   - Quản lý sản phẩm
   - Quản lý đơn hàng

2. **Thêm Customer Features:**
   - Đăng nhập
   - Profile
   - Order history
   - Wishlist

3. **Thêm Payments:**
   - Stripe integration
   - Momo payment
   - VNPay

4. **Marketing:**
   - Analytics
   - Email campaigns
   - Social media

---

**Deployment Guide - Updated: 19/07/2026**
