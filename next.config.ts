import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rentaltech.premiumasp.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
