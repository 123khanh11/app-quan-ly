# 📊 SYSTEM OVERVIEW - Tổng Quan Hệ Thống

Đây là tài liệu tổng quát về hệ thống E-Commerce + Management App Integration.

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND: E-Commerce Website               │
│         https://e-commerce-website-interface.vercel.app      │
│  (React + Next.js + Tailwind CSS)                            │
└────────┬──────────────────────────────────────────────────┬──┘
         │                                                  │
         │ (API Calls)                                      │ (User Checkout)
         ▼                                                  ▼
    ┌────────────────────────────────────┐      ┌──────────────────────────┐
    │    SUPABASE DATABASE               │      │  CHECKOUT FLOW           │
    │  (PostgreSQL + RLS)                │      │  1. Add product to cart  │
    │                                    │      │  2. Enter address info   │
    │ Tables:                            │      │  3. Select province/dist │
    │ • products                         │      │  4. Calculate shipping   │
    │ • orders                           │      │  5. Create order         │
    │ • order_items                      │      │  6. Auto get ship addr   │
    │ • addresses                        │      │  7. Confirm payment      │
    │ • ghn_provinces (63)               │      └──────────────────────────┘
    │ • ghn_districts (722)              │
    │ • ghn_wards (11,980)               │
    │ • ghn_services                     │
    │ • ghn_service_types                │
    │                                    │
    │ Triggers:                          │
    │ • trigger_auto_shipping_address    │ ← Auto fetch shipping_address
    └────────┬──────────────────────────┘
             │
             │ (Read/Write)
             ▼
    ┌────────────────────────────────────┐
    │    GHN API INTEGRATION             │
    │  (Shipping Fee Calculation)        │
    │  Service Type: 2                   │
    │  From: Hà Đông, Hà Nội             │
    │  To: User's selected location      │
    │                                    │
    │ Functions:                         │
    │ • calculateShippingFee()           │
    │ • getDistricts()                   │
    │ • getWards()                       │
    │ • getServices()                    │
    └────────────────────────────────────┘
             │
             │ (HTTP)
             ▼
    ┌────────────────────────────────────┐
    │    GHN Server                      │
    │  online-gateway.ghn.vn/shiip       │
    │  Token: 653bfc7b-8381-11f1-...     │
    │  Shop ID: 6557702                  │
    └────────────────────────────────────┘
         │
         │ (API Response)
         ▼
    ┌──────────────────────────┐
    │  MANAGEMENT APP          │
    │  https://appmanagement-  │
    │  six.vercel.app          │
    │  (React + Next.js)       │
    │                          │
    │ Features:                │
    │ • View orders            │
    │ • Parse shipping_address │
    │ • Update order status    │
    │ • Track shipments        │
    └──────────────────────────┘
