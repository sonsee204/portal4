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

export type BookingSlotLike = {
  courtId?: string | null;
  courtName?: string | null;
  startTime: string;
  endTime: string;
  price?: number | null;
  isPeakHour?: boolean | null;
};

export type GroupedBookingSlotDisplay = {
  id: string;
  courtName: string;
  startTime: string;
  endTime: string;
  slotCount: number;
  totalPrice: number;
  hasPeakHour: boolean;
};

function areConsecutiveSlots(
  previous: BookingSlotLike,
  next: BookingSlotLike,
): boolean {
  return (
    (previous.courtId && next.courtId
      ? previous.courtId === next.courtId
      : (previous.courtName ?? '') === (next.courtName ?? '')) &&
    previous.endTime === next.startTime
  );
}

export function groupBookingSlotsForDisplay(
  slots: BookingSlotLike[],
): GroupedBookingSlotDisplay[] {
  if (slots.length === 0) return [];

  const sorted = [...slots].sort((a, b) => {
    const courtCompare = (a.courtName ?? '').localeCompare(b.courtName ?? '', 'vi');
    if (courtCompare !== 0) return courtCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const groups: GroupedBookingSlotDisplay[] = [];
  let index = 0;

  while (index < sorted.length) {
    const first = sorted[index]!;
    const batch: BookingSlotLike[] = [first];
    let nextIndex = index + 1;

    while (nextIndex < sorted.length) {
      const previous = sorted[nextIndex - 1];
      const next = sorted[nextIndex];
      if (!previous || !next || !areConsecutiveSlots(previous, next)) {
        break;
      }
      batch.push(next);
      nextIndex += 1;
    }

    const last = batch[batch.length - 1]!;
    groups.push({
      id: `${first.courtId ?? first.courtName ?? 'court'}-${first.startTime}`,
      courtName: first.courtName?.trim() || 'Sân',
      startTime: first.startTime,
      endTime: last.endTime,
      slotCount: batch.length,
      totalPrice: batch.reduce((sum, slot) => sum + (slot.price ?? 0), 0),
      hasPeakHour: batch.some((slot) => slot.isPeakHour === true),
    });

    index = nextIndex;
  }

  return groups;
}

export function formatGroupedBookingSlotsSummary(
  groups: GroupedBookingSlotDisplay[],
): string {
  if (groups.length === 0) return '—';

  return groups
    .map((group) => {
      const slotNote =
        group.slotCount > 1 ? ` (${group.slotCount} slot)` : '';
      return `${group.courtName}: ${group.startTime} – ${group.endTime}${slotNote}`;
    })
    .join(' • ');
}

export function getUniqueCourtNames(
  groups: GroupedBookingSlotDisplay[],
): string[] {
  return [...new Set(groups.map((group) => group.courtName))];
}

/** Compact one-line summary for dense UI (tables, lists). */
export function formatCompactBookingSlots(slots: BookingSlotLike[]): string {
  const groups = groupBookingSlotsForDisplay(slots);
  if (groups.length === 0) return '—';

  const singleCourt = getUniqueCourtNames(groups).length === 1;

  return groups
    .map((group) => {
      const time = `${group.startTime} – ${group.endTime}`;
      const count = group.slotCount > 1 ? ` ×${group.slotCount}` : '';
      if (singleCourt) {
        return `${time}${count}`;
      }
      return `${group.courtName} ${time}${count}`;
    })
    .join(' • ');
}
