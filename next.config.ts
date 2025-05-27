import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.payulatam.com',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
