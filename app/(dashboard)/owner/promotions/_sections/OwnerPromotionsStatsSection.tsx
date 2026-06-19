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
import { formatCurrency } from '@/lib/utils';
import type { OwnerPromotionsPageData } from '../_hooks/useOwnerPromotionsPageData';

interface OwnerPromotionsStatsSectionProps {
  data: OwnerPromotionsPageData;
}

export function OwnerPromotionsStatsSection({
  data,
}: OwnerPromotionsStatsSectionProps) {
  const { stats, statsLoading, venueId } = data;

  if (!venueId) return null;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon="pricetag-outline"
        iconColor="text-purple-400"
        label="Tổng khuyến mãi"
        value={statsLoading ? '…' : String(stats?.total ?? 0)}
      />
      <StatCard
        icon="checkmark-circle-outline"
        iconColor="text-emerald-400"
        label="Đang chạy"
        value={statsLoading ? '…' : String(stats?.active ?? 0)}
      />
      <StatCard
        icon="hourglass-outline"
        iconColor="text-amber-400"
        label="Chờ duyệt"
        value={statsLoading ? '…' : String(stats?.pendingApproval ?? 0)}
      />
      <StatCard
        icon="trending-down-outline"
        iconColor="text-blue-400"
        label="Tổng giảm đã áp dụng"
        value={
          statsLoading ? '…' : formatCurrency(stats?.totalDiscountGiven ?? 0)
        }
      />
    </div>
  );
}
