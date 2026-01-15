-- ============================================
-- Supabase Storage Setup for Generated Images
-- ============================================

-- Create the storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public read access for generated images"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-images');

-- Allow authenticated users to upload
CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-images');

-- Allow service role to delete old images
CREATE POLICY "Service role can delete images"  
ON storage.objects FOR DELETE
USING (bucket_id = 'generated-images');
