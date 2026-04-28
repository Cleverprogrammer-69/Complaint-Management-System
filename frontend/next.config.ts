import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    // Allows production builds to complete even if there are lint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allows production builds to complete even if there are type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
