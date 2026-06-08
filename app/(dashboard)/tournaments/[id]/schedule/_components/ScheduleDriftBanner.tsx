'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { ScheduleDriftBannerPayload } from '@/hooks/tournament/useScheduleDriftBanner';

interface ScheduleDriftBannerProps {
  open: boolean;
  payload: ScheduleDriftBannerPayload | null;
  onDismiss: () => void;
}

export function ScheduleDriftBanner({
  open,
  payload,
  onDismiss,
}: ScheduleDriftBannerProps) {
  if (!payload) return null;

  const late = payload.driftMinutes > 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="dark:bg-surface mt-4 rounded-xl border border-l-4 border-l-amber-400 bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <IonIcon
              name="timer-outline"
              size="lg"
              className="mt-0.5 shrink-0 text-amber-500"
            />
            <div className="min-w-0 flex-1">
              <p className="text-heading text-sm font-semibold">
                Trận #{payload.matchNumber}
                {payload.courtName ? ` (${payload.courtName})` : ''} kéo dài hơn
                dự kiến
              </p>
              <p className="text-muted mt-1 text-xs">
                {late
                  ? `Thực tế dài hơn ${payload.driftMinutes} phút so với lịch. Các trận sau có thể được dồn tự động.`
                  : `Kết thúc sớm hơn dự kiến ${Math.abs(payload.driftMinutes)} phút.`}
              </p>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="text-muted hover:text-heading shrink-0 rounded-lg p-1.5"
              aria-label="Đóng"
            >
              <IonIcon name="close-outline" size="md" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
