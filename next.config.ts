import type { NextConfig } from "next";

const nextConfig = {
  // Bypasses ESLint errors during the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10gb',
    },
  },
};

export default nextConfig;
