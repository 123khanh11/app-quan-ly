# 🚀 DEPLOY LÊN VERCEL - HƯỚNG DẪN TIẾNG VIỆT

**⏱️ Thời gian:** 10 phút  
**🎯 Mục đích:** Deploy frontend lên internet  
**✅ Kết quả:** Website trực tuyến!

---

## 📝 BƯỚC 1: CHUẨN BỊ CODE

### 1.1 Đảm bảo tất cả đã commit
```bash
cd "c:\Users\baomu\Downloads\E-commerce website interface"
git status
```

**Kết quả dự kiến:** Không có tệp chưa commit

### 1.2 Nếu có thay đổi, commit ngay
```bash
git add .
git commit -m "Chuẩn bị deploy lên Vercel"
```

---

## 📦 BƯỚC 2: TẢI LÊN GITHUB

### 2.1 Tạo tài khoản GitHub
1. Mở: https://github.com/signup
2. Đăng ký tài khoản
3. Xác nhận email

### 2.2 Tạo Repository mới
1. Mở: https://github.com/new
2. **Repository name:** `e-commerce-website-interface`
3. **Visibility:** Public
4. Click "Create repository"

### 2.3 Copy lệnh GitHub

GitHub sẽ hiển thị các lệnh. Sao chép mục "…or push an existing repository from the command line"

Sẽ giống như:
```bash
git remote add origin https://github.com/USERNAME/e-commerce-website-interface.git
git branch -M main
git push -u origin main
```

**Thay `USERNAME` bằng username GitHub của bạn**

### 2.4 Dán lệnh vào Terminal

```bash
# Thay USERNAME bằng thực tế
git remote add origin https://github.com/USERNAME/e-commerce-website-interface.git
git branch -M main
git push -u origin main
```

Nếu hỏi username/password:
- **Username:** Username GitHub
- **Password:** Tạo Personal Access Token
  - https://github.com/settings/tokens
  - Click "Generate new token"
  - Chọn "repo"
  - Copy token, dán vào Terminal

**✅ Chờ upload hoàn tất...**

---

## 🌐 BƯỚC 3: DEPLOY LÊN VERCEL

### 3.1 Tạo tài khoản Vercel
1. Mở: https://vercel.com
2. Click "Sign Up"
3. Chọn "Continue with GitHub"
4. Authorize Vercel

### 3.2 Import Project
1. Sau khi đăng ký, bạn sẽ thấy "New Project"
2. Chọn repository: `e-commerce-website-interface`
3. Click "Import"

### 3.3 Cấu hình (Config)

Mục "Configure Project" - để mặc định, chỉ cần xác nhận:
- ✅ Framework Preset: `Vite`
- ✅ Root Directory: `./`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

### 3.4 Deploy

1. Click "Deploy"
2. **Chờ 2-3 phút...**
3. Sẽ thấy: "Congratulations! Your project has been deployed"
4. Copy URL: `https://xxxxxxx.vercel.app`

**✅ HOÀN TẤT! Frontend đã live!**

---

## ⏳ BƯỚC 4: DEPLOY BACKEND (Railway)

### 4.1 Tạo tài khoản Railway
1. Mở: https://railway.app
2. Click "Login"
3. Chọn "GitHub"
4. Authorize Railway

### 4.2 Tạo Project mới
1. Dashboard → "New Project"
2. Chọn "Deploy from GitHub repo"
3. Chọn repository: `e-commerce-website-interface`
4. Click "Create"

### 4.3 Thêm Environment Variables
1. Click tab "Variables"
2. Thêm từng biến:
   ```
   GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e
   GHN_SHOP_ID=5430969
   GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
   GHN_FROM_DISTRICT_ID=1455
   GHN_FROM_WARD_CODE=21617
   ```

### 4.4 Deploy Backend
1. Click "Deploy"
2. **Chờ 1-2 phút...**
3. Sẽ thấy: "Deployment successful"

### 4.5 Lấy Backend URL
1. Mở Settings
2. Mục "Domain"
3. Copy URL: `https://xxxxxxx-yyyy.railway.app`

**⏳ GHI NHỚ URL này!**

---

## 🔗 BƯỚC 5: KẾT NỐI FRONTEND → BACKEND

### 5.1 Quay lại Vercel

1. https://vercel.com/dashboard
2. Chọn project của bạn

### 5.2 Thêm Environment Variable

1. Click "Settings"
2. "Environment Variables"
3. Thêm biến:
   ```
   VITE_API_URL=https://xxxxxxx-yyyy.railway.app
   ```
   **Thay `xxxxxxx-yyyy.railway.app` bằng URL backend bạn lấy ở trên**

4. Click "Save"

### 5.3 Redeploy Frontend

