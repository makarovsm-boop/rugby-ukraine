import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "media-cdn.incrowdsports.com",
      },
      {
        protocol: "https",
        hostname: "media-cdn.cortextech.io",
      },
      {
        protocol: "https",
        hostname: "www.unitedrugby.com",
      },
    ],
  },
};

export default nextConfig;
