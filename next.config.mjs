/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hitri-media-prod.hn.ss.bfcplatform.vn',
      },
      {
        protocol: 'https',
        hostname: 'hitri-media-staging.hn.ss.bfcplatform.vn',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'https://staging-api.hitri.vn/graphql',
      },
    ];
  },
};

export default nextConfig;
