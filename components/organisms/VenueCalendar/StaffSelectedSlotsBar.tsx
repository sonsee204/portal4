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
import { IonIcon } from '@/components/atoms/IonIcon';
import { formatCurrency } from '@/lib/utils';
import {
  buildStaffSlotKey,
  type StaffSelectedSlot,
} from '@/lib/venue/calendar-staff-booking';
import { parseTimeToMinutes } from '@/lib/venue/calendar-booking-segments';

interface StaffSelectedSlotsBarProps {
  selectedSlots: StaffSelectedSlot[];
  totalPrice: number;
  onRemoveSlot: (slotKey: string) => void;
  onClear: () => void;
  onBook: () => void;
}

export function StaffSelectedSlotsBar({
  selectedSlots,
  totalPrice,
  onRemoveSlot,
  onClear,
  onBook,
}: StaffSelectedSlotsBarProps) {
  if (selectedSlots.length === 0) {
    return null;
  }

  const sortedSlots = [...selectedSlots].sort((a, b) => {
    const courtCompare = a.courtName.localeCompare(b.courtName, 'vi');
    if (courtCompare !== 0) return courtCompare;
    return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
  });

  return (
    <div className="border-surface-border bg-surface-faint space-y-3 border-b px-4 py-3">
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-0.5">
        {sortedSlots.map((slot) => {
          const slotKey = buildStaffSlotKey(slot.courtId, slot.startTime);

          return (
            <div
              key={slotKey}
              className="bg-primary/10 text-primary inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <span>{slot.courtName}</span>
              <span className="bg-primary/30 h-4 w-px" aria-hidden />
              <span className="font-normal">
                {slot.startTime} – {slot.endTime}
              </span>
              <button
                type="button"
                className="bg-primary hover:bg-primary-hover inline-flex size-5 items-center justify-center rounded-full text-white transition-colors"
                aria-label={`Bỏ chọn ${slot.courtName} ${slot.startTime} – ${slot.endTime}`}
                onClick={() => onRemoveSlot(slotKey)}
              >
                <IonIcon name="close-outline" size="xs" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body text-sm">
          <span className="text-heading font-semibold">
            {selectedSlots.length}
          </span>{' '}
          khung giờ ·{' '}
          <span className="text-primary font-semibold">
            {formatCurrency(totalPrice)}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Bỏ chọn
          </Button>
          <Button size="sm" onClick={onBook}>
            Đặt lịch cho khách
          </Button>
        </div>
      </div>
    </div>
  );
}
