# ⚡ Hướng Dẫn Nhanh - React Web App

## 🎯 Bắt Đầu Trong 5 Phút

### Bước 1: Cài Đặt Dependencies
```bash
npm install
```

### Bước 2: Cấu Hình Supabase
Tạo file `.env` trong folder root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

**Cách lấy thông tin:**
1. Vào [Supabase Dashboard](https://app.supabase.com/)
2. Chọn project
3. Settings → API
4. Copy `Project URL` → `VITE_SUPABASE_URL`
5. Copy `anon public` key → `VITE_SUPABASE_KEY`

### Bước 3: Chạy Dev Server
```bash
npm run dev
```

✅ Truy cập: `http://localhost:5173`

---

## 📊 Cấu Trúc Thư Mục

```
src/
├── components/     ← 7 React pages
├── lib/            ← 6 services
├── styles/         ← 7 CSS files
├── App.jsx         ← Main component
└── main.jsx        ← Entry point
```

---

## 🚀 Lệnh Hữu Ích

| Lệnh | Mục Đích |
|------|---------|
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production |
| `npm run preview` | Xem build |

---

## ✨ Tính Năng Chính

| Trang | Mô Tả |
|------|-------|
| 📋 Đơn hàng | Tạo/sửa/xóa đơn, quản lý trạng thái |
| 📦 Sản phẩm | CRUD sản phẩm, quản lý danh mục |
| 📊 Kho hàng | Tồn kho, cảnh báo, giá trị kho |
| 📈 Báo cáo | Top sản phẩm, doanh thu, biểu đồ |
| 🏠 Dashboard | Thống kê tổng quát |
| 🏷️ Danh mục | Quản lý danh mục sản phẩm |

---

## 🗄️ Database

Đảm bảo Supabase có các table:
- `categories` - Danh mục
- `products` - Sản phẩm
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn

Chi tiết schema: `README_REACT_APP.md`

---

## 🔐 Đăng Nhập

**Demo Account:**
- Email: `demo@example.com`
- Pass: `demo123456`

Hoặc tạo tài khoản mới trên LoginPage

---

## 📱 Responsive

✅ Desktop (1200px+)
✅ Tablet (768px - 1199px)  
✅ Mobile (< 768px)

---

## 🐛 Gặp Vấn Đề?

### Error: "Supabase credentials not found"
→ Kiểm tra `.env` file

### Error: "CORS Error"
→ Thêm domain vào Supabase CORS settings

### Error: "Module not found"
```bash
rm -rf node_modules
npm install
```

---

## 📚 Tệp Quan Trọng

- `src/App.jsx` - Main app
- `src/main.jsx` - React entry
- `index.html` - HTML entry
- `package.json` - Dependencies
- `vite.config.js` - Vite config

---

## 🎨 Tùy Chỉnh Giao Diện

**Colors:** Sửa trong `src/App.css` và `src/styles/*.css`

```css
Primary: #667eea
Secondary: #764ba2
Success: #4caf50
```

---

## 📦 Build & Deploy

**Build:**
```bash
npm run build
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

---

## ✅ Checklist

- [ ] Clone repository
- [ ] `npm install`
- [ ] Tạo `.env` file
- [ ] Thêm Supabase credentials
- [ ] `npm run dev`
- [ ] Truy cập http://localhost:5173
- [ ] Đăng nhập / Đăng ký
- [ ] Test các tính năng

---

**Hoàn tất! 🎉**

Đọc `README_REACT_APP.md` để chi tiết hơn
