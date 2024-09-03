/** @type {import('next').NextConfig} */

import withPWA from "@ducanh2912/next-pwa";

const pwaConfig = {
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
};

const nextConfig = {};

export default withPWA(pwaConfig)(nextConfig);
