# Testing Checklist

This document provides a comprehensive testing checklist for the Infinity Creative platform.

## Build & Performance Tests

### ✅ Build Tests
- [x] `npm run build` succeeds without errors
- [x] `npm run lint` passes with no warnings
- [x] All routes compile successfully
- [x] No TypeScript errors

### Performance Audit (Lighthouse)
Run Lighthouse audit on production build:

```bash
npm run build
npm run start
# Then run Lighthouse on http://localhost:3000
```

**Target Scores:**
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 95

**Key Metrics to Check:**
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.9s
- [ ] Total Blocking Time (TBT) < 300ms
- [ ] Cumulative Layout Shift (CLS) < 0.1

## User Flow Tests

### Landing Page Flow
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] "How It Works" section visible
- [ ] Pricing table shows all packages
- [ ] "The Rules" section is clear and readable
- [ ] Portfolio grid displays (even with placeholders)
- [ ] Footer displays correctly
- [ ] All CTA buttons link to `/order`
- [ ] Smooth scroll between sections works
- [ ] Dark mode toggle works (if implemented)

### Order Form Flow (Critical Path)

#### Step 1: Project Type
- [ ] Form loads without errors
- [ ] Progress indicator shows Step 1 of 5
- [ ] All project type options are selectable
- [ ] Selected option highlights correctly
- [ ] "Next" button is disabled until selection
- [ ] "Next" button navigates to Step 2

#### Step 2: Content Details
- [ ] Progress indicator shows Step 2 of 5
- [ ] Text content textarea is required
- [ ] Dimensions/format input works
- [ ] Validation shows errors for empty required fields
- [ ] "Back" button returns to Step 1 (data preserved)
- [ ] "Next" button navigates to Step 3

#### Step 3: Visual References
- [ ] Progress indicator shows Step 3 of 5
- [ ] Reference links input accepts URLs
- [ ] File upload drag & drop works
- [ ] File upload via click works
- [ ] Uploaded files show preview
- [ ] Remove file button works
- [ ] File type validation works (reject invalid types)
- [ ] File size validation works (reject > 10MB)
- [ ] "Back" button preserves data
- [ ] "Next" button navigates to Step 4

#### Step 4: Additional Options
- [ ] Progress indicator shows Step 4 of 5
- [ ] Express delivery checkbox toggles price
- [ ] Source files checkbox toggles price
- [ ] Email input validates format
- [ ] Total price updates dynamically
- [ ] "Back" button preserves data
- [ ] "Next" button navigates to Step 5

#### Step 5: Order Summary
- [ ] Progress indicator shows Step 5 of 5
- [ ] All selected options display correctly
- [ ] Project type shows correctly
- [ ] Content details show correctly
- [ ] Additional options show correctly
- [ ] Total price calculates correctly
- [ ] Terms checkbox is required
- [ ] "Proceed to Payment" is disabled until terms accepted
- [ ] "Proceed to Payment" redirects to Stripe

### Stripe Checkout Flow
- [ ] Stripe checkout session creates successfully
- [ ] Checkout page shows correct amount
- [ ] Order metadata passes to Stripe correctly
- [ ] Test payment succeeds (use test card 4242 4242 4242 4242)
- [ ] Success redirect goes to `/order/success?session_id=...`
- [ ] Cancel redirect returns to order form

### Success Page
- [ ] Page loads with session_id parameter
- [ ] Order confirmation displays
- [ ] Order ID shows correctly
- [ ] Estimated delivery time displays
- [ ] Email confirmation message shows
- [ ] Countdown timer works (if implemented)
- [ ] Link to dashboard works

### Dashboard Flow
- [ ] Dashboard page loads without errors
- [ ] Order lookup by email works
- [ ] Order lookup by order ID works
- [ ] Order status displays correctly
- [ ] Countdown timer shows correct time remaining
- [ ] Status badge shows correct state (pending/in_progress/delivered)
- [ ] Delivery files download works (when available)
- [ ] Mobile layout works correctly

## Error Handling Tests

### Error Boundaries
- [ ] Global error.tsx catches and displays errors
- [ ] Error page shows "Try again" button
- [ ] Error page shows "Go home" button
- [ ] Error ID displays if available

### Loading States
- [ ] Global loading.tsx shows during page transitions
- [ ] Order page loading skeleton displays
- [ ] Dashboard loading skeleton displays
- [ ] Loading spinner animation works smoothly

