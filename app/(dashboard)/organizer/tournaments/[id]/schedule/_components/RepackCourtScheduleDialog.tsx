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

import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type {
  ScheduleShiftPreview,
  TournamentMatch,
} from '@/graphql/generated';
import { ScheduleShiftPreviewTable } from './ScheduleShiftPreviewTable';

interface RepackCourtScheduleDialogProps {
  open: boolean;
  anchorMatch: TournamentMatch | null;
  courtName: string;
  calendarDate: string;
  previewRows?: ScheduleShiftPreview[];
  overdueCount?: number;
  overdueMatchIds?: Set<string>;
  previewLoading?: boolean;
  previewError?: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  lastPreview?: ScheduleShiftPreview[];
}

export function RepackCourtScheduleDialog({
  open,
  anchorMatch,
  courtName,
  calendarDate,
  previewRows,
  overdueCount = 0,
  overdueMatchIds,
  previewLoading,
  previewError,
  onClose,
  onConfirm,
  loading,
  lastPreview,
}: RepackCourtScheduleDialogProps) {
  if (!open || !anchorMatch) return null;

  const showApplied = lastPreview && lastPreview.length > 0;
  const rows = showApplied ? lastPreview : (previewRows ?? []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <GlassPanel
        card={true}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden p-0"
      >
        <div className="border-surface-border border-b px-5 py-4">
          <h2 className="text-heading text-base font-bold">Dồn lại lịch sân</h2>
          <p className="text-secondary mt-1 text-sm">
            {courtName} · {calendarDate}
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <p className="text-secondary text-sm leading-relaxed">
            Xếp liên tiếp các trận chưa đấu — gồm trận quá hạn — ngay sau trận
            mốc #{anchorMatch.matchNumber}.
          </p>

          {previewLoading ? (
            <div className="bg-surface-elevated h-24 animate-pulse rounded-lg" />
          ) : previewError ? (
            <p className="text-sm text-amber-500">{previewError}</p>
          ) : (
            <>
              {!showApplied && overdueCount > 0 ? (
                <p className="border-surface-border dark:bg-surface rounded-lg border border-l-4 border-l-amber-400 bg-white px-3 py-2 text-sm leading-relaxed text-amber-600 shadow-sm dark:border-l-amber-400 dark:text-amber-400">
                  <span className="font-semibold">{overdueCount}</span> trận quá
                  hạn sẽ được xếp lại trước.
                </p>
              ) : null}
              <ScheduleShiftPreviewTable
                rows={rows}
                overdueMatchIds={overdueIds(showApplied, overdueMatchIds)}
              />
            </>
          )}
        </div>

        <div className="border-surface-border flex gap-2 border-t px-5 py-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Đóng
          </Button>
          {!showApplied ? (
            <Button
              className="flex-1"
              onClick={() => void onConfirm()}
              disabled={
                loading || previewLoading || !!previewError || rows.length === 0
              }
            >
              {loading ? 'Đang dồn…' : `Dồn ${rows.length} trận`}
            </Button>
          ) : null}
        </div>
      </GlassPanel>
    </div>
  );
}

function overdueIds(
  showApplied: boolean | undefined,
  ids?: Set<string>
): Set<string> | undefined {
  return showApplied ? undefined : ids;
}
