-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Project details
  project_type TEXT NOT NULL CHECK (project_type IN ('logo', 'banner', 'social', 'print', 'other')),
  content_text TEXT NOT NULL,
  dimensions TEXT,

  -- Visual references
  reference_links TEXT[], -- Array of URLs
  uploaded_files JSONB DEFAULT '[]'::jsonb, -- Array of file metadata {name, url, size, type}

  -- Additional options
  express_delivery BOOLEAN DEFAULT false,
  source_files BOOLEAN DEFAULT false,
  customer_email TEXT NOT NULL,

  -- Pricing
  base_price NUMERIC(10, 2) NOT NULL,
  express_delivery_price NUMERIC(10, 2) DEFAULT 0,
  source_files_price NUMERIC(10, 2) DEFAULT 0,
  total_price NUMERIC(10, 2) NOT NULL,

  -- Payment and delivery
  stripe_payment_id TEXT,
  stripe_checkout_session_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'in_progress', 'completed', 'delivered')),

  -- Delivery tracking
  delivery_deadline TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  delivery_files JSONB DEFAULT '[]'::jsonb -- Array of file metadata for final deliverables
);

-- Create index on customer_email for faster lookups
CREATE INDEX idx_orders_customer_email ON public.orders(customer_email);

-- Create index on stripe_checkout_session_id for webhook lookups
CREATE INDEX idx_orders_stripe_session ON public.orders(stripe_checkout_session_id);

-- Create index on created_at for sorting
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.orders IS 'Stores all design service orders';
COMMENT ON COLUMN public.orders.project_type IS 'Type of design project: logo, banner, social, print, or other';
COMMENT ON COLUMN public.orders.uploaded_files IS 'JSON array of uploaded reference files metadata';
COMMENT ON COLUMN public.orders.delivery_deadline IS 'Calculated deadline based on order time and express delivery option';
COMMENT ON COLUMN public.orders.delivery_files IS 'JSON array of final deliverable files metadata';