```

---

## 📁 PROJECT STRUCTURE

```
e-commerce-website-interface/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── checkout/
│   │   │   │   └── CheckoutForm.tsx          ← Tính phí ship, save shipping_address
│   │   │   ├── shop/
│   │   │   │   ├── ShopHome.tsx
│   │   │   │   ├── Cart.tsx
│   │   │   │   └── OrderTracking.tsx
│   │   │   └── ui/                           ← shadcn/ui components
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── page.tsx
│   │   └── App.tsx                           ← Main entry
│   │
│   ├── services/
│   │   ├── supabase.ts                       ← Supabase client + DB functions
│   │   ├── ghn-db.ts                         ← GHN location queries
│   │   ├── ghn.ts                            ← GHN API calls
│   │   ├── shipping-calculator.ts            ← Shipping fee logic
│   │   └── orderService.ts                   ← Auto shipping_address ← NEW
│   │
│   ├── context/
│   │   └── CartContext.tsx                   ← Cart state management
│   │
│   └── data/
│       └── ghn-locations.ts                  ← (deprecated - use DB now)
│
├── scripts/
│   ├── seed-ghn-data.js                      ← Insert GHN mock data
│   ├── sync-ghn-data.js                      ← Sync full GHN data
│   ├── seed-complete-data.js
│   ├── seed-full-data.js
│   └── fix-rls.js
│
├── SQL/
│   ├── SQL_CREATE_TABLES.sql                 ← Database schema
│   ├── SQL_FIX_RLS.sql                       ← RLS policies
│   ├── AUTO_SHIPPING_ADDRESS_TRIGGER.sql     ← Auto fetch shipping_address ← NEW
│   ├── FIX_STATUS_COLUMN.sql
│   └── SHIPPING_CALCULATION.sql              ← (reference)
│
├── DOCUMENTATION/
│   ├── NEXT_STEPS.md                         ← Current action items
│   ├── RUN_AUTO_SHIPPING_TRIGGER.md          ← How to run SQL trigger ← NEW
│   ├── SYSTEM_OVERVIEW.md                    ← This file
│   ├── CONNECT_APP_GET_ADDRESS.md            ← App integration guide
│   ├── PARSE_ADDRESS_GUIDE.md                ← How to parse shipping_address
│   ├── ORDER_MANAGEMENT_INTEGRATION.md       ← Order data structure
│   ├── SHIPPING_CALCULATION.md               ← Shipping fee logic
│   ├── GHN_API_SETUP.md
│   ├── GHN_DATA_SYNC_GUIDE.md
│   └── DATABASE_SETUP.md
│
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── .env.local                                ← Secrets (Supabase credentials)
├── .env.production
├── vercel.json
├── .gitignore
└── README.md
```

---

## 🔄 USER FLOW

### 1️⃣ **CHECKOUT FLOW (Website)**

```
User visits website
↓
Browse products
↓
Add to cart
↓
Click "Giỏ Hàng" (Cart button)
↓
Click "Thanh Toán" (Checkout)
↓
CheckoutForm rendered:
  • Email input
  • Phone input
  • Province selector (loaded from Supabase ghn_provinces)
  • District selector (loaded via getDistricts API)
  • Ward selector (loaded via getWards API)
  • Address detail input
  • Shipping fee calculated automatically
↓
calculateShippingFee() called:
  • Service type: 2 (Light goods)
  • From: District 1455, Ward 21617 (Hà Đông, Hà Nội)
  • To: User's selected location
  • Weight: 500g/item (min 1kg)
  • Dimensions: 20x20x20cm/item
  • Returns: Shipping fee
↓
User clicks "Đặt Hàng" (Place Order)
↓
createOrder() called:
  • Order inserted with shipping_address format:
    "detail, ward, district, province"
    Example: "Số 123 Lê Lợi, Phường Dương Nội, Hà Đông, Hà Nội"
  • Order items added to order_items table
  • Cart cleared
↓
Success message: "✅ Đặt hàng thành công! Mã đơn hàng: xxx"
↓
Redirect to home page
```

### 2️⃣ **AUTO SHIPPING ADDRESS FLOW (Database)**

```
Order inserted into orders table
↓
Trigger trigger_auto_shipping_address fires (BEFORE INSERT)
↓
Function auto_shipping_address() executes:
  1. Check if user_id is not NULL
  2. Query addresses table:
     SELECT address_full FROM addresses 
     WHERE user_id = NEW.user_id AND is_default = true LIMIT 1
  3. Set NEW.shipping_address to result
  4. If NULL, set to "Chưa cập nhật địa chỉ"
↓
Order saved with shipping_address value
```

### 3️⃣ **MANAGEMENT APP FLOW**

```
App Management loads orders
↓
Fetch orders from Supabase:
  GET /api/orders
  Result: { id, user_id, shipping_address, order_status, ... }
↓
Display orders in table/list:
  • Order ID
  • Customer info (from note field or addresses table)
  • Shipping address (full string)
  • Order status (pending, processing, shipped, delivered)
  • Action buttons (view, update, delete)
↓
When user clicks "View Details":
  • Parse shipping_address using parseShippingAddress()
  • Display as:
    ```
    Đơn hàng #xxx
    Địa chỉ giao hàng:
    Số 123 Lê Lợi
    Phường Dương Nội
    Hà Đông
    Hà Nội
    ```
↓
When user updates order status:
  • Call updateOrderStatus(orderId, newStatus)
  • Status updates in Supabase
  • Real-time update in UI
