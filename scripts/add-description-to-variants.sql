-- Add description column to product_variants table
ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS description text NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_variants_description 
ON public.product_variants USING btree (description) TABLESPACE pg_default;

-- Verify column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_variants' AND column_name = 'description';
