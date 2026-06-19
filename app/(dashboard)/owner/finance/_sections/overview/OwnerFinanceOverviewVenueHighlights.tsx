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

import { useMemo } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Badge } from '@/components/atoms/Badge';
import type { BadgeVariant } from '@/config/theme';
import { cn, formatCurrency } from '@/lib/utils';
import { getSignedValueClassName } from '@/lib/finance/stat-card-trend';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewVenueHighlightsProps {
  data: OwnerFinancePageData;
}

function VenueMiniList({
  title,
  badgeVariant,
  items,
  valueKey,
}: {
  title: string;
  badgeVariant: BadgeVariant;
  items: Array<{
    venueName: string;
    grossRevenue: { value: number };
    netProfit: { value: number };
  }>;
  valueKey: 'grossRevenue' | 'netProfit';
}) {
  return (
    <div>
      <p className="text-muted mb-2 text-xs font-semibold tracking-wide uppercase">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item, index) => {
          const value = item[valueKey].value;
          return (
            <li
              key={`${item.venueName}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/5 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Badge variant={badgeVariant} className="shrink-0">
                  {index + 1}
                </Badge>
                <span className="text-body truncate text-sm font-medium">
                  {item.venueName}
                </span>
              </div>
              <span
                className={cn(
                  'shrink-0 text-sm font-semibold',
                  getSignedValueClassName(value)
                )}
              >
                {formatCurrency(value)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function OwnerFinanceOverviewVenueHighlights({
  data,
}: OwnerFinanceOverviewVenueHighlightsProps) {
  const { topRevenue, bottomNetProfit } = useMemo(() => {
    const venues = [...(data.portfolio?.venues ?? [])];
    const topRevenue = [...venues]
      .sort((a, b) => b.grossRevenue.value - a.grossRevenue.value)
      .slice(0, 3);
    const bottomNetProfit = [...venues]
      .sort((a, b) => a.netProfit.value - b.netProfit.value)
      .slice(0, 3);

    return { topRevenue, bottomNetProfit };
  }, [data.portfolio?.venues]);

  if (topRevenue.length === 0) return null;

  return (
    <GlassPanel card className="space-y-4">
      <div>
        <h3 className="text-heading text-base font-bold">Điểm nổi bật</h3>
        <p className="text-muted mt-1 text-sm">
          Top doanh thu và cơ sở cần chú ý theo lãi ròng.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <VenueMiniList
          title="Top doanh thu gộp"
          badgeVariant="success"
          items={topRevenue}
          valueKey="grossRevenue"
        />
        <VenueMiniList
          title="Lãi ròng thấp nhất"
          badgeVariant="danger"
          items={bottomNetProfit}
          valueKey="netProfit"
        />
      </div>
    </GlassPanel>
  );
}
