import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  allowedDevOrigins: [
    "sk.kabataanprofile.test"
  ]
};

export default nextConfig;