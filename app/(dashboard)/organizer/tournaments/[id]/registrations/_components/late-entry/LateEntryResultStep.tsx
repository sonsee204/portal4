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
import { LateEntryAction } from '@/graphql/generated';
import type { LateEntryModalState } from '../../_hooks/useLateEntryModal';

interface LateEntryResultStepProps {
  modal: LateEntryModalState;
}

export function LateEntryResultStep({ modal }: LateEntryResultStepProps) {
  const { result, handleClose } = modal;

  if (!result) return null;

  return (
    <div className="space-y-4">
      {result.action === LateEntryAction.FilledBye && (
        <GlassPanel card className="overflow-hidden !p-0">
          <div className="flex items-start gap-3 bg-green-500/10 px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20">
              <IonIcon
                name="checkmark-circle-outline"
                size="md"
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-heading font-semibold">
                {TOURNAMENT.LATE_ENTRY_RESULT_FILLED}
              </p>
              {result.match && (
                <p className="text-secondary mt-1 text-sm">
                  {TOURNAMENT.LATE_ENTRY_RESULT_MATCH(
                    result.match.matchNumber,
                    result.opponentName ?? '—'
                  )}
                </p>
              )}
              {result.scheduleNeedsUpdate && (
                <p className="text-secondary mt-2 flex items-start gap-1.5 text-sm">
                  <IonIcon
                    name="calendar-outline"
                    size="sm"
                    className="text-primary mt-0.5 shrink-0"
                  />
                  {TOURNAMENT.LATE_ENTRY_SCHEDULE_NOTE}
                </p>
              )}
              {result.registration && (
                <p className="text-muted mt-2 text-xs">
                  Mã đăng ký: {result.registration._id}
                </p>
              )}
            </div>
          </div>
        </GlassPanel>
      )}

      {result.action === LateEntryAction.NoByeSlot && (
        <div className="border-border rounded-lg border p-4">
          <p className="text-heading font-medium">
            {TOURNAMENT.LATE_ENTRY_RESULT_NO_SLOT}
          </p>
          <p className="text-muted mt-1 text-sm">{result.message}</p>
        </div>
      )}

      {result.action === LateEntryAction.Blocked && (
        <div className="border-border rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="font-medium text-red-400">
            {TOURNAMENT.LATE_ENTRY_RESULT_BLOCKED}
          </p>
          <p className="text-muted mt-1 text-sm">{result.message}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={handleClose}>
          Đóng
        </Button>
      </div>
    </div>
  );
}
