#!/bin/bash

# Stripe Webhook Setup Script
# This script helps you configure and deploy the Stripe webhook Edge Function

set -e

echo "🚀 Stripe Webhook Setup for Infinity App"
echo "========================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "⚠️  Stripe CLI not found. Install it for testing:"
    echo "   https://stripe.com/docs/stripe-cli"
else
    echo "✅ Stripe CLI found"
fi

echo ""
echo "📋 Setup Checklist:"
echo ""
echo "Before continuing, make sure you have:"
echo "1. [ ] Supabase project created"
echo "2. [ ] Stripe account with test API keys"
echo "3. [ ] Resend account with API key"
echo "4. [ ] Domain verified in Resend (for production)"
echo ""

read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

# Check if already linked
if [ -f ".supabase/config.toml" ]; then
    echo "✅ Project already linked to Supabase"
else
    echo ""
    echo "🔗 Linking to Supabase project..."
    read -p "Enter your Supabase project ref: " PROJECT_REF
    supabase link --project-ref "$PROJECT_REF"
fi

echo ""
echo "🔐 Setting up environment secrets..."
echo ""

# Stripe Secret Key
read -p "Enter STRIPE_SECRET_KEY (sk_test_...): " STRIPE_SECRET_KEY
if [ -n "$STRIPE_SECRET_KEY" ]; then
    supabase secrets set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
    echo "✅ STRIPE_SECRET_KEY set"
fi

# Stripe Webhook Secret
read -p "Enter STRIPE_WEBHOOK_SECRET (whsec_...): " STRIPE_WEBHOOK_SECRET
if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    supabase secrets set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"
    echo "✅ STRIPE_WEBHOOK_SECRET set"
fi

# Resend API Key
read -p "Enter RESEND_API_KEY (re_...): " RESEND_API_KEY
if [ -n "$RESEND_API_KEY" ]; then
    supabase secrets set RESEND_API_KEY="$RESEND_API_KEY"
    echo "✅ RESEND_API_KEY set"
fi

# App URL
read -p "Enter NEXT_PUBLIC_APP_URL (e.g., https://yourdomain.com): " APP_URL
if [ -n "$APP_URL" ]; then
    supabase secrets set NEXT_PUBLIC_APP_URL="$APP_URL"
    echo "✅ NEXT_PUBLIC_APP_URL set"
fi

echo ""
echo "📦 Deploying Edge Function..."
supabase functions deploy stripe-webhook

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Configure Stripe Webhook:"
echo "   - Go to: https://dashboard.stripe.com/webhooks"
echo "   - Add endpoint URL (get it from Supabase Dashboard > Edge Functions)"
echo "   - Select event: checkout.session.completed"
echo "   - Copy the webhook signing secret"
echo "   - Update with: supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_..."
echo ""
echo "2. Test the webhook:"
echo "   - See docs/WEBHOOK_TESTING.md for detailed instructions"
echo "   - Use: stripe trigger checkout.session.completed"
echo ""
echo "3. Monitor function logs:"
echo "   - supabase functions logs stripe-webhook --tail"
echo ""
echo "Need help? Check the documentation in docs/"
echo ""
