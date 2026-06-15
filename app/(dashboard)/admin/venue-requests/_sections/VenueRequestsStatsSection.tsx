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

import { StatCard } from '@/components/molecules/StatCard';
import type { VenueRequestsPageData } from '../_hooks/useVenueRequestsPageData';

interface VenueRequestsStatsSectionProps {
  data: VenueRequestsPageData;
}

export function VenueRequestsStatsSection({
  data,
}: VenueRequestsStatsSectionProps) {
  const { stats } = data;
  if (!stats) return null;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-4">
      <StatCard
        icon="time-outline"
        iconColor="text-amber-400"
        label="Chờ duyệt"
        value={String(stats.pendingRequests)}
      />
      <StatCard
        icon="checkmark-circle-outline"
        iconColor="text-emerald-400"
        label="Đã duyệt"
        value={String(stats.approvedRequests)}
      />
      <StatCard
        icon="close-circle-outline"
        iconColor="text-red-400"
        label="Từ chối"
        value={String(stats.rejectedRequests)}
      />
      <StatCard
        icon="analytics-outline"
        iconColor="text-blue-400"
        label="Tổng yêu cầu"
        value={String(stats.totalRequests)}
      />
    </div>
  );
}
