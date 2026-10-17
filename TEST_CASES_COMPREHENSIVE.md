# BẢNG TEST CASES CHI TIẾT - E-Commerce Website Interface
**Dự án:** E-Commerce Website Interface  
**Phiên bản:** 1.0.0  
**Ngày tạo:** 16/10/2026  
**Dựa trên:** Test Plan v1.0 + SRS v1.0.0  

---

## CHỨC NĂNG F01: DUYỆT DANH MỤC VÀ TÌM KIẾM SẢN PHẨM (UC-01)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F01-001 | Hiển thị danh sách sản phẩm lần đầu | Trình duyệt mở website | URL: https://e-commerce-website-interface.vercel.app | 1. Mở website<br>2. Chờ tải<br>3. Quan sát | Danh sách sản phẩm tải thành công với ≥ 4 sản phẩm (ảnh, tên, giá gốc, giá khuyến mãi)<br>Layout responsive (2 cột mobile, 3-4 cột desktop)<br>Thời gian tải < 2 giây (NFR1.1) | Not Run |  |
| TC-F01-002 | Lọc sản phẩm theo danh mục | Trang chủ đã tải danh sách | Danh mục: Điện thoại | 1. Tìm menu danh mục<br>2. Nhấn "Điện thoại"<br>3. Quan sát kết quả | Danh sách cập nhật chỉ sản phẩm danh mục đó<br>URL thay đổi (category_id)<br>Thông tin sản phẩm đúng | Not Run |  |
| TC-F01-003 | Tìm kiếm sản phẩm theo từ khóa | Trang chủ đã tải | Từ khóa: "Iphone" | 1. Nhập "Iphone" vào ô tìm kiếm<br>2. Quan sát gợi ý<br>3. Nhấn Enter | Gợi ý tự động xuất hiện<br>Kết quả chỉ hiển thị sản phẩm chứa "Iphone"<br>Kết quả chính xác từ DB | Not Run |  |
| TC-F01-004 | Tìm kiếm không có kết quả | Trang chủ đã tải | Từ khóa: "xyzabc123" (không tồn tại) | 1. Nhập "xyzabc123" vào ô tìm kiếm<br>2. Nhấn Enter | Hiển thị thông báo "Không tìm thấy kết quả"<br>Danh sách trống | Not Run |  |
| TC-F01-005 | Danh mục không có sản phẩm | Có danh mục trống | Danh mục trống (nếu có) | 1. Lọc theo danh mục không có sản phẩm | Hiển thị "Không có sản phẩm"<br>Danh sách trống | Not Run |  |
| TC-F01-006 | Responsive layout mobile | Trang chủ đã tải | Chrome DevTools: iPhone 12 (390×844) | 1. Mở DevTools (F12)<br>2. Emulate iPhone 12<br>3. Reload trang | Sản phẩm hiển thị 2 cột<br>Không bị vỡ layout<br>Text dễ đọc | Not Run |  |
| TC-F01-007 | Responsive layout tablet | Trang chủ đã tải | Chrome DevTools: iPad (768×1024) | 1. Mở DevTools<br>2. Emulate iPad<br>3. Reload trang | Sản phẩm hiển thị 3 cột<br>Không bị vỡ layout | Not Run |  |
| TC-F01-008 | Responsive layout desktop | Trang chủ đã tải | Chrome DevTools: Desktop (1440×900) | 1. Mở DevTools<br>2. Emulate Desktop<br>3. Reload trang | Sản phẩm hiển thị 4 cột<br>Layout cân đối | Not Run |  |

---