1. Click "Deployments"
2. Lấy deployment mới nhất
3. Click "Redeploy"
4. **Chờ 1-2 phút...**

---

## 🧪 BƯỚC 6: KIỂM TRA

### Test 1: Frontend
```
Mở: https://your-project.vercel.app
→ Thêm sản phẩm
→ Bấm "Thanh Toán"
→ Chọn Tỉnh → Quận → Xã
→ Xem phí vận chuyển tính tự động ✅
```

### Test 2: Backend
```
Mở: https://your-backend.railway.app/api/ghn/province
→ Sẽ thấy danh sách 63 tỉnh/thành phố ✅
```

### Test 3: Integrated (Hoàn chỉnh)
```
Trên Frontend:
- Add product
- Checkout
- Chọn địa chỉ
- Phí tính từ Backend API ✅
- Đặt hàng → Save vào database ✅
```

---

## 🎉 HOÀN TẤT!

```
✅ Frontend: https://your-project.vercel.app
✅ Backend: https://your-backend.railway.app
✅ Tất cả đều chạy!
```

---

## 📊 KIẾN TRÚC CUỐI CÙNG

```
Customer tìm kiếm:
    ↓
Google
    ↓
Mở website: https://your-project.vercel.app (Vercel)
    ↓
Frontend React
    ↓
Chọn sản phẩm → Thanh toán
    ↓
Call API: /api/ghn/fee
    ↓
Backend: https://your-backend.railway.app
    ↓
Call GHN API (với Token)
    ↓
GHN tính phí: 36300 VNĐ
    ↓
Hiển thị trên Frontend
    ↓
Customer đặt hàng
    ↓
✅ HOÀN TẤT!
```

---

## 🔄 CI/CD AUTOMATIC

**Sau lần đầu setup:**

Mỗi khi bạn `git push`:

```
1. Code lên GitHub
   ↓
2. Vercel tự động rebuild frontend
   ↓
3. Railway tự động rebuild backend
   ↓
4. Website cập nhật tự động
   ↓
5. Bạn không cần làm gì! ✨
```

**Tất cả automatic!**

---

## 🐛 TROUBLESHOOTING

### "Build failed"
```
Giải pháp:
1. Chạy local: npm run build
2. Kiểm tra có lỗi không
3. Fix lỗi
4. Commit: git add . && git commit -m "Fix build error"
5. Push: git push
6. Vercel tự động rebuild
```

### "API không hoạt động"
```
Kiểm tra:
1. Backend deployed? → https://your-backend.railway.app/health
2. VITE_API_URL đúng không? → Vercel Settings
3. Environment variables có đủ? → Railway Settings
4. Token hợp lệ? → .env.local check
```

### "Phí không tính"
```
Kiểm tra:
1. Backend logs: Railway Dashboard
2. Browser console: F12 → Console
3. Network tab: F12 → Network (thấy API call không?)
4. Test API direct: /api/ghn/province
```

### "Chậm"
```
Bình thường vì:
- Vercel ở bên mỹ, server bạn ở VN
- Giải pháp: Deploy backend gần hơn (Railway có DC VN)

Tạm thời không sao, sẽ nhanh lên!
```

---

## 💡 TIPS

### Tip 1: Monitor Production
- Vercel Analytics: https://vercel.com/analytics
- Railway Logs: Railway Dashboard → Logs
- Browser DevTools: F12

### Tip 2: Update Code
```bash
# Local
git add .
git commit -m "Update: ..."
git push

# Automatic!
# Vercel & Railway tự rebuild
```

### Tip 3: Rollback (Quay lại)
```bash
# Nếu có lỗi
git revert HEAD
git push

# Hoặc dùng Vercel dashboard: Deployments → Revert
```

### Tip 4: Custom Domain (Optional)
- Buy domain: namecheap.com, godaddy.com
- Setup DNS → Vercel docs
- Setup HTTPS: Automatic!

---

## ✨ ĐÃ XONG!

Bạn giờ có:
- ✅ Website live trên Vercel
- ✅ API live trên Railway
- ✅ Auto-deploy khi push
- ✅ Shipping fee calculating
- ✅ Sẵn sàng kinh doanh! 🚀

---

## 📞 CẦN GIÚP?

1. Xem **DEPLOY_VERCEL.md** (chi tiết hơn)
2. Xem **DEPLOY_NOW.txt** (checklist)
3. Google lỗi message
4. Stack Overflow (nếu vẫn stuck)

---

**Chúc mừng! Website của bạn giờ live! 🎉**

**Kế tiếp:** Bán hàng, kiếm tiền, grow business! 💰

---

*Version: 1.0.0*  
*Language: Tiếng Việt*  
*Last Update: July 19, 2026*
