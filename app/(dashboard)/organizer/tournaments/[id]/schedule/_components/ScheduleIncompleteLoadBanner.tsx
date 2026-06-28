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

import { motion } from 'framer-motion';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';

interface ScheduleIncompleteLoadBannerProps {
  loadedTotal: number;
  expectedTotal: number;
  onRefetch: () => void;
  onDismiss: () => void;
}

export function ScheduleIncompleteLoadBanner({
  loadedTotal,
  expectedTotal,
  onRefetch,
  onDismiss,
}: ScheduleIncompleteLoadBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 dark:border-amber-500/30"
    >
      <IonIcon
        name="cloud-offline-outline"
        size="lg"
        className="shrink-0 text-amber-500"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
          Đã tải {loadedTotal}/{expectedTotal} trận — một số vòng có thể chưa
          hiển thị.
        </p>
        <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-400/80">
          Tải lại để thử lấy đủ dữ liệu trước khi chỉnh lịch.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="primary"
          size="sm"
          iconLeft="refresh-outline"
          onClick={onRefetch}
        >
          Tải lại
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted hover:text-heading rounded-lg p-1.5 transition-colors"
          aria-label="Ẩn cảnh báo"
        >
          <IonIcon name="close-outline" size="md" />
        </button>
      </div>
    </motion.div>
  );
}