## CHỨC NĂNG F02: XEM CHI TIẾT SẢN PHẨM VÀ CHỌN BIẾN THỂ (UC-02)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F02-001 | Hiển thị chi tiết sản phẩm | Trang chủ đã tải | Sản phẩm có sẵn trong DB | 1. Nhấn vào sản phẩm bất kỳ<br>2. Chờ trang tải<br>3. Quan sát | Hiển thị đầy đủ: tên, mô tả, giá, ảnh từ Supabase<br>Gallery ảnh hoạt động | Not Run |  |
| TC-F02-002 | Hiển thị danh sách biến thể | Trang chi tiết sản phẩm đã tải | Sản phẩm có nhiều biến thể | 1. Quan sát danh sách biến thể<br>2. Kiểm tra các màu/size | Hiển thị đầy đủ màu sắc và kích cỡ<br>Có thể chọn được | Not Run |  |
| TC-F02-003 | Cập nhật gallery khi chọn biến thể | Trang chi tiết sản phẩm đã tải | Sản phẩm có 2+ biến thể | 1. Chọn biến thể thứ 1<br>2. Quan sát ảnh<br>3. Chọn biến thể thứ 2<br>4. Quan sát ảnh thay đổi | Gallery ảnh cập nhật theo biến thể<br>Ảnh đúng với biến thể được chọn | Not Run |  |
| TC-F02-004 | Zoom ảnh sản phẩm | Trang chi tiết sản phẩm đã tải | Ảnh sản phẩm có sẵn | 1. Hover lên ảnh<br>2. Kiểm tra zoom | Ảnh phóng to (scale 110% hoặc hơn)<br>Hiệu ứng smooth | Not Run |  |
| TC-F02-005 | Điều hướng ảnh trong gallery | Trang chi tiết sản phẩm đó tải | Sản phẩm có 2+ ảnh | 1. Nhấn nút mũi tên Previous/Next<br>2. Quan sát ảnh thay đổi | Ảnh thay đổi theo thứ tự<br>Counter ảnh cập nhật (e.g. "1 / 5") | Not Run |  |
| TC-F02-006 | Nút "Thêm Vào Giỏ" khi chưa chọn biến thể | Trang chi tiết sản phẩm đã tải | Sản phẩm có biến thể bắt buộc | 1. Không chọn biến thể<br>2. Nhấn "Thêm Vào Giỏ" | Hiển thị cảnh báo: "Vui lòng chọn một variant"<br>Không thêm vào giỏ | Not Run |  |
| TC-F02-007 | Nút "Thêm Vào Giỏ" bị vô hiệu hóa khi hết hàng | Trang chi tiết sản phẩm đã tải | Biến thể hết hàng (stock = 0) | 1. Chọn biến thể hết hàng<br>2. Quan sát nút "Thêm Vào Giỏ" | Nút "Thêm Vào Giỏ" vô hiệu hóa (disabled)<br>Hiển thị "Hết hàng" | Not Run |  |
| TC-F02-008 | Nút "Yêu Thích" trên trang chi tiết | Trang chi tiết sản phẩm đã tải | Sản phẩm bất kỳ | 1. Nhấn biểu tượng trái tim<br>2. Quan sát | Biểu tượng tim chuyển sang trạng thái đã chọn (đỏ)<br>Sản phẩm lưu vào yêu thích | Not Run |  |
| TC-F02-009 | Meta Pixel event AddToCart | Trang chi tiết sản phẩm đã tải | Sản phẩm bất kỳ, Meta Pixel Helper được kích hoạt | 1. Mở Meta Pixel Helper extension<br>2. Nhấn "Thêm Vào Giỏ"<br>3. Kiểm tra event trong Helper | AddToCart event được gửi<br>Content_name, value, currency đúng | Not Run |  |

---

## CHỨC NĂNG F03: QUẢN LÝ GIỎ HÀNG (UC-03)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F03-001 | Hiển thị trang giỏ hàng | Có ≥ 1 sản phẩm trong giỏ | Sản phẩm đã thêm vào giỏ | 1. Nhấn biểu tượng giỏ hàng trên header<br>2. Chờ trang tải | Hiển thị danh sách sản phẩm với: ảnh, tên, biến thể, đơn giá, số lượng | Not Run |  |
| TC-F03-002 | Tăng số lượng sản phẩm | Trang giỏ hàng đã mở | Giỏ có sản phẩm | 1. Nhấn nút "+" tăng số lượng<br>2. Quan sát số lượng thay đổi | Số lượng tăng lên 1<br>Tổng tiền cập nhật theo thời gian thực | Not Run |  |
| TC-F03-003 | Giảm số lượng sản phẩm | Trang giỏ hàng đã mở | Giỏ có sản phẩm (qty > 1) | 1. Nhấn nút "-" giảm số lượng<br>2. Quan sát số lượng thay đổi | Số lượng giảm đi 1<br>Tổng tiền cập nhật | Not Run |  |
| TC-F03-004 | Giảm số lượng về 0 tự động xóa sản phẩm | Trang giỏ hàng đã mở | Giỏ có sản phẩm (qty = 1) | 1. Nhấn nút "-" để giảm từ 1 → 0<br>2. Quan sát | Sản phẩm tự động xóa khỏi giỏ<br>Giỏ cập nhật | Not Run |  |
| TC-F03-005 | Xóa từng sản phẩm khỏi giỏ | Trang giỏ hàng đã mở | Giỏ có ≥ 2 sản phẩm | 1. Nhấn nút xóa (icon thùng rác) trên sản phẩm<br>2. Quan sát | Sản phẩm bị xóa<br>Tổng tiền cập nhật<br>Giỏ vẫn có sản phẩm khác | Not Run |  |
| TC-F03-006 | Hiển thị "Giỏ hàng trống" | Giỏ hàng không có sản phẩm | Xóa tất cả sản phẩm hoặc giỏ mới | 1. Nếu giỏ trống, mở giỏ hàng | Hiển thị thông báo "Giỏ hàng của bạn đang trống"<br>Không có danh sách sản phẩm | Not Run |  |
| TC-F03-007 | Badge số lượng trên biểu tượng giỏ | Giỏ có sản phẩm | Có ≥ 1 sản phẩm trong giỏ | 1. Quan sát biểu tượng giỏ hàng trên header<br>2. Kiểm tra badge | Badge hiển thị số lượng sản phẩm trong giỏ<br>Cập nhật khi thêm/xóa | Not Run |  |
| TC-F03-008 | Giỏ hàng lưu sau khi reload trang | Giỏ có sản phẩm | Có ≥ 1 sản phẩm trong giỏ | 1. Thêm sản phẩm vào giỏ<br>2. Nhấn F5 reload trang<br>3. Mở giỏ hàng | Giỏ hàng vẫn còn sản phẩm (localStorage hoặc Supabase)<br>Dữ liệu không mất | Not Run |  |
| TC-F03-009 | Đồng bộ giỏ hàng với Supabase khi đăng nhập | Giỏ hàng guest có sản phẩm | User đăng nhập sau khi có giỏ | 1. Thêm sản phẩm vào giỏ (guest)<br>2. Đăng nhập Google<br>3. Kiểm tra giỏ | Giỏ hàng được đồng bộ vào user_carts trong Supabase<br>Sản phẩm vẫn còn | Not Run |  |

