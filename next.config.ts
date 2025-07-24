// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the images configuration here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      // If you used a placeholder image from placehold.co, you might also add it:
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* other config options here */
};

export default nextConfig;