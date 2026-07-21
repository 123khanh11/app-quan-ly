# 📸 Chụp Màn Hình Dự Kiến: Hiển Thị Địa Chỉ Giao Hàng

Đây là hình ảnh text mô tả cách app sẽ hiển thị sau khi fix:

---

## 📱 Orders Screen - Trạng Thái Ban Đầu

```
┌─────────────────────────────────────────┐
│         Quản Lý Bán Hàng                │
├─────────────────────────────────────────┤
│  [Tất cả] [Chờ xử lý] [Đang xử lý] ... │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ▼ Đơn hàng #550E8400              │ │
│  │   21/07/2024 10:30                │ │
│  │   1,500,000₫        [Chờ xử lý]   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ▼ Đơn hàng #4A2D5761              │ │
│  │   21/07/2024 09:15                │ │
│  │   2,200,000₫        [Đang xử lý]  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ▼ Đơn hàng #7B1E9F02              │ │
│  │   20/07/2024 14:45                │ │
│  │   800,000₫          [Hoàn thành]  │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📱 Orders Screen - Sau Khi Click Expand

```
┌─────────────────────────────────────────┐
│         Quản Lý Bán Hàng                │
├─────────────────────────────────────────┤
│  [Tất cả] [Chờ xử lý] [Đang xử lý] ... │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ▼ Đơn hàng #550E8400  [EXPANDED]  │ │
│  │   21/07/2024 10:30                │ │
│  │   1,500,000₫        [Chờ xử lý]   │ │
│  ├───────────────────────────────────┤ │
│  │                                   │ │
│  │ 📍 Địa Chỉ Giao Hàng             │ │
│  │                                   │ │
│  │ 🏙️ Tỉnh/Thành phố                │ │
│  │    TP. Hồ Chí Minh                │ │
│  │                                   │ │
│  │ 🏘️ Quận/Huyện                    │ │
│  │    Quận 1                         │ │
│  │                                   │ │
│  │ 🏘️ Xã/Phường                     │ │
│  │    Phường Bến Thành               │ │
│  │                                   │ │
│  │ 🏠 Địa chỉ chi tiết               │ │
│  │    Số 123 Lê Lợi                  │ │
│  │                                   │ │
│  ├───────────────────────────────────┤ │
│  │                                   │ │
│  │ Phí ship:       50,000₫           │ │
│  │ Thanh toán:     COD               │ │
│  │ Ghi chú:        Email: ...        │ │
│  │                 SĐT: 0988888888   │ │
│  │                                   │ │
│  ├───────────────────────────────────┤ │
│  │                                   │ │
│  │ Cập nhật trạng thái               │ │
│  │ [Xử lý] [Hoàn thành] [Hủy]       │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ▼ Đơn hàng #4A2D5761              │ │
│  │   21/07/2024 09:15                │ │
│  │   2,200,000₫        [Đang xử lý]  │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Chi Tiết Từng Phần

### 1. Header (Top)
```
┌─────────────────────────────────────────┐
│    ← Quản Lý Bán Hàng              ≡   │
└─────────────────────────────────────────┘
```

### 2. Filter Tabs
```
┌─────────────────────────────────────────┐
│ [Tất cả] [Chờ xử lý] [Đang xử lý] [Hoàn│
│  thành]                                 │
└─────────────────────────────────────────┘
```

### 3. Order Card (Collapsed)
```
┌─────────────────────────────────────────┐
│ ▼ Đơn hàng #550E8400                    │
│   21/07/2024 10:30                      │
│   1,500,000₫        [Chờ xử lý]         │
└─────────────────────────────────────────┘
```

### 4. Order Card (Expanded) - With Address
```
┌─────────────────────────────────────────┐
│ ▼ Đơn hàng #550E8400                    │
│   21/07/2024 10:30                      │
│   1,500,000₫        [Chờ xử lý]         │
├─────────────────────────────────────────┤
│                                         │
│  📍 Địa Chỉ Giao Hàng                  │
│  ─────────────────────────────────────  │
│                                         │
│  🏙️ Tỉnh/Thành phố                     │
│     TP. Hồ Chí Minh                     │
│                                         │
│  🏘️ Quận/Huyện                        │
│     Quận 1                              │
│                                         │
│  🏘️ Xã/Phường                         │
│     Phường Bến Thành                    │
│                                         │
│  🏠 Địa chỉ chi tiết                    │
│     Số 123 Lê Lợi                       │
│                                         │
├─────────────────────────────────────────┤
│  Phí ship:   50,000₫                   │
│  Thanh toán: COD                        │
│  Ghi chú:    Email: customer@...       │
│             SĐT: 0988888888            │
├─────────────────────────────────────────┤
│  Cập nhật trạng thái:                   │
│  [Xử lý]  [Hoàn thành]  [Hủy]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Luồng Tương Tác

```
Bước 1: User vào Orders tab
        ↓