---

## CHỨC NĂNG F04: THÊM SẢN PHẨM YÊU THÍCH (UC-04)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F04-001 | Thêm sản phẩm vào yêu thích | Trang danh sách sản phẩm đã tải | Sản phẩm bất kỳ | 1. Nhấn biểu tượng trái tim trên sản phẩm<br>2. Quan sát | Biểu tượng tim chuyển sang trạng thái đã chọn (đỏ)<br>Sản phẩm lưu vào yêu thích (localStorage) | Not Run |  |
| TC-F04-002 | Bỏ yêu thích sản phẩm | Sản phẩm đã được yêu thích | Sản phẩm có tim đỏ | 1. Nhấn lại biểu tượng tim (đỏ)<br>2. Quan sát | Biểu tượng tim quay về trạng thái bình thường (xám)<br>Sản phẩm bị xóa khỏi yêu thích | Not Run |  |
| TC-F04-003 | Xem trang Favorites | Có ≥ 1 sản phẩm yêu thích | Sản phẩm đã yêu thích | 1. Nhấn biểu tượng yêu thích trên header<br>2. Chờ trang Favorites tải | Hiển thị danh sách sản phẩm yêu thích<br>Thông tin sản phẩm đầy đủ | Not Run |  |
| TC-F04-004 | Thêm sản phẩm từ trang yêu thích vào giỏ | Trang Favorites đã mở | Sản phẩm bất kỳ trong Favorites | 1. Nhấn "Thêm Vào Giỏ" trên sản phẩm<br>2. Quan sát | Sản phẩm được thêm vào giỏ hàng<br>Thông báo thành công hiển thị | Not Run |  |
| TC-F04-005 | Dữ liệu yêu thích lưu sau reload | Có sản phẩm yêu thích | Sản phẩm đã yêu thích | 1. Thêm sản phẩm vào yêu thích<br>2. Reload trang (F5)<br>3. Kiểm tra | Sản phẩm vẫn hiển thị trong yêu thích<br>Dữ liệu không mất (localStorage) | Not Run |  |

---

## CHỨC NĂNG F05: CHECKOUT VÀ NHẬP ĐỊA CHỈ GIAO HÀNG (UC-05)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F05-001 | Form checkout với validation bắt buộc | Giỏ hàng có sản phẩm | Thông tin checkout | 1. Nhấn "Tiến hành thanh toán"<br>2. Quan sát form | Hiển thị form checkout với các trường: Họ tên, Email, Số điện thoại (bắt buộc)<br>Nút "Tiếp tục" có sẵn | Not Run |  |
| TC-F05-002 | Validation bỏ trống Họ tên | Form checkout đã mở | Bỏ trống Họ tên | 1. Để trống trường Họ tên<br>2. Nhấn "Tiếp tục"<br>3. Quan sát | Hiển thị lỗi: "Vui lòng nhập họ và tên"<br>Form không submit | Not Run |  |
| TC-F05-003 | Validation bỏ trống Số điện thoại | Form checkout đã mở | Bỏ trống Số điện thoại | 1. Để trống trường Số điện thoại<br>2. Nhấn "Tiếp tục"<br>3. Quan sát | Hiển thị lỗi: "Vui lòng nhập số điện thoại"<br>Form không submit | Not Run |  |
| TC-F05-004 | Validation bỏ trống Email | Form checkout đã mở | Bỏ trống Email | 1. Để trống trường Email<br>2. Nhấn "Tiếp tục"<br>3. Quan sát | Hiển thị lỗi: "Vui lòng nhập email"<br>Form không submit | Not Run |  |
| TC-F05-005 | Tải danh sách Tỉnh/Thành phố | Form checkout đã mở | API /api/ghn-provinces | 1. Quan sát dropdown Tỉnh/Thành phố<br>2. Mở dropdown | Tải đúng 63 tỉnh từ Supabase<br>Danh sách hiển thị đủ | Not Run |  |
| TC-F05-006 | Chọn Tỉnh và tải Quận/Huyện | Form checkout đã mở | Tỉnh: TP. Hồ Chí Minh | 1. Chọn "TP. Hồ Chí Minh"<br>2. Chờ dropdown Quận/Huyện tải | API /api/ghn-districts được gọi<br>Danh sách Quận/Huyện tải đúng theo tỉnh | Not Run |  |
| TC-F05-007 | Chọn Quận/Huyện và tải Xã/Phường | Form checkout đã mở | Quận/Huyện: Quận 1 | 1. Chọn "Quận 1"<br>2. Chờ dropdown Xã/Phường tải | API /api/ghn-wards được gọi<br>Danh sách Xã/Phường tải đúng theo quận | Not Run |  |
| TC-F05-008 | Nhập địa chỉ chi tiết | Form checkout đã mở | Địa chỉ: "123 Đường Nguyễn Huệ" | 1. Nhập địa chỉ chi tiết<br>2. Quan sát | Ô địa chỉ chi tiết chứa đủ ký tự<br>Dữ liệu lưu đúng | Not Run |  |
| TC-F05-009 | GHN API được gọi khi chọn đầy đủ địa chỉ | Form checkout đã mở | Tỉnh, Huyện, Xã đã chọn | 1. Chọn đầy đủ Tỉnh/Huyện/Xã<br>2. Mở Chrome DevTools → Network<br>3. Quan sát request | Request POST /api/shipping-fee được gọi<br>Status 200 OK<br>Phí vận chuyển hiển thị | Not Run |  |

