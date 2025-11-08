import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['m.media-amazon.com', '*.homify.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.homify.com',
      },
    ],
  },
};

export default nextConfig;
