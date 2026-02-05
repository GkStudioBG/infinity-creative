# Deployment Quick Start Guide

This is a condensed guide to get your application deployed to Cloudflare Pages as quickly as possible.

## Prerequisites Checklist

- [ ] Supabase project created and configured
- [ ] Stripe account with API keys
- [ ] Resend account with API key
- [ ] Cloudflare account
- [ ] GitHub repository with your code

## Step-by-Step Deployment

### 1. Prepare Your Services (15 minutes)

#### Supabase
```bash
# Run migrations
supabase db push

# Set up Storage bucket
# Go to Storage > Create bucket: "order-files" (public: false)

# Set secrets for Edge Functions
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set NEXT_PUBLIC_APP_URL=https://yourdomain.pages.dev

# Deploy Edge Functions
cd supabase/functions
supabase functions deploy stripe-webhook
```

#### Stripe
1. Go to Stripe Dashboard > API Keys
2. Copy your live publishable key (pk_live_...)
3. Copy your live secret key (sk_live_...)
4. We'll set up webhooks after deployment

#### Resend
1. Sign up at resend.com
2. Verify your domain
3. Create an API key

### 2. Deploy to Cloudflare Pages (10 minutes)

#### Via Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com/
   - Navigate to Workers & Pages > Pages

2. **Connect Repository**
   - Click "Create a project"
   - Click "Connect to Git"
   - Authorize GitHub and select your repository

3. **Configure Build**
   - Framework preset: **Next.js (SSR)**
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
   - Node version: `20`

4. **Set Environment Variables**

   Click "Add environment variables" and add these for **Production**:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   NEXT_PUBLIC_APP_URL
   ```

   Values from your Supabase and Stripe dashboards.

5. **Deploy**
   - Click "Save and Deploy"
   - Wait 2-5 minutes for build to complete
   - Your site will be live at `https://your-project.pages.dev`

6. **Set Function Secrets**

   After deployment, go to Settings > Functions > Environment Variables:

   Add these secrets:
   ```
   SUPABASE_SERVICE_ROLE_KEY
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   RESEND_API_KEY
   ```

   **Redeploy** after adding these (click "Retry deployment" on latest deployment)

### 3. Configure Webhooks (5 minutes)

#### Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.pages.dev/api/webhook/stripe`
4. Description: "Infinity Order Payments"
5. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Click "Add endpoint"
7. Click "Reveal" on signing secret
8. Copy the `whsec_...` key
9. Update in Cloudflare Pages Functions Environment Variables
10. Redeploy

#### Update Supabase Edge Function
```bash
# Update the webhook secret in Supabase
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_new_production_secret
```

### 4. Test Everything (10 minutes)

#### Test Checklist

1. **Visit your site**: `https://your-domain.pages.dev`
   - [ ] Landing page loads
   - [ ] No console errors
   - [ ] Images load correctly

2. **Test Order Flow**
   - [ ] Fill out order form
   - [ ] Click "Proceed to Payment"
   - [ ] Use test card: `4242 4242 4242 4242`, any future date, any CVC
   - [ ] Complete payment
   - [ ] Should redirect to success page
   - [ ] Check email for confirmation

3. **Check Backend**
   - [ ] Stripe Dashboard > Payments - payment appears
   - [ ] Stripe Dashboard > Webhooks - events show successful
   - [ ] Supabase Table Editor - order marked as "paid"
   - [ ] Resend Dashboard - email sent

4. **Test Dashboard**
   - [ ] Go to `/dashboard`
   - [ ] Enter order email or ID
   - [ ] See order status and countdown timer

### 5. Optional: Custom Domain (5 minutes)

1. In Cloudflare Pages, go to Custom domains
2. Click "Set up a custom domain"
3. Enter your domain
4. Follow DNS instructions
5. Update `NEXT_PUBLIC_APP_URL` to your custom domain
6. Update Stripe webhook URL to use custom domain
7. Redeploy

## Common Issues & Fixes

### Build Fails

**"Cannot find module"**
```bash
# Locally run:
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Site Loads but API Fails

**Check Function Environment Variables**
- Ensure all secrets are set under Settings > Functions
- Must redeploy after adding function variables

**Check Logs**
```bash
# Install wrangler
npm install -g wrangler

# View logs
wrangler pages deployment tail --project-name=your-project
```

### Webhook Not Working

1. Check webhook URL is correct
2. Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
3. Check Stripe webhook logs for error details
4. Ensure Supabase Edge Function has correct secret

### Emails Not Sending

1. Verify domain in Resend dashboard
2. Check RESEND_API_KEY is correct
3. Check Supabase Edge Function logs:
   ```bash
   supabase functions logs stripe-webhook --project-ref your-ref
   ```

## Quick Commands Reference

```bash
# View deployment logs
wrangler pages deployment tail

# Update a secret
wrangler pages secret put SECRET_NAME

# List deployments
wrangler pages deployment list

# Rollback to previous deployment
# (Do this via dashboard: Deployments > Click three dots > Rollback)

# Check build locally before deploying
npm run build
npm run pages:build
```

## What's Next?

After successful deployment:

1. **Switch to Live Mode**
   - Change all test API keys (pk_test_, sk_test_) to live keys (pk_live_, sk_live_)
   - Update environment variables in Cloudflare
   - Test with a real payment (you can refund it after)

2. **Set Up Monitoring**
   - Enable Cloudflare Web Analytics
   - Set up email alerts for deployment failures
   - Monitor Stripe webhooks regularly

3. **Optimize Performance**
   - Run Lighthouse audit
   - Optimize images further
   - Enable Cloudflare caching rules

4. **Business Tasks**
   - Add your actual portfolio images
   - Update support email address
   - Write your privacy policy and terms
   - Set up business email forwarding

## Support

- [Detailed Deployment Guide](./CLOUDFLARE_DEPLOYMENT.md)
- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)
- [Stripe Integration Details](./../.zenflow/tasks/new-task-3674/STRIPE_INTEGRATION.md)
- [Webhook Implementation](./../.zenflow/tasks/new-task-3674/webhook-implementation-summary.md)

## Emergency Contacts

- **Cloudflare Support**: https://community.cloudflare.com/
- **Stripe Support**: https://support.stripe.com/
- **Supabase Support**: https://supabase.com/support
- **Resend Support**: support@resend.com

---

**Estimated Total Time**: 45 minutes

**Cost**:
- Cloudflare Pages: Free tier (sufficient for launch)
- Supabase: Free tier (500MB database, 2GB bandwidth/month)
- Stripe: No monthly fee, 2.9% + €0.30 per transaction
- Resend: Free tier (100 emails/day)

**Next Review**: After first 10 orders, review analytics and performance
