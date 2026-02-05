# Webhook Deployment Checklist

Use this checklist to ensure proper deployment of the webhook and email system.

## Pre-Deployment

### Accounts & Access

- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Supabase CLI installed and authenticated
- [ ] Stripe account created
- [ ] Stripe CLI installed (for testing)
- [ ] Resend account created
- [ ] Domain verified in Resend (production only)

### Local Environment

- [ ] `.env.local` configured with all variables
- [ ] Local testing completed successfully
- [ ] Stripe CLI webhook forwarding tested
- [ ] Database order updates verified
- [ ] Email sends locally (if Resend configured)

## Deployment Steps

### 1. Supabase Edge Function

- [ ] Link to Supabase project: `supabase link --project-ref xxx`
- [ ] Set environment secrets:
  ```bash
  supabase secrets set STRIPE_SECRET_KEY=sk_...
  supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
  supabase secrets set RESEND_API_KEY=re_...
  supabase secrets set NEXT_PUBLIC_APP_URL=https://...
  ```
- [ ] Deploy function: `supabase functions deploy stripe-webhook`
- [ ] Verify deployment in Supabase Dashboard
- [ ] Copy Edge Function URL from dashboard

### 2. Stripe Configuration

- [ ] Go to Stripe Dashboard > Developers > Webhooks
- [ ] Click "Add endpoint"
- [ ] Enter Edge Function URL
- [ ] Select event: `checkout.session.completed`
- [ ] Save and copy signing secret
- [ ] Update Supabase secret with signing secret
- [ ] Verify webhook is active

### 3. Resend Configuration (Production)

- [ ] Domain verified in Resend Dashboard
- [ ] DNS records added and verified
- [ ] API key generated
- [ ] Added to Supabase secrets
- [ ] Sender email updated in code (if needed)
- [ ] Test email sent successfully

## Post-Deployment Verification

### Test Payment Flow

- [ ] Create test order in production
- [ ] Complete Stripe checkout (use test card)
- [ ] Verify redirect to success page
- [ ] Check Stripe Dashboard for payment
- [ ] Check webhook delivery status

### Verify Database Update

- [ ] Order `payment_status` changed to 'paid'
- [ ] Order `status` changed to 'in_progress'
- [ ] `paid_at` timestamp set
- [ ] `delivery_deadline` calculated and set
- [ ] `updated_at` timestamp updated

### Verify Email Delivery

- [ ] Confirmation email received
- [ ] Email displays correctly
- [ ] All order details present
- [ ] Links work (order tracking)
- [ ] Branding correct
- [ ] No formatting issues

### Check Logs & Monitoring

- [ ] Supabase function logs show no errors
- [ ] Stripe webhook shows 200 response
- [ ] Resend dashboard shows delivery
- [ ] No failed attempts in Stripe

## Production Settings

### Environment Variables (Production)

- [ ] `STRIPE_SECRET_KEY` → Production key (sk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` → Production webhook secret
- [ ] `RESEND_API_KEY` → Production API key
- [ ] `NEXT_PUBLIC_APP_URL` → Production domain
- [ ] `SUPABASE_URL` → Production Supabase URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` → Production service role key

### Security Check

- [ ] All secrets use production values
- [ ] No test API keys in production
- [ ] Webhook signature verification enabled
- [ ] Service role key kept secure
- [ ] Environment variables not exposed to client

## Monitoring Setup

### Alerts & Notifications

- [ ] Set up Stripe webhook monitoring
- [ ] Configure Resend bounce notifications
- [ ] Monitor Supabase function error rate
- [ ] Set up alerts for failed webhooks

### Metrics to Track

- [ ] Webhook success rate (target: >99%)
- [ ] Email delivery rate (target: >99%)
- [ ] Function response time (target: <2s)
- [ ] Database update failures (target: 0)

## Rollback Plan

If issues occur:

1. **Disable Webhook**
   - Go to Stripe Dashboard > Webhooks
   - Disable the endpoint temporarily
   - Orders will remain in 'pending' status

2. **Revert Edge Function**
   ```bash
   supabase functions delete stripe-webhook
   ```

3. **Manual Order Processing**
   - Check Stripe Dashboard for payments
   - Update orders manually in database
   - Send emails manually if needed

## Common Issues

### Webhook Returns 4xx/5xx

- Check function logs: `supabase functions logs stripe-webhook`
- Verify environment secrets are set
- Check database connectivity
- Verify order exists with correct `stripe_session_id`

### Email Not Sending

- Check Resend API key is valid
- Verify sender domain is verified
- Check Resend Dashboard for errors
- Review function logs for email errors

### Database Not Updating

- Verify service role key is used (not anon key)
- Check RLS policies (service role should bypass)
- Verify table/column names match code
- Check database logs for errors

## Success Criteria

Deployment is successful when:

- [x] Edge Function deploys without errors
- [x] Webhook endpoint configured in Stripe
- [x] Test payment triggers webhook
- [x] Order updates in database
- [x] Email delivers successfully
- [x] No errors in function logs
- [x] Monitoring shows healthy metrics

## Sign-Off

### Development Environment

- Tested by: _______________
- Date: _______________
- Status: ☐ Pass ☐ Fail

### Staging Environment (if applicable)

- Tested by: _______________
- Date: _______________
- Status: ☐ Pass ☐ Fail

### Production Environment

- Deployed by: _______________
- Date: _______________
- Verified by: _______________
- Status: ☐ Live ☐ Rollback

## Next Steps After Deployment

1. **Monitor for 24 Hours**
   - Watch function logs
   - Check webhook success rate
   - Monitor email delivery rate
   - Verify no errors occur

2. **Test with Real Customer (if possible)**
   - Create real test order
   - Complete full payment flow
   - Verify customer experience

3. **Documentation Updates**
   - Update README if any changes made
   - Document any issues encountered
   - Add production URLs to docs

4. **Team Communication**
   - Notify team deployment is complete
   - Share monitoring dashboard links
   - Document any known issues

## Resources

- Function Logs: Supabase Dashboard > Edge Functions > Logs
- Webhook Status: Stripe Dashboard > Developers > Webhooks
- Email Status: Resend Dashboard > Emails
- Database: Supabase Dashboard > Table Editor

## Support Contacts

- **Supabase Issues**: support@supabase.com
- **Stripe Issues**: https://support.stripe.com
- **Resend Issues**: support@resend.com

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Status**: ☐ Complete ☐ In Progress ☐ Failed
