# 4️⃣ TEST CASES DESIGN - THIẾT KẾ CÁC TRƯỜNG HỢP KIỂM THỬ
## E-Commerce Website Interface - Comprehensive Test Case Suite

**Ngày Tạo:** 15 Tháng 10, 2026  
**Phiên Bản:** 1.0  
**Tổng Test Cases:** 85 test cases  
**Coverage:** 100% functional requirements + NFR

---

## 📋 MỤC LỤC

- [Tổng Quan](#tổng-quan)
- [FR1: Duyệt Danh Mục](#fr1-duyệt-danh-mục-sản-phẩm)
- [FR2: Chi Tiết Sản Phẩm](#fr2-xem-chi-tiết-sản-phẩm)
- [FR3: Giỏ Hàng](#fr3-quản-lý-giỏ-hàng)
- [FR4: Checkout](#fr4-checkout--chọn-địa-chỉ)
- [FR5: Shipping Fee](#fr5-tính-phí-vận-chuyển)
- [FR6: Payment](#fr6-chọn-phương-thức-thanh-toán)
- [FR7: Order Creation](#fr7-tạo-đơn-hàng)
- [FR8: Order Tracking](#fr8-theo-dõi-đơn-hàng)
- [FR9: Authentication](#fr9-đăng-nhập)
- [FR10: Meta Pixel](#fr10-meta-pixel-tracking)
- [NFR: Non-Functional](#nfr-yêu-cầu-phi-chức-năng)

---

## 📊 Tổng Quan

### Test Case Distribution

| Functionality | # Cases | Positive | Negative | Edge Cases |
|--------------|---------|----------|----------|-----------|
| FR1: Browse | 7 | 4 | 2 | 1 |
| FR2: Detail | 8 | 5 | 2 | 1 |
| FR3: Cart | 8 | 5 | 2 | 1 |
| FR4: Checkout | 10 | 6 | 3 | 1 |
| FR5: Shipping | 9 | 5 | 3 | 1 |
| FR6: Payment | 7 | 4 | 2 | 1 |
| FR7: Order | 10 | 6 | 3 | 1 |
| FR8: Tracking | 7 | 4 | 2 | 1 |
| FR9: Auth | 8 | 4 | 3 | 1 |
| FR10: Pixel | 6 | 4 | 1 | 1 |
| NFR: Performance | 5 | 5 | - | - |
| **TOTAL** | **85** | **52** | **23** | **10** |

### Test Case Template

```
Test Case ID: TC-FR[X]-[Number]
Title: [Clear title]
Module: [FR1-FR10 or NFR]
Priority: High / Medium / Low
Category: Functional / Non-Functional / Integration
Prerequisite: [Pre-conditions]
Test Steps:
  1. [Step 1]
  2. [Step 2]
Expected Result: [What should happen]
Actual Result: [To be filled during execution]
Status: [ ] Pass [ ] Fail
Evidence: [Screenshot / Log]
Notes: [Any notes]
```

---

## ✅ FR1: Duyệt Danh Mục Sản Phẩm

### TC-FR1-001: Load danh sách sản phẩm mặc định
**Title:** Trang chủ load danh sách sản phẩm  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Browser open, no filters selected  
**Test Steps:**
1. Open https://e-commerce-website-interface.vercel.app
2. Wait for page load complete (max 2s)
3. Observe product grid

**Expected Result:**
- Page load < 2 seconds
- Minimum 10 products displayed
- Grid responsive (2-4 columns based on screen size)
- Each product shows: image, name, price
- No console errors

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot attached

---

### TC-FR1-002: Search sản phẩm theo tên
**Title:** Search functionality - positive case  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** On homepage, products loaded  
**Test Steps:**
1. Click search bar
2. Type "áo" (shirt)
3. Wait 500ms for results
4. Verify filtered list

**Expected Result:**
- Search results only show products containing "áo"
- Result count updates correctly
- No unrelated products shown
- Search case-insensitive

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot attached

---

### TC-FR1-003: Search sản phẩm với kết quả rỗng
**Title:** Search with no results  
**Priority:** Medium  
**Category:** Functional (Negative)  
**Prerequisite:** On homepage  
**Test Steps:**
1. Type "xyz123notexist" in search
2. Wait for results

**Expected Result:**
- "Không tìm thấy sản phẩm" message shown
- Grid is empty
- No errors displayed

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot attached

---

### TC-FR1-004: Filter sản phẩm theo danh mục
**Title:** Category filter  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Category menu visible  
**Test Steps:**
1. Click category dropdown
2. Select a category (e.g., "Áo")
3. Observe filtered results

**Expected Result:**
- Only products in selected category shown
- Category badge displayed
- "Xóa bộ lọc" button appears
- Count updated

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot attached

---

### TC-FR1-005: Clear category filter
**Title:** Clear filter button  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Category filter active  
**Test Steps:**
1. Filter by category applied
2. Click "Xóa bộ lọc" button
3. Observe results

**Expected Result:**
- All products displayed again
- Filter badge removed
- Button hidden

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot attached

---

### TC-FR1-006: Product grid responsive
**Title:** Responsive layout on different screen sizes  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Products loaded  
**Test Steps:**
1. Test on mobile (320px width)
2. Test on tablet (768px)
3. Test on desktop (1024px+)
4. Observe grid columns

**Expected Result:**
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 4 columns
- No horizontal scroll
- Readable on all sizes

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshots from 3 devices

---

### TC-FR1-007: Product card hover effect
**Title:** UI interaction - hover effect on product card  
**Priority:** Low  
**Category:** Functional  
**Prerequisite:** Products loaded, desktop browser  
**Test Steps:**
1. Hover over product card
2. Observe visual changes

**Expected Result:**
- Card shadow increases
- Image scale up slightly
- Wishlist button appears
- Smooth transition animation

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

## ✅ FR2: Xem Chi Tiết Sản Phẩm

### TC-FR2-001: Navigate to product detail page
**Title:** Click product → detail page loads  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** On homepage, products visible  
**Test Steps:**
1. Click on any product card
2. Wait for detail page to load

**Expected Result:**
- Page navigates to /products/[product-id]
- Product image loads
- All product info displayed (name, description, price)
- Load time < 1 second
- No 404 errors

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR2-002: Product image gallery
**Title:** Gallery viewer displays correctly  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** On product detail page  
**Test Steps:**
1. Observe main image
2. View thumbnail images below
3. Click thumbnail
4. Verify image changes

**Expected Result:**
- Main image displays
- Thumbnails visible and clickable
- Selected thumbnail highlighted
- Main image updates immediately
- Zoom functionality available

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR2-003: Select variant (color/size)
**Title:** Variant selection changes images  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** On product detail, multiple variants exist  
**Test Steps:**
1. Note current images
2. Select different color (e.g., "Red")
3. Observe image change
4. Select different size
5. Observe image update

**Expected Result:**
- Variant buttons are clickable
- Selected variant highlighted
- All images for that variant load
- Price may update if variant has different price
- Images change immediately

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR2-004: Add to cart button
**Title:** Click "Thêm Vào Giỏ" button  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** On product detail, variant selected  
**Test Steps:**
1. Select color and size
2. Select quantity (e.g., 2)
3. Click "Thêm Vào Giỏ"
4. Observe cart update

**Expected Result:**
- AddToCart event triggered (console log visible)
- Cart badge increments
- Item added to cart with correct quantity
- Color and size preserved
- No page reload
- Notification/confirmation shown

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot, [ ] Console log

---

### TC-FR2-005: Wishlist button (add/remove)
**Title:** Toggle wishlist functionality  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** On product detail page  
**Test Steps:**
1. Click heart icon (wishlist)
2. Observe icon change (filled)
3. Click again (remove from wishlist)
4. Observe icon change (empty)

**Expected Result:**
- Heart icon toggles filled/empty
- Product saved to favorites
- Favorites persisted (localStorage)
- Can view favorites list

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR2-006: Product price display
**Title:** Price information shown correctly  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** On product detail  
**Test Steps:**
1. Observe product price
2. If sale price exists, observe both
3. Check formatting (VND currency)

**Expected Result:**
- Original price displayed
- Sale price (if exists) shown below
- Currency formatted with "đ"
- Numbers formatted with thousands separator
- Sale price crossed out if different

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR2-007: Product not found
**Title:** Invalid product ID handling  
**Priority:** Medium  
**Category:** Functional (Negative)  
**Prerequisite:** Access product with invalid ID  
**Test Steps:**
1. Navigate to /products/invalid-id-12345
2. Observe page response

**Expected Result:**
- 404 error page shown OR
- Redirect to homepage OR
- Error message displayed
- No crash/blank page

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR2-008: Product detail performance
**Title:** Load time measurement  
**Priority:** Medium  
**Category:** Non-Functional (Performance)  
**Prerequisite:** On homepage  
**Test Steps:**
1. Open DevTools Network tab
2. Click product
3. Measure load time

**Expected Result:**
- Page load < 1 second
- Largest content paint < 1s
- No script errors
- Images lazy-loaded

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Network tab screenshot

---

## ✅ FR3: Quản Lý Giỏ Hàng

### TC-FR3-001: Add single item to cart
**Title:** Add product to empty cart  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Cart empty, product selected  
**Test Steps:**
1. Select product and variant
2. Click "Thêm Vào Giỏ"
3. Check cart badge
4. Click cart icon

**Expected Result:**
- Item added to cart
- Cart badge shows "1"
- Cart item shows correct product name, price, quantity
- Total price calculated correctly

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR3-002: Add multiple items to cart
**Title:** Add 3 different products  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Cart empty  
**Test Steps:**
1. Add product A (qty 1)
2. Add product B (qty 2)
3. Add product C (qty 1)
4. View cart

**Expected Result:**
- All 3 items in cart
- Badge shows "4" (total items)
- Correct prices and quantities
- Total calculated correctly (sum of all)

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR3-003: Update item quantity
**Title:** Change quantity of cart item  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Item in cart  
**Test Steps:**
1. View cart
2. Change quantity from 1 to 3
3. Observe total update

**Expected Result:**
- Quantity updated
- Item subtotal updated (price * qty)
- Cart total updated
- Badge updated

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR3-004: Remove item from cart
**Title:** Delete product from cart  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Multiple items in cart  
**Test Steps:**
1. View cart
2. Click delete button on one item
3. Confirm delete

**Expected Result:**
- Item removed from cart
- Cart total updated
- Badge updated
- Remaining items intact

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR3-005: Clear entire cart
**Title:** Clear all items from cart  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Items in cart  
**Test Steps:**
1. Click "Xóa Giỏ" or similar button
2. Confirm

**Expected Result:**
- All items removed
- Cart empty message shown
- Badge hidden or shows 0
- Total = 0

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR3-006: Cart persistence (refresh)
**Title:** Cart saved after page refresh  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Items in cart  
**Test Steps:**
1. Add items to cart
2. Refresh page (F5)
3. Check cart contents

**Expected Result:**
- Cart items still present
- Quantities intact
- Prices correct
- Data loaded from localStorage

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR3-007: Invalid quantity input
**Title:** Handle invalid quantity  
**Priority:** Medium  
**Category:** Functional (Negative)  
**Prerequisite:** Item in cart  
**Test Steps:**
1. Try to enter 0 quantity
2. Try to enter negative number
3. Try to enter text

**Expected Result:**
- Invalid input rejected/prevented
- Quantity remains valid
- Error message shown (optional)
- No crash

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR3-008: Cart total calculation
**Title:** Verify cart total math  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Multiple items with different prices  
**Test Steps:**
1. Add items: Product A (100k x 2), Product B (50k x 1), Product C (75k x 3)
2. Verify total

**Expected Result:**
- Subtotal = (100k*2) + (50k*1) + (75k*3) = 425,000 VND
- Total matches calculation
- Currency formatting correct

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot with calculation

---

## ✅ FR4: Checkout & Chọn Địa Chỉ

### TC-FR4-001: Load checkout form
**Title:** Open checkout page with form fields  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Cart with items, click checkout  
**Test Steps:**
1. Click "Thanh Toán" from cart
2. Wait for checkout page

**Expected Result:**
- Checkout form loads
- All fields displayed (name, email, phone, address dropdowns)
- Form is responsive
- Load time < 1s
- No console errors

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-002: Fill customer info
**Title:** Enter customer information  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Checkout page open  
**Test Steps:**
1. Enter name: "Nguyễn Văn A"
2. Enter email: "test@example.com"
3. Enter phone: "0901234567"

**Expected Result:**
- Fields accept input
- Data displayed correctly
- No validation errors yet
- Fields enabled

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-003: Select province (location cascade)
**Title:** Select province from dropdown  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Checkout form open  
**Test Steps:**
1. Click province dropdown
2. Select "Sơn La"
3. Observe district dropdown

**Expected Result:**
- Province dropdown opens (63 options)
- "Sơn La" selectable
- District dropdown loads with Sơn La districts
- Loading state shown during fetch

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-004: Select district (cascade from province)
**Title:** Select district after province  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Province selected  
**Test Steps:**
1. Province already selected: "Sơn La"
2. Click district dropdown
3. Select "Huyện Mộc Châu"

**Expected Result:**
- District dropdown populated correctly
- "Huyện Mộc Châu" available
- Ward dropdown enabled
- Can proceed

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-005: Select ward (cascade from district)
**Title:** Select ward after district  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** District selected  
**Test Steps:**
1. District selected: "Huyện Mộc Châu"
2. Click ward dropdown
3. Select a ward

**Expected Result:**
- Ward dropdown populated (11,980+ wards)
- Selection updates correctly
- Address detail field enabled

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-006: Enter address details
**Title:** Input street address  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Province, District, Ward selected  
**Test Steps:**
1. Enter address: "123 Đường Lê Lợi"
2. Verify input

**Expected Result:**
- Text field accepts input
- Address displayed correctly
- No character limit issues
- Special characters allowed

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-007: Form validation - required fields
**Title:** Validate required fields  
**Priority:** High  
**Category:** Functional (Validation)  
**Prerequisite:** Checkout form  
**Test Steps:**
1. Leave name field empty
2. Try to submit
3. Observe error message

**Expected Result:**
- Error: "Họ tên không được để trống"
- Form not submitted
- Red border on invalid field
- Focus moved to invalid field

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-008: Email validation
**Title:** Validate email format  
**Priority:** High  
**Category:** Functional (Validation)  
**Prerequisite:** Checkout form  
**Test Steps:**
1. Enter invalid email: "not-an-email"
2. Try to submit

**Expected Result:**
- Error: "Email không hợp lệ"
- Form not submitted
- Suggestion to fix email format

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-009: Phone number validation
**Title:** Validate phone format  
**Priority:** High  
**Category:** Functional (Validation)  
**Prerequisite:** Checkout form  
**Test Steps:**
1. Enter invalid phone: "123"
2. Try to submit

**Expected Result:**
- Error: "SĐT không hợp lệ"
- Phone must be 10-11 digits
- Starting with 0 or +84

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR4-010: All fields required before shipping fee
**Title:** Cannot proceed without complete address  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Some fields empty  
**Test Steps:**
1. Leave province empty
2. Attempt to calculate shipping fee
3. Observe response

**Expected Result:**
- Cannot proceed without all fields
- Error message shown
- Shipping fee not calculated
- User guided to fill remaining fields

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

## ✅ FR5: Tính Phí Vận Chuyển

### TC-FR5-001: Calculate shipping fee - valid address
**Title:** Call GHN API for shipping fee  
**Priority:** High  
**Category:** Integration  
**Prerequisite:** All address fields filled (Sơn La → Hà Nội)  
**Test Steps:**
1. Complete checkout form
2. Submit address
3. Observe shipping fee calculation

**Expected Result:**
- API call made to GHN
- Response received < 300ms
- Shipping fee displayed (e.g., 25,000 VND)
- Included in cart total
- "GHN Express" service shown

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot, [ ] Network tab

---

### TC-FR5-002: Shipping fee updates on address change
**Title:** Recalculate fee when address changes  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Shipping fee calculated  
**Test Steps:**
1. Change destination province (e.g., TP.HCM)
2. Observe shipping fee update

**Expected Result:**
- New fee calculated immediately
- Reflects different distance
- Total price updated
- No manual refresh needed

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR5-003: Shipping fee for all 63 provinces
**Title:** Support all Vietnamese provinces  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Test data available  
**Test Steps:**
1. Select random provinces (min 5): Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ, Quảng Ninh
2. Verify fee calculated for each

**Expected Result:**
- All provinces supported
- No errors for any province
- Fees vary appropriately by distance
- All fees are positive numbers

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshots of 5 provinces

---

### TC-FR5-004: Shipping fee includes weight calculation
**Title:** Fee based on total weight  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Multiple items in cart  
**Test Steps:**
1. Add 1 item (assume 500g) to cart
2. Calculate fee → note amount
3. Add 2 more items (1500g total)
4. Recalculate fee

**Expected Result:**
- Second fee higher than first
- Weight factor applied (min 1kg)
- Fee increases proportionally

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshots with calculations

---

### TC-FR5-005: Shipping fee includes dimension calculation
**Title:** Fee based on dimensions  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Cart with various items  
**Test Steps:**
1. Calculate fee with current items
2. Note dimensions factor

**Expected Result:**
- Large items (oversized) may incur higher fees
- Dimensions checked: 20x20x20cm per item
- Max dimension used for calculation

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR5-006: GHN API error handling
**Title:** Handle GHN API failure  
**Priority:** High  
**Category:** Functional (Error Handling)  
**Prerequisite:** (Simulate API failure or use invalid address)  
**Test Steps:**
1. Enter invalid district/ward combination
2. Attempt to calculate fee

**Expected Result:**
- Error message shown: "Không thể tính phí vận chuyển"
- User instructed to check address
- Form not submitted
- Can retry with correct address

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR5-007: Shipping fee loading state
**Title:** Show loading indicator during calculation  
**Priority:** Medium  
**Category:** Functional (UX)  
**Prerequisite:** Complete checkout form  
**Test Steps:**
1. Submit address for fee calculation
2. Observe loading state (watch network for slow connection)

**Expected Result:**
- Loading spinner/text shown
- "Đang tính phí..." message
- Button disabled during loading
- Cleared when complete

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR5-008: Shipping fee not negative or zero
**Title:** Validate shipping fee is positive  
**Priority:** High  
**Category:** Functional (Validation)  
**Prerequisite:** Any valid address  
**Test Steps:**
1. Calculate shipping fee for any address
2. Verify fee value

**Expected Result:**
- Shipping fee > 0
- Never shows 0 or negative
- Minimum fee enforced by GHN
- Currency formatted correctly (VND)

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR5-009: Performance - fee calculated within target
**Title:** Shipping fee calculation meets performance SLA  
**Priority:** High  
**Category:** Non-Functional (Performance)  
**Prerequisite:** Complete address  
**Test Steps:**
1. Open DevTools Network tab
2. Submit checkout form
3. Measure time to shipping fee response

**Expected Result:**
- API response < 300ms
- Total calculation time < 500ms
- User perceives as instant
- No timeout errors

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Network tab screenshot

---

## ✅ FR6: Chọn Phương Thức Thanh Toán

### TC-FR6-001: Display payment options
**Title:** Payment method selection UI  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Checkout form with calculated fee  
**Test Steps:**
1. Scroll to payment section
2. Observe payment options

**Expected Result:**
- 2 payment methods shown:
  - "Thanh toán khi nhận hàng (COD)"
  - "Chuyển khoản ngân hàng"
- Radio buttons for selection
- Clear descriptions

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR6-002: Select COD payment method
**Title:** Select "Thanh toán khi nhận"  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Payment section visible  
**Test Steps:**
1. Click COD radio button
2. Observe form update

**Expected Result:**
- COD selected (radio filled)
- Bank info section hidden
- "Xác Nhận Đặt Đơn Hàng" button enabled
- No additional fields required

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR6-003: Select Bank Transfer payment method
**Title:** Select "Chuyển khoản ngân hàng"  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Payment section visible  
**Test Steps:**
1. Click Bank Transfer radio button
2. Observe bank info displayed

**Expected Result:**
- Bank Transfer selected
- Bank information shown:
  - Bank name: "Vietcombank"
  - Account: "0721002222333"
  - Holder: "NGUYEN VAN A"
- QR code displayed
- Copy buttons visible

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR6-004: QR code generation
**Title:** Generate QR code for bank transfer  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Bank Transfer selected  
**Test Steps:**
1. Observe QR code display
2. Try to scan QR code with phone

**Expected Result:**
- QR code image displays
- Contains bank account info
- Scannable by mobile banking app
- Links to correct account

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR6-005: Copy account number button
**Title:** Copy to clipboard functionality  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Bank Transfer selected  
**Test Steps:**
1. Click "Copy" button next to account number
2. Paste (Ctrl+V) to verify

**Expected Result:**
- Account number "0721002222333" copied
- Notification shown: "Đã sao chép"
- Can paste in banking app

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR6-006: Copy transfer content button
**Title:** Copy payment content  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Bank Transfer, order created  
**Test Steps:**
1. Click "Copy" button next to transfer content
2. Observe copied text

**Expected Result:**
- Transfer content "DH{OrderID}" copied
- Order ID included
- Can paste into banking app

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR6-007: Payment method cannot be changed after submission
**Title:** Prevent payment method change mid-transaction  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Order submitted  
**Test Steps:**
1. (After order confirmed)
2. Verify payment method is locked

**Expected Result:**
- Payment method shown but not editable
- Prevents fraud/confusion
- Clear read-only display

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

## ✅ FR7: Tạo Đơn Hàng

### TC-FR7-001: Submit valid checkout form
**Title:** Create order with all valid data  
**Priority:** High  
**Category:** Functional/Integration  
**Prerequisite:** Complete checkout form, payment selected  
**Test Steps:**
1. Fill all form fields correctly
2. Select payment method
3. Click "Xác Nhận Đặt Đơn Hàng"
4. Wait for submission

**Expected Result:**
- Order created successfully
- Unique Order ID generated
- Redirect to confirmation page
- Order data saved in database
- fbp + fbc captured and saved

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot, [ ] Console log

---

### TC-FR7-002: Order saved in database
**Title:** Verify order record created  
**Priority:** High  
**Category:** Integration  
**Prerequisite:** Order submitted  
**Test Steps:**
1. (In Supabase dashboard)
2. Query orders table
3. Find newly created order

**Expected Result:**
- Order record exists with:
  - Unique id (UUID)
  - user_id (if logged in)
  - total amount
  - shipping_fee
  - payment_method (cod / bank_transfer)
  - order_status (pending)
  - customer info (name, email, phone)
  - fbp (Meta Pixel ID)
  - fbc (Facebook Click ID)
  - timestamps

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Supabase screenshot

---

### TC-FR7-003: Order items saved in database
**Title:** Verify order_items records created  
**Priority:** High  
**Category:** Integration  
**Prerequisite:** Order submitted  
**Test Steps:**
1. (In Supabase)
2. Query order_items table
3. Filter by order_id

**Expected Result:**
- Multiple order_item records created
- Each item contains:
  - order_id (FK)
  - product_id, variant_id
  - product_name, quantity, price
  - color, size, sku
- Matches cart contents

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Supabase screenshot

---

### TC-FR7-004: Meta Pixel Lead event tracked
**Title:** Lead event fired with fbp + fbc  
**Priority:** High  
**Category:** Integration (Meta Pixel)  
**Prerequisite:** Order submitted  
**Test Steps:**
1. Open DevTools Console
2. Look for Lead event log
3. Verify fbp + fbc included

**Expected Result:**
- Console log: "🔔 [Meta Pixel] Tracking Lead event..."
- Lead event fired with:
  - value: order total
  - currency: "VND"
  - fbp: captured from cookie
  - fbc: captured from URL/storage
- Data matches order

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Console screenshot

---

### TC-FR7-005: fbp captured and saved
**Title:** Facebook Pixel ID in orders table  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Order created  
**Test Steps:**
1. Check orders.fbp field
2. Verify format: fb.1.xxx

**Expected Result:**
- fbp captured from _fbp cookie
- Format: "fb.1.{pixel_id}.{user_id}"
- Saved to database
- Not NULL in order record

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Supabase screenshot

---

### TC-FR7-006: fbc captured and saved
**Title:** Facebook Click ID in orders table  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Order created  
**Test Steps:**
1. Check orders.fbc field
2. Verify format or value

**Expected Result:**
- fbc captured from fbclid URL parameter
- If no fbclid: may be NULL or empty
- If fbclid present: format "fb.1.xxx"
- Saved to database

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Supabase screenshot

---

### TC-FR7-007: Order confirmation page
**Title:** Display order success  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Order submitted  
**Test Steps:**
1. After submission, observe page
2. Note displayed information

**Expected Result:**
- Confirmation page shown
- Order ID displayed prominently
- Order summary with items
- Total amount with shipping
- Payment method
- Delivery address
- Estimated delivery info
- "Continue Shopping" button

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR7-008: Cart cleared after order
**Title:** Cart emptied after successful order  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Order submitted  
**Test Steps:**
1. Click "Continue Shopping"
2. Check cart icon

**Expected Result:**
- Cart badge hidden or shows 0
- Cart is empty
- User can start new shopping

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR7-009: Order missing required field validation
**Title:** Prevent order creation with missing data  
**Priority:** High  
**Category:** Functional (Validation)  
**Prerequisite:** (Programmatically remove required field)  
**Test Steps:**
1. Try to submit form without name
2. Attempt submit

**Expected Result:**
- Error message: "Vui lòng điền [field name]"
- Order not created
- User redirected to fix errors

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR7-010: Order ID uniqueness
**Title:** Each order has unique ID  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Multiple orders submitted  
**Test Steps:**
1. Create order A → OrderID_1
2. Create order B → OrderID_2
3. Compare IDs

**Expected Result:**
- OrderID_1 ≠ OrderID_2
- All IDs unique
- UUID format
- No duplicates

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Supabase screenshot

---

## ✅ FR8: Theo Dõi Đơn Hàng

### TC-FR8-001: Access order tracking
**Title:** Navigate to order history page  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Logged in, orders exist  
**Test Steps:**
1. Click "Đơn Hàng" in header
2. Navigate to order tracking page

**Expected Result:**
- Order tracking page loads
- List of all user's orders shown
- Load time < 1s

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR8-002: Display order list
**Title:** Show all user orders  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** User has 3+ orders  
**Test Steps:**
1. Go to order tracking
2. Observe order list

**Expected Result:**
- All orders displayed
- Each order shows: ID, date, total, status
- Sorted by date (newest first)
- Clickable for details

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR8-003: View order detail
**Title:** Click order to view full details  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Order tracking page  
**Test Steps:**
1. Click on an order
2. View detail page

**Expected Result:**
- Detail page loads
- Shows: Order ID, date, items, prices
- Delivery address
- Shipping fee
- Payment method
- Order status
- Load time < 1s

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR8-004: Order status display
**Title:** Show order current status  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Order detail page  
**Test Steps:**
1. Observe order status
2. Note status badge

**Expected Result:**
- Status badge shown (color-coded):
  - Pending: Yellow
  - Processing: Blue
  - Shipped: Orange
  - Delivered: Green
- Status text clear
- Timeline of status changes (if available)

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR8-005: Filter orders by status
**Title:** Filter order list  
**Priority:** Medium  
**Category:** Functional  
**Prerequisite:** Multiple orders with different statuses  
**Test Steps:**
1. Filter by "Pending"
2. Only pending orders shown
3. Filter by "Delivered"
4. Only delivered shown

**Expected Result:**
- Filter dropdown available
- Only selected status shown
- Count updated
- "All" option available

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshots

---

### TC-FR8-006: Order items detail in order tracking
**Title:** List all items in order  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Order detail page  
**Test Steps:**
1. View order detail
2. Scroll to items section

**Expected Result:**
- Each item shows: product image, name, color, size, qty, price
- Subtotal for each item
- Can link to product

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR8-007: No orders message
**Title:** Show message when no orders  
**Priority:** Low  
**Category:** Functional  
**Prerequisite:** New user, no orders  
**Test Steps:**
1. New account, go to order tracking
2. Observe page

**Expected Result:**
- "Bạn chưa có đơn hàng nào" message
- Empty state icon
- Link to shop

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

## ✅ FR9: Đăng Nhập

### TC-FR9-001: Open login modal
**Title:** Click login button  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** On homepage, not logged in  
**Test Steps:**
1. Click "Đăng Nhập" button
2. Observe modal

**Expected Result:**
- Login modal opens
- Google OAuth button visible
- Email/password inputs (if applicable)
- Close button available

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR9-002: Google OAuth login flow
**Title:** Login with Google account  
**Priority:** High  
**Category:** Functional/Integration  
**Prerequisite:** Login modal open  
**Test Steps:**
1. Click "Đăng Nhập với Google"
2. Google popup opens
3. Select account (qa.test1@gmail.com)
4. Authorize app

**Expected Result:**
- Google popup opens
- Account selection shown
- Permission request shown
- Redirects back to app
- User logged in

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR9-003: User info displayed after login
**Title:** Show username in header  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Successfully logged in  
**Test Steps:**
1. Look at header
2. Find user name display

**Expected Result:**
- User name shown: "QA Test User 1"
- User avatar (if applicable)
- Account dropdown menu
- Logout button

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR9-004: Session persistence (refresh)
**Title:** Session remains after page refresh  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Logged in  
**Test Steps:**
1. Login successfully
2. Refresh page (F5)
3. Check login status

**Expected Result:**
- Session token persists
- Still logged in after refresh
- User name still displayed
- No re-login required

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR9-005: Logout functionality
**Title:** Logout from account  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Logged in  
**Test Steps:**
1. Click user menu
2. Click "Đăng Xuất"
3. Observe page

**Expected Result:**
- Session terminated
- Redirected to homepage
- Login button visible
- User info hidden

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR9-006: Protected route - order tracking
**Title:** Cannot access order tracking without login  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Logged out  
**Test Steps:**
1. Not logged in
2. Try to access /order-tracking
3. Observe redirect

**Expected Result:**
- Redirected to login
- Or login modal opens
- After login: redirected to order tracking

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-FR9-007: User data isolated
**Title:** Cannot see other user's orders  
**Priority:** High  
**Category:** Security / Functional  
**Prerequisite:** (Database level test)  
**Test Steps:**
1. Login as User A
2. Check Row Level Security
3. Verify User B's data not accessible

**Expected Result:**
- RLS policy enforces user_id = auth.uid()
- User A cannot query User B's orders
- Database query returns empty
- No data leak

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Supabase policy screenshot

---

### TC-FR9-008: Login form validation
**Title:** Prevent empty login  
**Priority:** Medium  
**Category:** Functional (Validation)  
**Prerequisite:** Login modal open  
**Test Steps:**
1. (If email/password form exists)
2. Try to submit empty form

**Expected Result:**
- Error message
- Form not submitted
- Focus to first field

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

## ✅ FR10: Meta Pixel Tracking

### TC-FR10-001: Pixel script loaded
**Title:** Meta Pixel SDK initialized  
**Priority:** High  
**Category:** Functional/Integration  
**Prerequisite:** Page loaded  
**Test Steps:**
1. Open DevTools
2. Check Network tab for fbq script

**Expected Result:**
- fbq script loaded from cdn
- No errors in console
- `fbq` function available globally
- Pixel ID: 1823205972392139

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Console/Network screenshot

---

### TC-FR10-002: PageView event tracked
**Title:** Automatic PageView event on each page  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Page loaded  
**Test Steps:**
1. Load homepage
2. Check DevTools Console
3. Look for PageView log

**Expected Result:**
- Console log: "fbq('track', 'PageView')"
- No errors
- Fired automatically
- Can see in Meta Events Manager

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Console screenshot

---

### TC-FR10-003: AddToCart event with fbp + fbc
**Title:** Track AddToCart with Meta IDs  
**Priority:** High  
**Category:** Functional/Integration  
**Prerequisite:** Product in cart, DevTools open  
**Test Steps:**
1. Click "Thêm Vào Giỏ"
2. Check console

**Expected Result:**
- Console log: "🛒 [Meta Pixel] Tracking AddToCart with fbp + fbc"
- Event data includes: product name, price, quantity, color, size
- fbp captured (format: fb.1.xxx)
- fbc captured (if fbclid in URL)
- No errors

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Console screenshot

---

### TC-FR10-004: fbp captured from _fbp cookie
**Title:** Extract Facebook Pixel ID  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Page loaded, DevTools open  
**Test Steps:**
1. Go to Application → Cookies
2. Find _fbp cookie
3. Note value
4. Compare to console log

**Expected Result:**
- _fbp cookie exists
- Format: "fb.1.[timestamp].[random]"
- Matches fbp in console logs
- Persists across page loads

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Cookie screenshot, Console log

---

### TC-FR10-005: fbc captured from fbclid URL parameter
**Title:** Extract Facebook Click ID  
**Priority:** High  
**Category:** Functional  
**Prerequisite:** Visited from Facebook ad (fbclid in URL)  
**Test Steps:**
1. Access site with ?fbclid=fb.1.xxx parameter
2. Check console for fbc value

**Expected Result:**
- fbc captured from URL parameter
- Format: "fb.1.xxx"
- Stored in localStorage (optional)
- Sent with Lead event

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] URL bar screenshot, Console log

---

### TC-FR10-006: fbp + fbc saved in orders table
**Title:** Database persistence of Meta IDs  
**Priority:** High  
**Category:** Integration  
**Prerequisite:** Order created via checkout  
**Test Steps:**
1. Create order
2. Check Supabase orders table
3. Inspect fbp and fbc columns

**Expected Result:**
- orders.fbp not NULL
- orders.fbc not NULL (or may be NULL if no fbclid)
- Values match console logs
- Indexed for performance

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Supabase screenshot

---

## ✅ NFR: Yêu Cầu Phi Chức Năng

### TC-NFR-001: Page load time
**Title:** Measure homepage load time  
**Priority:** High  
**Category:** Performance  
**Prerequisite:** None  
**Test Steps:**
1. Open DevTools Lighthouse
2. Run performance audit
3. Note metrics

**Expected Result:**
- Largest Contentful Paint (LCP) < 2 seconds
- First Contentful Paint (FCP) < 1 second
- Time to Interactive < 2 seconds
- Lighthouse score > 80

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Lighthouse screenshot

---

### TC-NFR-002: API response time
**Title:** Measure API endpoint response  
**Priority:** High  
**Category:** Performance  
**Prerequisite:** API accessible  
**Test Steps:**
1. Open Network tab
2. Trigger API calls (GHN, orders)
3. Note response times

**Expected Result:**
- Shipping fee API < 300ms
- Order creation API < 500ms
- Database queries < 100ms
- 95th percentile < 500ms

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Network tab screenshot

---

### TC-NFR-003: Bundle size
**Title:** Measure frontend bundle size  
**Priority:** Medium  
**Category:** Performance  
**Prerequisite:** Build created  
**Test Steps:**
1. Check build output
2. Note gzipped size

**Expected Result:**
- Gzipped bundle < 150KB
- Uncompressed < 500KB
- No bloated dependencies

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Build output screenshot

---

### TC-NFR-004: Mobile responsiveness
**Title:** Test on mobile device (320px)  
**Priority:** High  
**Category:** Responsive Design  
**Prerequisite:** Mobile device or emulator  
**Test Steps:**
1. Set viewport to 320px width
2. Test all pages (home, detail, checkout, cart)
3. Check usability

**Expected Result:**
- Layout adapts to mobile
- No horizontal scroll
- Buttons/inputs touch-friendly
- Images scale appropriately
- Text readable

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshots from 320px

---

### TC-NFR-005: Tablet responsiveness
**Title:** Test on tablet (768px)  
**Priority:** High  
**Category:** Responsive Design  
**Prerequisite:** Tablet device or emulator  
**Test Steps:**
1. Set viewport to 768px
2. Check layout
3. Verify columns and spacing

**Expected Result:**
- 3-column grid on product page
- Optimal spacing for tablet
- All content visible without scroll
- Navigation accessible

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshots from 768px

---

### TC-NFR-006: Browser compatibility - Chrome
**Title:** Test on Chrome browser  
**Priority:** High  
**Category:** Browser Compatibility  
**Prerequisite:** Chrome installed  
**Test Steps:**
1. Open site in Chrome (latest)
2. Test all features
3. Check console for errors

**Expected Result:**
- All features work
- No console errors
- Performance acceptable
- Layout correct

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot, Console log

---

### TC-NFR-007: Browser compatibility - Firefox
**Title:** Test on Firefox browser  
**Priority:** High  
**Category:** Browser Compatibility  
**Prerequisite:** Firefox installed  
**Test Steps:**
1. Open site in Firefox (latest)
2. Test key flows (browse, checkout)
3. Check compatibility

**Expected Result:**
- All features work
- No major issues
- Layout renders correctly
- CSS/JS compatible

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-NFR-008: Browser compatibility - Safari
**Title:** Test on Safari browser  
**Priority:** High  
**Category:** Browser Compatibility  
**Prerequisite:** Safari installed (Mac/iOS)  
**Test Steps:**
1. Open site in Safari (latest)
2. Test core flows
3. Verify layout and functionality

**Expected Result:**
- Forms work correctly
- Payment flow works
- No CSS anomalies
- JavaScript executes

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot

---

### TC-NFR-009: Input validation security
**Title:** SQL injection prevention  
**Priority:** High  
**Category:** Security  
**Prerequisite:** Forms available  
**Test Steps:**
1. Try SQL injection: `" OR "1"="1`
2. Try XSS: `<script>alert('XSS')</script>`
3. Verify sanitization

**Expected Result:**
- Input sanitized
- No SQL injection executed
- Scripts not executed
- Error message shown
- Data safely stored

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Screenshot, Database check

---

### TC-NFR-010: HTTPS/SSL enforcement
**Title:** Verify HTTPS only  
**Priority:** High  
**Category:** Security  
**Prerequisite:** Site URL  
**Test Steps:**
1. Try http://... URL
2. Check if redirects to https://
3. Check SSL certificate

**Expected Result:**
- HTTP redirects to HTTPS
- SSL certificate valid
- No mixed content warnings
- Secure connection indicator

**Actual Result:** [ ] Pass [ ] Fail  
**Evidence:** [ ] Address bar screenshot

---

## 📊 Test Case Summary

**Total Test Cases:** 85

| Category | Count | Pass/Fail |
|----------|-------|-----------|
| Functional (FR1-FR10) | 65 | [ ] / [ ] |
| Non-Functional (NFR) | 10 | [ ] / [ ] |
| Integration | 10 | [ ] / [ ] |
| **TOTAL** | **85** | **[ ] / [ ]** |

---

## 🎯 Test Execution Notes

**Format for Recording Results:**
- [ ] Pass = All steps executed, expected result matched
- [ ] Fail = Step failed or unexpected result
- [ ] Blocked = Cannot execute (environment issue)
- [ ] N/A = Not applicable

**Evidence Requirements:**
- Screenshot for UI tests
- Network tab for API tests
- Console log for JavaScript tests
- Database query result for DB tests

---

**Test Case Suite Status:** ✅ **Ready for Execution**

**Next Phase:** Execute test cases (File 5: TEST_EXECUTION_AND_BUG_REPORT.md)

---

**Prepared By:** QA Team  
**Date:** 15 October 2026  
**Version:** 1.0
