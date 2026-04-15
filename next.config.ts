import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'gms-system.com',
      },
      {
        protocol: 'https',
        hostname: 'd1moyf5ccth9x8.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
