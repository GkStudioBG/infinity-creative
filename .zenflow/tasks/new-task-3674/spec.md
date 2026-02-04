# Technical Specification: Infinity Productized Service Platform

## Overview

**Project**: UI/UX Prototype for automated design services sales platform
**Brand**: Infinity Creative Ltd
**Difficulty**: Hard
**Deployment Target**: Cloudflare Pages (Static Export)

---

## Technical Context

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router, Static Export) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Components | shadcn/ui + Radix UI | Latest |
| State Management | Zustand | 4.x |
| Forms | React Hook Form + Zod | Latest |
| Backend | Supabase (Database, Auth, Edge Functions) | Latest |
| Payments | Stripe (Checkout Session) | Latest |
| Email | Resend | Latest |
| Animations | Framer Motion | Latest |
| Icons | Lucide React | Latest |

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "@supabase/supabase-js": "^2.42.0",
    "@stripe/stripe-js": "^3.0.0",
    "resend": "^3.2.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.365.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## Business Context

### Pricing Model (All prices exclude VAT)

| Service | Price |
|---------|-------|
| Single Design | €49 |
| Package of 5 | €199 |
| Express Delivery (under 24h) | +€30-50 |
| Additional Revisions | €20/hour |

### Included in Every Order
- 2 rounds of minor revisions
- 48-hour standard delivery
- Digital delivery via email/dashboard

### Design Types
- Logo
- Banner
- Social Media Graphics
- Print Materials
- Other

---

## Implementation Approach

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                         │
│                   (Static Next.js)                          │
├─────────────────────────────────────────────────────────────┤
│  Landing Page │ Order Form │ Checkout │ Dashboard │ Success │
└───────────────┴────────────┴──────────┴───────────┴─────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                               │
├──────────────┬──────────────┬───────────────────────────────┤
│   Database   │     Auth     │      Edge Functions           │
│   (Orders,   │   (Client    │   (Stripe Webhook,            │
│    Users)    │    Login)    │    Email via Resend)          │
└──────────────┴──────────────┴───────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
      ┌──────────────┐               ┌──────────────┐
      │    Stripe    │               │    Resend    │
      │  (Payments)  │               │   (Emails)   │
      └──────────────┘               └──────────────┘
```

### User Flow

```
1. Landing Page
   └── Hero → How it Works → Pricing → Rules → Portfolio → CTA

2. Order Form (Multi-step)
   └── Step 1: Project Type (Logo/Banner/Social/Print/Other)
   └── Step 2: Content Details (Text, Dimensions)
   └── Step 3: Visual References (Links, File Upload)
   └── Step 4: Additional Options (Express, Source Files)
   └── Step 5: Summary & Payment

3. Stripe Checkout
   └── Redirect to Stripe → Payment → Webhook → Back to Success

4. Success Page
   └── Order Confirmation → Timer (48h/24h) → Dashboard Link

5. Client Dashboard
   └── Order Status → Timer → Download Files (when ready)
