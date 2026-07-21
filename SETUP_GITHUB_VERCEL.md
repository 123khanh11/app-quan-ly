# 🔧 Setup GitHub + Vercel Integration

## ⚠️ Vấn Đề Hiện Tại

Git remote URL chưa được cấu hình đúng:
```
https://github.com/USERNAME/app-quan-ly.git/
```

USERNAME chưa được thay bằng username GitHub thực của bạn.

---

## 🎯 Để Deploy Bằng Git + Vercel

### **Option 1: Setup GitHub + Connect Vercel (Khuyên Dùng)**

#### Bước 1: Tạo Repository GitHub
1. Vào https://github.com/new
2. Điền:
   - Repository name: `app-quan-ly` (hoặc tên khác)
   - Description: `Order Management System`
   - Chọn **Public** hoặc **Private**
3. Click **Create Repository**

#### Bước 2: Setup Git Local
```cmd
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"

REM Add GitHub remote (thay YOUR_GITHUB_USERNAME)
git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/app-quan-ly.git

REM Verify
git remote -v
```

Ví dụ:
```cmd
git remote set-url origin https://github.com/khanhtrade/app-quan-ly.git
```

#### Bước 3: Push lên GitHub
```cmd
git push -u origin master
```

Nó sẽ hỏi GitHub account.

#### Bước 4: Connect Vercel
1. Vào https://vercel.com/dashboard
2. Vào project `app-ql-v2`
3. **Settings** → **Git** → **Connect GitHub**
4. Select repository `app-quan-ly`
5. Save

**Khi này**: Mỗi push lên GitHub → Vercel tự động deploy! 🚀

---

### **Option 2: Deploy Không Dùng GitHub (Hiện Tại)**

Nếu không muốn setup GitHub, dùng:

```cmd
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"
npm run build
vercel --prod
```

---

## 🔐 GitHub Authentication

Nếu gặp lỗi authentication:

### Windows 10/11 Credential Manager
1. Settings → Credential Manager → Windows Credentials
2. Tìm `git:https://github.com` 
3. Edit → Update username + personal access token

### Personal Access Token (PAT)
1. Vào https://github.com/settings/tokens
2. Click **Generate new token**
3. Scopes: ✅ `repo`, ✅ `admin:repo_hook`
4. Copy token
5. Khi Git hỏi password → Paste token

---

## 📊 So Sánh

| Method | Setup | Auto Deploy | Pros | Cons |
|--------|-------|-------------|------|------|
| **Git + Vercel** | ⭐⭐ Medium | ✅ Yes | Automatic, Professional | Need GitHub |
| **Vercel CLI Direct** | ⭐ Easy | ❌ Manual | Simple, No GitHub | Manual each time |
| **Vercel Dashboard** | ⭐ Easy | ❌ Manual | Simple | Manual upload |

---

## ✅ Tómlược

### Nếu có GitHub username:
```cmd
git remote set-url origin https://github.com/YOUR_USERNAME/app-quan-ly.git
git push -u origin master
```

### Nếu không có GitHub:
```cmd
npm run build
vercel --prod
```

---

**Bạn có GitHub username không? Nếu có, cho tôi biết để setup!** 🚀
