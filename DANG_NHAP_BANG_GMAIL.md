# 📧 Hướng Dẫn Đăng Nhập Bằng Gmail

## ✅ Web App Hiện Tại Hỗ Trợ Gì?

| Tính Năng | Status |
|-----------|--------|
| Đăng ký bằng Email | ✅ Có |
| Đăng nhập bằng Email | ✅ Có |
| Đăng nhập bằng Google/Gmail | ❌ Chưa có (cần setup) |
| Đăng nhập bằng GitHub | ❌ Chưa có (cần setup) |
| Đăng nhập bằng Facebook | ❌ Chưa có (cần setup) |

---

## 🎯 Để Sử Dụng Gmail Đăng Nhập

### **Bước 1: Setup Google OAuth Provider trong Supabase**

1. Vào https://supabase.com → Login → Chọn Project
2. Mở menu bên trái → **Authentication** → **Providers**
3. Tìm **Google** → Click vào
4. Bật toggle **"Enable Google"**

![Bước 1](https://i.imgur.com/xxx.png)

### **Bước 2: Tạo Google OAuth Credentials**

1. Vào https://console.cloud.google.com/
2. Tạo **New Project** (nếu chưa có)
3. Vào **APIs & Services** → **Credentials**
4. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
5. Chọn **Web application**
6. Thêm **Authorized Redirect URIs**:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback?provider=google
   ```
   
   Ví dụ:
   ```
   https://abcdef123456.supabase.co/auth/v1/callback?provider=google
   ```

7. Copy **Client ID** và **Client Secret**

### **Bước 3: Nhập vào Supabase**

1. Quay lại Supabase → Authentication → Providers → Google
2. Paste **Client ID** vào field `Client ID`
3. Paste **Client Secret** vào field `Client Secret`
4. Click **Save**

---

## 💻 Sửa Code React Để Dùng Gmail Đăng Nhập

### **Option 1: Thêm Nút Google Login (Đơn Giản)**

Mở file `src/components/LoginPage.jsx` (hoặc `src/pages/LoginPage.jsx`)

Thêm hàm:

```javascript
import { supabase } from '../lib/supabaseClient';

export const handleGoogleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'email profile',
    },
  });

  if (error) {
    console.error('Google sign in error:', error);
    alert('Đăng nhập Google thất bại: ' + error.message);
  }
};
```

Thêm nút vào form:

```jsx
<button 
  onClick={handleGoogleSignIn}
  style={{
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#DB4437',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }}
>
  📧 Đăng nhập bằng Gmail
</button>
```

---

### **Option 2: Thêm Vào Tất Cả Pages (Toàn Bộ App)**

Tạo component `GoogleSignInButton.jsx`:

```javascript
// src/components/GoogleSignInButton.jsx
import { supabase } from '../lib/supabaseClient';

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <button 
      onClick={handleGoogleSignIn}
      className="google-signin-btn"
    >
      📧 Gmail
    </button>
  );
}
```

Sử dụng:

```jsx
import GoogleSignInButton from './GoogleSignInButton';

export default function LoginPage() {
  return (
    <div>
      <h1>Đăng Nhập</h1>
      {/* ... email form ... */}
      <GoogleSignInButton />
    </div>
  );
}
```

---

## 🔧 Sửa Trong `supabaseClient.js` (Nếu Cần)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // 👈 Quan trọng để catch OAuth redirect
    },
  }
);

export { supabase };
```

---

## 🚀 Kiểm Tra Session Sau Khi Đăng Nhập

```javascript
// Sau khi đăng nhập, kiểm tra
import { useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

export default function App() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      console.log('Session:', session);
      
      if (session?.user) {
        console.log('Đăng nhập thành công:', session.user.email);
      }
    });
  }, []);

  return <div>App</div>;
}
```

---

## 📊 Schema Database - Thêm Fields Cho OAuth

Nếu muốn lưu thêm thông tin từ Google:

```sql
-- Mở rộng profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Lưu info từ Google
UPDATE profiles 
SET 
  full_name = COALESCE(full_name, (auth.users.raw_user_meta_data->>'name')::TEXT),
  avatar_url = COALESCE(avatar_url, (auth.users.raw_user_meta_data->>'picture')::TEXT)
WHERE auth.users.id = profiles.id;
```

---

## 🎯 Bảng So Sánh Các Phương Thức Đăng Nhập

| Phương Thức | Setup | Dễ Dùng | Độ An Toàn | Đề Xuất |
|------------|-------|---------|-----------|----------|
| Email/Password | ⭐ Dễ | ⭐ Dễ | ⭐⭐ Bình Thường | ✅ Cho Dev/Test |
| Google OAuth | ⭐⭐ Trung Bình | ⭐⭐⭐ Rất Dễ | ⭐⭐⭐⭐ Rất An Toàn | ✅ **Khuyên Dùng** |
| GitHub OAuth | ⭐⭐ Trung Bình | ⭐⭐⭐ Rất Dễ | ⭐⭐⭐⭐ Rất An Toàn | ✅ Cho Developers |
| Magic Link (Email) | ⭐ Dễ | ⭐⭐⭐ Rất Dễ | ⭐⭐⭐⭐⭐ Rất An Toàn | ✅ Pro Choice |

---

## 🔐 Cú Pháp SQL - RLS Policy Cho OAuth Users

```sql
-- Cho phép OAuth users truy cập
CREATE POLICY "OAuth users can read products"
ON products
FOR SELECT
USING (
  auth.role() = 'authenticated'::text
  OR (SELECT provider FROM profiles WHERE id = auth.uid()) IS NOT NULL
);

-- Chi phí cho phép Google users
CREATE POLICY "Google users can create orders"
ON orders
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'::text
  AND (SELECT provider FROM profiles WHERE id = auth.uid()) = 'google'
);
```

---

## ❓ FAQ

### **Q: Mất mật khẩu sao?**
A: Dùng "Quên mật khẩu" → Supabase sẽ gửi email reset.

### **Q: Đăng nhập Gmail nhưng không có profile?**
A: Tạo trigger tự động:
```sql
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

### **Q: Có thể liên kết nhiều account không?**
A: Có, dùng `supabase.auth.linkIdentities()`

### **Q: Logout sao?**
A: 
```javascript
await supabase.auth.signOut();
```

---

## 🎨 UI Template - Login Form Với Google

```jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    await supabase.auth.signInWithPassword({ email, password });
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>🔐 Đăng Nhập</h2>
      
      {/* Email Form */}
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          ✉️ Đăng nhập Email
        </button>
      </form>

      {/* Google Login */}
      <button 
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          backgroundColor: '#DB4437',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        📧 Đăng nhập Gmail
      </button>

      {/* Divider */}
      <p style={{ textAlign: 'center', margin: '20px 0' }}>hoặc</p>

      {/* Signup Link */}
      <p style={{ textAlign: 'center' }}>
        Chưa có tài khoản? <a href="/signup">Đăng ký</a>
      </p>
    </div>
  );
}
```

---

## 🚀 Tómlược Các Bước

| Bước | Tác Vụ | Thời Gian |
|------|--------|----------|
| 1 | Tạo Google OAuth App | 5 phút |
| 2 | Thêm Credentials vào Supabase | 2 phút |
| 3 | Sửa code React thêm nút Google | 5 phút |
| 4 | Test & Deploy | 5 phút |
| **TOTAL** | | **~15 phút** |

---

**Bạn muốn tôi thêm code Google Login vào app không?** 🚀
