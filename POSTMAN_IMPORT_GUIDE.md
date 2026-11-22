# 📮 HƯỚNG DẪN IMPORT POSTMAN COLLECTION

## 🚀 **Bước 1: Import Collection vào Postman**

### Cách 1: Import từ File
1. Mở **Postman** (tải từ https://www.postman.com/downloads/)
2. Click **File → Import**
3. Chọn tab **File**
4. Click **Upload Files**
5. Chọn file: `POSTMAN_COLLECTION.json`
6. Click **Import**

### Cách 2: Import từ Link (nếu up lên GitHub)
1. Mở **Postman**
2. Click **File → Import**
3. Chọn tab **Link**
4. Paste URL của file `POSTMAN_COLLECTION.json` từ GitHub
5. Click **Import**

---

## 📋 **Bước 2: Setup Environment Variables (Optional)**

1. Postman → Click **Environments** (tay trái)
2. Click **+ Create New Environment**
3. Đặt tên: `Localhost Dev`
4. Thêm variables:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:3000` |
| `ghn_token` | `a2bb6329-1eda-4bb3-9282-01a8a011c1c8` |

5. Click **Save**

---

## ✅ **Bước 3: Chạy Test Cases**

### **Test 1: Health Check**
```
GET http://localhost:3000/api/health
```
✅ Expected: Status 200, trả về `{ "status": "ok", ... }`

---

### **Test 2: Calculate Shipping Fee (Valid)**
```
POST http://localhost:3000/api/shipping-fee
Content-Type: application/json

{
  "to_district_id": 1915,
  "to_ward_code": "1B2101",
  "weight_gram": 5000,
  "length_cm": 20,
  "width_cm": 20,
  "height_cm": 20
}
```
✅ Expected: Status 200, trả về phí vận chuyển (khoảng 46000 VND)

---

### **Test 3: Shipping Fee (Weight < 200g - Error)**
```
POST http://localhost:3000/api/shipping-fee
Content-Type: application/json

{
  "to_district_id": 1915,
  "to_ward_code": "1B2101",
  "weight_gram": 100,
  "length_cm": 20,
  "width_cm": 20,
  "height_cm": 20
}
```
❌ Expected: Status 400, lỗi "Invalid weight: 100g"

---

### **Test 4: Shipping Fee (Missing Parameters)**
```
POST http://localhost:3000/api/shipping-fee
Content-Type: application/json

{
  "weight_gram": 5000
}
```
❌ Expected: Status 400, lỗi "Missing required: to_district_id, to_ward_code"

---

### **Test 5: Get Shipping Order Fee (Valid)**
```
GET http://localhost:3000/api/shipping-order-fee?order_code=LAD8VT
```
✅ Expected: Status 200, trả về chi tiết phí đơn hàng

---

### **Test 6: Get Shipping Order Fee (Missing Parameter)**
```
GET http://localhost:3000/api/shipping-order-fee
```
❌ Expected: Status 400, lỗi "Missing required query parameter: order_code"

---

### **Test 7: Get Shipping Order Fee (Invalid Order Code)**
```
GET http://localhost:3000/api/shipping-order-fee?order_code=INVALID999
```
❌ Expected: Status 404, lỗi "Order code not found"

---

## 📊 **Response Examples**

### ✅ Thành Công - Status 200
```json
{
  "success": true,
  "data": {
    "total": 46000,
    "service_fee": 40000,
    "insurance_fee": 0,
    "cod_fee": 0,
    "pick_station_fee": 0,
    "pick_remote_areas_fee": 0,
    "deliver_remote_areas_fee": 0,
    "coupon_value": 0,
    "r2s_fee": 0,
    "return_again": 0,
    "document_return": 0,
    "double_check": 0,
    "cod_failed_fee": 0,
    "change_to_address_fee": 0,
    "change_return_address_fee": 0,
    "return": 0
  }
}
```

### ❌ Lỗi - Status 400
```json
{
  "success": false,
  "error": "Invalid weight: 100g (must be 200-20000g inclusive)"
}
```

### ❌ Lỗi - Status 404
```json
{
  "success": false,
  "error": "Order code not found: INVALID999"
}
```

---

## 🛠️ **Tips & Tricks**

### 1. **Reuse Variables**
Thay vì hardcode, dùng:
```
{{base_url}}/api/shipping-fee
{{ghn_token}}
```

### 2. **Save Responses**
- Postman tự động save responses
- Click **Save** để lưu kết quả test

### 3. **Run Collection**
- Click **Run** ở collection level
- Postman chạy tất cả test cases theo thứ tự
- Xem results report

### 4. **Write Tests**
Thêm vào tab **Tests** để auto-validate response:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

---

## ✨ **Postman Features**

| Feature | Dùng để |
|---------|--------|
| **Environment** | Lưu variables (base_url, token, etc.) |
| **Pre-request Script** | Setup trước khi gửi request |
| **Tests** | Validate response tự động |
| **Collection Runner** | Chạy nhiều requests lần lượt |
| **Mock Server** | Tạo fake API để test |

---

## 📞 **Troubleshooting**

### ❌ "Cannot connect to localhost:3000"
- ✅ Chạy `npm run api` trong terminal

### ❌ "401 Token is not valid"
- ✅ Check token GHN trong `.env.local`

### ❌ "404 Not Found"
- ✅ Đảm bảo API endpoint đúng

---

**Happy Testing! 🧪**
