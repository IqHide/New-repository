import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const COMPARISON_ZONE_URL = process.env.COMPARISON_ZONE_URL || 'http://localhost:3002';

const COMPARISON_ZONE_URL = process.env.COMPARISON_ZONE_URL || 'http://localhost:3002';

const nextConfig: NextConfig = {

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
