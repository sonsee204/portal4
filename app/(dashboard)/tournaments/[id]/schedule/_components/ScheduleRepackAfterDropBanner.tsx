'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { RepackAfterDropHint } from '@/lib/tournament/detect-repack-after-drop';

interface ScheduleRepackAfterDropBannerProps {
  hint: RepackAfterDropHint;
  courtName?: string;
  onPreviewRepack: () => void;
  onDismiss: () => void;
}

export function ScheduleRepackAfterDropBanner({
  hint,
  courtName,
  onPreviewRepack,
  onDismiss,
}: ScheduleRepackAfterDropBannerProps) {
  return (
    <div className="border-amber-500/30 bg-amber-500/5 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
        <IonIcon
          name="git-merge-outline"
          size="sm"
          className="text-amber-600 dark:text-amber-400"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-heading text-sm font-semibold">
          {hint.overlapCount} trận trên {courtName ?? 'sân'} bị chồng lịch
        </p>
        <p className="text-muted mt-0.5 text-xs">
          Bạn có thể dồn lại lịch các trận phía sau để gọn sân.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onDismiss}>
          Bỏ qua
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          iconLeft="eye-outline"
          onClick={onPreviewRepack}
        >
          Xem trước dồn lịch
        </Button>
      </div>
    </div>
  );
}
