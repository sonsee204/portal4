/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * Cross-ref: nalee-sports-mobile useRecurringBookingSetupData fetchSlotsForDay
 */

import type { DayScheduleInput } from '@/graphql/generated';
import type { BookingPromotionSlot } from './build-booking-promotion-input';
import type { StaffAvailabilityCourt } from '@/lib/venue/calendar-staff-booking';

export function getSampleDateForDayOfWeek(
  startDate: string,
  dayOfWeek: number,
): string {
  const [year, month, day] = startDate.split('-').map(Number);
  const base = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
  const baseDow = base.getDay();
  let diff = dayOfWeek - baseDow;
  if (diff < 0) diff += 7;
  if (diff === 0) diff = 7;
  const target = new Date(base);
  target.setDate(base.getDate() + diff);
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function mapMatchingSlotsFromAvailability(
  courts: StaffAvailabilityCourt[],
  templateSlots: BookingPromotionSlot[],
): BookingPromotionSlot[] | null {
  const originalKeys = new Set(
    templateSlots.map(
      (slot) => `${slot.courtId}-${slot.startTime}-${slot.endTime}`,
    ),
  );

  const mapped: BookingPromotionSlot[] = [];
  for (const court of courts) {
    for (const slot of court.slots) {
      const key = `${court.courtId}-${slot.startTime}-${slot.endTime}`;
      if (originalKeys.has(key)) {
        mapped.push({
          courtId: court.courtId,
          courtName: court.courtName,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          isPeakHour: slot.isPeakHour,
        });
      }
    }
  }

  return mapped.length > 0 ? mapped : null;
}

export function buildRecurringAvailabilityParams(params: {
  selectedDays: number[];
  primaryDayOfWeek: number;
  slotsByDay: Map<number, BookingPromotionSlot[]>;
  fallbackSlots: BookingPromotionSlot[];
}) {
  const isSingleDay = params.selectedDays.length === 1;
  const primarySlots =
    params.slotsByDay.get(params.primaryDayOfWeek) ?? params.fallbackSlots;

  const slots = isSingleDay
    ? primarySlots.map((slot) => ({
      courtId: slot.courtId,
      courtName: slot.courtName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
      isPeakHour: slot.isPeakHour ?? false,
    }))
    : undefined;

  const daySchedules: DayScheduleInput[] | undefined = !isSingleDay
    ? params.selectedDays.map((day) => {
      const daySlots = params.slotsByDay.get(day) ?? params.fallbackSlots;
      return {
        dayOfWeek: day,
        slots: daySlots.map((slot) => ({
          courtId: slot.courtId,
          courtName: slot.courtName,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          isPeakHour: slot.isPeakHour ?? false,
        })),
      };
    })
    : undefined;

  return { slots, daySchedules, isSingleDay };
}
