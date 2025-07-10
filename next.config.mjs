/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Skip linting and type checking during build if needed
  eslint: {
    ignoreDuringBuilds: false, // Set to true if you want to skip ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Set to true if you want to skip TypeScript errors during builds
  },
  // Optimize build performance
  swcMinify: true,
  // Handle environment variables
  env: {
    // Add any build-time environment variables here if needed
  },
};

export default nextConfig;