```

---

## Source Code Structure

```
infinity-productized-service/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Cloudflare Pages deployment
├── public/
│   ├── fonts/                      # Inter font files
│   ├── images/
│   │   ├── portfolio/              # Portfolio examples
│   │   └── icons/                  # Custom icons
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (dark mode, fonts)
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles + Tailwind
│   │   ├── order/
│   │   │   └── page.tsx            # Multi-step order form
│   │   ├── checkout/
│   │   │   └── page.tsx            # Pre-checkout summary
│   │   ├── success/
│   │   │   └── page.tsx            # Order confirmation
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Client dashboard
│   │   └── api/                    # API routes (for local dev)
│   │       ├── create-checkout/
│   │       │   └── route.ts
│   │       └── webhook/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx          # Navigation header
│   │   │   ├── footer.tsx          # Footer with links
│   │   │   └── container.tsx       # Max-width container
│   │   ├── landing/
│   │   │   ├── hero.tsx            # Hero section
│   │   │   ├── how-it-works.tsx    # 3-step process
│   │   │   ├── pricing-table.tsx   # Pricing cards
│   │   │   ├── rules.tsx           # Terms/rules block
│   │   │   ├── portfolio-grid.tsx  # Work examples
│   │   │   └── cta-section.tsx     # Call to action
│   │   ├── order-form/
│   │   │   ├── form-wrapper.tsx    # Multi-step container
│   │   │   ├── step-indicator.tsx  # Progress bar
│   │   │   ├── step-project-type.tsx
│   │   │   ├── step-content.tsx
│   │   │   ├── step-references.tsx
│   │   │   ├── step-options.tsx
│   │   │   ├── step-summary.tsx
│   │   │   └── file-upload.tsx     # Drag & drop upload
│   │   ├── dashboard/
│   │   │   ├── order-card.tsx      # Single order display
│   │   │   ├── countdown-timer.tsx # Delivery countdown
│   │   │   └── status-badge.tsx    # Order status
│   │   └── shared/
│   │       ├── logo.tsx            # Infinity logo
│   │       ├── theme-toggle.tsx    # Dark/light mode
│   │       └── loading-spinner.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── types.ts            # Database types
│   │   ├── stripe/
│   │   │   └── client.ts           # Stripe initialization
│   │   ├── utils.ts                # cn() helper, formatters
│   │   └── constants.ts            # Prices, config values
│   ├── hooks/
│   │   ├── use-order-store.ts      # Zustand store for order
│   │   ├── use-countdown.ts        # Timer hook
│   │   └── use-media-query.ts      # Responsive hook
│   ├── types/
│   │   ├── order.ts                # Order types
│   │   └── index.ts                # Re-exports
│   └── schemas/
│       └── order.schema.ts         # Zod validation schemas
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Database schema
│   └── functions/
│       ├── stripe-webhook/
│       │   └── index.ts            # Handle Stripe events
│       └── send-confirmation/
│           └── index.ts            # Send email via Resend
├── .env.local.example              # Environment variables template
├── .gitignore
├── next.config.js                  # Static export config
├── tailwind.config.ts              # Tailwind + dark mode
├── tsconfig.json
├── postcss.config.js
├── components.json                 # shadcn/ui config
├── package.json
└── README.md
```

---

## Data Model

### Supabase Database Schema

```sql
-- Users table (managed by Supabase Auth)
-- Using auth.users built-in table

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,

  -- Order details
  project_type TEXT NOT NULL CHECK (project_type IN ('logo', 'banner', 'social', 'print', 'other')),
  content_text TEXT NOT NULL,
  dimensions TEXT,
  reference_links TEXT[],
  uploaded_files TEXT[], -- Supabase Storage URLs

  -- Options
  is_express BOOLEAN DEFAULT false,
  include_source_files BOOLEAN DEFAULT false,

  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  express_fee DECIMAL(10,2) DEFAULT 0,
  source_files_fee DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',

  -- Payment
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),

  -- Delivery
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'delivered')),
  delivery_deadline TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  delivery_files TEXT[], -- Final deliverables

  -- Revisions
  revisions_used INTEGER DEFAULT 0,
  revisions_included INTEGER DEFAULT 2,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

-- Policy: Anyone can insert (for guest checkout)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Policy: Only service role can update
CREATE POLICY "Service role can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-files', 'order-files', false);

-- Storage policy
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'order-files');
```

### TypeScript Types

```typescript
// src/types/order.ts

export type ProjectType = 'logo' | 'banner' | 'social' | 'print' | 'other';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type OrderStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'delivered';

export interface Order {
  id: string;
  userId?: string;
  email: string;

  // Details
  projectType: ProjectType;
  contentText: string;
  dimensions?: string;
  referenceLinks: string[];
  uploadedFiles: string[];

  // Options
  isExpress: boolean;
  includeSourceFiles: boolean;

  // Pricing
  basePrice: number;
  expressFee: number;
  sourceFilesFee: number;
  totalPrice: number;
  currency: string;

  // Payment
  stripeSessionId?: string;
  paymentStatus: PaymentStatus;

  // Delivery
  status: OrderStatus;
  deliveryDeadline?: Date;
  deliveredAt?: Date;
  deliveryFiles: string[];

