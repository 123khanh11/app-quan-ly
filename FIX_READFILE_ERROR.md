# 🔧 FIX: "Cannot read properties of undefined (reading 'readFile')"

## 🔴 Lỗi

```
Error: Cannot read properties of undefined (reading 'readFile')
```

## 🔍 Nguyên nhân

Lỗi này thường từ:
1. **Build cache cũ** trên máy hoặc Vercel
2. **ts-node config** không đúng
3. **Node modules** corrupt

## ✅ Giải pháp (Theo thứ tự)

### Bước 1: Clean build locally

```bash
# Remove old build artifacts
rm -r dist node_modules package-lock.json

# Reinstall
npm install

# Build again
npm run build
```

**Kết quả kỳ vọng:** Build thành công (✓ built in 3-4s)

---

### Bước 2: Clear Vercel cache

1. Vào https://vercel.com/dashboard
2. Chọn project: **E-commerce website interface**
3. Click **Settings** → **Git**
4. Click **Clear Cache**
5. Click **Redeploy**

---

### Bước 3: Check tsconfig.json

Đảm bảo file có đúng cấu hình:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "jsx": "react-jsx",
    "declaration": true,
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["scripts/**/*.ts", "src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"],
  "ts-node": {
    "compilerOptions": {
      "module": "commonjs"
    }
  }
}
```

---

### Bước 4: Cleanup .gitignore

```
node_modules
dist
.vercel
.env*
!.env.example
.DS_Store
*.log
.cache
```

---

### Bước 5: Fresh git push

```bash
git add .
git commit -m "fix: Clear build cache and update config"
git push origin master
```

Vercel sẽ auto-redeploy.

---

## 🎯 Nếu vẫn lỗi

### Option 1: Unlink & relink Vercel

```bash
vercel unlink
vercel link
vercel --prod
```

### Option 2: Delete & redeploy

1. Vercel Dashboard → Settings → Delete project
2. Tạo project mới
3. Deploy fresh

### Option 3: Check Node version

```bash
node --version  # Should be >= 18

# If old, update:
# Download from https://nodejs.org/
```

---

## ✅ Verification

Sau khi fix, kiểm tra:

```bash
# 1. Build locally
npm run build
# Should: ✓ built in X.XXs

# 2. Check Vercel
# Should: Deployments → READY

# 3. Visit website
# Should: https://e-commerce-website-interface.vercel.app ✓
```

---

## 📊 Status

- ✅ Code: Valid (Build test PASSED)
- ✅ Data: Seeded (5,336 wards)
- ✅ Environment: Configured
- ⚠️ Deployment: May need cache clear on Vercel

**Try Bước 1-2 above first!** 🚀

