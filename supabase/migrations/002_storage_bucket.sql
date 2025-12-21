-- ============================================
-- Supabase Storage Setup for Generated Images
-- ============================================
-- Run this in your Supabase SQL Editor to create the storage bucket

-- Create the storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images (anyone can view)
CREATE POLICY "Public read access for generated images"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-images');

-- Allow authenticated users to upload (we'll use service role key on server)
CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-images');

-- Allow service role to delete old images
CREATE POLICY "Service role can delete images"  
ON storage.objects FOR DELETE
USING (bucket_id = 'generated-images');

-- ============================================
-- NOTE: Run this in Supabase Dashboard
-- ============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: "generated-images"
-- 4. Check "Public bucket"
-- 5. Click "Create bucket"
--
-- Or run the SQL above in the SQL Editor
-- ============================================
