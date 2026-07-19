# ✅ Test Checklist - E-Commerce Website

## 🔍 Kiểm Tra Trước Khi Deploy

### 1️⃣ Setup & Installation

- [ ] `npm install` chạy thành công
- [ ] Không có dependency errors
- [ ] Node version >= 18
- [ ] Supabase connection file tồn tại

### 2️⃣ Local Development

- [ ] `npm run dev` chạy thành công
- [ ] Website accessible tại `http://localhost:5173`
- [ ] Không có TypeScript errors
- [ ] Không có console errors ban đầu

### 3️⃣ Build

- [ ] `npm run build` chạy thành công
- [ ] Dist folder được tạo
- [ ] Không có build errors
- [ ] Build size reasonable (< 500KB)

---

## 🏪 Shop Features Testing

### Navigation
- [ ] Logo click đưa về trang chủ
- [ ] Header buttons hoạt động
- [ ] Responsive trên mobile/tablet

### Product Listing
- [ ] Sản phẩm load từ Supabase
- [ ] Grid layout hiển thị đúng
- [ ] Images load correctly
- [ ] Descriptions visible

### Search
- [ ] Search bar visible
- [ ] Search filter hoạt động
- [ ] Results update realtime
- [ ] Empty state khi không có kết quả

### Wishlist
- [ ] Heart icon visible trên hover
- [ ] Click heart = add to wishlist
- [ ] Heart turns filled/red
- [ ] Wishlist lưu trong localStorage

---

## 🛒 Cart Features Testing

### Add to Cart
- [ ] "Thêm Vào Giỏ" button visible
- [ ] Click button = add to cart
- [ ] Cart count updates
- [ ] Alert shows after add
- [ ] Can add multiple items

### View Cart
- [ ] Click cart icon → show cart page
- [ ] Cart items display correctly
- [ ] Product images visible
- [ ] Prices correct

### Cart Operations
- [ ] Increment quantity: click + button
- [ ] Decrement quantity: click - button
- [ ] Direct input quantity works
- [ ] Remove button works
- [ ] Clear all button works

### Cart Persistence
- [ ] Refresh page → cart remains
- [ ] Close browser → cart remains
- [ ] Clear cache → cart clears

### Cart Totals
- [ ] Subtotal correct
- [ ] Shipping fee: 50,000đ
- [ ] Total = Subtotal + Shipping
- [ ] Numbers formatted correctly (vi-VN)

---

## 💳 Checkout Testing

### Form Validation
- [ ] Email field required
- [ ] Phone field required
- [ ] Address field required
- [ ] Note optional
- [ ] Error messages show

### Form Submission
- [ ] Bấm "Đặt Hàng" button
- [ ] Loading state shows
- [ ] No submit if required fields empty

### Order Creation
- [ ] Order created in Supabase
- [ ] Order has unique ID
- [ ] Order items added correctly
- [ ] Quantities correct
- [ ] Prices correct

### Post-Checkout
- [ ] Success message shows
- [ ] Order ID displayed
- [ ] Cart clears after checkout
- [ ] Redirect to tracking page (auto or manual)

---

## 📦 Order Tracking Testing

### Access Tracking
- [ ] Can access via order ID
- [ ] URL format correct
- [ ] Page loads correctly

### Display Information
- [ ] Order ID visible
- [ ] Order date shown
- [ ] Shipping address visible
- [ ] Email & phone visible
- [ ] Note visible (if provided)

### Status Timeline
- [ ] Timeline displays all steps
- [ ] Current step highlighted
- [ ] Icons visible & correct
- [ ] Connecting lines visible

### Order Items
- [ ] All items listed
- [ ] Quantities correct
- [ ] Prices correct
- [ ] Totals calculated right

### Payment Info
- [ ] Payment method shown (cash/transfer)
- [ ] Payment status shown (pending/paid)
- [ ] Final total correct

---

## 🎨 UI/UX Testing

### Responsive Design
- [ ] Mobile (320px): layouts stack
- [ ] Tablet (768px): 2-column layouts
- [ ] Desktop (1024px): full layouts
- [ ] No horizontal scrolling
- [ ] All content readable

### Colors & Typography
- [ ] Text readable (contrast good)
- [ ] Font sizes appropriate
- [ ] Primary color (orange) used correctly
- [ ] Buttons distinct from text

### Interactions
- [ ] Buttons have hover states
- [ ] Links have hover states
- [ ] Transitions smooth
- [ ] No jumpy layouts

### Accessibility
- [ ] Can tab through interactive elements
- [ ] Buttons have text/labels
- [ ] Images have alt text (check console)
- [ ] No color-only indicators

---

## 🔌 API Testing

### Supabase Connection
- [ ] Can connect to Supabase
- [ ] Credentials correct
- [ ] Tables accessible

### Data Retrieval
- [ ] getProducts() returns data
- [ ] Product IDs correct
- [ ] Prices numeric
- [ ] Images are URLs

### Data Creation
- [ ] createOrder() works
- [ ] Returns order with ID
- [ ] addOrderItem() works
- [ ] Data saved to database

