-- SQL Script để tạo tài khoản test trên Supabase
-- Copy và paste toàn bộ vào SQL Editor trong Supabase Dashboard
-- Sau đó click "Run"

-- ==========================================
-- HƯỚNG DẪN:
-- ==========================================
-- 1. Mở Supabase Dashboard: https://supabase.com/dashboard
-- 2. Chọn project của bạn
-- 3. Menu bên trái: SQL Editor
-- 4. Click: "+ New Query" hoặc "New Query"
-- 5. Xóa template và paste toàn bộ đoạn code này
-- 6. Click "Run" hoặc nhấn Ctrl+Enter
-- 7. Xem kết quả ở dưới
-- ==========================================

-- Tạo tài khoản ADMIN
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at
) VALUES (
  'admin@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Quản trị viên","role":"admin"}',
  NOW(),
  NOW(),
  NOW()
);

-- Tạo tài khoản NHÂN VIÊN
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at
) VALUES (
  'staff@example.com',
  crypt('staff123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Nhân viên bán hàng","role":"staff"}',
  NOW(),
  NOW(),
  NOW()
);

-- Tạo tài khoản KHÁCH HÀNG
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at
) VALUES (
  'user@example.com',
  crypt('user123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Người mua hàng","role":"customer"}',
  NOW(),
  NOW(),
  NOW()
);

-- Hiển thị thông tin tài khoản vừa tạo
SELECT 
  email,
  created_at,
  raw_user_meta_data->>'name' as fullname,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email IN ('admin@example.com', 'staff@example.com', 'user@example.com')
ORDER BY created_at DESC;

-- ==========================================
-- KẾT QUẢ MONG ĐỢI:
-- ==========================================
-- Email                  | Created At | Fullname           | Role
-- ----------------------+------------+--------------------+----------
-- admin@example.com      | [timestamp]| Quản trị viên       | admin
-- staff@example.com      | [timestamp]| Nhân viên bán hàng  | staff
-- user@example.com       | [timestamp]| Người mua hàng      | customer
-- ==========================================

-- ==========================================
-- THÔNG TIN ĐĂNG NHẬP:
-- ==========================================
-- 
-- Tài khoản 1 - ADMIN:
-- Email: admin@example.com
-- Password: password123
-- 
-- Tài khoản 2 - NHÂN VIÊN:
-- Email: staff@example.com
-- Password: staff123
-- 
-- Tài khoản 3 - KHÁCH HÀNG:
-- Email: user@example.com
-- Password: user123
--
-- ==========================================

-- Nếu cần XÓA tài khoản (CẨN THẬN!):
-- DELETE FROM auth.users WHERE email = 'admin@example.com';

-- Nếu cần CẬP NHẬT mật khẩu:
-- UPDATE auth.users 
-- SET encrypted_password = crypt('password_moi', gen_salt('bf'))
-- WHERE email = 'admin@example.com';
