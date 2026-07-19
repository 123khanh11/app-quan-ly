# 📖 Hướng Dẫn Các Tính Năng Hiện Tại

## 1. 🛒 Cửa Hàng (Shop)

### Hiển Thị Sản Phẩm
- Lấy tất cả sản phẩm từ database (active = true)
- Hiển thị hình ảnh, tên, giá
- Hiển thị giá sale nếu có

### Thêm Vào Giỏ Hàng
```
1. Nhấp nút "🛒 Thêm Vào Giỏ" trên sản phẩm
2. Sản phẩm được thêm vào giỏ
3. Icon giỏ hàng hiển thị số lượng
4. Click "🛒 Giỏ Hàng" để xem chi tiết
```

### Thích Sản Phẩm
```
1. Nhấp icon ❤️ để thêm vào wishlist (hiện tại chưa hoạt động)
2. Tính năng sẽ được phát triển sau
```

---

## 2. 🛍️ Giỏ Hàng (Cart)

### Xem Giỏ Hàng
- Hiển thị danh sách sản phẩm trong giỏ
- Hiển thị ảnh, tên, giá từng sản phẩm
- Hiển thị tổng giá tiền

### Quản Lý Số Lượng
```
Các cách điều chỉnh số lượng:
1. Nhấp nút "-" để giảm số lượng
2. Nhấp nút "+" để tăng số lượng
3. Nhập trực tiếp số vào ô text
4. Số lượng tối thiểu là 1
```

### Xóa Sản Phẩm
```
1. Nhấp icon 🗑️ đỏ trên từng sản phẩm
2. Hoặc nhấp "Xóa Tất Cả" để xóa toàn bộ
```

### Tóm Tắt Đơn Hàng
```
Hiển thị:
- Tạm tính (tổng giá sản phẩm)
- Phí vận chuyển: 50,000₫
- Tổng cộng (tạm tính + phí vận chuyển)
```

---

## 3. 💳 Thanh Toán (Checkout)

### Bước 1: Nhập Thông Tin Liên Hệ
```
- Email (bắt buộc): Để liên hệ khách hàng
- Số Điện Thoại (bắt buộc): Để giao hàng
```

### Bước 2: Chọn Địa Chỉ Giao
```
1. Chọn Tỉnh/Thành Phố
   └─ Danh sách: Hà Nội, TP.HCM, Hải Phòng, Đà Nẵng, Cần Thơ
   
2. Chọn Quận/Huyện (phụ thuộc vào tỉnh đã chọn)
   └─ Danh sách động tùy theo tỉnh
   
3. Chọn Xã/Phường (phụ thuộc vào quận đã chọn)
   └─ Danh sách động tùy theo quận
   
4. Nhập Địa Chỉ Chi Tiết (số nhà, tên đường, v.v.)
```

### Bước 3: Tùy Chọn Bổ Sung
```
- GPS Button: Nhấp để lấy tọa độ hiện tại (nếu browser hỗ trợ)
- Ghi Chú: Nhập bất kỳ ghi chú nào (không bắt buộc)
```

### Bước 4: Xác Nhận
```
1. Nhấp "Đặt Hàng" để xác nhận
2. Dữ liệu được gửi đến database
3. Thông báo thành công với mã đơn hàng
4. Tự động chuyển đến trang tracking
5. Giỏ hàng được xóa trống
```

---

## 4. 👤 Đăng Nhập (Authentication)

### Google OAuth Login
```
Quy trình:
1. Nhấp nút "🔑 Đăng Nhập" ở header
2. Modal hiển thị nút "Đăng nhập bằng Google"
3. Nhấp nút → Chuyển đến Google login
4. Đăng nhập Gmail
5. Xác nhận chia sẻ email/tên/avatar
6. Quay lại website, đã đăng nhập

Thông tin hiển thị:
- Avatar từ Google
- Tên người dùng
- Email
- Ngày đăng nhập
- Số đơn hàng (0)
- Tổng tiêu (0₫)
```

### Profile Menu
```
Khi đã đăng nhập:
1. Nhấp avatar ở header
2. Dropdown hiển thị thông tin cá nhân
3. Hiển thị số đơn hàng và tổng chi tiêu
4. Nút "Đăng Xuất" để logout
```

### Logout
```
1. Nhấp avatar
2. Nhấp "Đăng Xuất"
3. Quay lại trạng thái chưa đăng nhập
```

---

## 5. 📦 Tracking Đơn Hàng (Order Tracking)

