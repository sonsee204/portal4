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
  isSameDay,
  isToday,
  startOfDay,
} from '@/lib/date/calendar';

export interface CalendarPanelProps {
  viewMonth: Date;
  selectedDate?: Date | null;
  onViewMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  className?: string;
}

export function CalendarPanel({
  viewMonth,
  selectedDate,
  onViewMonthChange,
  onSelectDate,
  minDate,
  maxDate,
  locale = DEFAULT_DATE_LOCALE,
  className,
}: CalendarPanelProps) {
  const monthGrid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const monthLabel = formatCalendarMonthYear(viewMonth, locale);

  return (
    <div
      className={cn(
        'border-surface-border bg-surface w-[280px] rounded-xl border p-3 shadow-lg',
        className
      )}
      role="application"
      aria-label="Chọn ngày"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
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

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS_VI.map((label) => (
          <div
            key={label}
            className="text-faint py-1 text-center text-[11px] font-medium"
          >
            {label}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-1"
        role="grid"
        aria-label={monthLabel}
      >
        {monthGrid.map(({ date, inCurrentMonth }) => {
          const disabled = isDateDisabled(date, minDate, maxDate);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const today = isToday(date);
          const day = date.getDate();

          return (
            <button
              key={toDayKey(date)}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-label={date.toLocaleDateString(locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              aria-selected={selected}
              onClick={() => onSelectDate(startOfDay(date))}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
                'focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none',
                !inCurrentMonth && 'text-faint',
                inCurrentMonth &&
                  !selected &&
                  'text-body hover:bg-surface-hover',
                today && !selected && 'ring-primary/40 font-semibold ring-1',
                selected &&
                  'bg-primary hover:bg-primary/90 text-white shadow-sm',
                disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent'
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