Bước 2: Thấy danh sách đơn hàng
        ↓
Bước 3: Bấm vào đơn hàng (hoặc click mũi tên)
        ↓
Bước 4: Thấy phần "📍 Địa Chỉ Giao Hàng"
        ↓
Bước 5: Xem chi tiết 4 phần địa chỉ:
        - Tỉnh/Thành phố
        - Quận/Huyện
        - Xã/Phường
        - Địa chỉ chi tiết
        ↓
Bước 6: Xem thêm thông tin order khác
        ↓
Bước 7: Cập nhật trạng thái nếu cần
```

---

## 🎯 Những Phần Mà App Sẽ Hiển Thị

### ✅ Sẽ Hiển Thị
```
📍 Địa Chỉ Giao Hàng
🏙️ Tỉnh/Thành phố: TP. Hồ Chí Minh
🏘️ Quận/Huyện: Quận 1
🏘️ Xã/Phường: Phường Bến Thành
🏠 Địa chỉ chi tiết: Số 123 Lê Lợi

Phí ship: 50,000₫
Thanh toán: COD
Ghi chú: ...

Cập nhật trạng thái
[Xử lý] [Hoàn thành] [Hủy]
```

### ❌ KHÔNG Sẽ Hiển Thị
```
- "Chưa có thông tin địa chỉ" (nếu có data)
- Blank address section
- Null/undefined values
- Form để chỉnh sửa (chỉ xem)
```

---

## 📊 Color Scheme

```
Background:     White / Light Gray
Text:           Dark Gray / Black
Icons:          Color (as per emoji)
Status Badge:   Colored background
  - Pending:    Orange
  - Processing: Blue
  - Completed:  Green
  - Cancelled:  Red
Buttons:
  - Xử lý:      Blue
  - Hoàn thành: Green
  - Hủy:        Red
```

---

## 🎨 Typography

```
Order ID:           Bold, 14px
Date/Time:          Regular, 12px, Gray
Amount:             Bold, 13px, Green
Status Badge:       Bold, 12px, Colored
Section Header:     Medium, 14px
Label (Tỉnh):       Regular, 11px, Gray
Value (TP.HCM):     Bold, 13px
Button Text:        Medium, 14px, White
```

---

## 📱 Layout Structure

```
┌─ SafeArea
│  ├─ Scaffold
│  │  ├─ AppBar
│  │  │  └─ Title: "Quản Lý Bán Hàng"
│  │  │
│  │  └─ Body
│  │     ├─ Column
│  │     │  ├─ FilterChip Row (Horizontal Scroll)
│  │     │  └─ Expanded (Main Content)
│  │     │     ├─ RefreshIndicator
│  │     │     └─ ListView.builder
│  │     │        └─ Each Item:
│  │     │           ├─ Container (Card)
│  │     │           └─ ExpansionTile
│  │     │              ├─ Title Section (Order ID)
│  │     │              ├─ Subtitle (Amount + Status)
│  │     │              └─ Children (Expanded Content)
│  │     │                 ├─ Address Section
│  │     │                 ├─ Info Rows
│  │     │                 └─ Action Buttons
│  │     │
│  │     └─ If No Data:
│  │        └─ Center
│  │           ├─ Icon (Shopping Bag)
│  │           └─ Text: "Chưa có đơn hàng"
└──
```

---

## 📋 Dữ Liệu Mẫu Hiển Thị

### Order 1
```
ID: #550E8400
Date: 21/07/2024 10:30
Amount: 1,500,000₫
Status: Chờ xử lý

Address:
  Province: TP. Hồ Chí Minh
  District: Quận 1
  Ward: Phường Bến Thành
  Detail: Số 123 Lê Lợi

Fee: 50,000₫
Payment: COD
Note: Email: customer@email.com
      SĐT: 0988888888
```

### Order 2
```
ID: #4A2D5761
Date: 21/07/2024 09:15
Amount: 2,200,000₫
Status: Đang xử lý

Address:
  Province: TP. Hồ Chí Minh
  District: Quận 5
  Ward: Phường 1
  Detail: Số 456 Nguyễn Huệ

Fee: 45,000₫
Payment: Banking
Note: Email: another@email.com
      SĐT: 0977777777
```

---

## ✅ Kiểm Tra Khi Nhìn Thấy

Khi nhìn thấy như trên, có nghĩa:

- ✅ App restart thành công
- ✅ Database connection OK
- ✅ Address parsing đúng
- ✅ UI render đúng
- ✅ Format địa chỉ đúng
- ✅ Sẵn sàng deploy

---

**Đây là kết quả cuối cùng sau khi chạy: `flutter clean && flutter pub get && flutter run`**

