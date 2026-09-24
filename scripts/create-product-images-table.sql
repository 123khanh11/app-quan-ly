-- Create variant_images table for variant-specific images
CREATE TABLE IF NOT EXISTS public.variant_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL,
  image_url text NOT NULL,
  display_order integer NULL DEFAULT 0,
  is_main boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT variant_images_pkey PRIMARY KEY (id),
  CONSTRAINT variant_images_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_variant_images_variant_id 
  ON public.variant_images USING btree (variant_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_variant_images_display_order 
  ON public.variant_images USING btree (variant_id, display_order) TABLESPACE pg_default;

-- Create trigger to update variant timestamp when images are modified
CREATE OR REPLACE FUNCTION update_variant_updated_at_from_images()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE product_variants SET updated_at = NOW() WHERE id = NEW.variant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_variant_on_image_change ON variant_images;

CREATE TRIGGER trigger_update_variant_on_image_change
AFTER INSERT OR UPDATE OR DELETE ON variant_images
FOR EACH ROW
EXECUTE FUNCTION update_variant_updated_at_from_images();

-- Verify table was created
SELECT COUNT(*) as variant_image_count FROM variant_images;
