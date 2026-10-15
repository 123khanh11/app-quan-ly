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
