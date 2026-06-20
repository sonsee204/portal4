/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * Cross-ref: nalee-sports-mobile RecurringBookingSetup/constants.ts
 */

export interface RecurringDurationOption {
  months: number;
  label: string;
  description: string;
  recommended?: boolean;
}

export const RECURRING_DURATION_OPTIONS: RecurringDurationOption[] = [
  {
    months: 1,
    label: '1 tháng',
    description: 'Đến hết tháng này',
  },
  {
    months: 2,
    label: '2 tháng',
    description: 'Đến hết tháng sau',
    recommended: true,
  },
  {
    months: 3,
    label: '3 tháng',
    description: 'Đến hết tháng thứ 3',
  },
];

export const DAY_OF_WEEK_CHIPS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'CN' },
  { value: 1, label: 'T2' },
  { value: 2, label: 'T3' },
  { value: 3, label: 'T4' },
  { value: 4, label: 'T5' },
  { value: 5, label: 'T6' },
  { value: 6, label: 'T7' },
];

export const RECURRING_WIZARD_STEPS = [
  { label: 'Cấu hình' },
  { label: 'Xác nhận' },
] as const;

export function toggleDayOfWeek(
  selected: number[],
  day: number,
  anchorDay: number,
): number[] {
  if (day === anchorDay) {
    return selected.includes(day) ? selected : [...selected, day];
  }
  if (selected.includes(day)) {
    const next = selected.filter((value) => value !== day);
    return next.length > 0 ? next : [anchorDay];
  }
  return [...selected, day].sort((a, b) => a - b);
}

export function buildInitialSelectedDays(anchorDay: number): number[] {
  return [anchorDay];
}
