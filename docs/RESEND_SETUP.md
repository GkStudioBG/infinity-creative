# Resend Email Setup Guide

This guide walks you through setting up Resend for sending order confirmation emails.

## What is Resend?

Resend is a modern email API service built for developers. It provides reliable email delivery with a simple API.

## Step-by-Step Setup

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" or "Get Started"
3. Sign up with your email or GitHub account
4. Verify your email address

### 2. Verify Your Domain (Production)

For production use, you must verify your own domain:

1. In Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `infinitycreative.com`)
4. Add the provided DNS records to your domain:
   - **TXT record** for domain verification
   - **MX records** for receiving bounces (optional but recommended)
   - **DKIM records** for email authentication

**Example DNS Records:**
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...

Type: MX
Name: @
Value: 10 feedback-smtp.resend.com
Priority: 10
```

5. Wait for DNS propagation (can take up to 48 hours, usually much faster)
6. Click **Verify** in Resend Dashboard

### 3. Generate API Key

1. In Resend Dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it (e.g., "Production - Infinity App")
4. Choose permission: **Sending access**
5. Click **Add**
6. **Copy the API key immediately** - you won't see it again!

API key format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Configure Environment Variables

#### For Supabase Edge Function:

Add the API key as a Supabase secret:

```bash
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here
```

#### For Local Development:

Add to your `.env.local`:

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

### 5. Update Email Sender Address

In `supabase/functions/stripe-webhook/index.ts`, update the `from` field:

```typescript
from: "Infinity Creative <orders@infinitycreative.com>",
```

Replace with your verified domain:
- Format: `"Your Name <email@yourdomain.com>"`
- The email domain must match your verified domain in Resend

### 6. Test Email Sending

#### Using Test Mode (Development)

Resend provides a test domain for development:

```typescript
from: "onboarding@resend.dev"
```

- Emails sent from `resend.dev` are delivered but marked as test
- Limited to 100 emails/day
- Use for development only

#### Testing the Integration

1. Deploy your Edge Function (see webhook README)
2. Trigger a test webhook with Stripe CLI:
   ```bash
   stripe trigger checkout.session.completed
   ```
3. Check Resend Dashboard > **Emails** to see delivery status
4. Check your inbox for the confirmation email

## Email Best Practices

### 1. Sender Reputation

- Use a dedicated subdomain for transactional emails (e.g., `mail.infinitycreative.com`)
- This protects your main domain reputation
- Configure SPF, DKIM, and DMARC records

### 2. Email Content

Our template follows best practices:
- Plain text alternative (accessible)
- Mobile-responsive design
- Clear call-to-action
- Unsubscribe link (for marketing emails)
- Company contact information

### 3. Monitoring

Monitor these metrics in Resend Dashboard:
- **Delivery Rate**: Should be > 99%
- **Bounce Rate**: Should be < 2%
- **Complaint Rate**: Should be < 0.1%
- **Open Rate**: Typically 20-40% for transactional emails

### 4. Error Handling

The webhook handles email errors gracefully:
- Email failures don't fail the webhook
- Errors are logged for monitoring
- Order is still updated even if email fails

## Pricing

Resend pricing (as of 2024):
- **Free Tier**: 3,000 emails/month
- **Pro**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

Transactional emails (like order confirmations) count as 1 email each.

## Troubleshooting

### Email Not Received

1. **Check Spam Folder**: First place to look
2. **Verify Domain**: Ensure domain is verified in Resend
3. **Check API Key**: Ensure it's correctly set in Supabase secrets
4. **Check Logs**: View Edge Function logs in Supabase Dashboard
5. **Resend Dashboard**: Check **Emails** tab for delivery status

### Domain Verification Issues

- DNS changes can take up to 48 hours to propagate
- Use [DNS Checker](https://dnschecker.org) to verify records
- Ensure no typos in DNS records
- Remove any trailing dots from record values

### API Errors

Common error codes:
- `401 Unauthorized`: Invalid API key
- `403 Forbidden`: Domain not verified
- `422 Unprocessable`: Invalid email format or content
- `429 Too Many Requests`: Rate limit exceeded

### Development vs Production

| Environment | Domain | Limits | Use Case |
|-------------|--------|--------|----------|
| Development | `resend.dev` | 100/day | Testing |
| Production | Your domain | Plan limit | Live orders |

## Security

- **Never commit API keys** to version control
- Store keys in Supabase secrets or environment variables
- Rotate keys periodically (e.g., every 90 days)
- Use separate keys for development and production
- Monitor API usage for anomalies

## Alternative: Test Mode Without Resend

If you don't want to set up Resend immediately, you can:

1. Comment out email sending code in webhook
2. Log email content to console instead
3. Use a service like [Mailtrap](https://mailtrap.io) for testing

Example modification:

```typescript
// Instead of sending via Resend
console.log('Email would be sent to:', order.email);
console.log('Email content:', generateConfirmationEmail(order, deliveryDeadline));
```

## Support

- Resend Documentation: [resend.com/docs](https://resend.com/docs)
- Resend Support: support@resend.com
- Resend Discord: [Join here](https://resend.com/discord)

## Next Steps

1. ✅ Create Resend account
2. ✅ Verify domain (production) or use test domain (dev)
3. ✅ Generate API key
4. ✅ Add API key to Supabase secrets
5. ✅ Update sender email in code
6. ✅ Deploy Edge Function
7. ✅ Test email delivery
8. ✅ Monitor delivery metrics

Once configured, your order confirmations will be sent automatically when payments complete!
