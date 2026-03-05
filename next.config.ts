import type { NextConfig } from "next";

const ALLOWED_IMAGE_DOMAINS = [
  { protocol: "https" as const, hostname: "eda.rambler.ru" },
  { protocol: "https" as const, hostname: "images.cars.com" },
  { protocol: "https" as const, hostname: "cdn.autoru.ru" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: ALLOWED_IMAGE_DOMAINS,
  },
};

export default nextConfig;
