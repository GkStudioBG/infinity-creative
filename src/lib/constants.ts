// Pricing configuration
export const PRICING = {
  singleDesign: 25,
  packOfFive: 99,
  expressFee: 30,
  sourceFilesFee: 20,
  additionalRevisionRate: 20, // per hour
  currency: "EUR",
} as const;

// Delivery times in hours
export const DELIVERY_TIMES = {
  standard: 48,
  express: 24,
} as const;

// Included revisions
export const REVISIONS_INCLUDED = 2;

// Project types
export const PROJECT_TYPES = [
  { value: "logo", label: "Logo" },
  { value: "banner", label: "Banner" },
  { value: "social", label: "Social Media" },
  { value: "print", label: "Print Materials" },
  { value: "other", label: "Other" },
] as const;

// Common dimension presets
export const DIMENSION_PRESETS = [
  { value: "1080x1080", label: "Instagram Post (1080x1080)" },
  { value: "1920x1080", label: "YouTube Thumbnail (1920x1080)" },
  { value: "1200x628", label: "Facebook/LinkedIn (1200x628)" },
  { value: "1080x1920", label: "Instagram Story (1080x1920)" },
  { value: "custom", label: "Custom Size" },
] as const;