  // Revisions
  revisionsUsed: number;
  revisionsIncluded: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

export interface OrderFormData {
  // Step 1
  projectType: ProjectType;

  // Step 2
  contentText: string;
  dimensions: string;

  // Step 3
  referenceLinks: string[];
  uploadedFiles: File[];

  // Step 4
  isExpress: boolean;
  includeSourceFiles: boolean;

  // Contact
  email: string;
}
```

---

## API / Interface Changes

### Supabase Edge Functions

#### 1. `stripe-webhook`
Handles Stripe webhook events after payment.

```typescript
// Input: Stripe webhook event
// Actions:
//   - Verify webhook signature
//   - Update order payment_status to 'paid'
//   - Set delivery_deadline (now + 48h or 24h if express)
//   - Trigger send-confirmation function
```

#### 2. `send-confirmation`
Sends order confirmation email via Resend.

```typescript
// Input: { orderId: string }
// Actions:
//   - Fetch order from database
//   - Send confirmation email with order details
//   - Include dashboard link for status tracking
```

### Stripe Checkout Session

```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: `Design Service - ${projectType}`,
        description: `${isExpress ? 'Express (24h)' : 'Standard (48h)'} delivery`,
      },
      unit_amount: totalPrice * 100, // cents
    },
    quantity: 1,
  }],
  customer_email: email,
  metadata: {
    orderId: order.id,
  },
  success_url: `${baseUrl}/success?order_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/order`,
});
```

---

## UI/UX Specifications

### Visual Identity

| Element | Value |
|---------|-------|
| Primary Font | Inter (400, 500, 600, 700) |
| Accent Color | Electric Blue `#3B82F6` |
| Background (Dark) | `#0A0A0B` |
| Surface (Dark) | `#18181B` |
| Border (Dark) | `#27272A` |
| Text Primary | `#FAFAFA` |
| Text Secondary | `#A1A1AA` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |

### Responsive Breakpoints

| Breakpoint | Width |
|------------|-------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

### Micro-interactions

1. **Button hover**: Scale 1.02, subtle shadow increase
2. **Form step transition**: Slide left/right with fade
3. **Progress indicator**: Animated fill on step change
4. **File upload**: Drag state with dashed border animation
5. **Countdown timer**: Pulse animation on last hour

---

## Verification Approach

### Linting & Type Checking

```bash
# TypeScript compilation
npx tsc --noEmit

# ESLint
npx eslint src/ --ext .ts,.tsx

# Prettier format check
npx prettier --check "src/**/*.{ts,tsx}"
```

### Build Verification

```bash
# Production build (static export)
npm run build

# Verify output in /out directory
ls -la out/
```

### Manual Testing Checklist

- [ ] Landing page loads correctly (all sections visible)
- [ ] Dark mode toggle works
- [ ] Order form navigation (next/back buttons)
- [ ] Form validation shows errors
- [ ] File upload drag & drop works
- [ ] Price calculation updates dynamically
- [ ] Stripe checkout redirect works
- [ ] Success page shows order details
- [ ] Dashboard displays order status
- [ ] Countdown timer counts down correctly
- [ ] Mobile responsiveness (test at 375px, 768px)
- [ ] Page load time < 2 seconds

### Cloudflare Pages Deployment

```bash
# Build command
npm run build

# Output directory
out

# Environment variables (set in Cloudflare dashboard)
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
```

---

## Security Considerations

1. **Environment Variables**: All secrets in `.env.local`, never committed
2. **Stripe Webhook**: Verify signature before processing
3. **Supabase RLS**: Row-level security policies enabled
4. **File Uploads**: Validate file types, size limits (10MB max)
5. **Input Validation**: Zod schemas on all form inputs
6. **HTTPS**: Enforced by Cloudflare Pages

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3s |
| Bundle Size (gzipped) | < 150KB |

### Optimization Strategies

1. **Static Generation**: All pages pre-rendered at build time
2. **Image Optimization**: Next.js Image component with WebP
3. **Font Loading**: `display: swap` for Inter
4. **Code Splitting**: Dynamic imports for heavy components
5. **Lazy Loading**: Portfolio images loaded on scroll
