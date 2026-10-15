# 2️⃣ SRS - ĐẶC TẢ YÊU CẦU PHẦN MỀM
## E-Commerce Website Interface - Detailed Requirements

**Ngày Viết:** 15 Tháng 10, 2026  
**Phiên Bản:** 1.0  
**Trạng Thái:** ✅ Complete & Production Ready  
**Người Viết:** QA & Dev Team

---

## 📑 MỤC LỤC

1. [Tổng quan hệ thống](#tổng-quan-hệ-thống)
2. [Mục đích & phạm vi](#mục-đích--phạm-vi)
3. [Kiến trúc công nghệ](#kiến-trúc-công-nghệ)
4. [Các chức năng yêu cầu (FR)](#các-chức-năng-yêu-cầu)
5. [Yêu cầu phi chức năng (NFR)](#yêu-cầu-phi-chức-năng)
6. [Yêu cầu giao diện (UI)](#yêu-cầu-giao-diện)
7. [Yêu cầu database](#yêu-cầu-database)
8. [Yêu cầu API](#yêu-cầu-api)
9. [Yêu cầu security](#yêu-cầu-security)
10. [Acceptance Criteria](#acceptance-criteria)

---

## 🎯 Tổng Quan Hệ Thống

### Hệ Thống Là Gì?

**E-Commerce Website Interface** là nền tảng thương mại điện tử (B2C) cho phép:
- Khách hàng duyệt, tìm kiếm, mua sắm sản phẩm online
- Quản lý giỏ hàng
- Thanh toán an toàn (COD, Bank Transfer)
- Tính phí vận chuyển thực tế theo GHN
- Theo dõi đơn hàng
- Meta Pixel tracking cho marketing optimization

### Người Dùng Mục Tiêu

| Loại Người Dùng | Mục Đích | Chức Năng Cần |
|-----------------|---------|--------------|
| **Khách hàng** | Mua sắm online | Xem sản phẩm, thêm giỏ, checkout, track order |
| **Chủ shop** | Quản lý bán hàng | Quản lý sản phẩm, xem đơn hàng, analytics |
| **Admin** | Maintain hệ thống | Manage data, monitor, troubleshoot |
| **Marketing** | Optimize campaigns | Meta Pixel data, fbp+fbc tracking |

### Phạm Vi Địa Lý & Kinh Doanh

- **Phạm vi:** Toàn quốc Việt Nam (63 tỉnh thành)
- **Shipping:** GHN Express
- **Thanh toán:** COD, Bank Transfer
- **Marketing:** Meta Pixel (Facebook Ads)
- **Số sản phẩm:** 10+ (expandable)
- **Số người dùng dự kiến:** 1,000+ concurrent

---

## 🔄 Mục Đích & Phạm Vi

### Mục Đích Chính

1. **Kinh Doanh:** Tạo nền tảng bán hàng online để tăng doanh số
2. **Khách Hàng:** Cung cấp trải nghiệm mua sắm dễ dàng, nhanh chóng
3. **Marketing:** Thu thập dữ liệu khách hàng để optimize quảng cáo
4. **Operations:** Quản lý đơn hàng, shipping, thanh toán tự động

### Phạm Vi In (Có trong phiên bản 1.0)

✅ **Functional Scope:**
- [ ] Danh sách sản phẩm
- [ ] Chi tiết sản phẩm + variants
- [ ] Giỏ hàng
- [ ] Checkout
- [ ] GHN shipping integration
- [ ] Meta Pixel tracking
- [ ] Order management
- [ ] Order tracking
- [ ] Authentication (OAuth)
- [ ] Admin panel (basic)

✅ **Technical Scope:**
- [ ] React SPA frontend
- [ ] Vercel serverless backend
- [ ] Supabase PostgreSQL database
- [ ] GHN Shipping API
- [ ] Meta Pixel SDK
- [ ] Production deployment
- [ ] CI/CD pipeline

### Phạm Vi Out (Ngoài phiên bản 1.0)

❌ **Scope Out:**
- [ ] Payment gateway (Stripe, Momo) - Only COD + Bank Transfer for now
- [ ] Inventory management - No stock tracking
- [ ] Email marketing automation
- [ ] SMS notifications
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support
- [ ] Marketplace features (multiple sellers)

---

## 🏗️ Kiến Trúc Công Nghệ

### Technology Stack (Detailed)

```
┌─────────────────────────────────────────────────────────────┐
│                    E-Commerce Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐                                         │
│  │  Frontend (SPA) │  React 18 + TypeScript                 │
│  │  - Vite build   │  - Tailwind CSS                        │
│  │  - 133KB gzip   │  - Radix UI components                 │
│  └─────────────────┘                                         │
│           │                                                   │
│           │ (HTTP/HTTPS)                                     │
│           ▼                                                   │
│  ┌─────────────────┐        ┌──────────────┐                │
│  │ Vercel Edge    │        │  Supabase    │                │
│  │ Functions      │◄───────┤  PostgreSQL  │                │
│  │ - Orders API   │        │  - RLS       │                │
│  │ - GHN proxy    │        │  - Auth      │                │
│  │ - Webhooks     │        │  - Real-time │                │
│  └─────────────────┘        └──────────────┘                │
│           │                                                   │
│      ┌────┴──────────────┬──────────────┐                   │
│      ▼                   ▼              ▼                    │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐           │
│  │ GHN        │  │ Meta       │  │ OAuth        │           │
│  │ Shipping   │  │ Pixel      │  │ (Google)     │           │
│  │ API        │  │ Tracking   │  │ / Supabase   │           │
│  └────────────┘  └────────────┘  └──────────────┘           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Database Architecture

```sql
-- Core tables
├── products
│   ├── id (UUID, PK)
│   ├── name (VARCHAR)
│   ├── price (NUMERIC)
│   ├── sale_price (NUMERIC, nullable)
│   ├── description (TEXT)
│   ├── category_id (FK → categories)
│   ├── image_url (VARCHAR)
│   ├── sku (VARCHAR, unique)
│   ├── active (BOOLEAN)
│   └── timestamps
│
├── product_variants
│   ├── id (UUID, PK)
│   ├── product_id (FK → products)
│   ├── color (VARCHAR)
│   ├── size (VARCHAR)
│   ├── sku (VARCHAR)
│   ├── price (NUMERIC, nullable)
│   └── timestamps
│
├── product_images
│   ├── id (UUID, PK)
│   ├── product_id (FK → products)
│   ├── image_url (VARCHAR)
│   ├── alt_text (VARCHAR)
│   └── display_order (INT)
│
├── variant_images
│   ├── id (UUID, PK)
│   ├── variant_id (FK → product_variants)
│   ├── image_url (VARCHAR)
│   └── display_order (INT)
│
├── orders
│   ├── id (UUID, PK)
│   ├── user_id (FK → auth.users, nullable)
│   ├── total (NUMERIC)
│   ├── shipping_fee (NUMERIC)
│   ├── payment_method (VARCHAR: 'cod', 'bank_transfer')
│   ├── payment_status (VARCHAR)
│   ├── order_status (VARCHAR)
│   ├── shipping_address (TEXT)
│   ├── customer_name (VARCHAR)
│   ├── customer_email (VARCHAR)
│   ├── customer_phone (VARCHAR)
│   ├── fbp (VARCHAR)  ⭐ Meta Pixel ID
│   ├── fbc (VARCHAR)  ⭐ Facebook Click ID
│   ├── note (TEXT)
│   └── timestamps
│
├── order_items
│   ├── id (UUID, PK)
│   ├── order_id (FK → orders)
│   ├── product_id (FK → products)
│   ├── variant_id (FK → product_variants)
│   ├── product_name (VARCHAR)
│   ├── quantity (INT)
│   ├── price (NUMERIC)
│   ├── color (VARCHAR)
│   ├── size (VARCHAR)
│   ├── sku (VARCHAR)
│   └── timestamps
│
├── ghn_provinces (63 records - static)
├── ghn_districts (722 records - static)
└── ghn_wards (11,980 records - static)
```

### API Architecture

```
/api
├── /orders
│   ├── POST   - Create order with validation
│   └── GET    - Get order by ID
├── /shipping-fee
│   └── POST   - Calculate shipping fee (GHN)
├── /ghn-provinces
│   └── GET    - List all provinces
├── /ghn-districts
│   └── POST   - Get districts by province
├── /ghn-wards
│   └── POST   - Get wards by district
├── /payment-transfers
│   └── GET    - Get payment status
└── /health
    └── GET    - Server health check
```

---

## 🛍️ Các Chức Năng Yêu Cầu (Functional Requirements)

### FR1: DUYỆT DANH MỤC SẢN PHẨM

**Mô Tả:** Khách hàng xem danh sách sản phẩm, tìm kiếm, lọc.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR1.1 | Hiển thị danh sách | Tất cả sản phẩm từ database | High |
| FR1.2 | Product Card | Ảnh, tên, giá, giá sale | High |
| FR1.3 | Responsive Grid | 2 col (mobile), 3 col (tablet), 4 col (desktop) | High |
| FR1.4 | Search By Name | Real-time search theo tên | High |
| FR1.5 | Search By Description | Search theo mô tả sản phẩm | Medium |
| FR1.6 | Filter By Category | Dropdown chọn danh mục | High |
| FR1.7 | Clear Filters | Button xóa tất cả filter | High |
| FR1.8 | Pagination | Phân trang khi sản phẩm > 20 | Medium |

**Cách Hoạt Động:**
```
1. User load trang chủ
2. System query products từ Supabase
3. Display products in responsive grid
4. User can:
   a. Search → filter by name/description
   b. Filter by category → display matching products
   c. Click clear → show all products
```

**Constraints:**
- Maximum 20 products per page
- Search case-insensitive
- Filter must be real-time (no button click)

**Test Scenarios:**
- TC1.1: Load trang chủ → 10+ sản phẩm hiển thị
- TC1.2: Search "áo" → Chỉ hiển thị áo
- TC1.3: Filter danh mục → Chỉ hiển thị đúng danh mục
- TC1.4: Responsive 4 device types

---

### FR2: XEM CHI TIẾT SẢN PHẨM

**Mô Tả:** Khách hàng xem chi tiết sản phẩm, chọn variant, xem hình ảnh.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR2.1 | Main Image | Ảnh chính sản phẩm | High |
| FR2.2 | Product Info | Tên, mô tả, giá | High |
| FR2.3 | Variants List | Danh sách màu/size | High |
| FR2.4 | Select Variant | Click chọn màu/size → update ảnh | High |
| FR2.5 | Variant Images | Khi chọn variant → hiển thị tất cả ảnh của nó | High |
| FR2.6 | Gallery Viewer | Zoom, navigation, thumbnails | High |
| FR2.7 | Add To Cart | Button thêm vào giỏ | High |
| FR2.8 | Quantity Input | Input chọn số lượng | High |
| FR2.9 | Wishlist | Button thêm vào yêu thích | Medium |
| FR2.10 | Related Products | Hiển thị sản phẩm liên quan | Low |

**Variant Image Flow:**
```
1. User click product → ProductDetailPage load
2. Display first variant images
3. User select color "Đỏ" 
   → Fetch variant_images where variant_id = 'red-id'
   → Display all red variant images
4. User can zoom, swipe, click thumbnail
5. User select quantity
6. Click "Thêm Vào Giỏ" → AddToCart event tracked
```

**Test Scenarios:**
- TC2.1: Click product → load chi tiết <1s
- TC2.2: Select variant → images update
- TC2.3: Gallery viewer zoom hoạt động
- TC2.4: AddToCart event tracked with fbp+fbc
- TC2.5: Wishlist button toggle

---

### FR3: QUẢN LÝ GIỎ HÀNG

**Mô Tả:** Khách hàng quản lý giỏ hàng (thêm, xóa, cập nhật).

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR3.1 | Add To Cart | Thêm item vào giỏ hàng | High |
| FR3.2 | View Cart | Xem danh sách items | High |
| FR3.3 | Update Quantity | Thay đổi số lượng | High |
| FR3.4 | Remove Item | Xóa item khỏi giỏ | High |
| FR3.5 | Calculate Total | Tính tổng tiền = sum(price * qty) | High |
| FR3.6 | Cart Badge | Hiển thị số lượng trên icon | High |
| FR3.7 | Persist Cart | Lưu giỏ (Context + localStorage) | High |
| FR3.8 | Clear Cart | Clear tất cả items | Medium |

**Cart Data Structure:**
```typescript
interface CartItem {
  id: string
  product_id: string
  variant_id: string
  name: string
  color: string
  size: string
  price: number
  quantity: number
  image_url: string
  weight_g: number (for shipping)
  dimensions: {length, width, height} (for shipping)
}

interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}
```

**Persistence Flow:**
```
1. User add item to cart
2. Update CartContext state
3. Save to localStorage
4. On page refresh → Load from localStorage
5. If session expired → Load from localStorage
```

**Test Scenarios:**
- TC3.1: Thêm vào giỏ → lưu đúng
- TC3.2: Tổng tiền tính đúng
- TC3.3: Badge update realtime
- TC3.4: Giỏ persist sau refresh
- TC3.5: Xóa item → update tổng

---

### FR4: CHECKOUT & CHỌN ĐỊA CHỈ

**Mô Tả:** Khách hàng nhập thông tin, chọn địa chỉ giao hàng.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR4.1 | Customer Info Form | Họ tên, email, SĐT | High |
| FR4.2 | Province Selection | Chọn 63 tỉnh thành | High |
| FR4.3 | District Selection | Chọn 722 quận/huyện | High |
| FR4.4 | Ward Selection | Chọn 11,980 xã/phường | High |
| FR4.5 | Address Details | Nhập số nhà, tên đường | High |
| FR4.6 | Form Validation | Validate required fields | High |
| FR4.7 | Error Messages | Hiển thị lỗi rõ ràng | High |
| FR4.8 | Dropdown Loading | Show loading state | High |
| FR4.9 | Save Address | Save to localStorage (optional) | Medium |

**Validation Rules:**

```javascript
const validationRules = {
  customerName: { required: true, minLength: 3, pattern: /^[a-zA-Z\s]+$/ },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { required: true, pattern: /^(\+84|0)\d{9,10}$/ },  // Vietnam phone
  province: { required: true },
  district: { required: true },
  ward: { required: true },
  addressDetails: { required: true, minLength: 5 }
}
```

**Dropdown Cascade Flow:**
```
1. User select Province ID (e.g., 266 = Sơn La)
   → API call: /ghn-districts?province_id=266
   → Load districts, show in dropdown
2. User select District ID (e.g., 1976 = Huyện Mộc Châu)
   → API call: /ghn-wards?district_id=1976
   → Load wards, show in dropdown
3. User select Ward Code
   → Enable shipping fee calculation
```

**Test Scenarios:**
- TC4.1: Form load mới → fields empty
- TC4.2: Select province → load districts
- TC4.3: Select district → load wards
- TC4.4: Validate required fields
- TC4.5: Error message display
- TC4.6: Responsive form mobile

---

### FR5: TÍNH PHÍ VẬN CHUYỂN

**Mô Tả:** Tính phí vận chuyển thực tế từ GHN API.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR5.1 | Call GHN API | POST /shipping-fee | High |
| FR5.2 | Weight Calculation | Sum(item weight) = total weight | High |
| FR5.3 | Dimension Calculation | Max dimensions of items | High |
| FR5.4 | Display Fee | Hiển thị phí realtime | High |
| FR5.5 | Update On Address Change | Khi thay đổi address → recalculate | High |
| FR5.6 | Service Info | Hiển thị thông tin dịch vụ (GHN Express) | Medium |
| FR5.7 | Error Handling | Invalid address → error message | High |
| FR5.8 | Loading State | Show loading spinner | High |

**GHN API Request:**

```javascript
POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee

{
  from_district_id: 1976,        // Huyện Mộc Châu
  from_ward_code: "141005",
  to_district_id: <user-selected>,
  to_ward_code: "<user-selected>",
  height: <max-height>,
  length: <max-length>,
  width: <max-width>,
  weight: <total-weight>,
  service_type_id: 2             // Express
}

Response:
{
  code: 200,
  message: "Success",
  data: {
    total: 25000,                // Phí vận chuyển (VND)
    service_id: 0,
    service_type_id: 2,
    extra_service_ids: [],
    insurance_value: 0
  }
}
```

**Weight & Dimension Calculation:**

```javascript
// Per item default (if not specified):
const ITEM_DEFAULT = {
  weight_g: 500,                // 500 grams
  length_cm: 20,
  width_cm: 20,
  height_cm: 20
}

// Total weight = sum of all items
let totalWeight = cartItems.reduce((sum, item) => {
  return sum + (item.weight_g || 500)
}, 0)

// Convert grams to kg, minimum 1kg
totalWeight = Math.max(totalWeight / 1000, 1)

// Max dimensions (use largest)
let maxDimensions = {
  length: Math.max(...cartItems.map(i => i.length_cm || 20)),
  width: Math.max(...cartItems.map(i => i.width_cm || 20)),
  height: Math.max(...cartItems.map(i => i.height_cm || 20))
}
```

**Test Scenarios:**
- TC5.1: Calculate fee <300ms
- TC5.2: Weight calculation correct
- TC5.3: Support all 63 provinces
- TC5.4: Update fee when change address
- TC5.5: Error handling for invalid address
- TC5.6: Loading state display

---

### FR6: CHỌN PHƯƠNG THỨC THANH TOÁN

**Mô Tả:** Khách hàng chọn phương thức thanh toán (COD, Bank Transfer).

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR6.1 | COD Option | Cash on Delivery (Thu tiền khi nhận hàng) | High |
| FR6.2 | Bank Transfer Option | Chuyển khoản ngân hàng | High |
| FR6.3 | Bank Info | Hiển thị: Tên ngân hàng, Số tài khoản, Chủ TK | High |
| FR6.4 | QR Code | Hiển thị QR code chuyển khoản | High |
| FR6.5 | Copy Button | Copy account number, transfer content | High |
| FR6.6 | Radio Selection | Radio button để chọn | High |
| FR6.7 | Payment Status | Hiển thị status (pending, confirmed) | Medium |

**Bank Information (Hardcoded):**

```javascript
const BANK_INFO = {
  bank_name: "Vietcombank",           // Ngân hàng
  account_number: "0721002222333",    // Số tài khoản
  account_holder: "NGUYEN VAN A",     // Chủ tài khoản
  transfer_content: "DH{OrderID}",    // Nội dung chuyển (Dynamic)
  qr_code_url: "<generated-dynamic>"
}
```

**QR Code Generation:**

```javascript
// Use Vietcombank QR code API
const generateVietcomQR = (accountNumber, amount, content) => {
  const baseUrl = "https://api.vietcombank.com.vn/qr"
  return `${baseUrl}?account=${accountNumber}&amount=${amount}&content=${encodeURIComponent(content)}`
}
```

**Test Scenarios:**
- TC6.1: COD option clickable
- TC6.2: Bank transfer option show bank info
- TC6.3: QR code generate and display
- TC6.4: Copy button work correctly
- TC6.5: Radio selection work

---

### FR7: TẠO ĐƠN HÀNG

**Mô Tả:** Tạo đơn hàng, lưu vào database, track Meta Pixel Lead event.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR7.1 | Validate Data | Validate tất cả form data | High |
| FR7.2 | Create Order | Insert into orders table | High |
| FR7.3 | Create Order Items | Insert into order_items table | High |
| FR7.4 | Generate Order ID | UUID unique cho mỗi order | High |
| FR7.5 | Save fbp | Facebook Pixel ID | High |
| FR7.6 | Save fbc | Facebook Click ID | High |
| FR7.7 | Track Lead Event | fbq('track', 'Lead', {...}) | High |
| FR7.8 | Confirmation Page | Show success + Order ID | High |
| FR7.9 | Clear Cart | Xóa giỏ hàng sau order | High |

**Order Creation Flow:**

```javascript
async function handleConfirmOrder() {
  // 1. Validate
  if (!validateForm(formData)) throw new Error("Invalid form")
  
  // 2. Get Meta Pixel IDs
  const fbp = await waitForFbp(2000)  // Wait up to 2 seconds
  const fbc = getFbc()                 // From URL param or storage
  
  // 3. Create order
  const orderData = {
    user_id: currentUser?.id,
    total: cartTotal,
    shipping_fee: shippingFee,
    payment_method: paymentMethod,  // 'cod' or 'bank_transfer'
    shipping_address: JSON.stringify(address),
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    fbp,                             // ⭐ Meta Pixel ID
    fbc                              // ⭐ Facebook Click ID
  }
  
  // 4. Call API
  const response = await fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
  const order = await response.json()
  
  // 5. Create order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price,
    color: item.color,
    size: item.size
  }))
  // Insert order_items to DB
  
  // 6. Track Lead event
  fbq('track', 'Lead', {
    value: orderData.total,
    currency: 'VND',
    content_name: 'Checkout',
    content_type: 'product',
    fbp: fbp,
    fbc: fbc,
    payment_method: paymentMethod
  })
  
  // 7. Clear cart & redirect
  clearCart()
  navigate(`/order-confirmation/${order.id}`)
}
```

**Database Transaction:**

```sql
BEGIN TRANSACTION;

-- Insert order
INSERT INTO orders (id, user_id, total, shipping_fee, payment_method, ...)
VALUES (...);

-- Insert order items
INSERT INTO order_items (order_id, product_id, variant_id, ...)
VALUES (...), (...), (...);

-- Update payment transfer record (if bank transfer)
INSERT INTO payment_transfers (order_id, payment_method, status, ...)
VALUES (...);

COMMIT;
```

**Test Scenarios:**
- TC7.1: Validate required fields
- TC7.2: Order created in database
- TC7.3: fbp + fbc saved correct
- TC7.4: Lead event tracked
- TC7.5: Order ID unique
- TC7.6: Confirmation page display
- TC7.7: Cart cleared

---

### FR8: THEO DÕI ĐƠN HÀNG

**Mô Tả:** Khách hàng xem lịch sử đơn hàng, chi tiết từng đơn.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR8.1 | Order List | Danh sách đơn hàng của user | High |
| FR8.2 | Sort By Date | Sắp xếp mới nhất trước | High |
| FR8.3 | Order Summary | Order ID, ngày, tổng tiền, status | High |
| FR8.4 | Order Detail | Click xem chi tiết | High |
| FR8.5 | Product Details | Danh sách sản phẩm, số lượng, giá | High |
| FR8.6 | Shipping Info | Địa chỉ giao hàng, phí vận chuyển | High |
| FR8.7 | Payment Info | Phương thức thanh toán, status | High |
| FR8.8 | Order Status | pending, processing, shipped, delivered | Medium |
| FR8.9 | Filter By Status | Lọc đơn theo status | Medium |

**Order Status Enum:**
```javascript
const ORDER_STATUS = {
  PENDING: 'pending',        // Chờ xác nhận
  CONFIRMED: 'confirmed',    // Đã xác nhận
  PROCESSING: 'processing',  // Đang xử lý
  SHIPPED: 'shipped',        // Đã gửi
  DELIVERED: 'delivered',    // Đã giao
  CANCELLED: 'cancelled'     // Đã hủy
}
```

**Test Scenarios:**
- TC8.1: Load order list correct
- TC8.2: Sort by date correct
- TC8.3: Click see details
- TC8.4: Display complete info
- TC8.5: Filter by status work

---

### FR9: ĐĂNG NHẬP

**Mô Tả:** Khách hàng đăng nhập bằng Google OAuth.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR9.1 | Google OAuth Login | OAuth2 flow via Supabase | High |
| FR9.2 | Session Management | Session lưu trong Supabase Auth | High |
| FR9.3 | User Display | Hiển thị tên user trên header | High |
| FR9.4 | Logout | Nút đăng xuất, clear session | High |
| FR9.5 | Protected Routes | Redirect to login nếu chưa auth | High |
| FR9.6 | User Info | Lưu user (ID, email, name) | High |
| FR9.7 | Persist Login | Session persist across page refresh | High |

**OAuth Flow:**
```
1. User click "Đăng Nhập"
2. Modal mở → Google sign-in popup
3. User chọn Google account
4. Supabase Auth xử lý OAuth callback
5. Session token được lưu
6. Redirect về trang trước
7. User info display trên header
```

**Test Scenarios:**
- TC9.1: Google OAuth popup open
- TC9.2: Login success
- TC9.3: Session persist
- TC9.4: Username display
- TC9.5: Logout work
- TC9.6: Protected route redirect

---

### FR10: META PIXEL TRACKING

**Mô Tả:** Theo dõi hành vi khách hàng bằng Meta Pixel.

**Requirements:**

| ID | Yêu Cầu | Mô Tả | Priority |
|----|---------|-------|----------|
| FR10.1 | PageView Event | Tracked tự động mỗi page view | High |
| FR10.2 | AddToCart Event | Tracked khi click "Thêm Vào Giỏ" | High |
| FR10.3 | Lead Event | Tracked khi confirm checkout | High |
| FR10.4 | fbp Captured | Facebook Pixel ID từ _fbp cookie | High |
| FR10.5 | fbc Captured | Facebook Click ID từ fbclid URL | High |
| FR10.6 | fbp In Database | Saved to orders.fbp | High |
| FR10.7 | fbc In Database | Saved to orders.fbc | High |
| FR10.8 | Events In Console | Logged for debugging | High |

**Meta Pixel Pixel ID: 1823205972392139**

**AddToCart Event Data:**

```javascript
fbq('track', 'AddToCart', {
  content_name: 'Product Name',
  content_type: 'product',
  content_ids: ['product-id', 'variant-id'],
  value: 299000,
  currency: 'VND',
  quantity: 1,
  custom: {
    color: 'Red',
    size: 'L',
    fbp: 'fb.1.xxx',
    fbc: 'fb.1.xxx'
  }
})
```

**Lead Event Data:**

```javascript
fbq('track', 'Lead', {
  value: 325000,              // Total including shipping
  currency: 'VND',
  content_name: 'Checkout Complete',
  content_type: 'product',
  custom: {
    payment_method: 'bank_transfer',
    fbp: 'fb.1.xxx',
    fbc: 'fb.1.xxx'
  }
})
```

**Test Scenarios:**
- TC10.1: fbq script loaded
- TC10.2: PageView in console
- TC10.3: AddToCart event tracked
- TC10.4: fbp captured from _fbp
- TC10.5: fbc captured from fbclid
- TC10.6: fbp + fbc in database
- TC10.7: Events in Meta Events Manager (24-48h)

---

## 🔧 Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### NFR1: PERFORMANCE

| Yêu Cầu | Target | Acceptance |
|--------|--------|-----------|
| **Page Load Time** | < 2 seconds | LCP < 2s, FCP < 1s |
| **API Response** | < 500ms | 95th percentile < 500ms |
| **Bundle Size** | < 150KB | Gzipped < 150KB |
| **Image Load** | < 100ms per image | Lazy loading implemented |
| **Concurrent Users** | 1,000+ | Vercel auto-scale |
| **Database Query** | < 100ms | Indexed, optimized |

### NFR2: RESPONSIVENESS

| Device | Resolution | Status |
|--------|-----------|--------|
| Mobile | 320px - 480px | ✅ 2-column grid |
| Mobile+ | 480px - 768px | ✅ 3-column grid |
| Tablet | 768px - 1024px | ✅ 3-column grid |
| Desktop | 1024px - 1440px | ✅ 4-column grid |
| Desktop+ | 1440px+ | ✅ 4-column grid |

### NFR3: BROWSER SUPPORT

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full support |
| Firefox | Latest | ✅ Full support |
| Safari | Latest | ✅ Full support |
| Edge | Latest | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ Full support |
| Chrome Mobile | Android | ✅ Full support |

### NFR4: SECURITY

| Requirement | Implementation |
|------------|-----------------|
| **Authentication** | Supabase OAuth (Google) |
| **Authorization** | Row Level Security (RLS) |
| **Data Encryption** | SSL/HTTPS (Vercel) |
| **API Keys** | Environment variables |
| **CORS** | Whitelist only frontend domains |
| **SQL Injection** | Parameterized queries (Supabase) |
| **XSS Prevention** | React escaping + Content Security Policy |
| **CSRF Protection** | SameSite cookies |

### NFR5: AVAILABILITY & RELIABILITY

| Requirement | Target |
|------------|--------|
| **Uptime** | 99.5% (Vercel SLA) |
| **Database Backup** | Daily (Supabase) |
| **Auto-Recovery** | Vercel auto-redeploy |
| **Error Logging** | CloudWatch / Vercel |
| **Monitoring** | Real-time alerts |

### NFR6: SCALABILITY

| Aspect | Capability |
|--------|-----------|
| **Database** | Auto-scale PostgreSQL (Supabase) |
| **Backend** | Serverless auto-scale (Vercel) |
| **Frontend** | CDN global distribution |
| **Storage** | Unlimited via Supabase |
| **Products** | Support 100,000+ products |
| **Users** | Support 100,000+ users |

---

## 🎨 Yêu Cầu Giao Diện (UI Requirements)

### Layout Requirements

- **Header:** Logo, search bar, cart icon (badge), favorites, account menu
- **Footer:** About, contact, links, copyright
- **Navigation:** Breadcrumb, category menu, search
- **Product Grid:** Responsive, lazy loading, hover effects
- **Product Detail:** Gallery, variants, reviews, related products
- **Cart:** Summary, edit items, proceed to checkout
- **Checkout:** Form, address selection, shipping fee, payment option
- **Order Tracking:** List, detail view, status timeline

### Color Scheme

- **Primary:** #FF6B35 (Orange)
- **Secondary:** #F7931E (Light Orange)
- **Accent:** #004E89 (Blue)
- **Background:** #F5F5F5 (Light Gray)
- **Text:** #333333 (Dark Gray)
- **Success:** #4CAF50 (Green)
- **Warning:** #FFC107 (Yellow)
- **Error:** #F44336 (Red)

### Typography

- **Headlines:** Inter, 24-32px, Bold
- **Body:** Inter, 14-16px, Regular
- **Small:** Inter, 12px, Regular

### Component Library

- Radix UI components
- Tailwind CSS utilities
- Custom SVG icons (Lucide React)

---

## 🗄️ Yêu Cầu Database

### Tables & Indexes

```sql
-- Performance indexes
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_fbp ON orders(fbp);
CREATE INDEX idx_orders_fbc ON orders(fbc);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_variant_images_variant_id ON variant_images(variant_id);
```

### Row Level Security (RLS)

```sql
-- Users can only see their own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Only authenticated users can insert orders
CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### Constraints

```sql
-- Foreign keys
ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_order
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- Unique constraints
ALTER TABLE products ADD CONSTRAINT unique_product_sku UNIQUE (sku);
ALTER TABLE product_variants ADD CONSTRAINT unique_variant_sku UNIQUE (sku);

-- Check constraints
ALTER TABLE orders
  ADD CONSTRAINT check_total_positive CHECK (total > 0);
ALTER TABLE order_items
  ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);
```

---

## 🔌 Yêu Cầu API

### REST API Standards

- **Base URL:** https://e-commerce-website-interface.vercel.app/api
- **Content-Type:** application/json
- **Authentication:** Bearer token (Supabase)
- **Error Format:** { error: "message", code: "ERROR_CODE" }

### API Endpoints Specification

See **FR1-FR10** sections for detailed request/response specifications.

---

## 🔐 Yêu Cầu Security

### Authentication

- ✅ Google OAuth via Supabase Auth
- ✅ JWT tokens with 7-day expiration
- ✅ Refresh token rotation
- ✅ Secure HttpOnly cookies

### Authorization

- ✅ Row Level Security on all user-specific data
- ✅ API endpoint auth checks
- ✅ Role-based access control (basic)

### Data Protection

- ✅ HTTPS/SSL on all endpoints
- ✅ CORS whitelist (frontend domain only)
- ✅ API key in environment variables
- ✅ Secrets not in git (.env.local in .gitignore)

### Input Validation

- ✅ Client-side validation (React Hook Form)
- ✅ Server-side validation (Supabase)
- ✅ Sanitized input queries
- ✅ Type-safe TypeScript

---

## ✅ Acceptance Criteria

### Overall Acceptance

**System is ACCEPTED when:**

1. ✅ All 10 FR (FR1-FR10) fully implemented
2. ✅ All 6 NFR (NFR1-6) met
3. ✅ All test cases pass (Pass rate > 95%)
4. ✅ No critical or high-severity bugs
5. ✅ Performance metrics achieved
6. ✅ Security audit passed
7. ✅ Accessibility WCAG AA compliant
8. ✅ Browser compatibility verified
9. ✅ Mobile responsiveness confirmed
10. ✅ Production deployment successful

### Per-Feature Acceptance

**Each FR is accepted when:**
- Requirements specification met
- Unit tests pass (if applicable)
- Integration tests pass
- E2E test cases pass
- Code review approved
- Performance acceptable
- No known bugs

---

**Document Status:** ✅ Complete  
**Last Updated:** 15 October 2026  
**Approval Status:** Pending QA Review