### Data Retrieval (Orders)
- [ ] getOrderDetails() works
- [ ] Returns order + items
- [ ] Order data complete
- [ ] Items data complete

---

## ⚠️ Error Handling Testing

### Network Errors
- [ ] Supabase down → show error
- [ ] No internet → show error
- [ ] Timeout → show error

### Validation Errors
- [ ] Empty form → show required
- [ ] Invalid email → show error
- [ ] Invalid phone → show error

### Data Errors
- [ ] No products → show empty state
- [ ] Order not found → show error
- [ ] Database error → show error

---

## 🔒 Security Testing

### Data Protection
- [ ] Cart data in localStorage (OK - no sensitive)
- [ ] No passwords stored
- [ ] No credit cards stored
- [ ] Supabase key is anon key (OK)

### Input Validation
- [ ] XSS prevention (inputs escaped)
- [ ] SQL injection prevention (use Supabase)
- [ ] CSRF tokens (Supabase handles)

### HTTPS
- [ ] Site uses HTTPS (after deploy)
- [ ] No mixed content warnings

---

## 📊 Performance Testing

### Load Time
- [ ] Initial page load < 3s
- [ ] Products load < 2s
- [ ] Cart operations instant
- [ ] Checkout form responsive

### Network
- [ ] Check Network tab
- [ ] No unnecessary requests
- [ ] API calls optimized
- [ ] Images optimized

### Bundle Size
- [ ] npm run build shows size
- [ ] JS bundle < 400KB
- [ ] CSS bundle < 150KB

---

## 🌐 Cross-Browser Testing

- [ ] Chrome/Edge: ✅ All features
- [ ] Firefox: ✅ All features
- [ ] Safari: ✅ All features
- [ ] Mobile Chrome: ✅ All features
- [ ] Mobile Safari: ✅ All features

---

## 📱 Mobile-Specific Testing

### Screen Sizes
- [ ] iPhone 12 (390px)
- [ ] iPad (768px)
- [ ] Android phone (360px)

### Touch Interactions
- [ ] Buttons easily tappable (48px+)
- [ ] No hover-dependent features
- [ ] Swipe gestures work (if any)

### Mobile Performance
- [ ] Page loads on 4G
- [ ] No lag when scrolling
- [ ] Images not too large

---

## 🎯 Business Logic Testing

### Shopping Flow
- [ ] User can browse products
- [ ] User can add to cart
- [ ] User can checkout
- [ ] Order created successfully
- [ ] User can track order

### Data Consistency
- [ ] Cart total = sum of items
- [ ] Order total = subtotal + shipping
- [ ] Product prices consistent
- [ ] Order items match cart items

### Edge Cases
- [ ] Add same product twice → quantity increases
- [ ] Quantity 1 → remove → cart empty
- [ ] Very long address → text wraps
- [ ] Special characters in note → saved correctly

---

## 🔄 Database Testing

### CRUD Operations

**Create:**
- [ ] Insert order works
- [ ] Insert order_items works
- [ ] All fields saved

**Read:**
- [ ] Select products works
- [ ] Select orders works
- [ ] Select order_items works

**Update:**
- [ ] Update order_status works
- [ ] Update payment_status works

**Delete:**
- [ ] Delete from cart (localStorage) works

### Data Integrity
- [ ] Foreign keys work (order_id → order exists)
- [ ] Required fields present
- [ ] Data types correct
- [ ] Timestamps auto-generated

---

## 📝 Final Checklist

- [ ] All test checkboxes checked
- [ ] No console errors
- [ ] No console warnings (except minor)
- [ ] Build succeeds
- [ ] All pages accessible
- [ ] All features working
- [ ] Responsive on all devices
- [ ] Ready to deploy

---

## 🚀 Deployment Pre-Check

- [ ] Git repo ready
- [ ] GitHub remote configured
- [ ] Code committed
- [ ] No uncommitted changes
- [ ] Vercel account ready
- [ ] Environment variables prepared
- [ ] Database backups taken
- [ ] README updated

---

## 📊 Test Results

| Feature | Status | Notes |
|---------|--------|-------|
| ShopHome | ❌🟡✅ | |
| Cart | ❌🟡✅ | |
| Checkout | ❌🟡✅ | |
| OrderTracking | ❌🟡✅ | |
| Supabase API | ❌🟡✅ | |
| Responsive | ❌🟡✅ | |
| Performance | ❌🟡✅ | |
| Security | ❌🟡✅ | |

---

## 🐛 Issues Found

| ID | Issue | Severity | Status | Fix |
|----|-------|----------|--------|-----|
| 1 | | High/Med/Low | Open/In Progress/Closed | |
| 2 | | High/Med/Low | Open/In Progress/Closed | |
| 3 | | High/Med/Low | Open/In Progress/Closed | |

---

## ✅ Sign-Off

- Tested by: ________________
- Date: ________________
- Ready for deployment: ✅ Yes / ❌ No

**Notes:**

```

```

---

**Test Completed:** ________________  
**Status:** ✅ Ready / 🟡 Needs Work / ❌ Not Ready
