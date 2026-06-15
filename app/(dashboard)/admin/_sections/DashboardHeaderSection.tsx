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
import { TabGroup } from '@/components/molecules/TabGroup';
import { PERIOD_TABS } from '../_hooks/dashboard-page.constants';
import type { DashboardPageData } from '../_hooks/useDashboardPageData';

interface DashboardHeaderSectionProps {
  data: DashboardPageData;
}

export function DashboardHeaderSection({ data }: DashboardHeaderSectionProps) {
  const { period, setPeriod } = data;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader
        title="Dashboard"
        description="Tổng quan hoạt động hệ thống HITRI TECH Portal."
      />
      <TabGroup tabs={[...PERIOD_TABS]} active={period} onChange={setPeriod} />
    </div>
  );
}
