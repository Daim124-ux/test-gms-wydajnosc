import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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

export default withNextIntl(nextConfig);
