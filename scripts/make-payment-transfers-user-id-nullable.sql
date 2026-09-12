-- Make user_id nullable in payment_transfers table to allow guest checkout
-- This allows payment transfers to be recorded without requiring a logged-in user

ALTER TABLE public.payment_transfers
ALTER COLUMN user_id DROP NOT NULL;

-- Update foreign key constraint to allow NULL
ALTER TABLE public.payment_transfers
DROP CONSTRAINT IF EXISTS payment_transfers_user_id_fkey;

ALTER TABLE public.payment_transfers
ADD CONSTRAINT payment_transfers_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;
