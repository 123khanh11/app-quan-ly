-- Add user_id column to order_items table if it doesn't exist
ALTER TABLE public.order_items
ADD COLUMN user_id uuid NULL;

-- Add comment
COMMENT ON COLUMN public.order_items.user_id IS 'Foreign key reference to the user who placed the order';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'order_items' AND column_name = 'user_id';
