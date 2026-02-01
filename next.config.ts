import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      "images.pexels.com",
      "storage.googleapis.com",
    ],
  },
};

export default nextConfig;
