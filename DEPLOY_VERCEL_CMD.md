# 🚀 Hướng Dẫn Deploy Lên Vercel Bằng CMD

## ⚡ Cách Nhanh Nhất (5 phút)

### **Bước 1: Mở CMD**
```
Win + R
Gõ: cmd
Press Enter
```

### **Bước 2: Vào Folder Project**
```cmd
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"
```

### **Bước 3: Deploy Lên Production**
```cmd
vercel --prod
```

### **Bước 4: Chọn Lựa Chọn**
Khi chạy lệnh, nó sẽ hỏi:
- **Which scope?** → Chọn scope của bạn (Enter)
- **Link to existing project?** → `y` (có)
- **Project name?** → Tên project Vercel của bạn (Enter)
- **Build command?** → `npm run build` (Enter)
- **Output directory?** → `dist` (Enter)

---

## 📝 Full Script (Copy-Paste Cả Khối)

Mở CMD rồi paste:

```cmd
cd "c:\Users\baomu\OneDrive\Documents\app quản ly" && npm run build && vercel --prod
```

**Giải thích:**
- `npm run build` - Build project
- `&&` - Nếu build OK, chạy tiếp
- `vercel --prod` - Deploy to production

---

## 🎯 Alternative: Deploy Mà Không Dùng Git

### **Option 1: Dùng Vercel Dashboard**

1. Vào https://vercel.com
2. Login account của bạn
3. Vào project → Settings → Git
4. Chọn **Redeploy** button (nếu có)
5. Hoặc upload folder `dist` trực tiếp

### **Option 2: Dùng Vercel CLI (Không cần Git)**

```cmd
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"
vercel --prod --yes
```

`--yes` flag = không hỏi confirm, tự động deploy

---

## ✅ Verify Deploy

Sau khi deploy xong:
1. Mở browser
2. Vào link Vercel của project
3. Test features:
   - ✅ Dashboard load được không?
   - ✅ Orders tab hoạt động không?
   - ✅ Search orders được không?
   - ✅ Nút Gmail login có hiện không?

---

## 🔐 Có Vấn Đề?

### Lỗi: "No project found"
→ Chạy: `vercel link` trước, rồi `vercel --prod`

### Lỗi: "Build failed"
→ Chạy: `npm install` trước, rồi retry

### Lỗi: "Cannot find module"
→ Xóa `node_modules` folder:
```cmd
rmdir /s /q node_modules
npm install
npm run build
vercel --prod
```

---

## 📊 Build Status Check

Xem build logs:

```cmd
vercel logs app-quan-ly --prod
```

(Thay `app-quan-ly` bằng tên project của bạn)

---

## 🎨 Environment Variables (Nếu Cần)

Nếu có biến môi trường:

```cmd
vercel env pull
```

Cái này sẽ pull `.env.local` từ Vercel

---

## 🚀 Lệnh Nhanh

| Tác Vụ | Lệnh |
|--------|------|
| Build | `npm run build` |
| Deploy staging | `vercel` |
| Deploy production | `vercel --prod` |
| Link project | `vercel link` |
| Xem logs | `vercel logs app-quan-ly --prod` |
| Unlink project | `vercel unlink` |

---

## 💡 Tips

✅ **Luôn build trước deploy**
```cmd
npm run build
vercel --prod
```

✅ **Nếu muốn tự động deploy mỗi khi push**
→ Setup GitHub integration (nhưng bạn nói ko dùng GitHub nữa)

✅ **Deploy test staging trước**
```cmd
vercel
```
(Không có `--prod` flag)

✅ **Clear Vercel cache nếu có vấn đề**
```cmd
vercel env rm VERCEL_CACHE_BUILD_OUTPUTS
```

---

## 🎯 Tómlược Bước

1. Mở CMD
2. `cd "c:\Users\baomu\OneDrive\Documents\app quản ly"`
3. `npm run build`
4. `vercel --prod`
5. Follow prompts
6. ✅ Deploy done!

**Thời gian**: ~2-3 phút (tùy network)

---

**Bạn chạy xong rồi báo cho tôi kết quả nhé!** 🚀
