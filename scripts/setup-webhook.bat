@echo off
REM Stripe Webhook Setup Script for Windows
REM This script helps you configure and deploy the Stripe webhook Edge Function

echo.
echo 🚀 Stripe Webhook Setup for Infinity App
echo ========================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Supabase CLI not found. Please install it first:
    echo    npm install -g supabase
    exit /b 1
)

echo ✅ Supabase CLI found

REM Check if Stripe CLI is installed
where stripe >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Stripe CLI not found. Install it for testing:
    echo    https://stripe.com/docs/stripe-cli
) else (
    echo ✅ Stripe CLI found
)

echo.
echo 📋 Setup Checklist:
echo.
echo Before continuing, make sure you have:
echo 1. [ ] Supabase project created
echo 2. [ ] Stripe account with test API keys
echo 3. [ ] Resend account with API key
echo 4. [ ] Domain verified in Resend (for production)
echo.

set /p CONTINUE="Do you want to continue? (y/n) "
if /i not "%CONTINUE%"=="y" exit /b 0

REM Check if already linked
if exist ".supabase\config.toml" (
    echo ✅ Project already linked to Supabase
) else (
    echo.
    echo 🔗 Linking to Supabase project...
    set /p PROJECT_REF="Enter your Supabase project ref: "
    supabase link --project-ref %PROJECT_REF%
)

echo.
echo 🔐 Setting up environment secrets...
echo.

REM Stripe Secret Key
set /p STRIPE_SECRET_KEY="Enter STRIPE_SECRET_KEY (sk_test_...): "
if not "%STRIPE_SECRET_KEY%"=="" (
    supabase secrets set STRIPE_SECRET_KEY=%STRIPE_SECRET_KEY%
    echo ✅ STRIPE_SECRET_KEY set
)

REM Stripe Webhook Secret
set /p STRIPE_WEBHOOK_SECRET="Enter STRIPE_WEBHOOK_SECRET (whsec_...): "
if not "%STRIPE_WEBHOOK_SECRET%"=="" (
    supabase secrets set STRIPE_WEBHOOK_SECRET=%STRIPE_WEBHOOK_SECRET%
    echo ✅ STRIPE_WEBHOOK_SECRET set
)

REM Resend API Key
set /p RESEND_API_KEY="Enter RESEND_API_KEY (re_...): "
if not "%RESEND_API_KEY%"=="" (
    supabase secrets set RESEND_API_KEY=%RESEND_API_KEY%
    echo ✅ RESEND_API_KEY set
)

REM App URL
set /p APP_URL="Enter NEXT_PUBLIC_APP_URL (e.g., https://yourdomain.com): "
if not "%APP_URL%"=="" (
    supabase secrets set NEXT_PUBLIC_APP_URL=%APP_URL%
    echo ✅ NEXT_PUBLIC_APP_URL set
)

echo.
echo 📦 Deploying Edge Function...
supabase functions deploy stripe-webhook

echo.
echo ✅ Deployment complete!
echo.
echo 📝 Next steps:
echo.
echo 1. Configure Stripe Webhook:
echo    - Go to: https://dashboard.stripe.com/webhooks
echo    - Add endpoint URL (get it from Supabase Dashboard ^> Edge Functions)
echo    - Select event: checkout.session.completed
echo    - Copy the webhook signing secret
echo    - Update with: supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
echo.
echo 2. Test the webhook:
echo    - See docs/WEBHOOK_TESTING.md for detailed instructions
echo    - Use: stripe trigger checkout.session.completed
echo.
echo 3. Monitor function logs:
echo    - supabase functions logs stripe-webhook --tail
echo.
echo Need help? Check the documentation in docs/
echo.

pause
