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

import { IonIcon } from '@/components/atoms/IonIcon';
import { QueryState } from '@/components/molecules/QueryState';
import { buildFinanceInsights } from '@/lib/finance/finance-display';
import { cn } from '@/lib/utils';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceInsightsSectionProps {
  data: OwnerFinancePageData;
}

const toneStyles = {
  info: 'border-sky-400/20 bg-sky-400/5 text-sky-300',
  warning: 'border-amber-400/20 bg-amber-400/5 text-amber-300',
  success: 'border-emerald-400/20 bg-emerald-400/5 text-emerald-300',
} as const;

const toneIcons = {
  info: 'information-circle-outline',
  warning: 'alert-circle-outline',
  success: 'checkmark-circle-outline',
} as const;

export function OwnerFinanceInsightsSection({
  data,
}: OwnerFinanceInsightsSectionProps) {
  const insights = buildFinanceInsights(data.report);

  return (
    <QueryState
      loading={data.reportLoading && !data.report}
      error={data.reportError}
      empty={!data.allVenues && !data.selectedVenueId}
      emptyMessage=""
      onRetry={() => void data.refetchReport()}
    >
      {insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className={cn(
                'flex gap-3 rounded-xl border px-4 py-3',
                toneStyles[insight.tone]
              )}
            >
              <IonIcon
                name={toneIcons[insight.tone]}
                size="sm"
                className="mt-0.5 shrink-0"
              />
              <div>
                <p className="text-heading text-sm font-semibold">
                  {insight.title}
                </p>
                <p className="text-muted mt-1 text-sm leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </QueryState>
  );
}
