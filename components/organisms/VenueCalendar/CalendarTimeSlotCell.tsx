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

import { IonIcon } from '@/components/atoms/IonIcon';
import { cn } from '@/lib/utils';
import {
  CALENDAR_SELECTED_SLOT_PALETTE,
  formatCalendarSlotPrice,
  getCalendarPriceTier,
  getCalendarPriceTierStyle,
  type CalendarPriceTiers,
} from '@/lib/venue/calendar-price-tiers';
import type { StaffAvailabilitySlot } from '@/lib/venue/calendar-staff-booking';

export type CalendarTimeSlotCellProps = {
  slot: StaffAvailabilitySlot;
  priceTiers: CalendarPriceTiers;
  isSelected?: boolean;
  isSelectable?: boolean;
  width: number;
  height: number;
  left: number;
  top?: number;
  onClick?: () => void;
};

export function CalendarTimeSlotCell({
  slot,
  priceTiers,
  isSelected = false,
  isSelectable = false,
  width,
  height,
  left,
  top = 4,
  onClick,
}: CalendarTimeSlotCellProps) {
  const tier = getCalendarPriceTier(slot.price, priceTiers);
  const tierStyle = getCalendarPriceTierStyle(tier);
  const isDisabled = !slot.isAvailable;
  const canClick = isSelectable && !isDisabled;

  const title = `${slot.startTime} – ${slot.endTime} • ${formatCalendarSlotPrice(slot.price)}đ`;

  if (isSelected) {
    return (
      <button
        type="button"
        title={title}
        className={cn(
          'absolute z-[5] flex items-center justify-center rounded-lg border transition-opacity hover:opacity-90',
          onClick && 'cursor-pointer'
        )}
        style={{
          left,
          width,
          height,
          top,
          backgroundColor: CALENDAR_SELECTED_SLOT_PALETTE.bg,
          borderColor: CALENDAR_SELECTED_SLOT_PALETTE.border,
        }}
        onClick={onClick}
      >
        <IonIcon
          name="checkmark-circle"
          size="md"
          className="h-5 w-5 text-white"
        />
      </button>
    );
  }

  if (isDisabled) {
    return (
      <div
        title={title}
        className="pointer-events-none absolute z-[1] flex items-center justify-center rounded-lg border"
        style={{
          left,
          width,
          height,
          top,
          backgroundColor: '#EFEFEF',
          borderColor: '#DFDFDF',
          color: '#E5E7EB',
        }}
      >
        <span className="text-[10px] font-medium" style={{ color: '#E5E7EB' }}>
          {formatCalendarSlotPrice(slot.price)}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      title={title}
      className={cn(
        'absolute z-[5] flex items-center justify-center rounded-lg border transition-opacity hover:opacity-80',
        onClick && 'cursor-pointer'
      )}
      style={{
        left,
        width,
        height,
        top,
        backgroundColor: tierStyle.backgroundColor,
        borderColor: tierStyle.borderColor,
        color: tierStyle.color,
      }}
      onClick={canClick ? onClick : undefined}
    >
      <span className="text-xs font-bold">
        {formatCalendarSlotPrice(slot.price)}
      </span>
    </button>
  );
}
