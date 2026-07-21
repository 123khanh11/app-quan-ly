# ✅ Setup & Configuration Checklist

## 📋 Pre-Setup

- [ ] Node.js installed (v18+)
- [ ] npm or yarn available
- [ ] Supabase account created
- [ ] Git installed (optional)

---

## 🔧 Step 1: Project Setup

- [ ] Navigate to project folder
- [ ] Run `npm install`
- [ ] Verify no errors in console

```bash
cd "app quản ly"
npm install
```

---

## 🗄️ Step 2: Supabase Configuration

### 2.1 Create Tables

- [ ] Login to Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Create `categories` table
- [ ] Create `products` table
- [ ] Create `orders` table
- [ ] Create `order_items` table

**SQL Template:**
```sql
-- See DATABASE_SCHEMA.sql for full schema
```

### 2.2 Get API Keys

- [ ] Go to Settings → API
- [ ] Copy Project URL
- [ ] Copy Anon Public Key

---

## 🌐 Step 3: Environment Configuration

### 3.1 Create .env File

- [ ] Create `.env` in project root (copy from `.env.example`)
- [ ] Add VITE_SUPABASE_URL
- [ ] Add VITE_SUPABASE_KEY

```bash
# Create .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

### 3.2 Verify Configuration

- [ ] Check `.env` file exists
- [ ] Verify values are not empty
- [ ] No quotes around values
- [ ] Save file

---

## 🔐 Step 4: Authentication Setup

### 4.1 Create Users

- [ ] Go to Supabase Auth section
- [ ] Create test user for login testing
  - Email: `test@example.com`
  - Password: `TestPass123!`

### 4.2 Enable Auth Providers

- [ ] Email/Password enabled (should be default)
- [ ] Setup email templates if needed

---

## 🚀 Step 5: Run Development Server

```bash
npm run dev
```

- [ ] App starts without errors
- [ ] Accessible at `http://localhost:5173`
- [ ] Page loads and displays

---

## 🧪 Step 6: Test Features

### 6.1 Login Page

- [ ] Can see login form
- [ ] Email validation works
- [ ] Can login with test user
- [ ] Error message shows on wrong password
- [ ] Can switch to sign-up
- [ ] Can create new account

### 6.2 Dashboard

- [ ] Dashboard displays after login
- [ ] Shows statistics cards
- [ ] Shows order status breakdown
- [ ] Refresh button works

### 6.3 Orders Page

- [ ] Order list displays (empty is OK)
- [ ] Can click "Add Order" button
- [ ] Form appears with all fields
- [ ] Can fill and create order
- [ ] Order appears in table
- [ ] Can edit order
- [ ] Can delete order
- [ ] Search function works
- [ ] Status filter works

### 6.4 Products Page

- [ ] Product grid displays (empty is OK)
- [ ] Can add new product
- [ ] Product appears in grid
- [ ] Can edit product
- [ ] Can delete product
- [ ] Category filter works

### 6.5 Inventory Page

- [ ] Shows inventory statistics
- [ ] Product table displays
- [ ] Can update stock quantity
- [ ] Low stock alert shows
- [ ] Sorting works (5 options)
- [ ] Can filter low stock

### 6.6 Sales Report Page

- [ ] Top products table displays
- [ ] Category revenue shows
- [ ] Date range selector works
- [ ] Revenue chart displays
- [ ] Percentage bars show

### 6.7 Categories Page

- [ ] Category list displays
- [ ] Can add category
- [ ] Can edit category
- [ ] Can delete category

### 6.8 Logout

- [ ] Logout button visible
- [ ] Can click logout
- [ ] Redirects to login
- [ ] Session cleared

---

## 📱 Step 7: Responsive Testing

### 7.1 Desktop (1200px+)

- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Navigation bar displays
- [ ] Tables readable
- [ ] Buttons accessible

### 7.2 Tablet (768px - 1199px)

- [ ] Responsive layout working
- [ ] Touch targets adequate
- [ ] Text readable
- [ ] Forms responsive

### 7.3 Mobile (< 768px)

- [ ] Navigation mobile-friendly
- [ ] Single column layout
- [ ] No horizontal scroll
- [ ] Touch targets adequate
- [ ] Forms work on mobile

---

## 🔍 Step 8: Browser Testing

- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Edge ✓
- [ ] Mobile browser ✓

---

## 🛠️ Step 9: Build Testing

```bash
npm run build
npm run preview
```

- [ ] Build completes without errors
- [ ] Build output in `dist` folder
- [ ] Preview runs on local server
- [ ] All features work in preview

---

## 📝 Step 10: Documentation

- [ ] Read `README_REACT_APP.md`
- [ ] Read `REACT_QUICK_START.md`
- [ ] Understand project structure
- [ ] Know file locations

---

## 🚀 Step 11: Deployment Preparation

### 11.1 Code Cleanup

- [ ] Remove console.log() calls
- [ ] Remove unused imports
- [ ] Fix any ESLint warnings
- [ ] Update README

### 11.2 Environment

- [ ] Production .env configured
- [ ] API URLs correct
- [ ] Security settings checked

### 11.3 Pre-Deployment

- [ ] All tests pass
- [ ] Build is successful
- [ ] No console errors
- [ ] No console warnings

---

## 🌐 Step 12: Deploy to Vercel (Optional)

```bash
npm install -g vercel
vercel
```

- [ ] Vercel account created
- [ ] Project connected to Git (recommended)
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] App accessible online
- [ ] All features work online

---

## 📊 Final Verification

### Performance

- [ ] Page load time < 3s
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Responsive interactions

### Security

- [ ] No sensitive data in console
- [ ] CORS configured
- [ ] Input validation working
- [ ] Authentication secure

### Functionality

- [ ] All CRUD operations work
- [ ] Search/Filter works
- [ ] Real-time updates work
- [ ] Error handling works

---

## 🎯 Common Setup Issues

| Issue | Solution |
|-------|----------|
| npm install fails | Delete node_modules, try again |
| Cannot connect to Supabase | Check .env credentials |
| Login not working | Verify auth user exists |
| Data not showing | Check Supabase RLS |
| Port 5173 in use | Change port in vite.config.js |

---

## 📞 Support

If you encounter issues:

1. Check `.env` file
2. Check Supabase connection
3. Check browser console (F12)
4. Check Supabase logs
5. Read error messages carefully

---

## ✅ Completion Status

- [ ] Dependencies installed
- [ ] Supabase configured
- [ ] Environment variables set
- [ ] Dev server running
- [ ] Login works
- [ ] Features tested
- [ ] Build successful
- [ ] Ready for production

---

## 🎉 Ready to Go!

Once all checklist items are marked, your React app is ready for use!

**Next Steps:**
1. Start using the app
2. Add your real data
3. Deploy when ready
4. Share with team

---

**Last Updated: 2024**
