# 💰 GHN Tính Phí - Hướng Dẫn Chi Tiết

## 🎯 Cách Tính Phí GHN Hiện Tại

### Thông Số Sử Dụng

```javascript
{
  service_type_id: 2,           // Hàng nhẹ (Light goods)
  from_district_id: 1442,       // Quận Ba Đình, Hà Nội (cửa hàng)
  from_ward_code: '21211',      // Phường Trần Hưng Đạo
  to_district_id: ...,          // Quận/Huyện khách hàng (từ form)
  to_ward_code: ...,            // Xã/Phường khách hàng (từ form)
  weight: ...,                  // Khối lượng tổng (grams)
  length: ...,                  // Chiều dài (cm)
  width: ...,                   // Chiều rộng (cm)
  height: ...,                  // Chiều cao (cm)
  insurance_value: 0,           // Không bảo hiểm
  coupon: null                  // Không dùng mã giảm giá
}
```

### Cách Tính Weight & Dimensions

**Từ các sản phẩm trong giỏ hàng:**

```javascript
// Cộng khối lượng từ tất cả items
totalWeight = SUM(item.weight * item.quantity)

// Lấy kích thước lớn nhất (vì items xếp chồng)
totalLength = MAX(item.length)
totalWidth = MAX(item.width)

// Cộng chiều cao (vì items xếp chồng lên nhau)
totalHeight = SUM(item.height * item.quantity)
```

**Giá trị mặc định (nếu product không có thông tin):**
- weight: 500 grams/item
- length: 20 cm
- width: 20 cm
- height: 20 cm

**Giá trị minimum:**
- weight: 1000 grams (1kg)
- length, width, height: 20 cm

---

## 📊 Ví Dụ Tính Phí

### Ví Dụ 1: Gửi từ Hà Nội → TP HCM

```
Giỏ hàng:
├─ Sản phẩm A: 500g × 1 = 500g (20×20×20cm)
├─ Sản phẩm B: 300g × 2 = 600g (15×15×10cm)
└─ Sản phẩm C: 200g × 1 = 200g (10×10×5cm)

Tính toán:
├─ Weight: 500 + 600 + 200 = 1300g ✓
├─ Length: MAX(20, 15, 10) = 20cm
├─ Width: MAX(20, 15, 10) = 20cm
└─ Height: (20×1) + (10×2) + (5×1) = 45cm

Request GHN:
{
  "service_type_id": 2,
  "from_district_id": 1442,
  "from_ward_code": "21211",
  "to_district_id": 1820,     // TP HCM, Quận 1
  "to_ward_code": "030712",   // Phường Bến Nghé
  "weight": 1300,
  "length": 20,
  "width": 20,
  "height": 45,
  ...
}

Response GHN:
{
  "code": 200,
  "data": {
    "total": 45600,           ← Phí vận chuyển: 45,600 VNĐ
    "service_fee": 45600,
    "insurance_fee": 0,
    ...
  }
}
```

### Ví Dụ 2: Gửi Trong Hà Nội

```
Giỏ hàng:
├─ Sản phẩm A: 300g × 1 = 300g (20×20×20cm)
└─ Sản phẩm B: 400g × 1 = 400g (20×20×20cm)

Tính toán:
├─ Weight: 300 + 400 = 700g → Minimum 1000g = 1000g
├─ Length: MAX(20, 20) = 20cm
├─ Width: MAX(20, 20) = 20cm
└─ Height: (20×1) + (20×1) = 40cm

Request GHN:
{
  ...
  "weight": 1000,     ← Minimum weight applied
  "height": 40,       ← Tính từ sản phẩm
}

Response GHN:
{
  "data": {
    "total": 28500    ← Rẻ hơn vì cùng tỉnh
  }
}
```

---

## 🔄 Luồng Tính Phí Trong App

```
User nhập checkout
│
├─ Select Province
│  └─→ API: getGHNDistricts()
│
├─ Select District
│  ├─→ API: getGHNWards()
│  └─→ API: calculateGHNShippingFee()
│       ├─ Lấy weight/dimensions từ cartItems
│       ├─ Gửi request to GHN
│       └─ Update UI: Phí vận chuyển = X.XXX VNĐ
│
└─ Submit Order
   └─→ Create order with calculated shipping fee
```

---

## 📋 Dữ Liệu GHN Trả Về

### Phí Chi Tiết

```json
{
  "total": 36300,                    // Tổng phí (VNĐ)
  "service_fee": 36300,              // Phí dịch vụ
  "insurance_fee": 0,                // Phí bảo hiểm (nếu có)
  "pick_station_fee": 0,             // Phí lấy hàng tại bưu cục
  "coupon_value": 0,                 // Giá trị mã giảm giá (nếu có)
  "r2s_fee": 0,                      // Phí giao lại hàng
  "document_return": 0,              // Phí giao tài liệu
  "double_check": 0,                 // Phí đồng kiểm
  "cod_fee": 0,                      // Phí thu tiền COD (nếu là COD)
  "pick_remote_areas_fee": 0,        // Phí lấy hàng vùng xa
  "deliver_remote_areas_fee": 0,     // Phí giao hàng vùng xa
  "cod_failed_fee": 0                // Phí giao thất bại
}
```