---

## CHỨC NĂNG F06: TÍNH PHÍ VẬN CHUYỂN (UC-06)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F06-001 | Hiển thị phí vận chuyển sau chọn địa chỉ | Form checkout, địa chỉ đã chọn | Đỉa chỉ hợp lệ | 1. Chọn đầy đủ Tỉnh/Huyện/Xã<br>2. Chờ phí tính toán<br>3. Quan sát | Phí vận chuyển hiển thị > 0<br>Đơn vị: VNĐ | Not Run |  |
| TC-F06-002 | Cập nhật tổng tiền (tiền hàng + phí ship) | Form checkout | Sản phẩm + phí ship | 1. Quan sát tổng tiền trước ship<br>2. Chọn địa chỉ<br>3. Quan sát tổng tiền sau | Tổng tiền = Tiền hàng + Phí ship<br>Công thức tính đúng | Not Run |  |
| TC-F06-003 | Logic tính trọng lượng (500g/sản phẩm, min 1kg) | Checkout, 2 sản phẩm trong giỏ | 2 sản phẩm không khai báo weight | 1. Mở Chrome DevTools → Console<br>2. Kiểm tra log | Trọng lượng = 2 × 500g = 1000g = 1kg (đúng giá trị min)<br>Log hiển thị: "Tổng cộng - Khối lượng: 1000g" | Not Run | FR6.2 |
| TC-F06-004 | Kích thước mặc định (20×20×20 cm/sản phẩm) | Checkout, sản phẩm không khai báo kích thước | Sản phẩm không có length/width/height | 1. Mở Console<br>2. Kiểm tra log | Kích thước = 20×20×20 cm<br>Log hiển thị: "Dimensions: L:20cm, W:20cm, H:20cm" | Not Run | FR6.3 |
| TC-F06-005 | Hiển thị lỗi khi GHN API không phản hồi | Checkout | GHN API offline (hoặc timeout) | 1. Mock GHN API offline<br>2. Chọn địa chỉ<br>3. Quan sát | Hiển thị thông báo lỗi: "Không thể tính phí vận chuyển"<br>Hệ thống sử dụng phí ước tính (fallback) | Not Run | FR6.5 |
| TC-F06-006 | Fallback phí ước tính khi GHN lỗi | Checkout | GHN API lỗi | 1. GHN offline<br>2. Chọn địa chỉ<br>3. Quan sát phí | Phí fallback = 20.000đ + 5.000đ/kg thêm (min 20.000đ)<br>Phí được sử dụng để tính tổng | Not Run | FR6.5 |
| TC-F06-007 | Test API Vercel Function POST /api/shipping-fee (dữ liệu hợp lệ) | Postman | `{ "to_district_id": 1454, "to_ward_code": "21616", "weight_gram": 1000, "length_cm": 20, "width_cm": 20, "height_cm": 20 }` | 1. Mở Postman<br>2. POST /api/shipping-fee<br>3. Gửi payload hợp lệ<br>4. Quan sát response | Status: 200 OK<br>Response: `{ "success": true, "data": { "total": 46000, ... } }`<br>Phí hợp lệ (> 0) | Not Run |  |
| TC-F06-008 | Test API với dữ liệu không hợp lệ (weight < 200g) | Postman | `{ "weight_gram": 100, ... }` (weight < 200g) | 1. Mở Postman<br>2. POST /api/shipping-fee<br>3. Gửi weight < 200g | Status: 400 Bad Request<br>Response: `{ "success": false, "error": "Invalid weight: 100g" }` | Not Run |  |

