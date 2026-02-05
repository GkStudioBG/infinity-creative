/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: Static export disabled for API routes
  // Will need to migrate to Supabase Edge Functions for Cloudflare Pages deployment
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
