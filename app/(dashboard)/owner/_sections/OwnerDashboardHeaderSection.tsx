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

'use client';

import { PageHeader } from '@/components/organisms/PageHeader';

export function OwnerDashboardHeaderSection() {
  return (
    <PageHeader
      title="Tổng quan sân"
      description="Theo dõi hoạt động và doanh thu các sân bạn quản lý."
    />
  );
}
