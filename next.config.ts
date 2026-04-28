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
  async headers() {
    return [
      {
        // Pasuje do wszystkich plików w folderach z modelami
        source: '/assets/makieta_3d/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
      {
        source: '/apps/verge-model/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      }
    ];
  },
};

export default withNextIntl(nextConfig);
