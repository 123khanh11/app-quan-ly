# Supabase Setup Guide

## Required Database Migrations

To enable cross-device cart sync, you need to create the `user_carts` table in Supabase.

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `edtxexnhpbipcecceoop`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Run Migration Script

Copy and paste the SQL from `scripts/create-user-carts-table.sql` into the SQL editor.

**Or use this SQL directly:**

```sql
-- Create user_carts table to sync cart across devices
CREATE TABLE IF NOT EXISTS user_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one cart per user
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON user_carts(user_id);

-- Create RLS policies for security
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cart
CREATE POLICY "Users can view their own cart" ON user_carts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own cart
CREATE POLICY "Users can update their own cart" ON user_carts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only insert their own cart
CREATE POLICY "Users can insert their own cart" ON user_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own cart
CREATE POLICY "Users can delete their own cart" ON user_carts
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_user_carts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_carts_updated_at_trigger
BEFORE UPDATE ON user_carts
FOR EACH ROW
EXECUTE FUNCTION update_user_carts_timestamp();
```

### Step 3: Execute Query

1. Click **Run** (green play button)
2. Wait for success message ✅
3. Should see: "Query executed successfully"

### Step 4: Verify

1. Go to **Database** → **Tables** (left sidebar)
2. Look for `user_carts` table ✅
3. Should see it in the table list

### Step 5: Test

1. Hard refresh browser (Ctrl+Shift+R)
2. Login with Google
3. Add items to cart
4. Check Supabase: **Database** → **user_carts**
5. Should see your cart data in `cart_data` column ✅

---

## Troubleshooting

### Error: "Could not find the table 'public.user_carts'"

**Solution:** Run the SQL migration (Step 2) in your Supabase SQL editor

### Error: "Permission denied"

**Solution:** Make sure RLS policies are enabled (they are created by the SQL above)

### Cart not syncing across devices

**Solution:** 
1. Verify `user_carts` table exists
2. Verify RLS policies are in place
3. Hard refresh browser (Ctrl+Shift+R)
4. Try logging in again

### Cart lost after logout

**Solution:**
- Cart is backed up in localStorage
- After login, cart should restore from database
- If table not created, falls back to localStorage automatically

---

## Features After Setup

✅ **Cross-Device Sync**
- Add items on Device A
- Login on Device B
- See same cart items ✅

✅ **Account Switching**
- Click "Dùng Tài Khoản Khác" button
- Switch to different Google account
- Each account has separate cart ✅

✅ **Data Persistence**
- Cart survives browser restart
- Cart available across all devices
- Backed up in Supabase database ✅

---

## Database Schema

```
user_carts
├─ id (UUID, primary key)
├─ user_id (UUID, references auth.users)
├─ cart_data (JSONB, array of CartItem)
├─ created_at (timestamp)
├─ updated_at (timestamp, auto-updated)
└─ UNIQUE(user_id) -- One cart per user
```

---

## Row Level Security (RLS)

All operations are restricted by user:
- ✅ Users can only VIEW their own cart
- ✅ Users can only UPDATE their own cart
- ✅ Users can only INSERT their own cart
- ✅ Users can only DELETE their own cart
- ❌ Cannot access other users' carts

---

## Questions?

If you encounter issues:

1. Check Supabase SQL Editor for errors
2. Verify `user_carts` table exists
3. Check RLS policies are created
4. Try hard refresh (Ctrl+Shift+R)
5. Check browser console for error messages

For more help, see the main README.md
