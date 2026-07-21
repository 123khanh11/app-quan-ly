# 📱 HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG QUẢN LÝ HÀNG HÓA HOÀN CHỈNH

## 📋 MỤC LỤC
1. [Giới Thiệu](#giới-thiệu)
2. [Cài Đặt](#cài-đặt)
3. [Tính Năng](#tính-năng)
4. [Hướng Dẫn Chi Tiết](#hướng-dẫn-chi-tiết)
5. [Liên Hệ Hỗ Trợ](#liên-hệ-hỗ-trợ)

---

## 🎯 GIỚI THIỆU

Ứng dụng quản lý hàng hóa toàn diện với 2 phiên bản:
- **📱 Flutter (Mobile)**: Chạy trên điện thoại Android/iOS
- **🌐 Web (React)**: Chạy trên trình duyệt máy tính

### ✨ Tính Năng Chính
- ✅ Quản lý đơn hàng (xem, cập nhật trạng thái)
- ✅ Quản lý hàng hóa (thêm, sửa, xóa, tìm kiếm)
- ✅ Quản lý tồn kho (tự động cập nhật)
- ✅ Hiển thị địa chỉ giao hàng đầy đủ
- ✅ Thống kê, báo cáo doanh số
- ✅ Dashboard tổng quan
- ✅ Đồng bộ dữ liệu realtime

---

## 📲 CÀI ĐẶT

### FLUTTER (Mobile)

#### Bước 1: Chuẩn Bị Môi Trường
```bash
# Cài đặt Flutter SDK
# Download từ: https://flutter.dev/docs/get-started/install

# Kiểm tra cài đặt
flutter doctor
```

#### Bước 2: Clone / Copy Project
```bash
# Copy thư mục project vào máy
# Hoặc clone từ repository
```

#### Bước 3: Cài Đặt Dependencies
```bash
cd "c:\Users\baomu\OneDrive\Documents\app quản ly"
flutter pub get
```

#### Bước 4: Chạy Ứng Dụng
```bash
# Trên Android
flutter run -d android

# Trên iOS
flutter run -d ios

# Hoặc chạy tất cả device
flutter run
```

### WEB (React)

**Link trực tiếp:**
```
https://order-management-web-green.vercel.app
```

Hoặc deploy riêng:
```bash
npm install
npm run build
vercel deploy --prod
```

---

## 🎮 TÍNH NĂNG

### 1. 📦 QUẢN LÝ ĐƠN HÀNG

#### Xem Danh Sách Đơn Hàng
- Click tab **Orders**
- Hiển thị tất cả đơn hàng theo trạng thái
- Lọc theo: Chờ xử lý, Đang xử lý, Hoàn thành, Đã hủy

#### Xem Chi Tiết Đơn Hàng
- Click vào đơn hàng bất kỳ
- Xem đầy đủ:
  - 📋 Thông tin cơ bản (mã, ngày, khách)
  - 📍 Địa chỉ giao hàng (tỉnh, quận, xã, chi tiết)
  - 💰 Thông tin thanh toán (tổng tiền, phí, phương thức)
  - 📦 Trạng thái đơn hàng

#### Cập Nhật Trạng Thái
- Click nút cập nhật trong chi tiết đơn hàng
- Chọn trạng thái mới:
  - ⏳ Chờ xử lý
  - 🔄 Đang xử lý
  - ✅ Hoàn thành
  - ❌ Đã hủy

---

### 2. 📦 QUẢN LÝ HÀNG HÓA

#### Dashboard Hàng Hóa
- Click tab **Inventory Dashboard**
- Xem tổng quan:
  - 📊 Tổng số sản phẩm
  - 💵 Giá trị kho hàng
  - ⚠️ Sản phẩm sắp hết (tồn < 20)
  - 🔴 Sản phẩm hết hàng

#### Danh Sách Hàng Hóa
- Click tab **Inventory**
- Tìm kiếm theo tên hoặc SKU
- Xem thông tin chi tiết:
  - Tên sản phẩm
  - SKU/Mã hàng
  - Giá tiền
  - Tồn kho (màu xanh = còn, đỏ = hết)
  - Mô tả

#### Thêm Sản Phẩm Mới
1. Click nút **➕ Thêm sản phẩm**
2. Điền thông tin:
   - **Tên sản phẩm** (bắt buộc)
   - **SKU/Mã hàng** (bắt buộc, không trùng)
   - **Giá** (bắt buộc)
   - **Tồn kho** (bắt buộc)
   - **Mô tả** (tùy chọn)
3. Click **💾 Lưu**

#### Sửa Sản Phẩm
1. Click vào sản phẩm cần sửa
2. Click **✏️ Sửa** trong menu ba chấm
3. Thay đổi thông tin
4. Click **💾 Lưu**

#### Xóa Sản Phẩm
1. Click vào sản phẩm cần xóa
2. Click **🗑️ Xóa** trong menu ba chấm
3. Xác nhận xóa

#### Tìm Kiếm Hàng Hóa
- Nhập tên sản phẩm hoặc SKU trong ô tìm kiếm
- Ứng dụng tự động lọc kết quả
- Không phân biệt hoa/thường

---

### 3. 📊 DASHBOARD TỔNG QUAN

Xem thống kê chung:
- **Tổng đơn hàng** (toàn bộ)
- **Doanh thu** (tổng tiền từ tất cả đơn)
- **Đơn đang xử lý**
- **Đơn hoàn thành**
- **Biểu đồ** thống kê trực quan

---

### 4. 🔍 TÌMKIẾM VÀ LỌC

#### Tìm Kiếm Đơn Hàng
- Tìm theo địa chỉ giao hàng
- Tìm theo ghi chú

#### Tìm Kiếm Hàng Hóa
- Tìm theo tên sản phẩm
- Tìm theo SKU/Mã hàng

#### Lọc Theo Trạng Thái
- Click chip trạng thái ở đầu trang
- Tất cả, Chờ xử lý, Đang xử lý, Hoàn thành

---

## 📖 HƯỚNG DẪN CHI TIẾT

### 📍 HIỂN THỊ ĐỊA CHỈ GIAO HÀNG

#### Format Lưu Trữ
Địa chỉ được lưu dưới dạng:
```
"Chi tiết, Xã/Phường, Quận/Huyện, Tỉnh/Thành phố"
```

**Ví dụ:**
```
"Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
```

#### Hiển Thị Trên Ứng Dụng
Ứng dụng tự động tách thành:
- 🏠 **Chi tiết**: Số 123 Đường Lê Lợi
- 🏘️ **Xã/Phường**: Phường Bến Thành
- 🏘️ **Quận/Huyện**: Quận 1
- 🏙️ **Tỉnh/Thành phố**: TP. Hồ Chí Minh

---

### 💾 CẬP NHẬT TỒN KHO

#### Cách 1: Qua Giao Diện
1. Click **Inventory** → Inventory Dashboard
2. Click sản phẩm cần cập nhật
3. Click **✏️ Sửa**
4. Thay đổi số **Tồn kho**
5. Click **💾 Lưu**

#### Cách 2: Qua Đơn Hàng
Khi tạo đơn hàng, tồn kho tự động giảm

#### Kiểm Tra Tồn Kho
- **Xanh**: Còn hàng (tồn > 0)
- **Vàng**: Sắp hết (tồn < 20)
- **Đỏ**: Hết hàng (tồn = 0)

---

### 📱 ĐĂNG NHẬP & BẢO MẬT

#### Đăng Nhập
1. Nhập email
2. Nhập mật khẩu
3. Click **Đăng Nhập**

#### Đăng Xuất
- Click menu ☰
- Click **Đăng Xuất**

#### Tài Khoản Mặc Định (Demo)
```
Email: admin@example.com
Password: password123
```

---

### 🔄 ĐỒNG BỘ DỮ LIỆU

Ứng dụng **tự động đồng bộ** dữ liệu:
- Kéo xuống để làm mới (Pull to refresh)
- Dữ liệu cập nhật realtime từ server
- Offline mode: Dữ liệu từ cache cục bộ

---

### ⚡ MẸO & THỦ THUẬT

#### 1. Kéo Để Làm Mới
- Kéo từ trên xuống để refresh dữ liệu
- Hoặc click nút 🔄 Làm mới

#### 2. Xem Chi Tiết Nhanh
- Tap vào bất kỳ card nào để mở chi tiết
- Swipe để quay lại

#### 3. Tìm Kiếm Thông Minh
- Tìm kiếm **không phân biệt** hoa/thường
- Hỗ trợ tìm kiếm từng phần (VD: "hàng" → "hàng hóa")

#### 4. Thêm Dữ Liệu Nhanh
- Nhấn nút **➕** ở góc dưới phải
- Điền nhanh thông tin rồi lưu

---

## 🌐 WEB APP (REACT)

### Truy Cập
```
https://order-management-web-green.vercel.app
```

### Tính Năng
- ✅ Xem danh sách đơn hàng
- ✅ Hiển thị địa chỉ giao hàng
- ✅ Cập nhật trạng thái đơn
- ✅ Tìm kiếm theo địa chỉ
- ✅ Lọc theo trạng thái
- ✅ Responsive (làm việc trên điện thoại, tablet, PC)

### Hướng Dẫn
Tương tự như app mobile, giao diện web đơn giản hơn.

---

## 🐛 KHẮC PHỤC SỰ CỐ

### Vấn Đề: App không tải dữ liệu

**Giải pháp:**
1. Kiểm tra kết nối internet
2. Kéo để làm mới
3. Đóng app rồi mở lại
4. Xóa cache app

### Vấn Đề: Không thể đăng nhập

**Giải pháp:**
1. Kiểm tra email/mật khẩu
2. Kiểm tra kết nối internet
3. Đặt lại mật khẩu

### Vấn Đề: Lỗi khi thêm sản phẩm

**Giải pháp:**
1. Kiểm tra đủ thông tin (đánh dấu *)
2. SKU không được trùng
3. Giá phải là số

---

## 📞 LIÊN HỆ HỖ TRỢ

### Báo Cáo Lỗi
Gửi thông tin:
1. Mô tả vấn đề chi tiết
2. Screenshot lỗi
3. Thời gian xảy ra lỗi

### Yêu Cầu Tính Năng Mới
Liên hệ qua email hoặc form feedback

### FAQs

**Q: Dữ liệu được lưu ở đâu?**
A: Trên server Supabase (cloud), an toàn 100%

**Q: Có hỗ trợ offline không?**
A: Mobile có cache, nhưng tính năng đầy đủ cần internet

**Q: Mất bao lâu để đồng bộ dữ liệu?**
A: Tức thì (realtime), không có delay

**Q: Có giới hạn số đơn hàng không?**
A: Không, hỗ trợ vô hạn

---

## ✅ CHECKLIST SỬ DỤNG LẦN ĐẦU

- [ ] Cài đặt app / Truy cập web
- [ ] Đăng nhập tài khoản
- [ ] Xem Dashboard
- [ ] Xem danh sách Orders
- [ ] Xem danh sách Hàng hóa
- [ ] Thêm sản phẩm mới
- [ ] Cập nhật trạng thái đơn
- [ ] Tìm kiếm hàng hóa
- [ ] Làm quen giao diện

---

**Cảm ơn sử dụng ứng dụng! 🙏**

**Phiên bản:** 1.0.0
**Cập nhật:** Tháng 7, 2026
**Hỗ trợ:** 24/7
