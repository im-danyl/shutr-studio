-- Fix storage policies for style-references bucket to allow user uploads

-- Add policy for users to upload custom style references to their own folder
CREATE POLICY "Users can upload custom style references" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'style-references' AND
    name LIKE 'custom/' || auth.uid()::text || '/%'
  );

-- Add policy for users to view their own custom style references
CREATE POLICY "Users can view their own custom style references" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'style-references' AND
    (
      -- Can view public library styles (not in custom folder)
      name NOT LIKE 'custom/%' OR
      -- Can view their own custom styles
      name LIKE 'custom/' || auth.uid()::text || '/%'
    )
  );

-- Add policy for users to delete their own custom style references
CREATE POLICY "Users can delete their own custom style references" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'style-references' AND
    name LIKE 'custom/' || auth.uid()::text || '/%'
  );