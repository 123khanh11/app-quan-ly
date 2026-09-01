-- Drop the existing foreign key constraint
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add back the foreign key with ON DELETE SET NULL (allows NULL values)
ALTER TABLE public.orders
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- Verify the constraint
SELECT constraint_name, constraint_type, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name = 'orders' AND column_name = 'user_id';
