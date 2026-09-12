-- Make user_id nullable in orders table to allow guest checkout
-- This allows orders to be created without requiring a logged-in user

ALTER TABLE public.orders
ALTER COLUMN user_id DROP NOT NULL;

-- Update foreign key constraint to allow NULL
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;
