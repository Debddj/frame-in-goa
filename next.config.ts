import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel Blob requires the external host for next/image in the share page
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
