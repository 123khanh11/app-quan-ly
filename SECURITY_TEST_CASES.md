# SECURITY TEST CASES

**Dự án:** E-Commerce Website Interface v1.0.0  
**Ngày tạo:** 17/10/2026  
**Loại kiểm thử:** Security Testing  
**Tổng số TC:** 12  
**Trạng thái:** Chưa thực thi (NOT RUN)

---

## MỤC TIÊU SECURITY TESTING

- ✅ Authentication & Authorization
- ✅ Data Protection & Encryption
- ✅ API Security & Validation
- ✅ OWASP Top 10 Prevention
- ✅ Input Validation & Sanitization
- ✅ SQL Injection Prevention
- ✅ XSS (Cross-Site Scripting) Prevention
- ✅ CSRF (Cross-Site Request Forgery) Prevention
- ✅ Session Management
- ✅ Sensitive Data Protection

---

## SECURITY TEST CASES

### **NHÓM SEC-01: Authentication Security**

#### **SEC-001: SQL Injection Prevention - Login Form**

**Mục đích:** Kiểm tra xem API có bị SQL injection qua login form

**Chi tiết kiểm thử:**
```
Test Case: Nhập SQL injection payload vào email field

Input:
Email: admin' OR '1'='1
Password: anything

Request:
POST /api/auth/login
{
  "email": "admin' OR '1'='1",
  "password": "anything"
}

Expected Result:
- ✅ Status 400 Bad Request (Invalid email format)
- ✅ Error message: "Invalid email format"
- ✅ Không thể bypass authentication
- ✅ Không trả về admin user
- ✅ Database query không bị modify

Actual Result:
- ⏳ NOT RUN

Why NOT RUN:
- Chưa test SQL injection prevention
- API auth logic chưa verify
- Supabase RLS policy chưa check
```

**Code Review Points:**
```typescript
// supabase.ts - Cần check
const { data, error } = await supabase.auth.signInWithPassword({
  email: userEmail,  // ✅ Supabase SDK handle parameterized queries
  password: userPassword
})

// ✅ Supabase uses parameterized queries by default
// ❓ Nhưng cần verify không có custom SQL query
```

**Risk Level:** HIGH  
**OWASP:** A03:2021 – Injection

---

#### **SEC-002: XSS Prevention - User Input in Profile**

**Mục đích:** Kiểm tra XSS attack khi user nhập JavaScript vào profile

**Chi tiết kiểm thử:**
```
Test Case: Nhập XSS payload vào profile name

Input:
Name: <img src=x onerror="alert('XSS')">

Request:
POST /api/user/update-profile
{
  "name": "<img src=x onerror=\"alert('XSS')\">"
}

Expected Result:
- ✅ Payload được escaped/sanitized
- ✅ Stored as text: "&lt;img src=x...&gt;"
- ✅ Frontend render as text (không execute script)
- ✅ Browser console không có alert

Actual Result:
- ⏳ NOT RUN

Why NOT RUN:
- Chưa test XSS prevention
- Frontend sanitization chưa verify
```

**Code Review Points:**
```typescript
// Frontend sanitization
const sanitizedName = DOMPurify.sanitize(userInput)  // ✅ Nếu dùng DOMPurify
// hoặc
const sanitizedName = escapeHtml(userInput)  // ✅ Nếu manual escape

// Database storage - Supabase tự động escape ✅
```

**Risk Level:** HIGH  
**OWASP:** A03:2021 – Injection (XSS)

---

#### **SEC-003: CSRF Token Validation**

**Mục đích:** Kiểm tra CSRF protection khi submit form từ cross-origin

**Chi tiết kiểm thử:**
```
Test Case: Form submission mà không có CSRF token

Scenario: Attacker website gửi POST request tới e-commerce

Request from attacker.com:
POST https://e-commerce-website-interface.vercel.app/api/orders
Content-Type: application/json
Origin: https://attacker.com

{
  "customer_name": "Hacker",
  "total": 1000000
}

Expected Result:
- ✅ Status 403 Forbidden (CSRF token missing)
- ✅ Error: "CSRF token validation failed"
- ✅ Order không được tạo

Actual Result:
- ⏳ NOT RUN

Why NOT RUN:
- API CSRF protection chưa verify
```

**Code Review Points:**
```typescript
// Cần check API có CSRF middleware không
// Express CSRF protection:
import csurf from 'csurf'
const csrfProtection = csurf({ cookie: true })

app.post('/api/orders', csrfProtection, (req, res) => {
  // ✅ CSRF token validated
})

// Hoặc SameSite cookie:
res.setHeader('Set-Cookie', 'session=...; SameSite=Strict')  // ✅
```

**Risk Level:** MEDIUM  
**OWASP:** A01:2021 – Broken Access Control

---

#### **SEC-004: Session Fixation Prevention**

