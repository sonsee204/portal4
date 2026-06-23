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

import { cn } from '@/lib/utils';
import {
  getUniqueCourtNames,
  groupBookingSlotsForDisplay,
  type BookingSlotLike,
} from '@/lib/venue/booking-slots-display';

type BookingSlotsCellInput = {
  courtId?: string | null;
  courtName?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  price?: number | null;
  isPeakHour?: boolean | null;
};

export function BookingSlotsCell({
  slots,
  className,
}: {
  slots?: Array<BookingSlotsCellInput | null> | null;
  className?: string;
}) {
  const normalized: BookingSlotLike[] = [];

  for (const slot of slots ?? []) {
    if (!slot?.startTime || !slot.endTime) continue;
    normalized.push({
      courtId: slot.courtId,
      courtName: slot.courtName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
      isPeakHour: slot.isPeakHour,
    });
  }

  const groups = groupBookingSlotsForDisplay(normalized);

  if (groups.length === 0) {
    return <span className="text-muted text-xs">—</span>;
  }

  const singleCourt = getUniqueCourtNames(groups).length === 1;

  return (
    <div className={cn('flex max-w-md flex-col gap-1', className)}>
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs leading-snug"
        >
          {!singleCourt ? (
            <span className="text-body font-medium">{group.courtName}</span>
          ) : null}
          <span className="text-muted tabular-nums">
            {group.startTime} – {group.endTime}
          </span>
          {group.slotCount > 1 ? (
            <span className="bg-surface-hover text-muted rounded px-1.5 py-px text-[10px] font-medium">
              ×{group.slotCount}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
