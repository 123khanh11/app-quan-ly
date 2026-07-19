# ⚡ BƯỚC TIẾP THEO - CHẠY LÀ THẤY NGAY!

## 🎯 MỤC ĐÍCH
Tính phí vận chuyển GHN một cách chính xác theo địa chỉ khách hàng.

---

## ✅ CÓ GÌ MỚI?

### 1. Backend API Server ✨
- File: `server.ts`
- Chạy trên: `http://localhost:5000`
- Bảo vệ token GHN trên server

### 2. Frontend API Client
- File: `src/services/ghn-api.ts` (MỚI)
- Gọi backend thay vì GHN trực tiếp
- An toàn, không lộ token

### 3. CheckoutForm Cập Nhật
- File: `src/app/components/checkout/CheckoutForm.tsx`
- Sử dụng ghn-api.ts
- Tính phí tự động khi chọn địa chỉ

### 4. Hướng Dẫn Chi Tiết
- File: `TÍNH_PHÍ_VẬN_CHUYỂN.md`

---

## 🚀 CHẠY NGAY

### Terminal 1: Khởi động Backend Server
```bash
npm run server
```

**Kết quả:**
```
📂 Loading environment from: .env.local
   ✓ Token: ✓ Set (653bfc7b...)
   ✓ Shop ID: ✓ Set (5430969)
   ✓ API URL: https://dev-online-gateway.ghn.vn/shiip/public-api/v2

🚀 GHN API Server running on http://localhost:5000

📍 API Endpoints:
   GET  http://localhost:5000/api/ghn/province
   GET  http://localhost:5000/api/ghn/district?province_id=201
   GET  http://localhost:5000/api/ghn/ward?district_id=1450
   GET  http://localhost:5000/api/ghn/service?from_district=1455&to_district=1542
   POST http://localhost:5000/api/ghn/fee

✅ Status: Ready!
```

**⚠️ Giữ terminal này mở!**

---

### Terminal 2: Khởi động Frontend
```bash
npm run dev
```

**Kết quả:**
```
VITE v6.3.5  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

---

## 🧪 KIỂM TRA NGAY

### 1. Test API trong Trình Duyệt

Mở: `http://localhost:5000/api/ghn/province`

Sẽ thấy danh sách tỉnh/thành phố ✅

---

### 2. Test Frontend

Mở: `http://localhost:5173`

1. Chọn sản phẩm
2. Thêm vào giỏ
3. Nhấn "Thanh Toán"
4. Chọn Tỉnh → Quận → Phường
5. **Phí vận chuyển tính tự động** ✨

---

## 📊 VÍ DỤ

Đặt 1 chiếc áo từ Hà Nội giao tới TP. HCM:

```
Chọn địa chỉ:
  Tỉnh: TP. Hồ Chí Minh
  Quận: Quận 1
  Phường: Bến Nghé

Kết quả:
  Tiền hàng:      250.000 VNĐ
  Phí vận chuyển: 36.300 VNĐ (tính từ GHN)
  ─────────────────────────────
  Tổng cộng:      286.300 VNĐ

Nhấn "Đặt Hàng" → Hoàn tất! ✅
```

---

## 🎯 FLOW HOÀN CHỈNH

```
1. Backend Server running
   ↓
2. Frontend Server running
   ↓
3. Customer mở website
   ↓
4. Chọn sản phẩm → Thanh toán
   ↓
5. Chọn địa chỉ
   ↓
6. Frontend → GET /api/ghn/province
   ↓
7. Frontend → GET /api/ghn/district
   ↓
8. Frontend → GET /api/ghn/ward
   ↓
9. Frontend → POST /api/ghn/fee (với weight & dimensions)
   ↓
10. Backend → GHN API (với token)
    ↓
11. GHN trả về phí: 36.300 VNĐ
    ↓
12. Frontend hiển thị phí
    ↓
13. Customer nhấn "Đặt Hàng"
    ↓
14. Backend lưu order vào Supabase
    ↓
15. Hoàn tất! ✅
```

---

## 🔒 BẢO MẬT

✅ Token GHN được bảo vệ:
- Lưu trong `.env.local`
- Đọc từ `process.env` (backend)
- KHÔNG bao giờ gửi sang frontend

✅ Frontend an toàn:
- Chỉ gọi `/api/ghn/*`
- Không có token
- Có thể deploy lên Vercel

---

## 📁 FILES THAY ĐỔI

```
NEW:
  src/services/ghn-api.ts                    ← Frontend API client
  TÍNH_PHÍ_VẬN_CHUYỂN.md                    ← Hướng dẫn chi tiết
  BƯỚC_TIẾP_THEO.md                         ← File này

UPDATED:
  src/app/components/checkout/CheckoutForm.tsx  ← Dùng ghn-api.ts
  server.ts                                  ← Fix types, add error handling
  package.json                               ← Dependencies added

UNCHANGED:
  .env.local                                 ← Credentials an toàn
  src/services/ghn.ts                       ← (keep for reference)
```

---

## 🐛 NẾU CÓ LỖI

### "Cannot connect to backend"
→ Chạy `npm run server` trước
→ Giữ terminal mở

### "Error: Port 5000 already in use"
→ Kill process: `lsof -ti:5000 | xargs kill`
→ Hoặc thay port trong `server.ts`

### "Token missing"
→ Check `.env.local` có `GHN_TOKEN` không
→ Restart server

### Tính phí không chính xác
→ Check district_id & ward_code có đúng không
→ Xem logs backend: `npm run server` output
→ Test với curl (xem `TÍNH_PHÍ_VẬN_CHUYỂN.md`)

---

## 📞 CẦN GIÚP?

Kiểm tra:
1. Server chạy? → Terminal 1
2. Frontend chạy? → Terminal 2
3. .env.local có credentials? → Yes
4. Browser console có lỗi? → F12
5. API respond? → http://localhost:5000/api/ghn/province

---

## 🎉 READY!

**Hệ thống tính phí GHN đã sẵn sàng!**

Chạy ngay:
```bash
# Terminal 1
npm run server

# Terminal 2 (sau vài giây)
npm run dev
```

Mở `http://localhost:5173` → Thử đặt hàng → Xem phí tính tự động ✨

---

**Chúc bạn thành công!** 🚀