```

---

## 📊 DATABASE SCHEMA

### Orders Table
```
Column              | Type          | Notes
--------------------|---------------|-------------------------
id                  | UUID          | Primary key
user_id             | UUID          | Foreign key (optional)
total               | DECIMAL       | Total price (Sản phẩm + Phí ship)
shipping_fee        | DECIMAL       | Phí vận chuyển
payment_method      | VARCHAR       | 'cod' (Cash on Delivery)
payment_status      | VARCHAR       | 'pending', 'completed'
order_status        | VARCHAR       | 'pending', 'processing', 'shipped', 'delivered'
shipping_address    | TEXT          | Format: "detail, ward, district, province"
note                | TEXT          | Additional notes
created_at          | TIMESTAMP     | Order creation time
updated_at          | TIMESTAMP     | Last update time
```

### Addresses Table (Optional)
```
Column              | Type          | Notes
--------------------|---------------|-------------------------
id                  | UUID          | Primary key
user_id             | UUID          | Foreign key
address_full        | TEXT          | Full address string
is_default          | BOOLEAN       | Is default address?
created_at          | TIMESTAMP     | Creation time
```

### GHN Tables
```
ghn_provinces:
- province_id (INT, unique)
- province_name (VARCHAR)
- Total: 63 rows

ghn_districts:
- district_id (INT, unique)
- province_id (INT, FK)
- district_name (VARCHAR)
- Total: 722 rows

ghn_wards:
- ward_code (VARCHAR, unique)
- district_id (INT, FK)
- province_id (INT, FK)
- ward_name (VARCHAR)
- Total: 11,980 rows
```

---

## 🔌 GHN API CONFIGURATION

**Credentials** (in `.env.local`):
```
NEXT_PUBLIC_GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e
NEXT_PUBLIC_GHN_SHOP_ID=6557702
NEXT_PUBLIC_GHN_BASE_URL=https://online-gateway.ghn.vn/shiip/public-api
```

**Shop Location:**
- District: Hà Đông (District ID: 1455)
- Ward: Phường Dương Nội (Ward code: 21617)
- Province: Hà Nội (Province ID: 201)

**Service Type:**
- ID: 2
- Name: Chuyển phát nhanh hôm nay (Next-day delivery)

**Default Shipping Parameters:**
- Weight: 500g/item, minimum 1kg
- Dimensions: 20x20x20cm/item
- Surcharge: 5,000 VND per kg above 1kg

---

## 🚀 DEPLOYMENT

### Frontend (E-Commerce Website)
```
Platform: Vercel
URL: https://e-commerce-website-interface.vercel.app
Build: ✅ Success (1650 modules)
Deploy: Auto via Vercel CLI (no GitHub)
Command: vercel deploy --prod
```

### Management App
```
Platform: Vercel
URL: https://appmanagement-six.vercel.app
Build: ✅ Success
Deploy: Manual via CLI
Command: vercel deploy --prod
```

### Database
```
Platform: Supabase
URL: https://edtxexnhpbipcecceoop.supabase.co
Auth: Anon key + Service role key
Tables: 12 (products, orders, addresses, ghn_*)
```

---

## 🔑 KEY FUNCTIONS

### OrderService (src/services/orderService.ts)

```typescript
// Create order with auto shipping_address
createOrder(params: CreateOrderParams): Promise<Order>

// Get order by ID
getOrderById(orderId: string): Promise<Order | null>

// Get all orders for user
getUserOrders(userId: string): Promise<Order[]>

// Update order status
updateOrderStatus(orderId: string, newStatus: string): Promise<boolean>

// Delete order
deleteOrder(orderId: string): Promise<boolean>

// Parse shipping_address into 4 parts
parseShippingAddress(address: string): ParsedAddress
// Returns: { detail, ward, district, province }
```

### GHN Functions (src/services/ghn-db.ts)

```typescript
// Get all districts for a province
getDistricts(provinceId: number): Promise<{ success, districts, error }>

// Get all wards for a district
getWards(districtId: number): Promise<{ success, wards, error }>

// Calculate shipping fee
calculateShippingFee(params: ShippingParams): Promise<{ success, data, error }>

// Get services for location
getServices(params): Promise<{ success, services, error }>
```

### Supabase Functions (src/services/supabase.ts)

```typescript
// Create order
createOrder(orderData): Promise<Order>

