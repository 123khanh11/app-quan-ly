# 📦 Hệ Thống Quản Lý Kho Hàng - React Web App

**Ứng dụng web quản lý đơn hàng và sản phẩm toàn bộ tính năng, xây dựng bằng React 18 và Supabase.**

---

## 🚀 Tính Năng

✅ **Quản Lý Đơn Hàng**
- Tạo, sửa, xóa đơn hàng
- Cập nhật trạng thái đơn hàng (Chờ, Đang xử lý, Hoàn thành, Hủy)
- Tìm kiếm đơn hàng theo tên, email, điện thoại
- Hiển thị đầy đủ thông tin địa chỉ giao hàng
- Quản lý địa chỉ: Đường, Phường, Quận, Thành phố

✅ **Quản Lý Sản Phẩm**
- CRUD sản phẩm (Tạo, Đọc, Sửa, Xóa)
- Quản lý giá, mô tả, hình ảnh
- Phân loại theo danh mục
- Quản lý SKU

✅ **Quản Lý Kho Hàng**
- Hiển thị số lượng tồn kho
- Cảnh báo hàng tồn ít (< 10)
- Cập nhật số lượng tồn kho
- Tính giá trị kho hàng
- Lọc, sắp xếp theo nhiều tiêu chí

✅ **Báo Cáo Doanh Thu**
- Top 10 sản phẩm bán chạy nhất
- Doanh thu theo danh mục
- Doanh thu theo ngày (biểu đồ)
- Thống kê chi tiết với tỷ lệ %

✅ **Bảng Điều Khiển (Dashboard)**
- Tổng doanh thu
- Tổng số đơn hàng
- Tổng sản phẩm & kho hàng
- Trạng thái đơn hàng (Chờ, Đang, OK, Hủy)
- Thống kê hôm nay
- Cập nhật liên tục

✅ **Quản Lý Danh Mục**
- Tạo danh mục sản phẩm
- Sửa, xóa danh mục
- Hình ảnh danh mục

✅ **Xác Thực & Bảo Mật**
- Đăng nhập với email/mật khẩu
- Đăng ký tài khoản
- Đăng xuất an toàn
- Quản lý session
- Authentication với Supabase

✅ **Giao Diện**
- Responsive (mobile, tablet, desktop)
- Dark/Light theme sẵn sàng
- Navigation bar đầy đủ
- Loading states
- Error handling
- Animations mượt mà

---

## 📁 Cấu Trúc Dự Án

```
src/
├── components/              # React Components (8 trang)
│   ├── App.jsx             # Main app với navigation
│   ├── LoginPage.jsx       # Đăng nhập/Đăng ký
│   ├── HomePage.jsx        # Dashboard
│   ├── OrdersPage.jsx      # Quản lý đơn hàng
│   ├── ProductsPage.jsx    # Quản lý sản phẩm
│   ├── InventoryPage.jsx   # Quản lý kho hàng
│   ├── SalesReportPage.jsx # Báo cáo doanh thu
│   └── CategoriesPage.jsx  # Quản lý danh mục
│
├── lib/                     # Services & Utilities
│   ├── supabaseClient.js   # Supabase initialization
│   ├── productService.js   # Product CRUD
│   ├── orderService.js     # Order CRUD
│   ├── orderItemService.js # Order items
│   ├── dashboardService.js # Analytics
│   └── parseAddress.js     # Address parsing
│
├── styles/                  # CSS Files (8 tệp)
│   ├── LoginPage.css
│   ├── HomePage.css
│   ├── OrdersPage.css
│   ├── ProductsPage.css
│   ├── InventoryPage.css
│   ├── SalesReportPage.css
│   └── CategoriesPage.css
│
├── App.jsx                  # Main app component
├── App.css                  # Main styles & navbar
├── main.jsx                 # React entry point
└── index.css                # Global styles

index.html                    # HTML entry point
```

---

## 🛠️ Công Nghệ Sử Dụng

- **React 18** - UI Framework
- **Supabase JS SDK** - Backend & Database
- **Vite** - Build tool
- **CSS3** - Styling (Grid, Flexbox, Animations)
- **Modern JavaScript (ES6+)**

---

## 📦 Cài Đặt & Chạy

### 1. Cài đặt Dependencies

```bash
npm install
```

### 2. Cấu Hình Supabase

Tạo file `.env` từ `.env.example`:

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

