# 📊 Data Flow: Khi Lưu Order Thì Gửi Gì Về Database

## 🔄 Complete Flow

```
User Click "Checkout"
       ↓
CheckoutForm.tsx (handleSubmit)
       ↓
Prepare order data:
  - order object
  - items array
       ↓
POST /api/orders
       ↓
src/app/api/orders/route.ts
       ↓
Insert into "orders" table
Insert into "order_items" table
       ↓
Response back to frontend
       ↓
Redirect to home page
```

---

## 1️⃣ REQUEST: CheckoutForm gửi lên API

### File: `src/app/components/checkout/CheckoutForm.tsx` (line 338-380)

```typescript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order: {
      total: 100000,                           // Tổng tiền
      shipping_fee: 30000,                     // Phí ship
      payment_method: 'cod',                   // Phương thức thanh toán
      payment_status: 'pending',               // Trạng thái thanh toán
      order_status: 'pending',                 // Trạng thái order
      shipping_address: '123 Đường ABC, ...',  // Địa chỉ giao hàng
      customer_email: 'test@example.com',      // Email khách
      customer_phone: '0123456789',            // SĐT khách
      note: 'Ghi chú gì đó',                   // Ghi chú
    },
    items: [
      {
        product_id: 'uuid-123',          // ID sản phẩm
        variant_id: 'uuid-456',          // ID variant (màu size)
        product_name: 'Áo Thun Xanh',    // Tên sản phẩm
        quantity: 2,                     // Số lượng
        price: 50000,                    // Giá từng cái
        color: 'Xanh',                   // Màu sắc
        size: 'M',                       // Kích thước
        sku: 'SKU-001',                  // Mã SKU
        weight_kg: 0.3,                  // Cân nặng (kg)
        length_cm: 30,                   // Chiều dài (cm)
        width_cm: 20,                    // Chiều rộng (cm)
        height_cm: 15,                   // Chiều cao (cm)
      },
      {
        // item 2, 3, ... nếu có
      }
    ]
  })
})
```

---

## 2️⃣ BACKEND: API xử lý request

### File: `src/app/api/orders/route.ts`

```typescript
export async function POST(req: NextRequest) {
  const body = await req.json()  // Nhận request từ frontend
  const { order, items } = body

  console.log('📝 API: Creating order with items')
  console.log('Order:', order)   // Log order data
  console.log('Items:', items)   // Log items data

  // ===== STEP 1: Insert vào bảng "orders" =====
  const { data: orderData, error: orderError } = await supabase
    .from('orders')              // Bảng "orders"
    .insert([order])             // Insert order object
    .select()
    .single()

  console.log('✅ Order created:', orderData.id)

  // ===== STEP 2: Insert vào bảng "order_items" =====
  const itemsWithOrderId = items.map((item: any) => ({
    ...item,
    order_id: orderData.id,      // Thêm order_id vào mỗi item
  }))

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')         // Bảng "order_items"
    .insert(itemsWithOrderId)    // Insert items array
    .select()

  console.log('✅ Order items created:', itemsData?.length)

  // Return response
  return NextResponse.json({
    success: true,
    order: orderData,
    items: itemsData || [],
  }, { status: 201 })
}
```

---

## 3️⃣ DATABASE: Dữ liệu lưu trong Supabase

### Bảng "orders"
```
id (UUID)           | customer_email      | total   | shipping_fee | order_status | payment_status
abc-123-def         | test@example.com    | 130000  | 30000        | pending      | pending
```

Dòng này sẽ có:
- ✅ `total`: 130000 (tổng tiền = sản phẩm + ship)
- ✅ `shipping_fee`: 30000
- ✅ `customer_email`: test@example.com
- ✅ `customer_phone`: 0123456789
- ✅ `shipping_address`: "123 Đường ABC, ..."
- ✅ `payment_method`: cod
- ✅ `payment_status`: pending
- ✅ `order_status`: pending
- ✅ `note`: Ghi chú gì đó
- ✅ `created_at`: 2024-08-27 10:30:00

---

### Bảng "order_items"
```
id              | order_id      | product_id   | variant_id   | product_name    | quantity | price  | color | size
xyz-789-uvw     | abc-123-def   | uuid-123     | uuid-456     | Áo Thun Xanh    | 2        | 50000  | Xanh  | M
```

