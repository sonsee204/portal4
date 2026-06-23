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
import { useOwnerFinanceOverviewLayout } from '../_hooks/useOwnerFinanceOverviewLayout';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import type { OwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';
import { OwnerFinanceOverviewKpiSection } from './overview/OwnerFinanceOverviewKpiSection';
import { OwnerFinanceOverviewInsightsSection } from './overview/OwnerFinanceOverviewInsightsSection';
import { OwnerFinanceOverviewPnlCompactSection } from './overview/OwnerFinanceOverviewPnlCompactSection';
import { OwnerFinanceOverviewTrendSection } from './overview/OwnerFinanceOverviewTrendSection';
import { OwnerFinanceOverviewBreakdownSection } from './overview/OwnerFinanceOverviewBreakdownSection';
import { OwnerFinanceOverviewOpsStripSection } from './overview/OwnerFinanceOverviewOpsStripSection';
import { OwnerFinanceOverviewVenueHighlights } from './overview/OwnerFinanceOverviewVenueHighlights';
import { OwnerFinanceOverviewTopVenuesChart } from './overview/OwnerFinanceOverviewTopVenuesChart';
import { OwnerFinanceOverviewPortfolioTable } from './overview/OwnerFinanceOverviewPortfolioTable';
import { OwnerFinanceOverviewFooterCta } from './overview/OwnerFinanceOverviewFooterCta';

interface OwnerFinancePortfolioSectionProps {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
}

export function OwnerFinancePortfolioSection({
  data,
  actions,
}: OwnerFinancePortfolioSectionProps) {
  const { mode, sections } = useOwnerFinanceOverviewLayout(data);
  const needsVenueSelection = mode === 'needsVenue';

  return (
    <div className="space-y-6">
      <QueryState
        loading={data.portfolioLoading && !data.portfolio}
        error={data.portfolioError}
        empty={data.venues.length === 0 || needsVenueSelection}
        emptyMessage={
          needsVenueSelection
            ? 'Chọn sân để xem tổng quan.'
            : 'Chưa có sân để xem danh mục.'
        }
        onRetry={() => void data.refetchPortfolio()}
      >
        {sections.kpi ? (
          <OwnerFinanceOverviewKpiSection data={data} mode={mode} />
        ) : null}
        {sections.insights ? (
          <OwnerFinanceOverviewInsightsSection data={data} />
        ) : null}
        {sections.pnlCompact ? (
          <OwnerFinanceOverviewPnlCompactSection data={data} />
        ) : null}
        {sections.trend ? (
          <OwnerFinanceOverviewTrendSection data={data} />
        ) : null}
        {sections.breakdown ? (
          <OwnerFinanceOverviewBreakdownSection data={data} />
        ) : null}
        {sections.opsStrip ? (
          <OwnerFinanceOverviewOpsStripSection data={data} />
        ) : null}
        {sections.highlights ? (
          <OwnerFinanceOverviewVenueHighlights data={data} />
        ) : null}
        {sections.topVenuesChart ? (
          <OwnerFinanceOverviewTopVenuesChart data={data} />
        ) : null}
        {sections.table ? (
          <OwnerFinanceOverviewPortfolioTable data={data} actions={actions} />
        ) : null}
        {sections.cta ? <OwnerFinanceOverviewFooterCta /> : null}
      </QueryState>
    </div>
  );
}
