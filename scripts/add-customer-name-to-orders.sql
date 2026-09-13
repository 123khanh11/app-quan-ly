-- Add customer_name column to orders table
-- This stores the customer's full name for each order

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.orders.customer_name IS 'Full name of the customer placing the order (required field)';