### 404 Page
- [ ] not-found.tsx displays for invalid routes
- [ ] 404 page shows correct content
- [ ] "Go to homepage" link works
- [ ] "Place an order" link works
- [ ] Page is styled correctly

### API Error Handling
- [ ] Invalid Stripe session shows error
- [ ] Failed file upload shows error message
- [ ] Network errors show user-friendly message
- [ ] Invalid order ID shows "not found" message

## Responsive Design Tests

### Mobile (375px - 767px)
- [ ] Landing page layout adapts correctly
- [ ] Hero section is readable
- [ ] Pricing table stacks vertically
- [ ] Order form is usable
- [ ] Step indicators are visible
- [ ] All buttons are tappable (min 44x44px)
- [ ] Text is readable (min 16px)
- [ ] Dashboard is functional
- [ ] Navigation works without horizontal scroll

### Tablet (768px - 1023px)
- [ ] Layout uses available space efficiently
- [ ] Two-column layouts work
- [ ] Pricing table shows properly
- [ ] Order form is well-proportioned
- [ ] Dashboard grid layout works

### Desktop (1024px+)
- [ ] Content max-width constrains properly
- [ ] Multi-column layouts display
- [ ] Hover states work on interactive elements
- [ ] Portfolio grid shows multiple columns

## Cross-Browser Tests

### Chrome/Edge (Chromium)
- [ ] All features work
- [ ] Animations smooth
- [ ] Forms submit correctly

### Firefox
- [ ] All features work
- [ ] CSS renders correctly
- [ ] Forms submit correctly

### Safari (macOS/iOS)
- [ ] All features work
- [ ] Date/time displays correctly
- [ ] Forms submit correctly
- [ ] File upload works on iOS

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All interactive elements are focusable
- [ ] Focus indicators are visible
- [ ] Form can be completed with keyboard only
- [ ] Skip links work (if implemented)

### Screen Readers
- [ ] Headings are hierarchical (h1 > h2 > h3)
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Buttons have descriptive labels

### Color & Contrast
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Focus indicators are visible
- [ ] Error states don't rely solely on color
- [ ] Links are distinguishable

## SEO Tests

### Meta Tags
- [x] Title tag is present and descriptive
- [x] Meta description is present (< 160 chars)
- [x] Open Graph tags are present
- [x] Twitter card tags are present
- [x] Canonical URL is set
- [ ] Favicon displays correctly

### Content
- [ ] H1 tag present on each page
- [ ] Headings are hierarchical
- [ ] Images have alt text (when applicable)
- [ ] Links have descriptive text

### Technical SEO
- [ ] robots.txt exists (if needed)
- [ ] Sitemap.xml exists (if needed)
- [ ] No broken links
- [ ] HTTPS enforced (in production)

## Integration Tests

### Supabase
- [ ] Database connection works
- [ ] Orders insert correctly
- [ ] File upload to Storage works
- [ ] Order queries work correctly

### Stripe
- [ ] Checkout session creates
- [ ] Payment succeeds
- [ ] Webhook receives events
- [ ] Order status updates after payment

### Email (Resend)
- [ ] Confirmation email sends
- [ ] Email content is correct
- [ ] Links in email work
- [ ] Email renders in major clients

## Security Tests

### Input Validation
- [ ] Form inputs are sanitized
- [ ] File upload types are restricted
- [ ] File size limits are enforced
- [ ] SQL injection not possible (using Supabase client)
- [ ] XSS not possible (React escapes by default)

### API Security
- [ ] Stripe webhook signature verified
- [ ] Supabase RLS policies active
- [ ] Environment variables not exposed
- [ ] No sensitive data in client code

## Notes for Manual Testing

### Test Cards (Stripe)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

Use any future expiry date and any 3-digit CVC.

### Stripe CLI for Webhooks (Local Testing)
```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

### Supabase Local Testing
```bash
supabase start
supabase functions serve
```

## Automated Testing (Future Enhancement)

- [ ] Setup Playwright/Cypress for E2E tests
- [ ] Add unit tests for critical functions
- [ ] Add integration tests for API routes
- [ ] Setup CI/CD pipeline with tests

---

## Test Results Summary

**Date Tested**: _____________
**Tester**: _____________
**Build Version**: _____________

### Critical Issues Found
- [ ] None

### Minor Issues Found
- [ ] None

### Performance Results
- FCP: _____ s
- LCP: _____ s
- Lighthouse Score: _____ / 100

### Sign-off
- [ ] All critical flows work
- [ ] Performance meets targets
- [ ] Responsive design verified
- [ ] Ready for deployment
