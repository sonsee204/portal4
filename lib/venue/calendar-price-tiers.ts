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

import type { StaffAvailabilityCourt } from './calendar-staff-booking';

/** Matches mobile theme `_config.ts` (green500 / pink500 / red500). */
export const CALENDAR_PRICE_TIER_PALETTE = {
  low: {
    bg: 'rgba(16, 185, 129, 0.1)',
    text: '#10B981',
    border: 'rgba(16, 185, 129, 0.3)',
    legendBg: 'rgba(16, 185, 129, 0.2)',
  },
  medium: {
    bg: 'rgba(236, 72, 153, 0.1)',
    text: '#EC4899',
    border: 'rgba(236, 72, 153, 0.3)',
    legendBg: 'rgba(236, 72, 153, 0.2)',
  },
  high: {
    bg: 'rgba(239, 68, 68, 0.1)',
    text: '#EF4444',
    border: 'rgba(239, 68, 68, 0.3)',
    legendBg: 'rgba(239, 68, 68, 0.2)',
  },
} as const;

/** Matches mobile selected slot (purple500 / purple700). */
export const CALENDAR_SELECTED_SLOT_PALETTE = {
  bg: '#8B5CF6',
  border: '#7e22ce',
  text: '#FFFFFF',
} as const;

export type CalendarPriceTier = 'low' | 'medium' | 'high';

export type CalendarPriceTiers = {
  min: number;
  max: number;
  uniquePrices: number[];
};

export function buildAvailabilityPriceTiers(
  courts: StaffAvailabilityCourt[],
): CalendarPriceTiers {
  const allPrices = new Set<number>();
  const availablePrices = new Set<number>();

  for (const court of courts) {
    for (const slot of court.slots) {
      if (slot.isPast) {
        continue;
      }

      allPrices.add(slot.price);
      if (slot.isAvailable && !slot.bookingId && !slot.isHold) {
        availablePrices.add(slot.price);
      }
    }
  }

  const pricesSet = availablePrices.size > 0 ? availablePrices : allPrices;
  const uniquePrices = Array.from(pricesSet).sort((a, b) => a - b);

  return {
    min: uniquePrices[0] ?? 0,
    max: uniquePrices[uniquePrices.length - 1] ?? 0,
    uniquePrices,
  };
}

export function getCalendarPriceTier(
  price: number,
  priceTiers: CalendarPriceTiers,
): CalendarPriceTier {
  const { min, max, uniquePrices } = priceTiers;

  if (uniquePrices.length <= 1) {
    return 'low';
  }

  if (uniquePrices.length === 2) {
    return price === min ? 'low' : 'high';
  }

  const range = max - min;
  if (range === 0) {
    return 'low';
  }

  const normalized = (price - min) / range;
  if (normalized < 0.33) {
    return 'low';
  }
  if (normalized < 0.67) {
    return 'medium';
  }
  return 'high';
}

export function formatCalendarSlotPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price);
}

export type CalendarPriceTierStyle = {
  backgroundColor: string;
  color: string;
  borderColor: string;
};

export function getCalendarPriceTierStyle(
  tier: CalendarPriceTier,
): CalendarPriceTierStyle {
  const palette = CALENDAR_PRICE_TIER_PALETTE[tier];
  return {
    backgroundColor: palette.bg,
    color: palette.text,
    borderColor: palette.border,
  };
}

export function getCalendarPriceTierLegendBg(
  tier: CalendarPriceTier,
): string {
  return CALENDAR_PRICE_TIER_PALETTE[tier].legendBg;
}
