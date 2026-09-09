-- Create payment_transfers table
CREATE TABLE IF NOT EXISTS public.payment_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  transfer_content text NOT NULL, -- Nội dung chuyển khoản (VD: DH7B77E49A)
  qr_code_url text, -- URL QR code
  bank_account text NOT NULL, -- Tài khoản MB: 0865816910
  bank_name text NOT NULL, -- MB Bank
  amount numeric NOT NULL, -- Số tiền
  status text DEFAULT 'pending', -- pending, paid, cancelled
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_transfers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous insert
CREATE POLICY "Allow anonymous insert" ON public.payment_transfers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to SELECT
CREATE POLICY "Allow select" ON public.payment_transfers
  FOR SELECT
  USING (true);

-- Policy: Allow UPDATE
CREATE POLICY "Allow update" ON public.payment_transfers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_payment_transfers_order_id ON public.payment_transfers(order_id);
CREATE INDEX idx_payment_transfers_user_id ON public.payment_transfers(user_id);
CREATE INDEX idx_payment_transfers_status ON public.payment_transfers(status);