### Tìm Kiếm Đơn Hàng
```
1. Nhấp "Đơn Hàng" ở navigation
2. Modal hiệu xuất với ô nhập "Mã Đơn Hàng"
3. Nhập mã đơn hàng (UUID)
4. Nhấp "Tìm Kiếm"
```

### Xem Chi Tiết Đơn Hàng
```
Hiển thị:
- Mã đơn hàng
- Trang thái đơn hàng (pending, processing, shipped, delivered, cancelled)
- Ngày tạo
- Tổng giá tiền
- Phí vận chuyển
- Phương thức thanh toán (cash, card, etc.)
- Địa chỉ giao hàng
- Danh sách sản phẩm trong đơn hàng
  └─ Tên sản phẩm, số lượng, giá từng cái
```

### Timeline Tracking (Sẽ Thêm)
```
Dự kiến hiển thị:
- Đã nhận đơn hàng
- Đang chuẩn bị
- Đã giao cho đơn vị vận chuyển
- Đang vận chuyển
- Đã giao thành công
```

---

## 6. 🚚 J&T Express Integration (Chưa Hoàn Thành)

### Tính Năng Sắp Có
```
1. Tạo Shipment
   - Tự động tạo order trên J&T
   - Lấy AWB (mã tracking J&T)
   
2. Tracking Shipping
   - Theo dõi tình trạng vận chuyển
   - Cập nhật status real-time
   
3. Lấy Shipping Rates
   - Tính phí vận chuyển tùy theo địa chỉ
   - Lựa chọn nhiều hình thức giao
   
4. Hủy Order
   - Hủy shipment nếu cần thiết
```

### Cách Hoạt Động (Sau Khi Hoàn Thành)
```
Checkout Flow:
1. Người dùng nhấp "Đặt Hàng"
2. Order được tạo trong Supabase
3. Tự động gọi J&T API để tạo shipment
4. Lấy AWB number từ J&T
5. Lưu AWB vào order
6. Hiển thị AWB cho khách hàng
7. Khách hàng có thể tracking qua J&T website
```

---

## 📊 Database Schema

### Products Table
```sql
- id (UUID): Mã sản phẩm
- name (text): Tên sản phẩm
- price (numeric): Giá bình thường
- sale_price (numeric): Giá khuyến mãi (tùy chọn)
- image_url (text): URL ảnh sản phẩm
- description (text): Mô tả chi tiết
- category_id (UUID): Mã danh mục
- sku (text): Mã hàng
- active (boolean): Hiện/ẩn sản phẩm
```

### Orders Table
```sql
- id (UUID): Mã đơn hàng
- user_id (UUID): Mã người dùng (tùy chọn)
- total (numeric): Tổng giá sản phẩm
- shipping_fee (numeric): Phí vận chuyển
- payment_method (text): Phương thức thanh toán
- payment_status (text): Trạng thái thanh toán
- order_status (text): Trạng thái đơn hàng
- shipping_address (text): Địa chỉ giao hàng
- note (text): Ghi chú (chứa email + SĐT)
- created_at (timestamp): Ngày tạo
```

### Order Items Table
```sql
- id (UUID): Mã chi tiết
- order_id (UUID): Mã đơn hàng
- product_id (UUID): Mã sản phẩm
- quantity (integer): Số lượng
- price (numeric): Giá bán
- created_at (timestamp): Ngày tạo
```

---

## 🔐 Bảo Mật

### Google OAuth
- ✅ Mật khẩu không bao giờ được gửi đến website
- ✅ Chỉ email/tên/avatar được chia sẻ
- ✅ Google xác thực danh tính
- ✅ Website nhận token an toàn

### Database
- ✅ Row-Level Security (RLS) bảo vệ dữ liệu
- ✅ Chỉ người dùng được phép mới có thể xem đơn hàng của họ
- ✅ Mã sản phẩm được xác thực trước khi thêm

### Environment Variables
- ✅ Supabase credentials không công khai
- ✅ J&T API keys sẽ được lưu an toàn

---

## 🎯 Prioritized To-Do List

### Ưu Tiên Cao (High Priority)
- [ ] Hoàn thành J&T shipping integration
- [ ] Thêm logging sản phẩm chi tiết
- [ ] Fix wishlist functionality

### Ưu Tiên Trung Bình (Medium Priority)
- [ ] Thêm filter/search products
- [ ] Thêm reviews/ratings
- [ ] Trang thanh toán nâng cao

### Ưu Tiên Thấp (Low Priority)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin dashboard

---

**Last Updated**: 2024-07-19
