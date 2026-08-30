-- ====================================================================
-- SUPABASE STORAGE RLS POLICIES FOR 'customer-documents' BUCKET
-- ====================================================================

-- 1. Create the 'customer-documents' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-documents',
  'customer-documents',
  true,
  52428800, -- 50 MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/octet-stream']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit;

-- 2. Enable Row Level Security (RLS) on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop any pre-existing policies for 'customer-documents' bucket to prevent duplication
DROP POLICY IF EXISTS "Public Read Access for Customer Documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert Access for Customer Documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access for Customer Documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access for Customer Documents" ON storage.objects;

-- 4. RLS Policy: Public SELECT (Read) Access
-- Allows customers and public users to view/download generated documents and photos via public URLs
CREATE POLICY "Public Read Access for Customer Documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'customer-documents');

-- 5. RLS Policy: Authenticated INSERT Access
-- Strictly requires auth.role() = 'authenticated' or 'service_role' to upload new files
CREATE POLICY "Authenticated Insert Access for Customer Documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'customer-documents'
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- 6. RLS Policy: Authenticated UPDATE Access
-- Strictly requires auth.role() = 'authenticated' or 'service_role' to update existing files
CREATE POLICY "Authenticated Update Access for Customer Documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'customer-documents'
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- 7. RLS Policy: Authenticated DELETE Access
-- Strictly requires auth.role() = 'authenticated' or 'service_role' to delete files
CREATE POLICY "Authenticated Delete Access for Customer Documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'customer-documents'
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);