**Giải thích:**
- **total**: Số tiền duy nhất hiển thị cho user
- Các `*_fee` khác: Chi tiết phí (có thể 0)
- **Tổng = service_fee + all other fees**

---

## 🛍️ Thêm Weight/Dimensions Cho Product

### Trong Database

**Thêm cột cho `products` table:**

```sql
ALTER TABLE products ADD COLUMN weight INT DEFAULT 500;
ALTER TABLE products ADD COLUMN length INT DEFAULT 20;
ALTER TABLE products ADD COLUMN width INT DEFAULT 20;
ALTER TABLE products ADD COLUMN height INT DEFAULT 20;
```

**Giá trị mặc định:**
- weight: 500 grams
- length, width, height: 20 cm

### Trong CartItem Type

```typescript
export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  weight?: number        // grams
  length?: number        // cm
  width?: number         // cm
  height?: number        // cm
}
```

### Khi Thêm Vào Giỏ

```typescript
const cartItem: CartItem = {
  id: product.id,
  product_id: product.id,
  name: product.name,
  price: product.price,
  quantity: 1,
  image_url: product.image_url,
  weight: product.weight || 500,     // Lấy từ product hoặc mặc định
  length: product.length || 20,
  width: product.width || 20,
  height: product.height || 20,
}
```

---

## 🧮 Công Thức GHN Tính Cước

### Với service_type_id = 2 (Hàng Nhẹ)

```
Phí cơ bản = Tính dựa trên:
  1. Weight (khối lượng)
  2. Length × Width × Height (kích thước)
  
Cước = Weight × price_per_gram
    hoặc
Cước = (Length × Width × Height) / 5 × price_per_cm3
       (tùy theo giá trị nào lớn hơn)

+ Phí vùng (nếu là vùng sâu/xa)
+ Phí khác (bảo hiểm, COD, v.v.)
= TOTAL PHẢI TRẢ
```

### Với service_type_id = 5 (Hàng Nặng)

```
Dùng items array chi tiết:
items: [
  {
    name: "Sản phẩm A",
    quantity: 1,
    length: 20,
    width: 20,
    height: 20,
    weight: 500
  },
  ...
]

GHN tính:
- Tổng kích thước = MAX(length), MAX(width), SUM(height)
- Khối lượng quy đổi = (length × width × height) / 5
- Cước dựa trên khối lượng lớn hơn
```

---

## ⚠️ Lỗi Thường Gặp

### 1. "Weight is too large"
**Nguyên nhân**: Weight > 1,600,000 grams (1600kg)
**Giải pháp**: Kiểm tra product weight, phân chia order

### 2. "Invalid dimensions"
**Nguyên nhân**: length, width hoặc height > 200 cm
**Giải pháp**: Kiểm tra kích thước product

### 3. "Cannot find service"
**Nguyên nhân**: 
- service_type_id sai (không phải 2 hay 5)
- from_district_id hoặc to_district_id không hợp lệ
**Giải pháp**: Xác nhận district IDs hợp lệ

### 4. "Token hoặc ShopId sai"
**Nguyên nhân**: .env.local không set đúng
**Giải pháp**: Kiểm tra VITE_GHN_TOKEN và VITE_GHN_SHOP_ID

---

## 🔐 GHN Credentials (Đã Set)

```env
VITE_GHN_TOKEN=c518-c4bb-11ea-be3a-f636b1deefb9
VITE_GHN_SHOP_ID=885
VITE_GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
```

**Cửa hàng:**
- Địa điểm: Hà Nội, Quận Ba Đình
- from_district_id: 1442
- from_ward_code: 21211

---

## 📞 API Tham Khảo

### Calculate Shipping Fee Endpoint

```
POST /shipping-order/fee

Headers:
{
  "Content-Type": "application/json",
  "Token": "c518-c4bb-11ea-be3a-f636b1deefb9",
  "ShopId": "885"
}

Body:
{
  "service_type_id": 2,
  "from_district_id": 1442,
  "from_ward_code": "21211",
  "to_district_id": 1820,
  "to_ward_code": "030712",
  "weight": 1300,
  "length": 20,
  "width": 20,
  "height": 45,
  "insurance_value": 0,
  "coupon": null,
  "items": []  // Empty for service_type_id = 2
}
```

### Response

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "total": 36300,
    "service_fee": 36300,
    "insurance_fee": 0,
    ...
  }
}
```

---

## ✅ Checklist Deploy Với Tính Phí Mới

- [ ] CartItem interface có weight/dimensions ✅
- [ ] CheckoutForm dùng actual weight từ cart ✅
- [ ] GHN API call có weight/dimensions ✅
- [ ] Build successful ✅
- [ ] Git committed ✅
- [ ] Ready to deploy

---

## 🚀 Deploy

```bash
vercel --prod
```

Sau deploy, test:
1. Thêm sản phẩm vào giỏ
2. Checkout → Select tỉnh/quận/xã
3. Xem phí vận chuyển cập nhật (không phải hardcoded)
4. Submit order thành công

---

**Status**: ✅ Tính phí GHN đã được integrate
**Build**: ✅ Thành công
**Ready**: ✅ Ready to deploy

🎉 **Shipping fee calculation ready!**