// Add item to order
addOrderItem(itemData): Promise<OrderItem>

// Get all orders
getOrders(email?: string): Promise<Order[]>

// Get order details with items
getOrderDetails(orderId): Promise<{ order, items }>

// Get products
getProducts(): Promise<Product[]>
```

---

## 📋 CURRENT STATUS

### ✅ COMPLETED
- [x] GHN API integration (shipping fee calculation)
- [x] Database schema (products, orders, addresses, ghn_*)
- [x] Supabase RLS policies
- [x] Frontend deployment (Vercel)
- [x] Checkout form with address selection
- [x] GHN data population (63 provinces, 722 districts, 11,980 wards)
- [x] Shipping fee calculation
- [x] OrderService with CRUD operations
- [x] Management app deployment

### ⏳ IN PROGRESS
- [ ] SQL trigger for auto shipping_address (ready to run)
  - [ ] Create trigger in Supabase SQL Editor
  - [ ] Test with sample data
  - [ ] Verify in production

### 🟡 TODO
- [ ] Management app integration (import OrderService)
- [ ] Test end-to-end flow
- [ ] Add order tracking UI
- [ ] Setup email notifications

### ✅ NOT REQUIRED (Done)
- [x] Fix status column (added but using order_status instead)
- [x] Fix RLS policies
- [x] Create addresses table (optional)

---

## 🛠️ QUICK COMMANDS

### Run project locally
```bash
cd "c:\Users\baomu\Downloads\E-commerce website interface"

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev
# -> http://localhost:3000
```

### Deploy to Vercel
```bash
# Build and deploy
vercel deploy --prod

# Check deployment status
vercel --version
```

### Test SQL Trigger
```bash
# 1. Copy SQL to Supabase SQL Editor
# 2. Click RUN
# 3. Verify trigger created:

# In Supabase SQL Editor:
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_auto_shipping_address';
```

### Sync GHN data
```bash
# Full data sync (if GHN token available)
node scripts/sync-ghn-data.js

# Mock data insert
node scripts/seed-ghn-data.js
```

---

## 📞 SUPPORT

### Common Issues

**Q: Orders không có shipping_address?**
- A: SQL trigger chưa được chạy trong Supabase
- Solution: Chạy `AUTO_SHIPPING_ADDRESS_TRIGGER.sql` trong SQL Editor

**Q: Shipping fee không tính toán?**
- A: GHN API key hoặc shop ID sai
- Solution: Kiểm tra `.env.local` credentials

**Q: Addresses list trống?**
- A: Bảng ghn_wards chưa được populate
- Solution: Chạy `scripts/sync-ghn-data.js` hoặc seed mock data

**Q: Trigger có lỗi?**
- A: Addresses table không tồn tại
- Solution: Tạo bảng hoặc modify trigger để xử lý NULL case

---

## 📚 DOCUMENTATION

| File | Purpose |
|------|---------|
| NEXT_STEPS.md | Current action items |
| RUN_AUTO_SHIPPING_TRIGGER.md | How to run SQL trigger |
| CONNECT_APP_GET_ADDRESS.md | App integration guide |
| PARSE_ADDRESS_GUIDE.md | How to parse addresses |
| SHIPPING_CALCULATION.md | Shipping fee logic |
| GHN_API_SETUP.md | GHN API configuration |
| DATABASE_SETUP.md | Database creation guide |
| SYSTEM_OVERVIEW.md | This file |

---

## 🎯 NEXT IMMEDIATE STEPS

1. **Run SQL Trigger** (5 min)
   - Open Supabase SQL Editor
   - Paste SQL from `AUTO_SHIPPING_ADDRESS_TRIGGER.sql`
   - Click RUN

2. **Test Checkout** (5 min)
   - Visit website
   - Add product to cart
   - Go to checkout
   - Fill form and place order
   - Verify shipping_address in Supabase

3. **Deploy** (2 min)
   - Commit changes: `git add . && git commit -m "Add auto shipping address trigger"`
   - Deploy: `vercel deploy --prod`

4. **Test on Production** (3 min)
   - Visit deployed website
   - Repeat test checkout flow

---

**✅ All systems ready! Just need to run SQL trigger and test.** 🚀
