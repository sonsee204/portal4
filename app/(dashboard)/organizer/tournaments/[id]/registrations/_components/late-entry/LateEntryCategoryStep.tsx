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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { TOURNAMENT } from '@/lib/strings';
import type { LateEntryModalState } from '../../_hooks/useLateEntryModal';

interface LateEntryCategoryStepProps {
  modal: LateEntryModalState;
}

export function LateEntryCategoryStep({ modal }: LateEntryCategoryStepProps) {
  const {
    eligibleCategories,
    categoryId,
    setCategoryId,
    preview,
    previewLoading,
    canProceedFromCategory,
    handleClose,
    setStep,
  } = modal;

  return (
    <div className="space-y-4">
      {eligibleCategories.length === 0 ? (
        <p className="text-muted text-sm">
          {TOURNAMENT.LATE_ENTRY_NO_ELIGIBLE_CATEGORY}
        </p>
      ) : (
        <>
          <label className="text-heading block text-sm font-medium">
            {TOURNAMENT.LATE_ENTRY_SELECT_CATEGORY}
          </label>
          <select
            className="border-border bg-surface text-heading w-full rounded-lg border px-3 py-2 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">— Chọn —</option>
            {eligibleCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          {categoryId && (
            <GlassPanel card className="!p-4">
              {previewLoading ? (
                <p className="text-muted text-sm">Đang tải...</p>
              ) : preview ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        preview.canProceed
                          ? 'bg-green-500/15'
                          : 'bg-amber-500/15'
                      }`}
                    >
                      <IonIcon
                        name={
                          preview.canProceed
                            ? 'checkmark-circle-outline'
                            : 'alert-circle-outline'
                        }
                        size="sm"
                        className={
                          preview.canProceed
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }
                      />
                    </div>
                    <p className="text-heading pt-1.5 text-sm font-medium">
                      {preview.blockReason
                        ? preview.blockReason
                        : TOURNAMENT.LATE_ENTRY_PREVIEW_COUNT(
                            preview.eligibleByeMatchCount
                          )}
                    </p>
                  </div>
                  {preview.eligibleMatches.length > 0 && (
                    <div className="border-border divide-border divide-y rounded-lg border">
                      <p className="text-muted bg-surface-elevated/50 px-3 py-2 text-xs font-medium tracking-wide uppercase">
                        {TOURNAMENT.LATE_ENTRY_PREVIEW_OPPONENTS}
                      </p>
                      <ul className="max-h-40 overflow-y-auto">
                        {preview.eligibleMatches.map((m) => (
                          <li
                            key={m.matchId}
                            className="hover:bg-surface-elevated/40 flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors"
                          >
                            <span className="text-heading">
                              Trận #{m.matchNumber}
                              <span className="text-muted ml-1 text-xs">
                                ({m.roundLabel})
                              </span>
                            </span>
                            <span className="text-secondary truncate text-right">
                              {m.opponentName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </GlassPanel>
          )}
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleClose}>
          Huỷ
        </Button>
        <Button
          size="sm"
          disabled={!canProceedFromCategory}
          onClick={() => setStep(1)}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