Lấy thông tin từ [Supabase Dashboard](https://app.supabase.com/)

### 3. Chạy Dev Server

```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:5173`

### 4. Build Production

```bash
npm run build
```

Output sẽ ở folder `dist/`

### 5. Preview Build

```bash
npm run preview
```

---

## 🗄️ Database Schema

### Tables cần thiết:

```sql
-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL,
  stock_quantity INTEGER,
  category_id UUID REFERENCES categories,
  image_url TEXT,
  sku VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR,
  customer_phone VARCHAR,
  shipping_address TEXT,
  shipping_street TEXT,
  shipping_ward TEXT,
  shipping_district TEXT,
  shipping_city TEXT,
  total_amount DECIMAL,
  status VARCHAR,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders,
  product_id UUID REFERENCES products,
  quantity INTEGER,
  price DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 📝 Hướng Dẫn Sử Dụng

### Đăng Nhập

1. Truy cập trang LoginPage
2. Nhập email & mật khẩu
3. Bấm "Đăng nhập"
4. Hoặc đăng ký tài khoản mới

### Quản Lý Đơn Hàng

1. Vào **"Đơn hàng"** từ navigation
2. Bấm **"+ Thêm Đơn"** để tạo đơn mới
3. Điền thông tin khách hàng & địa chỉ
4. Bấm **"Tạo Đơn"**
5. Sửa: Bấm **✏️**
6. Xóa: Bấm **🗑️**

### Quản Lý Sản Phẩm

1. Vào **"Sản phẩm"**
2. Bấm **"+ Thêm Sản Phẩm"**
3. Điền tên, giá, mô tả
4. Chọn danh mục
5. Bấm **"Thêm"**

### Quản Lý Kho Hàng

1. Vào **"Kho hàng"**
2. Xem số lượng tồn kho từng sản phẩm
3. Bấm **"✏️ Sửa"** để cập nhật số lượng
4. Lọc hàng tồn ít
5. Sắp xếp theo tên, kho, giá

### Báo Cáo Doanh Thu

1. Vào **"Báo cáo"**
2. Chọn thời gian (7, 30, 90 ngày hoặc 1 năm)
3. Xem:
   - Top sản phẩm bán chạy
   - Doanh thu theo danh mục
   - Biểu đồ doanh thu theo ngày

### Dashboard

1. Vào **"Trang chủ"**
2. Xem thống kê tổng quát
3. Bấm **"🔄 Làm mới"** để cập nhật

---

## 🔒 Bảo Mật

- ✅ Authentication với Supabase
- ✅ RLS Policies (Row Level Security)
- ✅ Secure token storage
- ✅ Input validation
- ✅ Error handling

---

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

Tất cả các trang đều responsive và tối ưu cho thiết bị di động.

---

## 🚀 Deploy

### Vercel (Khuyên dùng)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag & drop 'dist' folder to Netlify
```

### Docker

```bash
docker build -t app-quan-ly .
docker run -p 3000:3000 app-quan-ly
```

---

## 🐛 Troubleshooting

### Lỗi: "Supabase credentials not found"
- Kiểm tra file `.env` có `.env.example`
- Đảm bảo `VITE_SUPABASE_URL` và `VITE_SUPABASE_KEY` đúng
- Restart dev server

### Lỗi: "Module not found"
```bash
rm -rf node_modules
npm install
```

### Lỗi: "CORS Error"
- Kiểm tra CORS settings trong Supabase
- Thêm domain vào Supabase allowed origins

### App không hiển thị dữ liệu
- Kiểm tra RLS Policies trong Supabase
- Đảm bảo user đã đăng nhập
- Kiểm tra network tab trong DevTools

---

## 📊 Performance

- ✅ Lazy loading components
- ✅ Optimized images
- ✅ Minimal bundle size (~50KB gzipped)
- ✅ Real-time data updates
- ✅ Efficient queries

---

## 🎨 Styling Guide

### Color Palette
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Success: `#4caf50` (Green)
- Error: `#f44336` (Red)
- Warning: `#ff9800` (Orange)
- Background: `#f5f5f5` (Light Gray)

### Typography
- Font: Segoe UI, Tahoma, Geneva, Verdana
- Headings: Font-weight 700, 600
- Body: Font-weight 400, 500

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra console (F12) xem error message
2. Kiểm tra Supabase logs
3. Xem API requests trong Network tab
4. Đọc documentation: [React Docs](https://react.dev), [Supabase Docs](https://supabase.com/docs)

---

## 📄 License

MIT License - Free to use and modify

---

**Được phát triển với ❤️ bằng React & Supabase**

Last Updated: 2024
