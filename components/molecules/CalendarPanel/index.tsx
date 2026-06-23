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

import { useMemo } from 'react';
import { IonIcon } from '@/components/atoms/IonIcon';
import { cn } from '@/lib/utils';
import {
  DEFAULT_DATE_LOCALE,
  WEEKDAY_LABELS_VI,
  addMonths,
  buildMonthGrid,
  formatCalendarMonthYear,
  isDateDisabled,
  isDateInRange,
  isSameDay,
  isToday,
  normalizeDateRange,
  startOfDay,
  getMondayBasedWeekday,
} from '@/lib/date/calendar';

export interface CalendarDateRange {
  from: Date;
  to: Date;
}

export interface CalendarPanelProps {
  viewMonth: Date;
  selectedDate?: Date | null;
  selectedRange?: CalendarDateRange | null;
  onViewMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  className?: string;
  /** Flat layout for nesting inside another popover (no outer border/shadow). */
  variant?: 'default' | 'embedded';
}

export function CalendarPanel({
  viewMonth,
  selectedDate,
  selectedRange,
  onViewMonthChange,
  onSelectDate,
  minDate,
  maxDate,
  locale = DEFAULT_DATE_LOCALE,
  className,
  variant = 'default',
}: CalendarPanelProps) {
  const monthGrid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const monthLabel = formatCalendarMonthYear(viewMonth, locale);
  const normalizedRange = selectedRange
    ? normalizeDateRange(
        startOfDay(selectedRange.from),
        startOfDay(selectedRange.to)
      )
    : null;

  return (
    <div
      className={cn(
        variant === 'default' &&
          'border-surface-border bg-surface w-[340px] rounded-xl border p-3 shadow-lg',
        variant === 'embedded' && 'w-full',
        className
      )}
      role="application"
      aria-label="Chọn ngày"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className="hover:bg-surface-hover text-muted hover:text-heading rounded-lg p-1.5 transition-colors"
          aria-label="Tháng trước"
          onClick={() => onViewMonthChange(addMonths(viewMonth, -1))}
        >
          <IonIcon name="chevron-back-outline" size="sm" />
        </button>
        <p className="text-heading text-sm font-semibold capitalize">
          {monthLabel}
        </p>
        <button
          type="button"
          className="hover:bg-surface-hover text-muted hover:text-heading rounded-lg p-1.5 transition-colors"
          aria-label="Tháng sau"
          onClick={() => onViewMonthChange(addMonths(viewMonth, 1))}
        >
          <IonIcon name="chevron-forward-outline" size="sm" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {WEEKDAY_LABELS_VI.map((label) => (
          <div
            key={label}
            className="text-faint py-1.5 text-center text-[11px] font-medium"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7" role="grid" aria-label={monthLabel}>
        {monthGrid.map(({ date, inCurrentMonth }) => {
          const disabled = isDateDisabled(date, minDate, maxDate);
          const today = isToday(date);
          const day = date.getDate();
          const weekday = getMondayBasedWeekday(date);

          const inRange = normalizedRange
            ? isDateInRange(date, normalizedRange.from, normalizedRange.to)
            : false;
          const isRangeStart =
            normalizedRange && isSameDay(date, normalizedRange.from);
          const isRangeEnd =
            normalizedRange && isSameDay(date, normalizedRange.to);
          const isRangeMiddle = inRange && !isRangeStart && !isRangeEnd;
          const isSingleDayRange = Boolean(isRangeStart && isRangeEnd);
          const selected =
            !inRange && selectedDate ? isSameDay(date, selectedDate) : false;
          const showRangeTrack = inRange && !isSingleDayRange;

          return (
            <div
              key={toDayKey(date)}
              className="relative flex h-10 items-center justify-center"
              role="presentation"
            >
              {showRangeTrack ? (
                <span
                  aria-hidden
                  className={cn(
                    'bg-primary/12 pointer-events-none absolute inset-y-2',
                    isRangeStart && 'right-0 left-1/2 rounded-l-full',
                    isRangeEnd && 'right-1/2 left-0 rounded-r-full',
                    isRangeMiddle && 'inset-x-0',
                    isRangeMiddle && weekday === 0 && 'rounded-l-full',
                    isRangeMiddle && weekday === 6 && 'rounded-r-full'
                  )}
                />
              ) : null}
              <button
                type="button"
                role="gridcell"
                disabled={disabled}
                aria-label={date.toLocaleDateString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                aria-selected={inRange || selected}
                onClick={() => onSelectDate(startOfDay(date))}
                className={cn(
                  'relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                  'focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none',
                  !inCurrentMonth && 'text-faint',
                  inCurrentMonth &&
                    !inRange &&
                    !selected &&
                    'text-body hover:bg-surface-hover',
                  today &&
                    !inRange &&
                    !selected &&
                    'text-primary ring-primary/35 font-semibold ring-1',
                  isRangeMiddle && 'text-primary font-medium',
                  (isRangeStart || isRangeEnd) &&
                    'bg-primary hover:bg-primary/90 font-semibold text-white shadow-sm',
                  selected &&
                    'bg-primary hover:bg-primary/90 text-white shadow-sm',
                  disabled &&
                    'cursor-not-allowed opacity-40 hover:bg-transparent'
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
