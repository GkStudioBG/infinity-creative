# Environment Variables Documentation

This document describes all environment variables required by the Infinity Productized Service Platform.

## Overview

The application uses environment variables for configuration across different environments (development, staging, production). All sensitive credentials should be stored in `.env.local` (never committed to git).

## Required Variables

### Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: Public (client-side accessible)
- **Required**: Yes
- **Format**: `https://your-project-id.supabase.co`
- **Where to get it**:
  1. Go to your Supabase project dashboard
  2. Navigate to Settings > API
  3. Copy the "Project URL"
- **Used for**: Connecting to Supabase database and services from the frontend

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: Public (client-side accessible)
- **Required**: Yes
- **Format**: Long alphanumeric string starting with `eyJ...`
- **Where to get it**:
  1. Go to your Supabase project dashboard
  2. Navigate to Settings > API
  3. Copy the "anon/public" key
- **Used for**: Anonymous/public API access with Row Level Security
- **Note**: This key is safe to expose publicly as it respects RLS policies

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Type**: Secret (server-side only)
- **Required**: Yes (for Edge Functions)
- **Format**: Long alphanumeric string starting with `eyJ...`
- **Where to get it**:
  1. Go to your Supabase project dashboard
  2. Navigate to Settings > API
  3. Copy the "service_role" key (keep this secret!)
- **Used for**: Server-side operations that bypass RLS (webhook updates)
- **⚠️ CRITICAL**: Never expose this key in client-side code or commit to git

---

### Stripe Configuration

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Type**: Public (client-side accessible)
- **Required**: Yes
- **Format**: `pk_test_...` (test) or `pk_live_...` (production)
- **Where to get it**:
  1. Go to Stripe Dashboard > Developers > API keys
  2. Copy the "Publishable key"
- **Used for**: Creating checkout sessions from the frontend
- **Note**: Use test keys for development, live keys for production

#### `STRIPE_SECRET_KEY`
- **Type**: Secret (server-side only)
- **Required**: Yes
- **Format**: `sk_test_...` (test) or `sk_live_...` (production)
- **Where to get it**:
  1. Go to Stripe Dashboard > Developers > API keys
  2. Copy or reveal the "Secret key"
- **Used for**: Creating checkout sessions and verifying webhooks
- **⚠️ CRITICAL**: Never expose this key in client-side code

#### `STRIPE_WEBHOOK_SECRET`
- **Type**: Secret (server-side only)
- **Required**: Yes
- **Format**: `whsec_...`
- **Where to get it**:
  1. Go to Stripe Dashboard > Developers > Webhooks
  2. Click on your webhook endpoint
  3. Click "Reveal" next to "Signing secret"
- **Used for**: Verifying webhook signatures to prevent fraud
- **Note**: Different secrets for local testing (Stripe CLI) vs production

---

### Resend Configuration

#### `RESEND_API_KEY`
- **Type**: Secret (server-side only)
- **Required**: Yes (for email functionality)
- **Format**: `re_...`
- **Where to get it**:
  1. Sign up at [resend.com](https://resend.com)
  2. Navigate to API Keys
  3. Create a new API key
- **Used for**: Sending order confirmation emails
- **Note**: Requires domain verification for production use

---

### Application Configuration

#### `NEXT_PUBLIC_APP_URL`
- **Type**: Public (client-side accessible)
- **Required**: Yes
- **Format**: Full URL with protocol
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`
- **Used for**:
  - Stripe redirect URLs (success/cancel)
  - Email template links
  - Absolute URL generation
- **Note**: Must match your actual deployment URL in production

---

## Environment Setup by Deployment Stage

### Local Development

Create `.env.local` in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From Stripe CLI

# Resend
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase Edge Functions

Set secrets using Supabase CLI:

```bash
# Development (local)
supabase secrets set --env-file .env.local

# Production
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

View current secrets:
```bash
supabase secrets list
```

### Cloudflare Pages

Set environment variables in two places:

#### 1. Pages Environment Variables (Settings > Environment Variables)
These are available during build time and on client-side:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://yourdomain.pages.dev
```

#### 2. Functions Environment Variables (Settings > Functions > Environment Variables)
These are server-side secrets for API routes running as Cloudflare Workers:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
```

**Via CLI:**
```bash
# Set secrets for Functions
wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name=infinity-productized-service
wrangler pages secret put STRIPE_SECRET_KEY --project-name=infinity-productized-service
wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name=infinity-productized-service
wrangler pages secret put RESEND_API_KEY --project-name=infinity-productized-service
```

**Note**: API routes (`/api/*`) run as Cloudflare Workers, so server-side secrets ARE needed in Cloudflare Pages.

---

## Security Best Practices

### ✅ DO:
- Use `.env.local` for local development (ignored by git)
- Use test/sandbox keys for development
- Rotate keys if exposed
- Use Supabase secrets management for Edge Functions
- Use environment-specific keys (dev vs prod)

### ❌ DON'T:
- Commit `.env.local` to version control
- Expose service role keys in client code
- Use production keys in development
- Share secrets in chat/email
- Hard-code credentials in source code

---

## Verification

### Check Variables Are Loaded

Create a test page to verify (delete after testing):

```typescript
// src/app/test-env/page.tsx
export default function TestEnv() {
  return (
    <div className="p-8">
      <h1>Environment Check</h1>
      <ul>
        <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</li>
        <li>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}</li>
        <li>Stripe Publishable: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅' : '❌'}</li>
        <li>App URL: {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</li>
      </ul>
      <p className="text-red-500 mt-4">
        ⚠️ Delete this page before deploying to production!
      </p>
    </div>
  );
}
```

Visit http://localhost:3000/test-env to verify.

---

## Troubleshooting

### Variables Not Loading

1. **Restart dev server**: Changes to `.env.local` require restarting `npm run dev`
2. **Check file name**: Must be `.env.local` (not `.env` or `.env.development`)
3. **Check prefix**: Client-side variables must start with `NEXT_PUBLIC_`
4. **Check syntax**: No spaces around `=`, no quotes needed for simple values

### Supabase Connection Failed

- Verify URL format includes `https://`
- Check anon key is complete (very long string)
- Test connection in Supabase dashboard

### Stripe Errors

- Ensure using test keys in development (`pk_test_` / `sk_test_`)
- Verify webhook secret matches Stripe CLI or dashboard
- Check webhook endpoint URL is correct

### Email Not Sending

- Verify Resend API key is active
- Check domain is verified in Resend dashboard
- Review Supabase Edge Function logs: `supabase functions logs stripe-webhook`

---

## Quick Reference

| Variable | Public/Secret | Used In | Can Expose? |
|----------|---------------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Client | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Client | ✅ Yes (safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Server | ❌ NO |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Client | ✅ Yes |
| `STRIPE_SECRET_KEY` | Secret | Server | ❌ NO |
| `STRIPE_WEBHOOK_SECRET` | Secret | Server | ❌ NO |
| `RESEND_API_KEY` | Secret | Server | ❌ NO |
| `NEXT_PUBLIC_APP_URL` | Public | Both | ✅ Yes |

---

## Next Steps

After configuring environment variables:

1. ✅ Test local development: `npm run dev`
2. ✅ Test Stripe checkout flow
3. ✅ Test webhook with Stripe CLI
4. ✅ Deploy to Cloudflare Pages
5. ✅ Configure production webhook in Stripe
6. ✅ Test production order flow end-to-end
