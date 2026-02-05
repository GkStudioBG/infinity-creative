-- Enable Row Level Security on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert orders (for new order creation)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow customers to view their own orders by email
CREATE POLICY "Customers can view their own orders"
  ON public.orders
  FOR SELECT
  TO public
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email'
         OR auth.role() = 'anon'); -- Allow anon access for public lookup by email

-- Policy: Only service role can update orders (for webhooks and admin operations)
CREATE POLICY "Service role can update orders"
  ON public.orders
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Only service role can delete orders (admin only)
CREATE POLICY "Service role can delete orders"
  ON public.orders
  FOR DELETE
  TO service_role
  USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
