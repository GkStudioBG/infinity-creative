# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Infinity Productized Service platform to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account with Pages enabled
2. Wrangler CLI installed globally: `npm install -g wrangler`
3. All environment variables configured (see ENVIRONMENT_VARIABLES.md)

## Deployment Options

### Option 1: Deploy via Cloudflare Dashboard (Recommended for first deployment)

1. **Connect Your Repository**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Pages → Create a project
   - Connect your Git repository (GitHub/GitLab)

2. **Configure Build Settings**
   - Framework preset: **Next.js**
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
   - Root directory: `/` (or your project root)

3. **Set Environment Variables** (CRITICAL)

   Go to Settings → Environment variables and add:

   **Required for all environments:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
   ```

   **Production-only secrets (under Functions tab):**
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   RESEND_API_KEY=re_your_resend_api_key
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for the build to complete
   - Your site will be available at `https://your-project.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

2. **Build and Deploy**
   ```bash
   npm run pages:deploy
   ```

3. **Set Environment Variables via CLI**
   ```bash
   # Set production environment variables
   wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY
   wrangler pages secret put STRIPE_SECRET_KEY
   wrangler pages secret put STRIPE_WEBHOOK_SECRET
   wrangler pages secret put RESEND_API_KEY
   ```

## Post-Deployment Configuration

### 1. Update Stripe Webhook URL

After deployment, update your Stripe webhook endpoint:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Update the endpoint URL to: `https://your-domain.pages.dev/api/webhook/stripe`
3. Ensure these events are selected:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 2. Update Supabase Allowed Origins

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Cloudflare Pages URL to "Site URL" and "Redirect URLs":
   - `https://your-domain.pages.dev`
   - `https://your-domain.pages.dev/**`

### 3. Configure Custom Domain (Optional)

1. In Cloudflare Pages → Custom domains
2. Add your custom domain
3. Update DNS settings as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain

### 4. Test the Deployment

1. **Test Order Flow:**
   - Visit your site
   - Fill out the order form
   - Complete a test payment (use Stripe test card: 4242 4242 4242 4242)
   - Verify you receive confirmation email
   - Check dashboard for order status

2. **Test API Routes:**
   - `/api/checkout` - Create checkout session
   - `/api/checkout/session` - Retrieve session details

3. **Verify Webhook:**
   - Check Stripe Dashboard → Webhooks for successful events
   - Verify orders are marked as "paid" in Supabase after payment

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Run `npm install` locally first to ensure all dependencies are in package.json

**Error: "API routes cannot be statically exported"**
- This is expected. API routes will run as Cloudflare Workers automatically.

### Runtime Errors

**Error: "Environment variable not defined"**
- Solution: Double-check all environment variables are set in Cloudflare Pages dashboard
- Ensure production secrets are set under the Functions tab, not just Pages

**Error: "Failed to connect to Supabase"**
- Solution: Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check Supabase project is active and not paused

**Error: "Stripe webhook signature verification failed"**
- Solution: Get the new webhook signing secret from Stripe after updating the endpoint URL
- Update STRIPE_WEBHOOK_SECRET in Cloudflare

### Performance Issues

- Enable Cloudflare's Argo Smart Routing for faster global performance
- Use Cloudflare Images for portfolio image optimization
- Enable caching rules in Cloudflare dashboard

## Monitoring and Maintenance

### View Logs

**Via Dashboard:**
- Cloudflare Dashboard → Pages → Your Project → Logs

**Via CLI:**
```bash
wrangler pages deployment tail
```

### Rollback Deployment

If something goes wrong:
1. Go to Cloudflare Dashboard → Pages → Deployments
2. Find the last working deployment
3. Click "Rollback to this deployment"

### Update Environment Variables

**Via Dashboard:**
- Settings → Environment variables → Edit

**Via CLI:**
```bash
wrangler pages secret put VARIABLE_NAME
```

After updating variables, trigger a new deployment to apply changes.

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run pages:build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: infinity-productized-service
          directory: .vercel/output/static
```

Add these secrets to your GitHub repository settings.

## Cost Estimation

Cloudflare Pages pricing (as of 2026):
- **Free Tier:**
  - 500 builds/month
  - 100 custom domains
  - Unlimited requests
  - Unlimited bandwidth

- **Pro ($20/month):**
  - 5,000 builds/month
  - Analytics
  - Access control

Your application should fit comfortably in the free tier for initial launch.

## Next Steps

1. Set up monitoring with Cloudflare Web Analytics
2. Configure email notifications for deployment failures
3. Set up preview deployments for staging/testing
4. Enable Cloudflare Bot Management to prevent spam orders

## Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Community](https://community.cloudflare.com/)