---

## CHỨC NĂNG F07: CHỌN PHƯƠNG THỨC THANH TOÁN (UC-07)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F07-001 | Hiển thị modal thanh toán | Form checkout đã hoàn thành | Điều kiện tiên quyết | 1. Nhấn "Tiếp tục"<br>2. Modal thanh toán xuất hiện | Modal hiển thị 2 phương thức: COD và Chuyển khoản<br>Radio button có sẵn | Not Run |  |
| TC-F07-002 | Chọn COD | Modal thanh toán đã mở | Chọn COD | 1. Nhấn radio button COD<br>2. Quan sát | Phương thức COD được chọn<br>Hiển thị thông tin xác nhận (không yêu cầu nhập thêm) | Not Run |  |
| TC-F07-003 | Chọn Chuyển khoản hiển thị QR code | Modal thanh toán đã mở | Chọn Chuyển khoản | 1. Nhấn radio button Chuyển khoản<br>2. Quan sát | Hiển thị:<br>- Tên ngân hàng: MB Bank<br>- Số tài khoản: 0865816910<br>- Nội dung chuyển: DH{random}<br>- QR code từ VietQR | Not Run |  |
| TC-F07-004 | Sao chép số tài khoản | Modal thanh toán, phương thức Chuyển khoản | Số tài khoản: 0865816910 | 1. Nhấn nút "Sao chép" trên số tài khoản<br>2. Kiểm tra clipboard | Số tài khoản được copy vào clipboard<br>Icon "Đã sao chép" hiển thị tạm thời | Not Run |  |
| TC-F07-005 | Sao chép nội dung chuyển khoản | Modal thanh toán, phương thức Chuyển khoản | Nội dung chuyển: DH{random} | 1. Nhấn nút "Sao chép" trên nội dung chuyển<br>2. Kiểm tra clipboard | Nội dung được copy<br>Icon "Đã sao chép" hiển thị | Not Run |  |
| TC-F07-006 | QR code tạo đúng từ VietQR | Modal thanh toán, phương thức Chuyển khoản | Số tiền, nội dung chuyển | 1. Mở DevTools → Network<br>2. Kiểm tra request đến VietQR | Request được gửi đến img.vietqr.io<br>QR code hiển thị<br>Thông tin: số tiền, nội dung đúng | Not Run |  |
| TC-F07-007 | Nút "Xác Nhận Đặt Đơn Hàng" kích hoạt luồng tạo đơn | Modal thanh toán đã chọn phương thức | Phương thức thanh toán được chọn | 1. Nhấn "Xác Nhận Đặt Đơn Hàng"<br>2. Quan sát | Luồng UC-08 được kích hoạt (tạo đơn hàng) | Not Run |  |

---