Có thể có nhiều dòng nếu order có nhiều sản phẩm:
```
id              | order_id      | product_id   | variant_id   | product_name    | quantity | price  | color | size
row-1           | abc-123-def   | uuid-111     | uuid-222     | Áo Thun Xanh    | 2        | 50000  | Xanh  | M
row-2           | abc-123-def   | uuid-333     | uuid-444     | Quần Jean      | 1        | 80000  | Đen   | 30
row-3           | abc-123-def   | uuid-555     | uuid-666     | Giày Sneaker   | 1        | 120000 | Trắng | 40
```

---

## 📋 Column Mapping

### Order Object → orders table
| Frontend (CheckoutForm) | Database (orders table) |
|------------------------|------------------------|
| total | total |
| shipping_fee | shipping_fee |
| payment_method | payment_method |
| payment_status | payment_status |
| order_status | order_status |
| shipping_address | shipping_address |
| customer_email | customer_email |
| customer_phone | customer_phone |
| note | note |
| (auto) | id (UUID generated) |
| (auto) | created_at (timestamp now) |

### Item Object → order_items table
| Frontend (CheckoutForm) | Database (order_items table) |
|------------------------|------------------------|
| product_id | product_id |
| variant_id | variant_id |
| product_name | product_name |
| quantity | quantity |
| price | price |
| color | color |
| size | size |
| sku | sku |
| weight_kg | weight_kg |
| length_cm | length_cm |
| width_cm | width_cm |
| height_cm | height_cm |
| (auto) | order_id (added by API) |
| (auto) | id (UUID generated) |
| (auto) | created_at (timestamp now) |

---

## 🔍 Example: Full Order Flow

### Step 1: Khách thêm 2 sản phẩm vào giỏ
```json
Cart (localStorage):
[
  {
    product_id: "prod-001",
    variant_id: "var-001",
    name: "Áo Thun",
    color: "Xanh",
    size: "M",
    quantity: 2,
    price: 50000
  },
  {
    product_id: "prod-002",
    variant_id: "var-002",
    name: "Quần Jean",
    color: "Đen",
    size: "30",
    quantity: 1,
    price: 80000
  }
]
```

### Step 2: Khách checkout, fill form
```
Email: test@example.com
Phone: 0123456789
Address: 123 Đường Nguyễn Huệ
Total: 180000 (50000*2 + 80000)
Shipping: 30000
Grand Total: 210000
```

### Step 3: Frontend gửi POST /api/orders
```json
{
  "order": {
    "total": 210000,
    "shipping_fee": 30000,
    "customer_email": "test@example.com",
    "customer_phone": "0123456789",
    "shipping_address": "123 Đường Nguyễn Huệ, ...",
    ...
  },
  "items": [
    {
      "product_id": "prod-001",
      "variant_id": "var-001",
      "product_name": "Áo Thun",
      "quantity": 2,
      "price": 50000,
      "color": "Xanh",
      "size": "M",
      ...
    },
    {
      "product_id": "prod-002",
      "variant_id": "var-002",
      "product_name": "Quần Jean",
      "quantity": 1,
      "price": 80000,
      "color": "Đen",
      "size": "30",
      ...
    }
  ]
}
```

### Step 4: API insert vào Supabase

**orders table:**
```
id: "order-abc-123"
customer_email: "test@example.com"
customer_phone: "0123456789"
total: 210000
shipping_fee: 30000
shipping_address: "123 Đường Nguyễn Huệ, ..."
payment_status: "pending"
order_status: "pending"
created_at: "2024-08-27 10:30:00"
```

**order_items table:**
```
Row 1:
  order_id: "order-abc-123"
  product_id: "prod-001"
  variant_id: "var-001"
  product_name: "Áo Thun"
  quantity: 2
  price: 50000
  color: "Xanh"
  size: "M"
  created_at: "2024-08-27 10:30:00"

Row 2:
  order_id: "order-abc-123"
  product_id: "prod-002"
  variant_id: "var-002"
  product_name: "Quần Jean"
  quantity: 1
  price: 80000
  color: "Đen"
  size: "30"
  created_at: "2024-08-27 10:30:00"
```

---

## ✅ Verification

Để xác nhận dữ liệu đã lưu đúng:

### Check orders table:
```sql
SELECT * FROM orders WHERE id = 'order-abc-123';
```

### Check order_items table:
```sql
SELECT * FROM order_items WHERE order_id = 'order-abc-123';
```

Sẽ thấy 2 dòng item tương ứng.

