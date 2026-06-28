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

export type CalendarScrollToNowOptions = {
  courtLabelWidth: number;
  hourCellWidth: number;
  viewportWidth: number;
  now?: Date;
  /** Fraction of viewport width kept before the current-time marker. */
  viewportLeadRatio?: number;
};

export function computeCalendarScrollLeftToNow(
  hours: number[],
  options: CalendarScrollToNowOptions,
): number {
  const {
    courtLabelWidth,
    hourCellWidth,
    viewportWidth,
    now = new Date(),
    viewportLeadRatio = 0.2,
  } = options;

  if (hours.length === 0 || viewportWidth <= 0) {
    return 0;
  }

  const gridStartHour = hours[0]!;
  const gridEndHour = hours[hours.length - 1]!;
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const gridContentWidth = courtLabelWidth + hours.length * hourCellWidth;
  const maxScroll = Math.max(0, gridContentWidth - viewportWidth);

  if (currentHour < gridStartHour) {
    return 0;
  }

  if (currentHour > gridEndHour) {
    return maxScroll;
  }

  const hourIndex = hours.findIndex((hour) => hour >= currentHour);
  const index = hourIndex >= 0 ? hourIndex : hours.length - 1;
  const hourAtIndex = hours[index]!;
  const minutesOffset =
    hourAtIndex === currentHour ? (currentMinutes / 60) * hourCellWidth : 0;
  const targetLeft = courtLabelWidth + index * hourCellWidth + minutesOffset;
  const padding = viewportWidth * viewportLeadRatio;

  return Math.max(0, Math.min(targetLeft - padding, maxScroll));
}
