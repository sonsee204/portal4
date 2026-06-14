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
import { StatCard } from '@/components/molecules/StatCard';
import { REPORT_TABS } from '../_hooks/moderation-page.constants';
import type { ModerationPageData } from '../_hooks/useModerationPageData';

export function ModerationHeaderSection() {
  return (
    <PageHeader
      title="Kiểm duyệt nội dung"
      description="Xem xét và xử lý các báo cáo từ cộng đồng."
    />
  );
}

export function ModerationStatsSection({ data }: { data: ModerationPageData }) {
  const { activeStats } = data;
  if (!activeStats) return null;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-4">
      <StatCard
        icon="flag-outline"
        iconColor="text-red-400"
        label="Chờ xử lý"
        value={String(activeStats.pendingReports)}
      />
      <StatCard
        icon="eye-outline"
        iconColor="text-amber-400"
        label="Đang xem xét"
        value={String(activeStats.reviewedReports)}
      />
      <StatCard
        icon="checkmark-circle-outline"
        iconColor="text-emerald-400"
        label="Đã xử lý"
        value={String(activeStats.resolvedReports)}
      />
      <StatCard
        icon="analytics-outline"
        iconColor="text-blue-400"
        label="Tổng báo cáo"
        value={String(activeStats.totalReports)}
      />
    </div>
  );
}

export function ModerationTabsSection({ data }: { data: ModerationPageData }) {
  const { activeTab, setActiveTab } = data;

  return (
    <div className="mt-6 flex gap-2">
      {REPORT_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-primary text-white'
              : 'bg-surface-hover text-muted hover:text-heading'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
