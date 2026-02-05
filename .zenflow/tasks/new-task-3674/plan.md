# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `{@artifacts_path}/spec.md`:
- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Important: unit tests must be part of each implementation task, not separate tasks. Each task should implement the code and its tests together, if relevant.

Save to `{@artifacts_path}/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step: Project Setup & Configuration
<!-- chat-id: e765c264-4aab-4bbf-8102-b0aa6ff6d179 -->

Initialize the Next.js project with all required dependencies and configuration:

- [x] Create Next.js 14 project with TypeScript and App Router
- [x] Configure for static export (Cloudflare Pages compatible)
- [x] Install and configure Tailwind CSS with dark mode
- [x] Setup shadcn/ui with required components
- [x] Install Zustand, React Hook Form, Zod, Framer Motion
- [x] Configure ESLint and Prettier
- [x] Create `.env.local.example` with required variables
- [x] Setup project folder structure as per spec

**Verification**: `npm run build` succeeds, `npm run lint` passes

---

### [x] Step: Design System & UI Components
<!-- chat-id: acd549f4-97b8-48ba-81af-2aa8e5939585 -->

Create the foundational UI components and design tokens:

- [x] Configure Tailwind with custom colors (Electric Blue accent, dark mode palette)
- [x] Setup Inter font with Next.js font optimization
- [x] Install shadcn/ui components: Button, Card, Input, Textarea, Select, Checkbox, Progress, Badge
- [x] Create layout components: Header, Footer, Container
- [x] Create shared components: Logo, ThemeToggle, LoadingSpinner
- [x] Add Framer Motion animation variants for micro-interactions

**Verification**: All components render correctly, dark mode toggles properly

---

### [x] Step: Landing Page - Hero & How It Works
<!-- chat-id: 6b179352-e40d-4ad9-ab55-c425709817c6 -->

Build the top sections of the landing page:

- [x] Create Hero section with headline, subheadline, and CTA button
- [x] Implement "How it Works" 3-step section with icons
- [x] Add smooth scroll navigation
- [x] Implement responsive layout (mobile-first)
- [x] Add entrance animations with Framer Motion

**Verification**: Page loads under 2s, responsive at 375px/768px/1024px

---

### [x] Step: Landing Page - Pricing & Rules
<!-- chat-id: d1f5235d-7133-4708-82f1-19f27f6fda16 -->

Build the pricing and rules sections:

- [x] Create PricingTable component with 2 packages (Single €49, Pack of 5 €199)
- [x] Highlight express delivery (+€30-50) and source files options
- [x] Create Rules section with clear policy text
- [x] Style for visual hierarchy and readability
- [x] Add "Order Now" CTA buttons linking to /order

**Verification**: Prices display correctly, CTAs navigate to order page

---

### [x] Step: Landing Page - Portfolio & Footer
<!-- chat-id: d8af490c-2eb2-48b6-860a-d1128654ccd4 -->

Complete the landing page:

- [x] Create PortfolioGrid component with card layout
- [x] Add placeholder portfolio images (6-8 examples)
- [x] Implement lazy loading for portfolio images
- [x] Create CTA section before footer
- [x] Build Footer with brand info, links, and copyright
- [x] Add "Infinity Creative Ltd" branding

**Verification**: Full landing page complete, all sections visible, smooth scrolling

---

### [x] Step: Order Form - Multi-step Container & Step 1
<!-- chat-id: b0cf6aa3-8e5d-4430-9bf8-54ac798e2840 -->

Create the order form foundation and first step:

- [x] Create FormWrapper with multi-step state management (Zustand)
- [x] Build StepIndicator progress bar component
- [x] Implement Step 1: Project Type selection (Logo, Banner, Social, Print, Other)
- [x] Create icon-based selection cards
- [x] Add form validation with Zod schema
- [x] Implement next/back navigation with animations

**Verification**: Step 1 validates, progress bar updates, data persists in store

---

### [x] Step: Order Form - Steps 2 & 3 (Content & References)
<!-- chat-id: 9e0c6038-528b-4078-8d23-a2db76d8b189 -->

Build the content and references steps:

- [x] Step 2: Content Details
  - [x] Text content textarea (required)
  - [x] Dimensions/format input with presets (1080x1080, etc.)
- [x] Step 3: Visual References
  - [x] Reference links input (Pinterest, Behance URLs)
  - [x] File upload with drag & drop (FileUpload component)
  - [x] File type validation (images, PDF, max 10MB)
  - [x] Upload preview with remove option

**Verification**: Form validation works, files upload to local state

---

### [ ] Step: Order Form - Steps 4 & 5 (Options & Summary)
<!-- chat-id: ae8dc528-0239-413d-bb89-00faf57aa5f4 -->

Complete the order form:

- [ ] Step 4: Additional Options
  - [ ] Express delivery checkbox (+€30)
  - [ ] Source files checkbox (+€20)
  - [ ] Email input for order delivery
- [ ] Step 5: Order Summary
  - [ ] Display all selected options
  - [ ] Calculate and show total price
  - [ ] Show terms acceptance checkbox
  - [ ] "Proceed to Payment" button
- [ ] Implement price calculation logic in Zustand store

**Verification**: Total calculates correctly, summary shows all data

---

### [ ] Step: Supabase Integration

Setup Supabase backend:

- [ ] Create Supabase project and configure
- [ ] Create database migration with orders table schema
- [ ] Setup Row Level Security policies
- [ ] Create Supabase client utilities (browser & server)
- [ ] Generate TypeScript types from database schema
- [ ] Create storage bucket for file uploads
- [ ] Implement file upload to Supabase Storage

**Verification**: Can create order in database, files upload to storage

---

### [ ] Step: Stripe Checkout Integration

Implement payment flow:

- [ ] Setup Stripe account and get API keys
- [ ] Create checkout session creation logic
- [ ] Implement "Proceed to Payment" → Stripe redirect
- [ ] Create success page with order confirmation
- [ ] Handle checkout cancellation (return to form)
- [ ] Display order ID and expected delivery time

**Verification**: Test payment flow with Stripe test mode

---

### [ ] Step: Webhook & Email Notifications

Setup post-payment automation:

- [ ] Create Supabase Edge Function for Stripe webhook
- [ ] Verify webhook signature
- [ ] Update order status to 'paid' on successful payment
- [ ] Calculate and set delivery deadline
- [ ] Setup Resend account and API
- [ ] Create order confirmation email template
- [ ] Send confirmation email on successful payment

**Verification**: Webhook updates order, email sends correctly

---

### [ ] Step: Client Dashboard

Build the order tracking dashboard:

- [ ] Create dashboard page layout
- [ ] Implement order lookup by email or order ID
- [ ] Create OrderCard component with status display
- [ ] Build CountdownTimer component for delivery deadline
- [ ] Create StatusBadge component (pending, in_progress, completed, delivered)
- [ ] Show delivery files download when available
- [ ] Mobile-responsive design

**Verification**: Dashboard shows order status, countdown works correctly

---

### [ ] Step: Final Polish & Optimization

Complete the application:

- [ ] Optimize images (WebP format, proper sizing)
- [ ] Add meta tags and Open Graph for SEO
- [ ] Implement loading states and error boundaries
- [ ] Add 404 page
- [ ] Test all user flows end-to-end
- [ ] Performance audit (Lighthouse score > 90)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Final responsive design review

**Verification**: Build succeeds, Lighthouse performance > 90, all flows work

---

### [ ] Step: Cloudflare Pages Deployment

Deploy the application:

- [ ] Configure `next.config.js` for static export
- [ ] Setup Cloudflare Pages project
- [ ] Configure environment variables in Cloudflare
- [ ] Setup custom domain (if available)
- [ ] Configure Supabase Edge Functions URLs
- [ ] Update Stripe webhook URL to production
- [ ] Test production deployment
- [ ] Write deployment documentation

**Verification**: Site accessible on Cloudflare URL, all integrations work

---

### [ ] Step: Documentation & Handoff

Complete project documentation:

- [ ] Write README.md with setup instructions
- [ ] Document environment variables
- [ ] Create UI Kit documentation (colors, fonts, components)
- [ ] Document admin workflow for order management
- [ ] Write report.md with implementation summary

**Verification**: Documentation complete, project can be set up from README
