# Supabase Setup Guide

This guide will help you set up Supabase for the Infinity Productized Service platform.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Supabase CLI installed (optional, for local development)

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - Name: `infinity-productized-service`
   - Database Password: (choose a strong password)
   - Region: (choose the closest to your users)
4. Wait for the project to be created (~2 minutes)

### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

3. Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Migrations

You have two options to run the migrations:

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy the contents of each migration file in order:
   - `migrations/20250205000000_create_orders_table.sql`
   - `migrations/20250205000001_setup_rls_policies.sql`
   - `migrations/20250205000002_create_storage_buckets.sql`
4. Run each query by clicking "Run" or pressing Ctrl+Enter
5. Verify no errors occurred

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Verify Setup

After running the migrations, verify the setup:

#### Check Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see the `orders` table with all columns

#### Check Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. You should see two buckets:
   - `order-references` (for customer uploads)
   - `order-deliverables` (for final deliverables)

#### Check RLS Policies

1. Go to **Authentication** > **Policies**
2. Select the `orders` table
3. You should see policies for INSERT, SELECT, UPDATE, and DELETE

### 5. Test the Connection

Run the Next.js development server:

```bash
npm run dev
```

The application should start without errors. Check the console for any Supabase connection issues.

## Database Schema

### Orders Table

- **id**: UUID (Primary Key)
- **created_at**: Timestamp (auto-generated)
- **updated_at**: Timestamp (auto-updated)
- **project_type**: Enum (logo, banner, social, print, other)
- **content_text**: Text (required)
- **dimensions**: Text (optional)
- **reference_links**: Text Array (optional)
- **uploaded_files**: JSONB (file metadata)
- **express_delivery**: Boolean (default: false)
- **source_files**: Boolean (default: false)
- **customer_email**: Text (required)
- **base_price**: Numeric
- **express_delivery_price**: Numeric
- **source_files_price**: Numeric
- **total_price**: Numeric
- **stripe_payment_id**: Text (nullable)
- **stripe_checkout_session_id**: Text (nullable)
- **payment_status**: Enum (pending, paid, failed, refunded)
- **order_status**: Enum (pending, in_progress, completed, delivered)
- **delivery_deadline**: Timestamp (nullable)
- **delivered_at**: Timestamp (nullable)
- **delivery_files**: JSONB (file metadata)

## Security Notes

⚠️ **Important Security Information:**

1. **Never commit `.env.local`** to version control
2. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - it bypasses all RLS policies
3. **Only use service role key** on the server-side (API routes, webhooks)
4. **Use anon key** for client-side operations

## Row Level Security (RLS)

The following RLS policies are configured:

- **Anyone can create orders**: Required for the order form
- **Customers can view their own orders**: Based on email address
- **Service role can update orders**: For webhooks and admin operations
- **Service role can delete orders**: Admin only

## Storage Buckets

### order-references (Private)

- Max file size: 10MB
- Allowed types: JPEG, PNG, GIF, WebP, SVG, PDF
- Access: Anyone can upload, users can view their own files

### order-deliverables (Private)

- Max file size: 50MB
- Allowed types: Images, PDF, ZIP, PSD, AI files
- Access: Only service role can upload, users can view via signed URLs

## Troubleshooting

### Error: "Missing environment variables"

Make sure you've created `.env.local` with all required variables from `.env.local.example`

### Error: "relation 'orders' does not exist"

Run the database migrations as described in Step 3

### Error: "storage bucket not found"

Run the storage bucket migration (20250205000002_create_storage_buckets.sql)

### Error: "permission denied for table orders"

Check that RLS policies are properly configured (20250205000001_setup_rls_policies.sql)

## Next Steps

After completing the Supabase setup:

1. Configure Stripe for payments
2. Set up Resend for email notifications
3. Deploy to Cloudflare Pages

For more information, see the main project README.
