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
import { cn } from '@/lib/utils';
import type { VenueProductReportQuery } from '@/graphql/generated';

type ProductReportSummary =
  VenueProductReportQuery['venueProductReport']['summary'];

interface ProductStatsInsightStripProps {
  summary: ProductReportSummary;
}

type InsightTone = 'emerald' | 'violet' | 'sky' | 'amber';

const insightToneStyles: Record<
  InsightTone,
  { card: string; icon: string; glow: string }
> = {
  emerald: {
    card: 'border-emerald-400/30 bg-gradient-to-br from-emerald-500/12 to-emerald-500/5',
    icon: 'border-emerald-400/20 bg-emerald-400/15 text-emerald-400',
    glow: 'bg-emerald-400/20',
  },
  violet: {
    card: 'border-violet-400/30 bg-gradient-to-br from-violet-500/12 to-violet-500/5',
    icon: 'border-violet-400/20 bg-violet-400/15 text-violet-400',
    glow: 'bg-violet-400/20',
  },
  sky: {
    card: 'border-sky-400/30 bg-gradient-to-br from-sky-500/12 to-sky-500/5',
    icon: 'border-sky-400/20 bg-sky-400/15 text-sky-400',
    glow: 'bg-sky-400/20',
  },
  amber: {
    card: 'border-amber-400/30 bg-gradient-to-br from-amber-500/12 to-amber-500/5',
    icon: 'border-amber-400/20 bg-amber-400/15 text-amber-400',
    glow: 'bg-amber-400/20',
  },
};

function InsightHighlightCard({
  icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: string;
  tone: InsightTone;
  label: string;
  value: string;
  hint?: string;
}) {
  const styles = insightToneStyles[tone];

  return (
    <div
      className={cn(
        'glass-panel relative overflow-hidden rounded-xl border p-4 shadow-sm',
        styles.card
      )}
    >
      <div
        className={cn(
          'absolute -top-8 -right-8 h-20 w-20 rounded-full blur-2xl',
          styles.glow
        )}
      />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
              styles.icon
            )}
          >
            <IonIcon name={icon} size="sm" />
          </div>
          <p className="text-muted text-[11px] font-semibold tracking-wide uppercase">
            {label}
          </p>
        </div>
        <p className="text-heading mt-3 truncate text-base leading-snug font-bold">
          {value}
        </p>
        {hint ? <p className="text-muted mt-1 text-xs">{hint}</p> : null}
      </div>
    </div>
  );
}

export function ProductStatsInsightStrip({
  summary,
}: ProductStatsInsightStripProps) {
  return (
    <div className="mb-4">
      <div className="mb-3 flex items-center gap-2">
        <IonIcon
          name="sparkles-outline"
          size="sm"
          className="text-emerald-400"
        />
        <h3 className="text-heading text-sm font-bold">Điểm nhấn trong kỳ</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InsightHighlightCard
          icon="trophy-outline"
          tone="emerald"
          label="Bán chạy nhất"
          value={summary.bestSellingProduct}
          hint="Sản phẩm dẫn đầu doanh thu"
        />
        <InsightHighlightCard
          icon="grid-outline"
          tone="violet"
          label="Danh mục dẫn đầu"
          value={summary.bestSellingCategory}
          hint="Nhóm sản phẩm bán tốt nhất"
        />
        <InsightHighlightCard
          icon="time-outline"
          tone="sky"
          label="Giờ cao điểm"
          value={summary.peakHour}
          hint={`Ngày bán nhiều nhất: ${summary.peakDay}`}
        />
        <InsightHighlightCard
          icon="layers-outline"
          tone="amber"
          label="SP bán trong kỳ"
          value={`${summary.uniqueProductsSold} SKU`}
          hint={`${summary.totalItemsSold.toLocaleString('vi-VN')} sản phẩm đã bán`}
        />
      </div>
    </div>
  );
}
