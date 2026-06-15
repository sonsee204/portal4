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
import { TOURNAMENT } from '@/lib/strings';
import type { LateEntryModalState } from '../../_hooks/useLateEntryModal';
import { RandomAllocationBanner, SummaryRow } from './late-entry.helpers';

interface LateEntryConfirmStepProps {
  modal: LateEntryModalState;
}

export function LateEntryConfirmStep({ modal }: LateEntryConfirmStepProps) {
  const {
    preview,
    selectedCategory,
    reason,
    buildInput,
    setStep,
    setConfirmOpen,
  } = modal;

  if (!preview || !selectedCategory) return null;

  return (
    <div className="space-y-4">
      <RandomAllocationBanner count={preview.eligibleByeMatchCount} />

      <GlassPanel card className="overflow-hidden !p-0">
        <div className="border-border border-b px-4 py-3">
          <p className="text-heading text-sm font-semibold">
            {TOURNAMENT.LATE_ENTRY_CONFIRM_SUMMARY}
          </p>
        </div>
        <div className="divide-border divide-y px-4">
          <SummaryRow label="Hạng mục" value={selectedCategory.title} />
          <SummaryRow label="VĐV / đội" value={buildInput().athleteName} />
          <SummaryRow label="Lý do" value={reason.trim()} />
        </div>
      </GlassPanel>

      <div className="flex justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
          Quay lại
        </Button>
        <Button size="sm" onClick={() => setConfirmOpen(true)}>
          Xác nhận thêm muộn
        </Button>
      </div>
    </div>
  );
}
