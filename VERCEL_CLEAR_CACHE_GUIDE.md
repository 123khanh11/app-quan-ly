# 🔧 VERCEL: Clear Cache & Redeploy (Chi Tiết)

## 📋 Hướng Dẫn Từng Bước

### BƯỚC 1: Vào Vercel Dashboard

1. Mở browser: https://vercel.com/dashboard
2. **Đăng nhập** nếu chưa (dùng GitHub/Google)
3. Bạn sẽ thấy danh sách projects

```
┌─────────────────────────────────────┐
│ Vercel Dashboard                    │
├─────────────────────────────────────┤
│ Projects:                           │
│ ┌───────────────────────────────────┤
│ │ E-commerce-website-interface  ← CHỌN CÁI NÀY
│ ├───────────────────────────────────┤
│ │ other-project                     │
│ └───────────────────────────────────┘
└─────────────────────────────────────┘
```

---

### BƯỚC 2: Click Vào Project

1. Click tên project: **E-commerce-website-interface**
2. Màn hình mới sẽ hiển thị chi tiết project

```
┌──────────────────────────────────────────┐
│ E-commerce-website-interface             │
├──────────────────────────────────────────┤
│ Production  │ Preview  │ Deployments      │
├──────────────────────────────────────────┤
│ Deployment Status: READY ✓               │
│ URL: https://e-commerce-...vercel.app   │
│                                          │
│ Latest Deployment: 2 hours ago           │
└──────────────────────────────────────────┘
```

---

### BƯỚC 3: Vào Settings

1. Tìm **Settings** (nút/link ở trên cùng)
2. Click **Settings**

```
┌──────────────────────────────────────┐
│ Production  Deployments  Settings ← CLICK HERE
│                         (thường ở góc phải)
└──────────────────────────────────────┘
```

---

### BƯỚC 4: Tìm "Git"

Sau khi click Settings, bạn sẽ thấy menu bên trái:

```
┌─────────────────────────────┐
│ Settings Menu (bên trái)    │
├─────────────────────────────┤
│ General                     │
│ Domains                     │
│ Git ← TÌMCÁI NÀY            │
│ Build & Development         │
│ Environment Variables       │
│ API Tokens                  │
│ ...                         │
└─────────────────────────────┘
```

Click **Git**

---

### BƯỚC 5: Clear Cache

Trong Git section, bạn sẽ thấy:

```
┌─────────────────────────────────────────┐
│ Git Settings                            │
├─────────────────────────────────────────┤
│ Connected Repository:                  │
│ your-github/e-commerce-website  ✓      │
│                                         │
│ Production Branch: master               │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ Clear Build Cache    [BUTTON]  ← │  │
│ └───────────────────────────────────┘  │
│                                         │
│ (Nếu không thấy, scroll xuống)         │
└─────────────────────────────────────────┘
```

**Click nút: "Clear Build Cache"** (màu đỏ hoặc xanh)

---

### BƯỚC 6: Xác Nhận

Sau khi click, sẽ có dialog xác nhận:

```
┌──────────────────────────────────────┐
│ ⚠️ Clear Build Cache?               │
├──────────────────────────────────────┤
│ This will clear the build cache.    │
│ Your next deployment will rebuild   │
│ from scratch.                       │
│                                      │
│  [Cancel]    [Clear Cache] ← CLICK  │
└──────────────────────────────────────┘
```

**Click: "Clear Cache"**

---

### BƯỚC 7: Chờ Clear Xong

Sẽ có message:

```
✅ Build cache cleared
```

---

### BƯỚC 8: Redeploy

Có 2 cách:

#### **Cách A: Vào Deployments tab**

1. Click tab **Deployments** (nằm trên)
2. Tìm deployment mới nhất
3. Click **...** (3 chấm)
4. Click **Redeploy**

```
┌────────────────────────────────────────┐
│ Deployments                            │
├────────────────────────────────────────┤
│ Latest:                                │
│ ┌──────────────────────────────────┐  │
│ │ Commit: fix: clear cache         │  │
│ │ Status: READY ✓                  │  │
│ │ Time: 2 hours ago                │  │
│ │ [...]  ← CLICK (3 chấm)          │  │
│ └──────────────────────────────────┘  │
│                                        │
│ Menu sẽ hiển thị:                      │
│ - View                                 │
│ - Promote to Production                │
│ - Redeploy ← CLICK CÁI NÀY            │
│ - Delete                               │
└────────────────────────────────────────┘
```

**Click: Redeploy**

#### **Cách B: Git push (Auto-redeploy)**

```bash
cd "C:\Users\baomu\Downloads\E-commerce website interface"
git push origin master
```

Vercel sẽ tự động redeploy! (Không cần click gì)

---

### BƯỚC 9: Chờ Deploy Xong

Màn hình Deployments sẽ hiển thị:

```
┌────────────────────────────────────────┐
│ Deployments                            │
├────────────────────────────────────────┤
│ Latest:                                │
│ ┌──────────────────────────────────┐  │
│ │ Commit: fix: clear cache         │  │
│ │ Status: BUILDING... ⏳           │  │
│ │ (Chờ 1-2 phút)                   │  │
│ └──────────────────────────────────┘  │
│                                        │
│ Sau khi xong:                          │
│ Status: READY ✓                        │
│ URL: https://e-commerce-...vercel.app│
└────────────────────────────────────────┘
```

---

### BƯỚC 10: Test Website

Sau khi Status = **READY ✓**:

1. Click URL: https://e-commerce-website-interface.vercel.app
2. Test checkout form
3. Chọn tỉnh/quận/phường
4. Nếu hiển thị đầy đủ → **✅ FIX THÀNH CÔNG!**

---

## 📸 Tóm Tắt (Quick Reference)

```
1. https://vercel.com/dashboard
   ↓
2. Click Project: E-commerce-website-interface
   ↓
3. Click Settings (góc phải trên)
   ↓
4. Click Git (menu bên trái)
   ↓
5. Click "Clear Build Cache" button
   ↓
6. Confirm: "Clear Cache"
   ↓
7. Chờ ✅ (1 phút)
   ↓
8. Click Deployments tab
   ↓
9. Click ... → Redeploy
   ↓
10. Chờ Status = READY ✓ (2-3 phút)
   ↓
11. Test website
```

---

## ✅ Expected Result

Sau khi redeploy:
- ✓ Website load without error
- ✓ Checkout form hoạt động
- ✓ Dropdown tỉnh/quận/phường hiển thị đầy đủ
- ✓ Shipping fee tính toán OK

---

## ❌ Nếu Vẫn Lỗi

1. **Hard refresh**: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
2. **Clear browser cache**: F12 → Application → Clear Storage
3. **Kiểm tra Network tab**: Có API error không?
4. **Đợi 5 phút**: Cache DNS có thể chậm update

---

## 💡 LƯU Ý

- Clear cache **không xóa dữ liệu**
- Chỉ xóa build artifacts
- Database (Supabase) vẫn an toàn
- Redeploy sẽ rebuild từ đầu (mất 2-3 phút)

---

**Làm theo các bước trên = Website fix!** 🚀