**Mục đích:** Kiểm tra xem session có bị fixation attack

**Chi tiết kiểm thử:**
```
Test Case: Attacker inject session cookie

Scenario:
1. Attacker set session cookie: sessionId=KNOWN_VALUE
2. Victim truy cập website
3. Victim login
4. Attacker dùng sessionId=KNOWN_VALUE để truy cập

Expected Result:
- ✅ Session ID thay đổi sau login
- ✅ KNOWN_VALUE không hoạt động
- ✅ Attacker không thể truy cập account

Implementation:
- ✅ Supabase tự động regenerate session ✅
- ✅ Session token thay đổi sau authentication

Actual Result:
- ⏳ NOT RUN
```

**Risk Level:** MEDIUM  
**OWASP:** A07:2021 – Identification and Authentication Failures

---

### **NHÓM SEC-02: Authorization & Access Control**

#### **SEC-005: Unauthorized API Access - Missing Auth Header**

**Mục đích:** Kiểm tra API có reject request không có auth token

**Chi tiết kiểm thử:**
```
Test Case: Truy cập protected endpoint không có auth header

Request:
GET /api/user/profile
(No Authorization header)

Expected Result:
- ✅ Status 401 Unauthorized
- ✅ Error: "Missing authentication token"
- ✅ Không trả về user data

Actual Result:
- ⏳ NOT RUN

Why NOT RUN:
- API protected endpoints chưa verify
- Supabase RLS policy chưa test
```

**Code Review Points:**
```typescript
// Supabase RLS (Row Level Security)
-- SQL: Enable RLS on user_profile table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own profile
CREATE POLICY "Users can read own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

// ✅ Chỉ user owner mới truy cập được
```

**Risk Level:** HIGH  
**OWASP:** A01:2021 – Broken Access Control

---

#### **SEC-006: Privilege Escalation - Non-Admin Accessing Admin Panel**

**Mục đích:** Kiểm tra xem non-admin có thể access admin page

**Chi tiết kiểm thử:**
```
Test Case: Regular user truy cập /admin/orders

Scenario:
1. Login với regular user account
2. Navigate tới https://...vercel.app/admin/orders
3. Kiểm tra xem có truy cập được không

Expected Result:
- ✅ Status 403 Forbidden
- ✅ Redirect tới /access-denied
- ✅ Không hiển thị admin data

Implementation:
- ✅ Frontend: ProtectedRoute check user role ✅
- ✅ Backend API: RLS policy kiểm tra admin role

Actual Result:
- ⏳ NOT RUN
```

**Code Review Points:**
```typescript
// Frontend protected route
function AdminRoute({ children }) {
  const { user } = useAuth()
  
  if (user?.role !== 'admin') {  // ✅ Check role
    return <Redirect to="/access-denied" />
  }
  
  return children
}

// Backend API
const { data, error } = await supabase
  .from('orders')
  .select()
  .eq('user_id', userId)  // ✅ RLS policy filters automatically
```

**Risk Level:** HIGH  
**OWASP:** A01:2021 – Broken Access Control

---

### **NHÓM SEC-03: Input Validation & Sanitization**

#### **SEC-007: Invalid Email Validation**

**Mục đích:** Kiểm tra email validation

**Chi tiết kiểm thử:**
```
Test Case 1: Invalid email format
Input: "not-an-email"
Expected: Rejected ✅

Test Case 2: Email injection
Input: "user@example.com\nbcc: attacker@evil.com"
Expected: Rejected or sanitized ✅

Test Case 3: SQL injection in email
Input: "user@example.com'; DROP TABLE users;--"
Expected: Rejected ✅

Test Case 4: XSS in email
Input: "<script>alert('XSS')</script>@example.com"
Expected: Rejected ✅

Implementation:
- Email regex validation ✅
- Parameterized queries ✅
- Input escaping ✅

Actual Result:
- ⏳ NOT RUN
```

**Code Review Points:**
```typescript
// Validation function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)  // ✅ Basic validation
}

// Better: Use validator library
import validator from 'validator'
const isValid = validator.isEmail(email)  // ✅ Robust validation
```

**Risk Level:** MEDIUM  
**OWASP:** A03:2021 – Injection

---

#### **SEC-008: Phone Number Validation - DoS Prevention**

**Mục đích:** Kiểm tra phone number validation để prevent DoS

**Chi tiết kiểm thử:**
```
Test Case: Extremely long phone number

Input:
phone: "1234567890" + "0".repeat(10000)  // 10000+ digits

Expected Result:
- ✅ Rejected (max length exceeded)
- ✅ Status 400 Bad Request
- ✅ Error: "Phone number too long"
- ✅ Prevent server resource exhaustion

Implementation:
- Max length check: 15 characters ✅
- Regex pattern: ^[\d\-\+\s\(\)]{1,15}$ ✅

Actual Result:
- ⏳ NOT RUN
```

