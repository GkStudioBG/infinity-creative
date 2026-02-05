# Deployment Guide

This application is ready to be deployed to Cloudflare Pages with Next.js SSR support.

## Quick Links

- **Quick Start**: [docs/DEPLOYMENT_QUICKSTART.md](./docs/DEPLOYMENT_QUICKSTART.md) - Get deployed in 45 minutes
- **Detailed Guide**: [docs/CLOUDFLARE_DEPLOYMENT.md](./docs/CLOUDFLARE_DEPLOYMENT.md) - Complete deployment reference
- **Environment Variables**: [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md) - All required configuration

## Deployment Status

### ✅ Ready for Deployment

The application is fully configured for Cloudflare Pages deployment:

- [x] Next.js build configured for Cloudflare
- [x] @cloudflare/next-on-pages adapter installed
- [x] API routes marked as dynamic
- [x] useSearchParams wrapped in Suspense
- [x] Build scripts added to package.json
- [x] Environment variables documented
- [x] wrangler.toml configuration created
- [x] .gitignore updated

### 🚀 Deployment Methods

#### 1. Via Cloudflare Dashboard (Recommended)
```
1. Connect Git repository
2. Set build command: npm run pages:build
3. Set output directory: .vercel/output/static
4. Add environment variables
5. Deploy
```

#### 2. Via Wrangler CLI
```bash
npm run pages:deploy
```

See detailed instructions in [DEPLOYMENT_QUICKSTART.md](./docs/DEPLOYMENT_QUICKSTART.md)

## Build Commands

```bash
# Standard Next.js build
npm run build

# Cloudflare Pages build (for adapter)
npm run pages:build

# Local development with Cloudflare Pages
npm run pages:dev

# Deploy to Cloudflare Pages
npm run pages:deploy
```

## Required Services

Before deploying, ensure you have:

1. **Supabase** - Database and Edge Functions
   - Project created
   - Migrations run
   - Storage bucket configured
   - Edge Functions deployed

2. **Stripe** - Payment processing
   - Account created
   - API keys obtained
   - Webhook will be configured after deployment

3. **Resend** - Email notifications
   - Account created
   - Domain verified
   - API key obtained

4. **Cloudflare** - Hosting platform
   - Account created
   - Pages enabled

## Environment Variables Checklist

### Public (Build-time)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`

### Secrets (Runtime - Functions)
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `RESEND_API_KEY`

## Post-Deployment Tasks

After your first deployment:

1. **Update Stripe Webhook**
   - Set URL to: `https://your-domain.pages.dev/api/webhook/stripe`
   - Copy new webhook secret
   - Update `STRIPE_WEBHOOK_SECRET` in Cloudflare

2. **Update Supabase**
   - Add your domain to allowed origins
   - Update Edge Function webhook secret

3. **Test Order Flow**
   - Complete a test order
   - Verify payment processing
   - Check email delivery
   - Verify database updates

4. **Custom Domain** (Optional)
   - Add custom domain in Cloudflare
   - Update DNS records
   - Update `NEXT_PUBLIC_APP_URL`

## Monitoring

After deployment, monitor:

- **Cloudflare Logs**: Deployment and function logs
- **Stripe Dashboard**: Payment events and webhook status
- **Supabase Dashboard**: Database and Edge Function logs
- **Resend Dashboard**: Email delivery status

## Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Build fails | Check all dependencies in package.json |
| API routes fail | Verify Function environment variables are set |
| Webhooks fail | Update STRIPE_WEBHOOK_SECRET after configuring webhook |
| Emails not sending | Verify Resend domain and API key |

See [CLOUDFLARE_DEPLOYMENT.md](./docs/CLOUDFLARE_DEPLOYMENT.md) for detailed troubleshooting.

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs/payments/checkout)

## Cost Estimate

Based on free tiers:

- **Cloudflare Pages**: Free (unlimited requests)
- **Supabase**: Free (500MB, 2GB bandwidth/month)
- **Resend**: Free (100 emails/day)
- **Stripe**: Free (pay per transaction: 2.9% + €0.30)

Perfect for launch and initial growth.

---

**Need help?** See the detailed guides in the `docs/` folder.
