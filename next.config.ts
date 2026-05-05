import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['10.44.1.*'],
};

export default nextConfig;
