# Infinity Productized Service Platform

A streamlined platform for automated design service sales with multi-step order forms, Stripe payments, and automated delivery tracking.

## Features

- Landing page with pricing, portfolio, and clear service rules
- Multi-step order form with validation
- Stripe payment integration
- Supabase backend with Edge Functions
- Automated email confirmations via Resend
- Order tracking dashboard
- Dark mode support
- Fully responsive design
- Static export for Cloudflare Pages

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (test mode)
- Resend account (optional for email)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd infinity-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (optional)
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Backend Setup

### 1. Supabase Database

The database migration file is in `supabase/migrations/`. Apply it to your Supabase project:

```bash
supabase db push
```

This creates the `orders` table with all necessary columns.

### 2. Stripe Webhook

The Stripe webhook handles payment confirmations and triggers email notifications.

#### Quick Setup:

```bash
# Windows
scripts\setup-webhook.bat

# Linux/Mac
chmod +x scripts/setup-webhook.sh
./scripts/setup-webhook.sh
```

#### Manual Setup:

See detailed instructions in:
- `supabase/functions/stripe-webhook/README.md` - Edge Function documentation
- `docs/WEBHOOK_TESTING.md` - Testing guide

### 3. Resend Email

Configure Resend for sending order confirmation emails.

See detailed instructions in:
- `docs/RESEND_SETUP.md` - Complete Resend setup guide

Quick steps:
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Generate API key
4. Add to Supabase secrets: `supabase secrets set RESEND_API_KEY=re_...`

## Project Structure

```
infinity-app/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── landing/         # Landing page sections
│   │   ├── layout/          # Layout components
│   │   ├── order-form/      # Multi-step form components
│   │   ├── shared/          # Shared components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and clients
│   ├── schemas/             # Zod validation schemas
│   └── types/               # TypeScript types
├── supabase/
│   ├── functions/           # Edge Functions
│   │   └── stripe-webhook/  # Stripe webhook handler
│   └── migrations/          # Database migrations
├── docs/                    # Documentation
├── scripts/                 # Setup scripts
└── public/                  # Static assets
```

## Development

### Running Locally

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Testing Webhooks Locally

1. Start Supabase locally:

```bash
supabase start
```

2. Serve Edge Function:

```bash
supabase functions serve stripe-webhook --env-file .env.local
```

3. Forward Stripe events:

```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

See `docs/WEBHOOK_TESTING.md` for detailed testing instructions.

## Deployment

### Cloudflare Pages

1. Build static export:

```bash
npm run build
```

2. Deploy to Cloudflare Pages:

```bash
npx wrangler pages deploy out
```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments.

### Environment Variables

Set these in Cloudflare Pages settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

### Supabase Edge Functions

Deploy webhook function:

```bash
supabase functions deploy stripe-webhook
```

Set production secrets:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Stripe Production Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Update webhook secret in Supabase

## Documentation

- `docs/RESEND_SETUP.md` - Email service setup
- `docs/WEBHOOK_TESTING.md` - Webhook testing guide
- `supabase/functions/stripe-webhook/README.md` - Edge Function docs
- `.zenflow/tasks/new-task-3674/spec.md` - Technical specification

## License

Proprietary - Infinity Creative Ltd.

## Support

For questions or issues, contact support@infinitycreative.com
