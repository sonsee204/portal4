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

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { ScheduleShiftPreview } from '@/graphql/generated';
import { ScheduleShiftPreviewTable } from './ScheduleShiftPreviewTable';
import { formatScheduledAt } from '@/lib/utils/format';
import type {
  AutoRepackBannerKind,
  AutoRepackShiftRow,
} from '@/lib/tournament/detect-schedule-auto-repack';

export type { AutoRepackShiftRow };

interface ScheduleAutoRepackBannerProps {
  open: boolean;
  kind?: AutoRepackBannerKind;
  courtLabels: string[];
  shifts: AutoRepackShiftRow[];
  anchorMatchNumber?: number;
  onDismiss: () => void;
  onViewDetail?: () => void;
}

export function ScheduleAutoRepackBanner({
  open,
  kind = 'repack',
  courtLabels,
  shifts,
  anchorMatchNumber,
  onDismiss,
  onViewDetail,
}: ScheduleAutoRepackBannerProps) {
  return (
    <AnimatePresence>
      {open && shifts.length > 0 ? (
        <ScheduleAutoRepackBannerContent
          kind={kind}
          courtLabels={courtLabels}
          shifts={shifts}
          anchorMatchNumber={anchorMatchNumber}
          onDismiss={onDismiss}
          onViewDetail={onViewDetail}
        />
      ) : null}
    </AnimatePresence>
  );
}

function ScheduleAutoRepackBannerContent({
  kind,
  courtLabels,
  shifts,
  anchorMatchNumber,
  onDismiss,
  onViewDetail,
}: Omit<ScheduleAutoRepackBannerProps, 'open'>) {
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(), 30_000);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  const previewRows: ScheduleShiftPreview[] = shifts.map((s) => ({
    matchId: s.matchId,
    matchNumber: s.matchNumber,
    oldScheduledAt: s.oldTime,
    newScheduledAt: s.newTime,
  }));

  const courtList = courtLabels.slice(0, 3).join(', ');
  const isActualized = kind === 'actualized';
  const title = isActualized
    ? `Trận #${anchorMatchNumber ?? shifts[0]?.matchNumber} đã cập nhật khung giờ theo thời gian thực`
    : `Lịch${courtList ? ` ${courtList}` : ''} đã được dồn tự động — ${shifts.length} trận đổi giờ`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={
        isActualized
          ? 'rounded-xl border border-l-4 border-l-emerald-400 bg-white p-4 text-emerald-700 dark:bg-surface'
          : 'border-primary/25 bg-primary/[0.06] rounded-xl border p-4'
      }
    >
      <div className="flex items-start gap-3">
        <IonIcon
          name={isActualized ? 'time-outline' : 'git-compare-outline'}
          size="lg"
          className={
            isActualized
              ? 'mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400'
              : 'text-primary mt-0.5 shrink-0'
          }
        />
        <div className="min-w-0 flex-1">
          <p
            className={
              isActualized
                ? 'text-heading text-sm font-semibold text-emerald-800 dark:text-emerald-300'
                : 'text-heading text-sm font-semibold'
            }
          >
            {title}
          </p>
          <ul className="text-muted mt-2 space-y-1 text-xs">
            {shifts.slice(0, 3).map((s) => (
              <li key={s.matchId} className="tabular-nums">
                #{s.matchNumber} ({s.courtLabel}):{' '}
                <span className="line-through">
                  {formatScheduledAt(s.oldTime)}
                </span>{' '}
                →{' '}
                <span className="text-primary font-medium">
                  {formatScheduledAt(s.newTime)}
                </span>
              </li>
            ))}
            {shifts.length > 3 ? <li>+{shifts.length - 3} trận khác</li> : null}
          </ul>
          {detailOpen ? (
            <div className="mt-3">
              <ScheduleShiftPreviewTable rows={previewRows} maxRows={12} />
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          {shifts.length > 3 || onViewDetail ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDetailOpen((v) => !v);
                onViewDetail?.();
              }}
            >
              {detailOpen ? 'Thu gọn' : 'Xem chi tiết'}
            </Button>
          ) : null}
          <button
            type="button"
            onClick={onDismiss}
            className="text-muted hover:text-heading rounded-lg p-1.5 transition-colors"
            aria-label="Đóng"
          >
            <IonIcon name="close-outline" size="md" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
