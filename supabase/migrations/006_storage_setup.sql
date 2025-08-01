-- Create storage buckets for file management

-- Create product-images bucket for user uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create generated-images bucket for AI outputs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-images',
  'generated-images',
  true,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create style-references bucket for admin style uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'style-references',
  'style-references',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage policies for product-images bucket
CREATE POLICY "Users can upload their own product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own product images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for generated-images bucket
CREATE POLICY "Users can view their own generated images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'generated-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Service role can manage generated images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'generated-images' AND
    auth.role() = 'service_role'
  );

-- Storage policies for style-references bucket (public read, admin write)
CREATE POLICY "Anyone can view style references" ON storage.objects
  FOR SELECT USING (bucket_id = 'style-references');

CREATE POLICY "Service role can manage style references" ON storage.objects
  FOR ALL USING (
    bucket_id = 'style-references' AND
    auth.role() = 'service_role'
  );

-- Helper function to generate unique file names
CREATE OR REPLACE FUNCTION generate_unique_filename(
  p_user_id UUID,
  p_original_name TEXT,
  p_prefix TEXT DEFAULT ''
)
RETURNS TEXT AS $$
DECLARE
  file_extension TEXT;
  unique_name TEXT;
BEGIN
  -- Extract file extension
  file_extension := LOWER(SUBSTRING(p_original_name FROM '\.([^.]*)$'));
  
  -- Generate unique filename with timestamp
  unique_name := p_user_id || '/' || p_prefix || EXTRACT(EPOCH FROM NOW())::bigint || '.' || file_extension;
  
  RETURN unique_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old uploaded files (can be called via cron)
CREATE OR REPLACE FUNCTION cleanup_old_uploads()
RETURNS VOID AS $$
BEGIN
  -- Delete product images older than 30 days that aren't used in generations
  DELETE FROM storage.objects 
  WHERE bucket_id = 'product-images'
    AND created_at < NOW() - INTERVAL '30 days'
    AND name NOT IN (
      SELECT DISTINCT product_image_url 
      FROM generations 
      WHERE product_image_url IS NOT NULL
    );
    
  -- Delete generated images older than 90 days
  DELETE FROM storage.objects 
  WHERE bucket_id = 'generated-images'
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;