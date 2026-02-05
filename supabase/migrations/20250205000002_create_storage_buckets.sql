-- Create storage bucket for order reference files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-references',
  'order-references',
  false, -- private bucket
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for delivered files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-deliverables',
  'order-deliverables',
  false, -- private bucket
  52428800, -- 50MB limit for final files
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'image/svg+xml',
    'application/zip',
    'application/x-zip-compressed',
    'image/vnd.adobe.photoshop',
    'application/postscript' -- AI files
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for order-references bucket
CREATE POLICY "Anyone can upload reference files"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (
    bucket_id = 'order-references'
    AND (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' -- UUID folder structure
  );

CREATE POLICY "Users can view their own reference files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'order-references');

CREATE POLICY "Service role can manage reference files"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'order-references')
  WITH CHECK (bucket_id = 'order-references');

-- Storage policies for order-deliverables bucket
CREATE POLICY "Only service role can upload deliverables"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'order-deliverables');

CREATE POLICY "Users can view deliverable files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'order-deliverables');

CREATE POLICY "Service role can manage deliverables"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'order-deliverables')
  WITH CHECK (bucket_id = 'order-deliverables');
