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
import { useOwnerDashboardData } from './_hooks/useOwnerDashboardData';
import { OwnerDashboardHeaderSection } from './_sections/OwnerDashboardHeaderSection';
import { OwnerStaffWelcomeBanner } from './_sections/OwnerStaffWelcomeBanner';
import { OwnerDashboardStatsSection } from './_sections/OwnerDashboardStatsSection';
import { OwnerDashboardAlertsSection } from './_sections/OwnerDashboardAlertsSection';
import { OwnerDashboardVenuesTableSection } from './_sections/OwnerDashboardVenuesTableSection';

export default function OwnerDashboardPage() {
  const data = useOwnerDashboardData();

  return (
    <div className="space-y-6">
      <OwnerDashboardHeaderSection />
      <OwnerStaffWelcomeBanner />

      <QueryState
        loading={data.loading && !data.stats}
        error={data.error}
        onRetry={() => data.refetchAll()}
      >
        <OwnerDashboardStatsSection data={data} />
        <OwnerDashboardAlertsSection data={data} />
        <OwnerDashboardVenuesTableSection data={data} />
      </QueryState>
    </div>
  );
}