## CHỨC NĂNG F08: XÁC NHẬN VÀ TẠO ĐƠN HÀNG (UC-08)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F08-001 | Validation toàn bộ dữ liệu trước tạo đơn | Checkout form + payment modal | Thông tin checkout đầy đủ | 1. Hoàn thành checkout form<br>2. Chọn thanh toán<br>3. Nhấn "Xác Nhận"<br>4. Quan sát | Validation kiểm tra đầy đủ: tên, SĐT, email, địa chỉ<br>Nếu thiếu → hiển thị lỗi<br>Không gọi API | Not Run |  |
| TC-F08-002 | Tạo bản ghi order trong Supabase | Checkout form, payment modal | Thông tin checkout đầy đủ | 1. Hoàn thành checkout<br>2. Mở Supabase Dashboard → orders table<br>3. Kiểm tra bản ghi mới | Bản ghi order được tạo<br>Order ID sinh duy nhất (8 ký tự)<br>Ngày tạo = hiện tại | Not Run |  |
| TC-F08-003 | Lưu đầy đủ fields trong orders table | Checkout form | Thông tin checkout | 1. Kiểm tra bản ghi order mới trong Supabase | Lưu đầy đủ:<br>- customer_name<br>- customer_email<br>- customer_phone<br>- shipping_address<br>- payment_method<br>- total<br>- shipping_fee<br>- fbp (Facebook Pixel ID)<br>- fbc (Facebook Click ID) | Not Run |  |
| TC-F08-004 | Tạo bản ghi order_items | Checkout form, 2 sản phẩm trong giỏ | 2 sản phẩm | 1. Tạo đơn hàng<br>2. Kiểm tra order_items table | Số bản ghi = số sản phẩm trong giỏ (2)<br>Mỗi bản ghi lưu: product_id, variant_id, quantity, price, color, size, sku | Not Run |  |
| TC-F08-005 | Lưu weight_kg, length_cm, width_cm, height_cm | Checkout form | Sản phẩm có weight, dimensions | 1. Tạo đơn hàng<br>2. Kiểm tra order_items → columns weight_kg, length_cm, ... | Lưu đúng giá trị weight_kg, length_cm, width_cm, height_cm từ product_variants | Not Run | FR8.2 |
| TC-F08-006 | Order ID sinh duy nhất | Tạo 2 đơn hàng liên tiếp | Checkout info cho 2 đơn | 1. Tạo đơn hàng 1 → Order ID: DH001<br>2. Tạo đơn hàng 2 → Order ID: DH002<br>3. So sánh | Order ID không trùng<br>Mỗi đơn có ID duy nhất | Not Run |  |
| TC-F08-007 | Giỏ hàng xóa hoàn toàn sau đặt hàng | Checkout, giỏ hàng có sản phẩm | ≥ 1 sản phẩm trong giỏ | 1. Tạo đơn hàng thành công<br>2. Mở giỏ hàng<br>3. Quan sát | Giỏ hàng trống<br>Thông báo "Giỏ hàng của bạn đang trống" | Not Run |  |
| TC-F08-008 | Hiển thị trang xác nhận đơn hàng | Tạo đơn thành công | Đơn hàng vừa tạo | 1. Sau khi "Xác Nhận"<br>2. Chờ trang tải | Hiển thị trang xác nhận<br>Order ID hiển thị rõ ràng<br>Thông báo "Đơn hàng thành công" | Not Run |  |
| TC-F08-009 | Meta Pixel Lead event được gửi | Checkout, Meta Pixel Helper được kích hoạt | Đơn hàng, Meta Pixel ID hợp lệ | 1. Mở Meta Pixel Helper extension<br>2. Tạo đơn hàng<br>3. Kiểm tra event trong Helper | Lead event được gửi<br>Content_value, currency, payment_method, fbp, fbc đúng | Not Run |  |
| TC-F08-010 | Hiển thị lỗi khi API lỗi | Checkout form | GHN API hoặc Supabase lỗi | 1. Mock API lỗi 500<br>2. Tạo đơn hàng<br>3. Quan sát | Hiển thị thông báo lỗi: "Không thể tạo đơn hàng"<br>Có nút "Thử lại" | Not Run |  |

---

## CHỨC NĂNG F09: XEM VÀ THEO DÕI LỊCH SỬ ĐƠN HÀNG (UC-09)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F09-001 | Trang theo dõi đơn chỉ cho user đã đăng nhập | User chưa đăng nhập | Chưa login | 1. Truy cập /orders (hoặc nhấn "Đơn Hàng")<br>2. Quan sát | Redirect đến trang login<br>Hiển thị "Vui lòng đăng nhập" | Not Run |  |
| TC-F09-002 | Hiển thị danh sách đơn hàng sắp xếp mới nhất | User đã đăng nhập, có ≥ 2 đơn | Danh sách đơn hàng | 1. Nhấn "Đơn Hàng" trên header<br>2. Chờ trang tải<br>3. Quan sát thứ tự | Danh sách sắp xếp theo ngày tạo mới nhất trước<br>Đơn cũ nhất ở cuối | Not Run |  |
| TC-F09-003 | Hiển thị thông tin đơn hàng (ID, ngày, tổng tiền, trạng thái) | Trang theo dõi đơn hàng | ≥ 1 đơn hàng | 1. Quan sát danh sách đơn<br>2. Kiểm tra thông tin | Mỗi đơn hiển thị:<br>- Order ID (8 ký tự)<br>- Ngày đặt<br>- Tổng tiền (tiền hàng + phí ship)<br>- Trạng thái (badge màu: pending/processing/shipped/completed) | Not Run |  |
| TC-F09-004 | Lọc đơn theo trạng thái | Trang theo dõi đơn hàng | ≥ 3 đơn với trạng thái khác nhau | 1. Lọc theo "Pending"<br>2. Kiểm tra kết quả<br>3. Lọc theo "Shipped"<br>4. Kiểm tra | Danh sách cập nhật chỉ hiển thị đơn với trạng thái lọc<br>Số lượng đơn giảm | Not Run |  |
| TC-F09-005 | Xem chi tiết đơn hàng (sản phẩm, địa chỉ, phí, thanh toán) | Trang theo dõi đơn hàng | ≥ 1 đơn hàng | 1. Nhấn vào đơn hàng bất kỳ<br>2. Chờ chi tiết tải | Hiển thị:<br>- Danh sách sản phẩm (name, qty, price)<br>- Địa chỉ giao hàng<br>- Phí vận chuyển<br>- Phương thức thanh toán (COD / Chuyển khoản)<br>- Tổng tiền | Not Run |  |

---

