# 🚀 DEPLOY BẰNG TERMINAL - CHI TIẾT

## 📋 BƯỚC 1: Chuẩn Bị

### 1.1 Cài Đặt Node.js
- Download: https://nodejs.org
- Cài đặt (bấm Next → Next → Finish)
- Kiểm tra:
  ```cmd
  node -v
  npm -v
  ```

### 1.2 Cài Đặt Vercel CLI
```cmd
npm install -g vercel
```

### 1.3 Đăng Nhập Vercel
```cmd
vercel login
```
- Chọn GitHub hoặc Email
- Follow hướng dẫn

---

## 🔄 BƯỚC 2: Deploy (Cách 1 - Tự Động)

**Chạy script tự động (dễ nhất):**

```cmd
REM Windows CMD
deploy.bat
```

**Hoặc PowerShell:**
```powershell
# PowerShell
.\deploy-vercel.bat
```

**Script sẽ:**
1. Cài dependencies ✓
2. Build project ✓
3. Deploy Vercel ✓

---

## 🔄 BƯỚC 3: Deploy (Cách 2 - Từng Bước)

**Mở Terminal/CMD tại thư mục project:**

```cmd
cd c:\Users\baomu\OneDrive\Documents\app quản ly
```

### Step 1: Cài Dependencies
```cmd
npm install
```

### Step 2: Build
```cmd
npm run build
```

### Step 3: Deploy
```cmd
vercel --prod
```

**Trả lời các câu hỏi:**
- `? Set up and deploy "..."?` → **y** (yes)
- `? Which scope?` → Chọn account
- `? Found project.vercel.json. Overwrite?` → **y**
- `? Production?` → **y**

### Step 4: Chờ Deploy Xong
- Vercel sẽ hiển thị URL
- Vào URL test ✅

---

## 🔄 BƯỚC 4: Deploy (Cách 3 - Drag & Drop)

**Nếu không muốn terminal:**

1. **Build local:**
   ```cmd
   npm install
   npm run build
   ```

2. **Nén thư mục `dist` thành ZIP**

3. **Vào Vercel Dashboard → Redeploy**

4. **Kéo file ZIP vào**

---

## 📝 Các Lệnh Hay Dùng

```cmd
REM Build local để test
npm run build

REM Preview build
npm run preview

REM Deploy Vercel
vercel --prod

REM Deploy staging (test)
vercel

REM Xem logs
vercel logs

REM Xem status
vercel status
```

---

## 🆘 Lỗi Thường Gặp

### Lỗi: "vercel: command not found"
```cmd
REM Cài lại Vercel
npm install -g vercel
vercel login
```

### Lỗi: "Cannot find module"
```cmd
REM Cài dependencies lại
npm install

REM Xóa node_modules rồi cài lại
rmdir /s /q node_modules
npm install
```

### Lỗi: "Build failed"
```cmd
REM Kiểm tra build local
npm run build

REM Nếu lỗi, sửa code rồi build lại
npm run build
```

---

## ✅ Hoàn Thành!

App của bạn đã live! 🎉

**Share URL:** `https://app-quan-ly.vercel.app`

