'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { Report, ReportCategory } from '@/types/portal';

const categoryLabel: Record<ReportCategory, string> = {
  hate_speech: 'Ngôn từ thù địch',
  spam: 'Spam',
  scam: 'Lừa đảo',
  other: 'Khác',
};

const categoryVariant: Record<
  ReportCategory,
  'danger' | 'warning' | 'info' | 'neutral'
> = {
  hate_speech: 'danger',
  spam: 'warning',
  scam: 'info',
  other: 'neutral',
};

export function ReportListItem({
  report,
  active,
  onClick,
}: {
  report: Report;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-xl p-3 text-left transition-colors',
        active
          ? 'bg-primary/10 border-primary/30 border'
          : 'hover:bg-surface-hover border border-transparent'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge
              variant={categoryVariant[report.category]}
              className="text-[10px]"
            >
              {categoryLabel[report.category]}
            </Badge>
            <span className="font-mono text-[10px] text-slate-500">
              {report.ticketId}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-white">{report.content}</p>
          <p className="mt-0.5 text-xs text-slate-500">@{report.authorName}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[10px] text-slate-500">{report.createdAt}</span>
          <div className="flex items-center gap-1 text-[10px] text-red-400">
            <IonIcon name="flag-outline" size="xs" />
            {report.reporterCount}
          </div>
        </div>
      </div>
    </button>
  );
}
