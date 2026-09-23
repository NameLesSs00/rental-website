import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
