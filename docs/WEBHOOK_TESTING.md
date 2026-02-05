# Webhook Testing Guide

This guide explains how to test the Stripe webhook integration locally and in production.

## Prerequisites

- Stripe CLI installed ([stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli))
- Supabase CLI installed ([supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli))
- Local Supabase instance running
- Valid test order in database

## Local Testing

### 1. Start Local Supabase

```bash
supabase start
```

This starts:
- PostgreSQL database
- Edge Functions runtime
- Local API endpoint

### 2. Create Test Environment File

Create `.env.local` with your test credentials:

```env
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
RESEND_API_KEY=re_your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase start output.

### 3. Serve Edge Function Locally

```bash
supabase functions serve stripe-webhook --env-file .env.local
```

Function will be available at: `http://localhost:54321/functions/v1/stripe-webhook`

### 4. Forward Stripe Events

In a new terminal, run Stripe CLI:

```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

Copy the webhook signing secret (`whsec_...`) and update `.env.local`.

### 5. Create Test Order

First, create a test order in your local database. You can use this SQL:

```sql
INSERT INTO orders (
  id,
  email,
  project_type,
  content_text,
  dimensions,
  reference_links,
  uploaded_files,
  is_express,
  include_source_files,
  base_price,
  express_fee,
  source_files_fee,
  total_price,
  currency,
  stripe_session_id,
  payment_status,
  status,
  revisions_used,
  revisions_included,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  'logo',
  'Test logo design for my company. I need something modern and minimal.',
  '500x500',
  ARRAY[]::text[],
  ARRAY[]::text[],
  false,
  false,
  4900,
  0,
  0,
  4900,
  'EUR',
  'cs_test_placeholder',
  'pending',
  'pending',
  0,
  2,
  NOW(),
  NOW()
);
```

Save the `stripe_session_id` value - you'll need it for testing.

### 6. Trigger Test Webhook

#### Option A: Use Stripe CLI

```bash
stripe trigger checkout.session.completed
```

This creates a real test checkout session. Update your order's `stripe_session_id` to match.

#### Option B: Send Custom Event

Create `test-webhook.json`:

```json
{
  "id": "evt_test_webhook",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_your_session_id",
      "object": "checkout.session",
      "payment_status": "paid",
      "status": "complete"
    }
  }
}
```

Then send it:

```bash
stripe events resend evt_your_real_event_id
```

### 7. Verify Results

Check:
1. **Function Logs**: See output in terminal running `supabase functions serve`
2. **Database**: Verify order status updated to 'paid'
3. **Email**: Check inbox for confirmation email
4. **Resend Dashboard**: Verify email was sent

## Production Testing

### 1. Deploy Edge Function

```bash
supabase functions deploy stripe-webhook
```

### 2. Configure Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click **Add endpoint**
3. URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
4. Events: Select `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### 3. Set Production Secrets

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_production_secret
supabase secrets set RESEND_API_KEY=re_production_key
supabase secrets set NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Test with Real Payment

1. Go to your app
2. Create a real test order
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify webhook is triggered
6. Check order status and email

### 5. Monitor Webhook

In Stripe Dashboard:
- Go to **Developers > Webhooks**
- Click your endpoint
- View **Events** tab to see all webhook calls
- Check response status (should be 200)
- View request/response body for debugging

## Manual Testing with cURL

You can also test the webhook directly with cURL:

```bash
curl -X POST http://localhost:54321/functions/v1/stripe-webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=1234567890,v1=mock_signature" \
  -d '{
    "id": "evt_test",
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_session_id"
      }
    }
  }'
```

**Note**: This will fail signature verification unless you use a real signature.

## Common Test Scenarios

### 1. Successful Payment

```
Order Status: pending -> in_progress
Payment Status: pending -> paid
Delivery Deadline: Set to +24h (express) or +48h (standard)
Email: Sent to customer
```

### 2. Express Order

```
is_express: true
Delivery Deadline: NOW + 24 hours
Email: Shows "⚡ Express Delivery"
```

### 3. Standard Order with Source Files

```
include_source_files: true
Total Price: base_price + source_files_fee
Email: Shows correct total
```

## Debugging Tips

### Check Function Logs

```bash
# View real-time logs
supabase functions logs stripe-webhook --tail

# View recent logs
supabase functions logs stripe-webhook
```

### Common Issues

#### 1. Signature Verification Failed

```
Error: No signatures found matching the expected signature for payload
```

**Solution**:
- Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check you're using the correct webhook endpoint
- Verify Stripe CLI is forwarding to correct URL

#### 2. Order Not Found

```
Error: Order not found
```

**Solution**:
- Verify `stripe_session_id` in database matches event
- Check database connection
- Ensure order exists before triggering webhook

#### 3. Email Not Sent

```
Error: Failed to send email
```

**Solution**:
- Verify `RESEND_API_KEY` is set correctly
- Check sender email domain is verified
- Check Resend API limits
- View Resend Dashboard for error details

#### 4. Database Update Failed

```
Error: Failed to update order
```

**Solution**:
- Check Row Level Security (RLS) policies
- Ensure using `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- Verify table schema matches update fields
- Check database logs

### Enable Verbose Logging

Add debug logs in the Edge Function:

```typescript
console.log('Event:', JSON.stringify(event, null, 2));
console.log('Order found:', order);
console.log('Delivery deadline:', deliveryDeadline);
console.log('Update result:', updateError);
```

## Test Checklist

- [ ] Local function serves without errors
- [ ] Stripe CLI connects successfully
- [ ] Test order exists in database
- [ ] Webhook triggers on test event
- [ ] Order status updates to 'paid'
- [ ] Payment status updates to 'paid'
- [ ] `paid_at` timestamp is set
- [ ] Delivery deadline is calculated correctly
- [ ] Express orders get 24h deadline
- [ ] Standard orders get 48h deadline
- [ ] Confirmation email is sent
- [ ] Email contains correct order details
- [ ] Email renders correctly in inbox
- [ ] Function returns 200 status
- [ ] No errors in function logs
- [ ] Resend Dashboard shows email sent

## Monitoring in Production

### Stripe Dashboard

Monitor webhook health:
- **Success Rate**: Should be > 99%
- **Response Time**: Should be < 2s
- **Failed Attempts**: Stripe retries failed webhooks

### Supabase Logs

View Edge Function logs:
1. Go to Supabase Dashboard
2. Navigate to **Edge Functions**
3. Select `stripe-webhook`
4. View **Logs** tab

### Resend Dashboard

Monitor email delivery:
- **Delivery Rate**: Should be > 99%
- **Bounce Rate**: Track hard/soft bounces
- **Failed Emails**: Investigate failures

### Database Queries

Check order processing:

```sql
-- Orders paid in last 24 hours
SELECT
  id,
  email,
  payment_status,
  status,
  paid_at,
  delivery_deadline
FROM orders
WHERE paid_at > NOW() - INTERVAL '24 hours'
ORDER BY paid_at DESC;

-- Orders with payment issues
SELECT
  id,
  email,
  payment_status,
  status,
  created_at
FROM orders
WHERE
  payment_status = 'pending'
  AND created_at < NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

## Next Steps

1. Test locally with Stripe CLI
2. Verify database updates
3. Check email delivery
4. Deploy to production
5. Configure production webhook
6. Test with real Stripe checkout
7. Monitor webhook health
8. Set up alerts for failures

Happy testing! 🚀