**Code Review Points:**
```typescript
// Validation
function validatePhone(phone: string): boolean {
  // Max length 15
  if (phone.length > 15) return false
  
  // Only digits and common separators
  const phoneRegex = /^[\d\-\+\s\(\)]{1,15}$/
  return phoneRegex.test(phone)
}
```

**Risk Level:** MEDIUM  
**OWASP:** A04:2021 – Insecure Deserialization (DoS)

---

### **NHÓM SEC-04: Data Protection**

#### **SEC-009: Sensitive Data - Password Hashing**

**Mục đích:** Kiểm tra passwords được hash, không plain text

**Chi tiết kiểm thử:**
```
Test Case: Query password field từ database

Query:
SELECT user_id, email, password FROM users LIMIT 1

Expected Result:
- ✅ Password field: "bcrypt hash" hoặc "scrypt hash"
- ✅ Không phải plain text
- ✅ Hash format: $2b$10$... (bcrypt) hoặc tương tự

Database check (Supabase):
SELECT * FROM auth.users LIMIT 1

Supabase structure:
- ✅ auth.users table (managed by Supabase)
- ✅ Passwords auto-hashed by Supabase ✅
- ✅ Plain text passwords KHÔNG bao giờ stored

Actual Result:
- ✅ VERIFY SUPABASE CONFIG (không auto-test được)
```

**Risk Level:** CRITICAL  
**OWASP:** A02:2021 – Cryptographic Failures

---

#### **SEC-010: HTTPS/TLS Enforcement**

**Mục đích:** Kiểm tra website enforce HTTPS

**Chi tiết kiểm thử:**
```
Test Case: Truy cập qua HTTP

Request:
http://e-commerce-website-interface.vercel.app/

Expected Result:
- ✅ Status 301/302 Redirect
- ✅ Redirect to: https://...
- ✅ Tất cả traffic phải qua HTTPS

Actual Result:
- ✅ Vercel auto-enforce HTTPS ✅
- HTTP requests redirect to HTTPS ✅

Verify:
curl -I http://e-commerce-website-interface.vercel.app/
→ Location: https://e-commerce-website-interface.vercel.app/
```

**Risk Level:** CRITICAL  
**OWASP:** A02:2021 – Cryptographic Failures

---

#### **SEC-011: Sensitive Data in localStorage**

**Mục đích:** Kiểm tra không lưu sensitive data vào localStorage

**Chi tiết kiểm thử:**
```
Test Case: Inspect localStorage sau login

Browser DevTools → Application → Local Storage

Expected Result:
- ✅ shopping_cart: [product list] (safe)
- ✅ favorites: [product list] (safe)
- ❌ KHÔNG có: password, credit_card, auth_token

What should NOT be in localStorage:
- ❌ Passwords
- ❌ Credit card numbers
- ❌ Auth tokens (should use HttpOnly cookies)
- ❌ SSN, Personal ID
- ❌ API keys

Current state:
- ✅ shopping_cart: safe ✅
- ✅ favorites: safe ✅
- ❓ Auth token: check if HttpOnly ✅ (Supabase manage)

Actual Result:
- ⏳ NEED TO VERIFY
```

**Code Review Points:**
```typescript
// ✅ GOOD: Supabase manages auth tokens with HttpOnly cookies
// NOT stored in localStorage

// localStorage safe to use for:
localStorage.setItem('shopping_cart', JSON.stringify(cart))  // ✅
localStorage.setItem('favorites', JSON.stringify(favorites))  // ✅

// ❌ NEVER do this:
localStorage.setItem('password', userPassword)  // ❌ WRONG
localStorage.setItem('auth_token', token)  // ❌ WRONG (use HttpOnly)
```

**Risk Level:** HIGH  
**OWASP:** A02:2021 – Cryptographic Failures

---

#### **SEC-012: API Response - Sensitive Data Exposure**

**Mục đích:** Kiểm tra API response không expose sensitive data

**Chi tiết kiểm thử:**
```
Test Case: Inspect API response cho sensitive fields

Request:
GET /api/user/profile

Expected Response:
{
  "user_id": "abc123",
  "email": "user@example.com",
  "name": "John Doe"
  // ✅ Allowed fields
}

NOT Expected in response:
{
  "password_hash": "...",  // ❌ NEVER
  "credit_card": "4532...",  // ❌ NEVER
  "ssn": "123-45-6789",  // ❌ NEVER
  "api_key": "sk-...",  // ❌ NEVER
}

Implementation:
- Backend: Select only safe columns ✅
- Supabase: Configure column access via RLS ✅
- Frontend: Don't log sensitive data ✅

Actual Result:
- ⏳ NOT RUN (cần verify API responses)
```