## CHỨC NĂNG F10: ĐĂNG NHẬP / ĐĂNG XUẤT (UC-10)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F10-001 | Nút "Đăng Nhập" mở LoginModal | Trang chủ đã tải, user chưa đăng nhập | Chưa login | 1. Quan sát header<br>2. Nhấn nút "Đăng Nhập" | Modal đăng nhập xuất hiện<br>Hiển thị tùy chọn Google | Not Run |  |
| TC-F10-002 | OAuth Google flow qua Supabase Auth | LoginModal đã mở | Google account hợp lệ | 1. Nhấn "Đăng nhập với Google"<br>2. Chọn tài khoản Google<br>3. Xác nhận | Cửa sổ OAuth xuất hiện<br>Xác thực thành công<br>Redirect về trang chủ | Not Run |  |
| TC-F10-003 | Phiên làm việc được lưu sau đăng nhập | Đăng nhập thành công | User đã login | 1. Đăng nhập thành công<br>2. Reload trang (F5)<br>3. Quan sát | Session vẫn còn<br>User vẫn đăng nhập (không cần login lại)<br>Dữ liệu session lưu trong Supabase | Not Run |  |
| TC-F10-004 | Header hiển thị tên và email user | Đăng nhập thành công | User đã login | 1. Quan sát header sau đăng nhập | Hiển thị tên user và email<br>Biểu tượng profile / menu tài khoản có sẵn | Not Run |  |
| TC-F10-005 | Chức năng đăng xuất | Đã đăng nhập | User login | 1. Mở menu tài khoản (header)<br>2. Nhấn "Đăng Xuất"<br>3. Quan sát | Xóa session Supabase<br>Xóa auth tokens (localStorage/sessionStorage)<br>Giỏ hàng và yêu thích GIỮ LẠI (không xóa)<br>Redirect trang chủ, header hiển thị "Đăng Nhập" | Not Run | FR10.4 |
| TC-F10-006 | Truy cập "Đơn Hàng" khi chưa đăng nhập redirect login | Chưa đăng nhập | Không login | 1. Nhấn "Đơn Hàng" trên header (hoặc truy cập /orders)<br>2. Quan sát | Redirect đến trang login<br>Hiển thị "Vui lòng đăng nhập"<br>Sau login, redirect đến trang đơn hàng | Not Run | FR10.5 |

---

## CHỨC NĂNG F11: THEO DÕI HÀNH VI NGƯỜI DÙNG - META PIXEL (UC-11)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F11-001 | AddToCart event được gửi | Trang chi tiết sản phẩm | Meta Pixel Helper cài sẵn | 1. Mở Meta Pixel Helper extension<br>2. Thêm sản phẩm vào giỏ<br>3. Kiểm tra event | AddToCart event được ghi nhận<br>Content_name, value, currency đúng | Not Run |  |
| TC-F11-002 | InitiateCheckout event được gửi | Giỏ hàng có sản phẩm | Meta Pixel Helper cài sẵn | 1. Mở Meta Pixel Helper<br>2. Nhấn "Tiến hành thanh toán"<br>3. Kiểm tra event | InitiateCheckout event được ghi nhận<br>Value, currency đúng | Not Run |  |
| TC-F11-003 | Lead event được gửi khi xác nhận đơn | Checkout form, thanh toán | Meta Pixel Helper cài sẵn | 1. Mở Meta Pixel Helper<br>2. Xác nhận đơn hàng<br>3. Kiểm tra event | Lead event được ghi nhận<br>Content_value, currency, payment_method, fbp, fbc đúng | Not Run |  |
| TC-F11-004 | fbp/fbc cookies được lấy đúng | Truy cập website | Trình duyệt cho phép cookies | 1. Kiểm tra cookies (DevTools → Application → Cookies)<br>2. Tìm _fbp, _fbc | _fbp và _fbc cookies có giá trị<br>Được truyền vào event Lead | Not Run |  |

---

## CHỨC NĂNG F12: QUẢN LÝ ĐƠN HÀNG (ADMIN) (UC-11)

