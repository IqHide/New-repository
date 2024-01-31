import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const ALLOWED_IMAGE_DOMAINS = [
  { protocol: "https" as const, hostname: "eda.rambler.ru" },
  { protocol: "https" as const, hostname: "images.cars.com" },
  { protocol: "https" as const, hostname: "cdn.autoru.ru" },
];

const COMPARISON_ZONE_URL = process.env.COMPARISON_ZONE_URL || 'http://localhost:3002';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: ALLOWED_IMAGE_DOMAINS,
  },
  async rewrites() {
    return [
      {
        source: '/comparison',
        destination: `${COMPARISON_ZONE_URL}/comparison`,
      },
      {
        source: '/comparison/:path*',
        destination: `${COMPARISON_ZONE_URL}/comparison/:path*`,
      },
    ];
  },
};
export default nextConfig;
