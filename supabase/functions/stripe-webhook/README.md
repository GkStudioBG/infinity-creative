# Stripe Webhook Edge Function

This Supabase Edge Function handles Stripe webhook events for order payment processing.

## Features

- Verifies Stripe webhook signatures for security
- Updates order status to 'paid' when payment succeeds
- Calculates delivery deadline (24h for express, 48h standard)
- Sends confirmation email using Resend API
- Handles errors gracefully

## Setup

### 1. Environment Variables

Add these to your Supabase project settings (Edge Functions secrets):

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Deploy the Function

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy stripe-webhook

# Set environment variables
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Configure Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret and add it to Supabase secrets

### 4. Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use the provided test domain
3. Generate API key
4. Add API key to Supabase secrets as `RESEND_API_KEY`
5. Update the `from` email address in the code to match your verified domain

**Important**: For production, you must verify your own domain in Resend. The test domain has sending limits.

## Testing

### Local Testing

```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve stripe-webhook --env-file .env.local

# Use Stripe CLI to forward webhooks
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

### Test with Stripe CLI

```bash
stripe trigger checkout.session.completed
```

## Event Handling

Currently handles:
- `checkout.session.completed` - Updates order status and sends confirmation email

## Email Template

The confirmation email includes:
- Order ID
- Project type
- Total paid
- Expected delivery date
- Express delivery indicator (if applicable)
- Project details
- Link to order tracking dashboard
- Company branding

## Error Handling

- Missing signature: Returns 400
- Invalid signature: Returns 400
- Order not found: Returns 404
- Update failure: Returns 500
- Email errors are logged but don't fail the webhook

## Monitoring

Check function logs in Supabase Dashboard > Edge Functions > stripe-webhook > Logs
