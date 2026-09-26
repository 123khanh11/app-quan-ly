-- Add fbp and fbc columns to orders table for Meta Pixel tracking
-- fbp = Facebook Pixel ID (user identifier)
-- fbc = Facebook Click ID (conversion tracking)

ALTER TABLE orders
ADD COLUMN fbp VARCHAR(255) DEFAULT NULL,
ADD COLUMN fbc VARCHAR(255) DEFAULT NULL;

-- Add indexes for faster queries if needed
CREATE INDEX idx_orders_fbp ON orders(fbp);
CREATE INDEX idx_orders_fbc ON orders(fbc);

-- Log the migration
INSERT INTO _migrations (name, status) VALUES ('add_fbp_fbc_to_orders', 'completed') ON CONFLICT DO NOTHING;
