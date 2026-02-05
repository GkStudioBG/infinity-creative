import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

// Note: Actual STRIPE_SECRET_KEY must be set in environment variables before running the app
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});
