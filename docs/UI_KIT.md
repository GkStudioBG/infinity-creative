# UI Kit Documentation

Complete design system documentation for the Infinity Productized Service Platform.

## Overview

This UI kit defines the visual language, design tokens, components, and patterns used throughout the application. The design emphasizes **minimalism, professionalism, and trust** with a dark-mode-first approach.

---

## Design Principles

1. **Trust through Simplicity**: Clean, uncluttered interfaces that inspire confidence
2. **Efficiency First**: Every element serves a purpose, no decorative fluff
3. **Responsive Always**: Mobile-first design that scales beautifully
4. **Accessible by Default**: WCAG 2.1 AA compliance for all interactive elements
5. **Performance Conscious**: Lightweight, fast-loading components

---

## Typography

### Font Family

**Primary**: [Inter](https://rsms.me/inter/)
- Modern, highly legible sans-serif optimized for screens
- Variable font with optical sizing for better readability
- Loaded via Next.js font optimization

```typescript
// Font configuration (src/app/layout.tsx)
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

### Font Weights

| Weight | Usage |
|--------|-------|
| 400 (Regular) | Body text, form inputs |
| 500 (Medium) | Emphasized text, labels |
| 600 (Semibold) | Subheadings, buttons |
| 700 (Bold) | Headings, hero text |

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| Display | 3rem (48px) | 700 | 1.2 | Hero headlines |
| H1 | 2.25rem (36px) | 700 | 1.25 | Page titles |
| H2 | 1.875rem (30px) | 600 | 1.3 | Section headers |
| H3 | 1.5rem (24px) | 600 | 1.4 | Subsection headers |
| H4 | 1.25rem (20px) | 600 | 1.5 | Card titles |
| Body Large | 1.125rem (18px) | 400 | 1.6 | Intro paragraphs |
| Body | 1rem (16px) | 400 | 1.5 | Default body text |
| Body Small | 0.875rem (14px) | 400 | 1.5 | Captions, helper text |
| Caption | 0.75rem (12px) | 500 | 1.4 | Labels, metadata |

### CSS Classes

```css
/* Headings */
.text-display { @apply text-5xl font-bold tracking-tight; }
.text-h1 { @apply text-4xl font-bold; }
.text-h2 { @apply text-3xl font-semibold; }
.text-h3 { @apply text-2xl font-semibold; }
.text-h4 { @apply text-xl font-semibold; }

/* Body */
.text-body-lg { @apply text-lg; }
.text-body { @apply text-base; }
.text-body-sm { @apply text-sm; }
.text-caption { @apply text-xs font-medium; }
```

---

## Color System

### Brand Colors

#### Electric Blue (Primary)
- **Hex**: `#3B82F6`
- **HSL**: `217° 91% 60%`
- **Usage**: Primary actions, links, focus states, brand accents

```css
/* Tailwind classes */
bg-primary
text-primary
border-primary
ring-primary
```

### Dark Mode Palette (Default)

| Token | HSL Value | Hex Approx | Usage |
|-------|-----------|------------|-------|
| `--background` | `240° 10% 4%` | `#0A0A0B` | Page background |
| `--foreground` | `0° 0% 98%` | `#FAFAFA` | Primary text |
| `--card` | `240° 6% 10%` | `#18181B` | Card backgrounds |
| `--muted` | `240° 4% 16%` | `#282828` | Secondary surfaces |
| `--muted-foreground` | `240° 5% 65%` | `#A1A1AA` | Secondary text |
| `--border` | `240° 4% 16%` | `#27272A` | Dividers, borders |

### Light Mode Palette

| Token | HSL Value | Hex Approx | Usage |
|-------|-----------|------------|-------|
| `--background` | `0° 0% 100%` | `#FFFFFF` | Page background |
| `--foreground` | `240° 10% 4%` | `#09090B` | Primary text |
| `--card` | `0° 0% 100%` | `#FFFFFF` | Card backgrounds |
| `--muted` | `240° 5% 96%` | `#F4F4F5` | Secondary surfaces |
| `--muted-foreground` | `240° 4% 46%` | `#71717A` | Secondary text |
| `--border` | `240° 6% 90%` | `#E4E4E7` | Dividers, borders |

### Semantic Colors

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Success** | `#22C55E` | `#22C55E` | Success states, completed orders |
| **Warning** | `#F59E0B` | `#F59E0B` | Warnings, pending states |
| **Error** | `#EF4444` | `#DC2626` | Errors, validation messages |

### Color Usage Guidelines

✅ **DO**:
- Use `text-foreground` for primary text
- Use `text-muted-foreground` for secondary/helper text
- Use `bg-primary` for primary CTAs
- Use semantic colors for status indicators

❌ **DON'T**:
- Don't use pure black (`#000000`) or pure white (`#FFFFFF`) for text
- Don't use primary color for large backgrounds
- Don't mix custom colors outside the design system

---

## Spacing Scale

Based on 4px base unit (Tailwind default).

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0px | Reset spacing |
| `1` | 4px | Tight spacing (icon-text gap) |
| `2` | 8px | Compact spacing |
| `3` | 12px | Default gap |
| `4` | 16px | Standard padding |
| `6` | 24px | Section spacing |
| `8` | 32px | Large spacing |
| `12` | 48px | XL spacing |
| `16` | 64px | Section dividers |
| `24` | 96px | Hero spacing |

### Common Patterns

```tsx
// Card padding
<Card className="p-6">

// Section spacing
<section className="py-16 md:py-24">

// Component gaps
<div className="flex gap-4">

// Form field spacing
<div className="space-y-4">
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Small elements (badges) |
| `md` | 6px | Default (inputs, small cards) |
| `lg` | 8px | Cards, modals |
| `xl` | 12px | Large cards |
| `2xl` | 16px | Hero cards |
| `full` | 9999px | Pills, circular buttons |

```tsx
// Standard card
<Card className="rounded-lg">

// Button
<Button className="rounded-md">

// Badge
<Badge className="rounded-full">
```

---

## Shadows

Subtle shadows for depth without distraction.

```css
/* Light mode */
.shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
.shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
.shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
.shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)

