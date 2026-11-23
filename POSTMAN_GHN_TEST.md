# Postman Test Cases - GHN Shipping Fee API

## Setup

**URL**: `http://localhost:3000/api/shipping-fee` (local) hoặc Vercel URL

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

---

## Test Case 1: Light Weight (5kg) - Hà Nội nội thành
✅ **Expected**: Success, fee ~20k-40k VNĐ

```json
{
  "to_district_id": 1954,
  "to_ward_code": "20308",
  "weight_gram": 5000,
  "length_cm": 20,
  "width_cm": 20,
  "height_cm": 20,
  "service_type_id": 2
}
```

---

## Test Case 2: Medium Weight (10kg) - Hà Nội
✅ **Expected**: Success, fee ~30k-50k VNĐ

```json
{
  "to_district_id": 1954,
  "to_ward_code": "20308",
  "weight_gram": 10000,
  "service_type_id": 2
}
```

---

## Test Case 3: Heavy Weight (20kg) - Hà Nội nội thành
✅ **Expected**: Success, fee ~50k-80k VNĐ

```json
{
  "to_district_id": 1954,
  "to_ward_code": "20308",
  "weight_gram": 20000,
  "service_type_id": 5
}
```

---

## Test Case 4: Heavy Weight (25kg) - Different Ward
✅ **Expected**: Success or fallback fee

```json
{
  "to_district_id": 1954,
  "to_ward_code": "21616",
  "weight_gram": 25000,
  "service_type_id": 5
}
```

---

## Test Case 5: Auto Service Type Detection
✅ **Expected**: Auto-select service_type=5 (weight >= 20kg)

```json
{
  "to_district_id": 1954,
  "to_ward_code": "20308",
  "weight_gram": 20000
}
```

---

## Test Case 6: Invalid Weight (0)
❌ **Expected**: Error 400

```json
{
  "to_district_id": 1954,
  "to_ward_code": "20308",
  "weight_gram": 0,
  "service_type_id": 2
}
```

---

## Test Case 7: Different District
✅ **Expected**: Success or fallback

```json
{
  "to_district_id": 1456,
  "to_ward_code": "20309",
  "weight_gram": 15000,
  "service_type_id": 2
}
```

---

## Troubleshooting

**Nếu bị lỗi "Cân nặng không hợp lệ"**:
1. Thử test case 1 trước (light weight, Hà Nội nội thành)
2. Nếu OK → vấn đề ở ward khác
3. Nếu vẫn fail → liên hệ GHN support

**Nếu bị lỗi "Tài khoản không thuộc cửa hàng"**:
- Token/Shop ID không khớp
- Cần update Vercel environment variables