**Code Review Points:**
```typescript
// ✅ GOOD: Select only safe columns
const { data } = await supabase
  .from('users')
  .select('user_id, email, name, phone')  // ✅ Only safe columns
  .eq('id', userId)

// ❌ BAD: Select all columns (expose sensitive data)
const { data } = await supabase
  .from('users')
  .select('*')  // ❌ Includes password_hash, etc.
```

**Risk Level:** HIGH  
**OWASP:** A01:2021 – Broken Access Control

---

## 📊 SECURITY TEST SUMMARY

| TC ID | Tên Test Case | Category | Risk | Status |
|-------|---------------|----------|------|--------|
| SEC-001 | SQL Injection - Login | Injection | HIGH | NOT RUN ⏳ |
| SEC-002 | XSS Prevention | Injection | HIGH | NOT RUN ⏳ |
| SEC-003 | CSRF Token | CSRF | MEDIUM | NOT RUN ⏳ |
| SEC-004 | Session Fixation | Auth | MEDIUM | NOT RUN ⏳ |
| SEC-005 | Unauthorized API Access | AuthZ | HIGH | NOT RUN ⏳ |
| SEC-006 | Privilege Escalation | AuthZ | HIGH | NOT RUN ⏳ |
| SEC-007 | Email Validation | Input | MEDIUM | NOT RUN ⏳ |
| SEC-008 | Phone DoS Prevention | Input | MEDIUM | NOT RUN ⏳ |
| SEC-009 | Password Hashing | Crypto | CRITICAL | VERIFY ✅ |
| SEC-010 | HTTPS Enforcement | Crypto | CRITICAL | VERIFY ✅ |
| SEC-011 | localStorage Security | Data | HIGH | VERIFY ⏳ |
| SEC-012 | API Response Sanitization | Data | HIGH | NOT RUN ⏳ |

**Total:** 12 Security Test Cases  
**Status:** 0 PASS, 0 FAIL, 12 NOT RUN  
**Coverage:** 0%  

---

## 🔒 SECURITY RECOMMENDATIONS

### **Ưu tiên 1: CRITICAL** (Phải fix ngay)
- [ ] SEC-010: Verify HTTPS enforcement ✅ (Vercel auto)
- [ ] SEC-009: Verify password hashing ✅ (Supabase auto)
- [ ] SEC-012: Review API responses (remove sensitive fields)

### **Ưu tiên 2: HIGH** (Fix trong sprint này)
- [ ] SEC-001: Add SQL injection prevention (validate input)
- [ ] SEC-002: Add XSS prevention (sanitize output)
- [ ] SEC-005: Verify API requires auth tokens
- [ ] SEC-006: Test admin role authorization
- [ ] SEC-011: Audit localStorage usage

### **Ưu tiên 3: MEDIUM** (Fix trong sprint tới)
- [ ] SEC-003: Implement CSRF tokens
- [ ] SEC-004: Test session regeneration
- [ ] SEC-007: Add email validation
- [ ] SEC-008: Add rate limiting

---

## 🚀 IMPLEMENTATION CHECKLIST

### **Phase 1: Code Review & Verification (2 giờ)**
- [ ] Review Supabase RLS policies
- [ ] Check password hashing (Supabase auth)
- [ ] Verify HTTPS enforcement
- [ ] Audit API response schemas
- [ ] Check localStorage usage

### **Phase 2: Implement Security Tests (1 ngày)**
- [ ] Setup OWASP ZAP scanning
- [ ] Create security test suite
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Test authorization

### **Phase 3: Security Fixes (1-2 ngày)**
- [ ] Add input validation
- [ ] Add output sanitization
- [ ] Implement rate limiting
- [ ] Add CSRF tokens
- [ ] Implement security headers

### **Phase 4: Security Scanning & Audit (1 ngày)**
- [ ] Run OWASP ZAP
- [ ] Penetration testing
- [ ] Code security review
- [ ] Dependency audit (npm audit)
- [ ] SSL certificate check

---

## 📝 OWASP TOP 10 MAPPING

| OWASP | Vulnerability | Test Case |
|-------|---|---|
| A01 | Broken Access Control | SEC-005, SEC-006 |
| A02 | Cryptographic Failures | SEC-009, SEC-010, SEC-011 |
| A03 | Injection (SQL, XSS) | SEC-001, SEC-002 |
| A04 | Insecure Deserialization | SEC-008 |
| A05 | Broken Authentication | SEC-004 |
| A06 | Sensitive Data Exposure | SEC-011, SEC-012 |
| A07 | Identification & Auth Failures | SEC-004 |
| A08 | CORS Misconfiguration | (Need separate test) |
| A09 | Logging & Monitoring | (Need separate test) |
| A10 | SSRF | (Need separate test) |

---

**Document Status:** ✅ CREATED  
**Next Step:** Implement security tests  
**Target Coverage:** 100% by 01/11/2026

