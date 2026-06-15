/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

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
  async redirects() {
    const adminRedirects = [
      'users',
      'venue-requests',
      'claim-requests',
      'tournaments',
      'finance',
      'growth',
      'qr-campaigns',
      'pickup-campaigns',
      'moderation',
      'support',
      'audit',
      'settings',
    ].map((segment) => ({
      source: `/${segment}`,
      destination: `/admin/${segment}`,
      permanent: true,
    }));

    return [
      { source: '/profile', destination: '/shared/profile', permanent: true },
      ...adminRedirects,
      {
        source: '/users/:id',
        destination: '/admin/users/:id',
        permanent: true,
      },
      {
        source: '/tournaments/:path*',
        destination: '/admin/tournaments/:path*',
        permanent: true,
      },
      {
        source: '/qr-campaigns/:path*',
        destination: '/admin/qr-campaigns/:path*',
        permanent: true,
      },
      {
        source: '/pickup-campaigns/:path*',
        destination: '/admin/pickup-campaigns/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
