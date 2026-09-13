-- Add payment_method column to payment_transfers if not exists
ALTER TABLE public.payment_transfers 
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'bank_transfer';

-- Create index on payment_method
CREATE INDEX IF NOT EXISTS idx_payment_transfers_payment_method 
ON public.payment_transfers(payment_method);