/* Dark mode shadows are more subtle */
```

**Usage**:
- `shadow-sm`: Input fields
- `shadow`: Cards, buttons (hover)
- `shadow-md`: Dropdowns, elevated cards
- `shadow-lg`: Modals, popovers

---

## Components

### Buttons

#### Primary Button
```tsx
<Button variant="default" size="default">
  Order Now
</Button>
```

**Variants**:
- `default`: Primary action (Electric Blue background)
- `secondary`: Secondary action (muted background)
- `outline`: Tertiary action (border only)
- `ghost`: Minimal action (no background)
- `destructive`: Dangerous actions (red)

**Sizes**:
- `sm`: 32px height, 12px padding
- `default`: 40px height, 16px padding
- `lg`: 48px height, 24px padding

**States**:
- Hover: Slight scale (1.02), darker background
- Active: Scale down (0.98)
- Disabled: 50% opacity, no pointer events
- Focus: 2px ring in primary color

#### Usage Examples

```tsx
// Primary CTA
<Button size="lg" className="w-full md:w-auto">
  Get Started
</Button>

// Secondary action
<Button variant="outline">
  Learn More
</Button>

// Destructive
<Button variant="destructive">
  Delete Order
</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>
```

---

### Cards

Containers for grouped content.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

**Variants**:
- Default: `bg-card` with border
- Hover: Add `hover:shadow-md transition-shadow`

**Usage**:
- Pricing cards
- Portfolio items
- Order summaries
- Dashboard order cards

---

### Form Inputs

#### Text Input
```tsx
<Input
  type="text"
  placeholder="Enter text..."
  className="max-w-md"
/>
```

#### Textarea
```tsx
<Textarea
  placeholder="Tell us about your project..."
  rows={4}
  className="resize-none"
/>
```

#### Select
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Checkbox
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm">
    I agree to the terms
  </label>
</div>
```

**States**:
- Default: Muted border
- Focus: Primary ring (2px)
- Error: Red border + error text below
- Disabled: 50% opacity

---

### Badges

Status indicators and labels.

```tsx
<Badge variant="default">New</Badge>
<Badge variant="secondary">Processing</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
```

**Usage**:
- Order status
- Feature tags
- Notification counts

---

### Progress Indicator

Multi-step form progress.

```tsx
<Progress value={60} className="h-2" />
```

**Custom Step Indicator** (Order Form):
```tsx
<div className="flex items-center justify-between">
  {steps.map((step, index) => (
    <div key={index} className="flex items-center">
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center",
        index <= currentStep ? "bg-primary text-white" : "bg-muted"
      )}>
        {index + 1}
      </div>
      {index < steps.length - 1 && (
        <div className={cn(
          "h-0.5 w-12 md:w-24",
          index < currentStep ? "bg-primary" : "bg-muted"
        )} />
      )}
    </div>
  ))}
</div>
```

---

### Loading States

#### Spinner
```tsx
import { Loader2 } from "lucide-react";

<Loader2 className="h-6 w-6 animate-spin text-primary" />
```

#### Skeleton
```tsx
<Skeleton className="h-12 w-full" />
```

---

## Animations

### Transition Timing

```css
/* Default transitions */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Fast (hover) */
transition: all 100ms ease-out;

/* Slow (layout shifts) */
transition: all 300ms ease-in-out;
```

### Framer Motion Variants

#### Fade In Up (Landing sections)
```tsx
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeInUp}
>
  {/* Content */}
</motion.div>
```

#### Stagger Children
```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Button Hover
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.1 }}
>
  Click Me
</motion.button>
```

### CSS Animations

Available utility classes:

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from right */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Pulse (countdown timer) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## Icons

