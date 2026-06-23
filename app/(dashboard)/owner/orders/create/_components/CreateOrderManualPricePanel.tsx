/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Input } from '@/components/atoms/Input';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';

interface CreateOrderManualPricePanelProps {
  enabled: boolean;
  note: string;
  onToggle: (enabled: boolean) => void;
  onNoteChange: (value: string) => void;
}

export function CreateOrderManualPricePanel({
  enabled,
  note,
  onToggle,
  onNoteChange,
}: CreateOrderManualPricePanelProps) {
  return (
    <VenueActionGate action={VenueAction.OverridePrice}>
      <div className="border-surface-border space-y-3 rounded-lg border p-3">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="accent-primary size-4 rounded"
          />
          <span className="text-body text-sm font-medium">Giá thủ công</span>
        </label>
        {enabled ? (
          <Input
            label="Lý do điều chỉnh"
            placeholder="Ghi chú giá thủ công..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
          />
        ) : null}
      </div>
    </VenueActionGate>
  );
}