| TC ID | Tên Test Case | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Các Bước Thực Hiện | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|-------------------|-----------------|------------------|-----------------|--------|---------|
| TC-F12-001 | Truy cập trang Admin Orders | Có quyền admin | URL: /admin/orders | 1. Truyền cập /admin/orders<br>2. Chờ trang tải | Trang Admin Orders tải thành công<br>Hiển thị danh sách tất cả đơn hàng | Not Run |  |
| TC-F12-002 | Hiển thị thông tin đơn hàng (ID, khách, tổng tiền, trạng thái, ngày) | Trang Admin Orders | ≥ 1 đơn hàng | 1. Quan sát bảng đơn hàng<br>2. Kiểm tra cột | Mỗi hàng hiển thị:<br>- Order ID (8 ký tự)<br>- Email/Tên khách<br>- Tổng tiền<br>- Trạng thái (badge)<br>- Ngày tạo | Not Run |  |
| TC-F12-003 | Lọc đơn hàng theo trạng thái | Trang Admin Orders | ≥ 3 đơn với trạng thái khác nhau | 1. Chọn filter trạng thái: "Pending"<br>2. Kiểm tra danh sách<br>3. Chọn "Shipped" | Danh sách cập nhật<br>Chỉ hiển thị đơn với trạng thái đã chọn | Not Run |  |
| TC-F12-004 | Expand/Collapse chi tiết đơn hàng | Trang Admin Orders | ≥ 1 đơn hàng | 1. Nhấn vào hàng đơn hàng (hoặc nút expand)<br>2. Quan sát chi tiết<br>3. Nhấn lại collapse | Expand: hiển thị thông tin khách hàng, sản phẩm, thanh toán, địa chỉ<br>Collapse: ẩn đi | Not Run |  |
| TC-F12-005 | Cập nhật trạng thái đơn hàng từ Admin | Trang Admin Orders, đơn hàng Pending | Đơn hàng status: Pending | 1. Mở chi tiết đơn<br>2. Chọn trạng thái mới: "Processing"<br>3. Lưu<br>4. Kiểm tra Supabase | Trạng thái cập nhật thành "Processing"<br>Supabase: orders table → status = "processing" | Not Run |  |

---

## CHỨC NĂNG API ENDPOINTS (API Testing)

| TC ID | Tên Test Case | Endpoint | Method | Điều Kiện Tiên Quyết | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Status | Ghi Chú |
|-------|---------------|----------|--------|-------------------|-----------------|-----------------|--------|---------|
| TC-API-001 | GET /api/health | /api/health | GET | Server chạy | (không có) | Status: 200 OK<br>Response: `{ "status": "ok" }` | Not Run |  |
| TC-API-002 | GET /api/ghn-provinces | /api/ghn-provinces | GET | Server chạy | (không có) | Status: 200 OK<br>Response: `{ "success": true, "data": [{ "province_id": 1, "province_name": "Hà Nội" }, ...] }`<br>Số lượng: 63 tỉnh | Not Run |  |
| TC-API-003 | GET /api/ghn-districts?province_id=1 | /api/ghn-districts | GET | Server chạy, province_id=1 | province_id=1 | Status: 200 OK<br>Response: danh sách quận/huyện theo tỉnh<br>Dữ liệu đúng | Not Run |  |
| TC-API-004 | GET /api/ghn-wards?district_id=1 | /api/ghn-wards | GET | Server chạy | district_id=1 | Status: 200 OK<br>Response: danh sách xã/phường theo quận<br>Dữ liệu đúng | Not Run |  |
| TC-API-005 | POST /api/shipping-fee (dữ liệu hợp lệ) | /api/shipping-fee | POST | Server chạy, dữ liệu hợp lệ | `{ "to_district_id": 1454, "to_ward_code": "21616", "weight_gram": 1000, "length_cm": 20, "width_cm": 20, "height_cm": 20 }` | Status: 200 OK<br>Response: `{ "success": true, "data": { "total": 46000, "service_fee": 40000, ... } }`<br>Phí > 0 | Not Run |  |
| TC-API-006 | POST /api/shipping-fee (weight không hợp lệ) | /api/shipping-fee | POST | Server chạy | `{ "to_district_id": 1454, "to_ward_code": "21616", "weight_gram": 100 }` (weight < 200g) | Status: 400 Bad Request<br>Response: `{ "success": false, "error": "Invalid weight: 100g" }` | Not Run |  |
| TC-API-007 | POST /api/orders (tạo đơn hàng) | /api/orders | POST | Server chạy, user login | Payload đầy đủ (customer_name, email, phone, items, ...) | Status: 200 OK<br>Response: `{ "success": true, "order_id": "DH001", ... }`<br>Bản ghi tạo trong Supabase | Not Run |  |
| TC-API-008 | POST /api/orders (thiếu trường bắt buộc) | /api/orders | POST | Server chạy | Payload thiếu customer_name | Status: 400 Bad Request<br>Response: `{ "success": false, "error": "Missing required field: customer_name" }` | Not Run |  |

---

## TÓMERASE

| Loại Kiểm Thử | Số Test Cases | Trạng Thái |
|-------------|--------------|----------|
| F01 | 8 | Not Run |
| F02 | 9 | Not Run |
| F03 | 9 | Not Run |
| F04 | 5 | Not Run |
| F05 | 9 | Not Run |
| F06 | 8 | Not Run |
| F07 | 7 | Not Run |
| F08 | 10 | Not Run |
| F09 | 5 | Not Run |
| F10 | 6 | Not Run |
| F11 | 4 | Not Run |
| F12 | 5 | Not Run |
| API | 8 | Not Run |
| **TỔNG CỘNG** | **104** | **Not Run** |

---

**Tài liệu được tạo:** 16/10/2026  
**Phiên bản:** 1.0  
**Dựa trên:** Test Plan v1.0 + SRS v1.0.0 + Source Code hiện tại
