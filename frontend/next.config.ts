import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '*.homify.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost', 
      },
    ],
  },
};

export default nextConfig;
