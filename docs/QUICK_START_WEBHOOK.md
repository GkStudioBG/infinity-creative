# Quick Start: Webhook Setup

This is a condensed guide to get the webhook running quickly. For detailed information, see the full documentation.

## Prerequisites

- ✅ Supabase project created
- ✅ Orders table exists in database
- ✅ Stripe account (test mode is fine)
- ✅ Resend account (optional, can skip for testing)

## 5-Minute Setup

### 1. Install CLI Tools

```bash
npm install -g supabase stripe
```

### 2. Run Setup Script

**Windows:**
```bash
scripts\setup-webhook.bat
```

**Mac/Linux:**
```bash
chmod +x scripts/setup-webhook.sh
./scripts/setup-webhook.sh
```

The script will prompt you for:
- Supabase project ref
- Stripe secret key
- Stripe webhook secret
- Resend API key (optional)
- App URL

### 3. Configure Stripe

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: Get from Supabase Dashboard > Edge Functions > stripe-webhook
4. Events: Select `checkout.session.completed`
5. Copy webhook signing secret
6. Update: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

### 4. Test It

```bash
stripe trigger checkout.session.completed
```

Check:
- Supabase function logs: No errors
- Database: Order status updated
- Email: Confirmation received

## Environment Variables

```env
# Required
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional (for emails)
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Testing

```bash
# Terminal 1: Start Supabase
supabase start

# Terminal 2: Serve function
supabase functions serve stripe-webhook --env-file .env.local

# Terminal 3: Forward webhooks
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

## Troubleshooting

### Webhook fails with 401
→ Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

### Order not found
→ Ensure order has `stripe_session_id` set

### Email not sent
→ Check `RESEND_API_KEY` is valid
→ Verify sender domain in Resend

### Database update fails
→ Use `SUPABASE_SERVICE_ROLE_KEY`, not anon key

## Files Created

```
supabase/functions/stripe-webhook/index.ts   # Main handler
docs/RESEND_SETUP.md                         # Email setup
docs/WEBHOOK_TESTING.md                      # Testing guide
scripts/setup-webhook.sh                     # Setup script
```

## Next Steps

- [ ] Deploy to production
- [ ] Set up production webhook in Stripe
- [ ] Configure Resend with verified domain
- [ ] Monitor function logs

## Full Documentation

- Setup: `supabase/functions/stripe-webhook/README.md`
- Testing: `docs/WEBHOOK_TESTING.md`
- Email: `docs/RESEND_SETUP.md`
- Verification: `docs/WEBHOOK_VERIFICATION.md`

## Support

Issues? Check the troubleshooting sections in the full docs or review function logs:

```bash
supabase functions logs stripe-webhook --tail
```

---

**Time to complete**: ~5 minutes
**Difficulty**: Easy (with script) / Moderate (manual)
