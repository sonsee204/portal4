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

import { QueryState } from '@/components/molecules/QueryState';
import { useDashboardPageData } from './_hooks/useDashboardPageData';
import { DashboardHeaderSection } from './_sections/DashboardHeaderSection';
import { DashboardMainSection } from './_sections/DashboardMainSection';
import { DashboardStatsSection } from './_sections/DashboardStatsSection';

export default function AdminDashboardPage() {
  const data = useDashboardPageData();

  return (
    <>
      <DashboardHeaderSection data={data} />
      <QueryState
        loading={data.loading && !data.stats}
        error={data.error}
        onRetry={() => void data.refetch()}
      >
        <DashboardStatsSection data={data} />
        <DashboardMainSection data={data} />
      </QueryState>
    </>
  );
}
