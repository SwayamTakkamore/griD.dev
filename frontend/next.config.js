/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'cloudflare-ipfs.com'],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  },
  // Speed up development
  typescript: {
    // Skip type checking during build (use editor for type checks)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Skip ESLint during build for faster compilation
    ignoreDuringBuilds: false,
  },
  // Optimize bundle
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Faster refresh
  experimental: {
    optimizeCss: false, // Disable in dev for speed
  },
}

module.exports = nextConfig
