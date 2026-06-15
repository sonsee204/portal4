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

export const siteConfig = {
  companyName: 'HITRI TECH',
  slogan: 'Kiến tạo nền tảng thể thao công nghệ hàng đầu, kết nối đam mê và nâng tầm trải nghiệm người dùng.',
  description:
    'Nền tảng đặt sân thể thao, kết nối cộng đồng và trải nghiệm thể thao toàn diện.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hitri.vn',
  copyrightYear: '2026',
  keywords: [
    'phát triển mobile app',
    'thiết kế web application',
    'landing page chuyên nghiệp',
    'React Native',
    'Flutter',
    'Next.js',
    'công ty phần mềm Hà Nội',
    'HITRI TECH',
    'đặt sân thể thao',
    'nền tảng thể thao',
    'Ao Trình',
    'ứng dụng thể thao',
    'quản lý giải đấu',
  ],
  links: {
    appStore: 'https://apps.apple.com/app/aotrinh',
    playStore: 'https://play.google.com/store/apps/details?id=com.nalee.aotrinh',
  },
  contact: {
    adminPhone: '0907671368',
    email: 'admin@hitri.vn',
    address: 'Số 25, phố Vân Đồn, phường Bạch Đằng, quận Hai Bà Trưng, Hà Nội',
    taxId: '0111375621',
  },
  social: {
    facebook: '',
    zalo: '',
  },
} as const;