**Library**: [Lucide React](https://lucide.dev/)

### Common Icons Used

```tsx
import {
  Check,          // Success, checkmarks
  X,              // Close, remove
  ChevronRight,   // Navigation
  ChevronDown,    // Dropdowns
  Loader2,        // Loading spinner
  Upload,         // File upload
  Clock,          // Timer, deadlines
  Mail,           // Email
  CreditCard,     // Payments
  FileText,       // Documents
  Image,          // Images
  AlertCircle,    // Warnings
  CheckCircle,    // Success
  XCircle,        // Errors
} from "lucide-react";
```

### Icon Sizing

```tsx
// Small (inline text)
<Icon className="h-4 w-4" />

// Default
<Icon className="h-5 w-5" />

// Large (feature icons)
<Icon className="h-6 w-6" />

// XL (hero icons)
<Icon className="h-12 w-12" />
```

### Icon Colors

```tsx
// Primary
<Icon className="text-primary" />

// Muted
<Icon className="text-muted-foreground" />

// Success
<Icon className="text-success" />

// Error
<Icon className="text-destructive" />
```

---

## Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Usage Example

```tsx
<div className="
  grid
  grid-cols-1      /* Mobile: 1 column */
  md:grid-cols-2   /* Tablet: 2 columns */
  lg:grid-cols-3   /* Desktop: 3 columns */
  gap-6
">
  {/* Cards */}
</div>

<h1 className="
  text-3xl         /* Mobile: 30px */
  md:text-4xl      /* Tablet: 36px */
  lg:text-5xl      /* Desktop: 48px */
  font-bold
">
  Headline
</h1>
```

---

## Layout Patterns

### Container

Max-width container for content:

```tsx
<Container className="py-16">
  {/* Content */}
</Container>

// Component definition
function Container({ children, className }: Props) {
  return (
    <div className={cn("container mx-auto px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
```

**Max widths**:
- Default: `1280px`
- Content: `768px` (for reading)

### Section Spacing

```tsx
<section className="py-16 md:py-24">
  <Container>
    {/* Section content */}
  </Container>
</section>
```

---

## Accessibility

### Focus States

All interactive elements have visible focus rings:

```css
.focus-ring {
  @apply focus:outline-none
         focus-visible:ring-2
         focus-visible:ring-primary
         focus-visible:ring-offset-2
         focus-visible:ring-offset-background;
}
```

### Color Contrast

All text meets WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum

### Keyboard Navigation

- Tab order follows visual order
- All interactive elements reachable
- Escape closes modals/dropdowns
- Enter/Space activates buttons

### Screen Reader Support

```tsx
// Hidden labels for screen readers
<span className="sr-only">Close menu</span>

// ARIA labels
<button aria-label="Open navigation menu">
  <Menu />
</button>

// ARIA live regions for status updates
<div aria-live="polite" aria-atomic="true">
  Order submitted successfully
</div>
```

---

## Component Usage Examples

### Landing Page Hero

```tsx
<section className="relative overflow-hidden py-20 md:py-32">
  <Container>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto text-center"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        Design Delivered in{" "}
        <span className="text-primary">48 Hours</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        No meetings. No scope creep. Just professional design.
      </p>
      <Button size="lg" className="text-lg px-8 py-6">
        Order Now
      </Button>
    </motion.div>
  </Container>
</section>
```

### Pricing Card

```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Single Design</CardTitle>
    <div className="text-3xl font-bold mt-2">
      €49<span className="text-base font-normal text-muted-foreground">/project</span>
    </div>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      <li className="flex items-center gap-2">
        <Check className="h-5 w-5 text-success" />
        <span>48-hour delivery</span>
      </li>
      <li className="flex items-center gap-2">
        <Check className="h-5 w-5 text-success" />
        <span>2 revision rounds</span>
      </li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Get Started</Button>
  </CardFooter>
</Card>
```

---

## Design Tokens Reference

### Quick Copy-Paste

```css
/* Primary Brand Color */
--primary: 217 91% 60%;         /* #3B82F6 Electric Blue */

/* Dark Mode Backgrounds */
--background: 240 10% 4%;       /* #0A0A0B */
--card: 240 6% 10%;             /* #18181B */
--muted: 240 4% 16%;            /* #282828 */

/* Dark Mode Text */
--foreground: 0 0% 98%;         /* #FAFAFA */
--muted-foreground: 240 5% 65%; /* #A1A1AA */

/* Semantic Colors */
--success: 142 71% 45%;         /* #22C55E */
--warning: 38 92% 50%;          /* #F59E0B */
--destructive: 0 84.2% 60.2%;   /* #EF4444 */
```

---

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui Components**: https://ui.shadcn.com
- **Framer Motion**: https://www.framer.com/motion/
- **Lucide Icons**: https://lucide.dev/
- **Inter Font**: https://rsms.me/inter/

---

## Changelog

- **v1.0** (2025-02-05): Initial UI Kit release
