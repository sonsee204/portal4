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

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { CalendarPanel } from '@/components/molecules/CalendarPanel';
import { cn } from '@/lib/utils';
import {
  DEFAULT_DATE_LOCALE,
  addDays,
  formatDisplayDate,
  isDateDisabled,
  startOfDay,
  startOfMonth,
} from '@/lib/date/calendar';

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  locale?: string;
  className?: string;
  label?: string;
  withNavigation?: boolean;
  showTodayButton?: boolean;
  align?: 'start' | 'end';
  'aria-label'?: string;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  locale = DEFAULT_DATE_LOCALE,
  className,
  label,
  withNavigation = false,
  showTodayButton = false,
  align = 'end',
  'aria-label': ariaLabel = 'Chọn ngày',
}: DatePickerProps) {
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value));

  const normalizedValue = startOfDay(value);
  const displayValue = formatDisplayDate(normalizedValue, locale);

  const close = useCallback(() => setOpen(false), []);

  const selectDate = useCallback(
    (date: Date) => {
      onChange(startOfDay(date));
      close();
    },
    [close, onChange]
  );

  const shiftDay = useCallback(
    (delta: number) => {
      const next = addDays(normalizedValue, delta);
      if (isDateDisabled(next, minDate, maxDate)) return;
      onChange(next);
    },
    [maxDate, minDate, normalizedValue, onChange]
  );

  const goToToday = useCallback(() => {
    const today = startOfDay(new Date());
    if (isDateDisabled(today, minDate, maxDate)) return;
    onChange(today);
    setViewMonth(startOfMonth(today));
    close();
  }, [close, maxDate, minDate, onChange]);

  const openPopover = useCallback(() => {
    setViewMonth(startOfMonth(normalizedValue));
    setOpen(true);
  }, [normalizedValue]);

  const togglePopover = useCallback(() => {
    if (disabled) return;
    if (open) {
      close();
      return;
    }
    openPopover();
  }, [close, disabled, open, openPopover]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close, open]);

  const handleTriggerKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>
  ) => {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      if (!disabled) openPopover();
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative inline-flex flex-col gap-1', className)}
    >
      {label ? (
        <span className="text-body text-sm font-medium">{label}</span>
      ) : null}

      <div className="flex items-center gap-2">
        {withNavigation ? (
          <button
            type="button"
            disabled={
              disabled ||
              isDateDisabled(addDays(normalizedValue, -1), minDate, maxDate)
            }
            onClick={() => shiftDay(-1)}
            className="hover:bg-surface-hover text-muted hover:text-heading rounded-lg p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Ngày trước"
          >
            <IonIcon name="chevron-back-outline" size="sm" />
          </button>
        ) : null}

        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          onClick={togglePopover}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            'border-surface-border bg-surface hover:bg-surface-hover inline-flex min-w-[148px] items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
            'focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <IonIcon
            name="calendar-outline"
            size="sm"
            className="text-primary shrink-0"
          />
          <span className="text-heading font-medium">{displayValue}</span>
        </button>

        {withNavigation ? (
          <button
            type="button"
            disabled={
              disabled ||
              isDateDisabled(addDays(normalizedValue, 1), minDate, maxDate)
            }
            onClick={() => shiftDay(1)}
            className="hover:bg-surface-hover text-muted hover:text-heading rounded-lg p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Ngày sau"
          >
            <IonIcon name="chevron-forward-outline" size="sm" />
          </button>
        ) : null}

        {showTodayButton ? (
          <Button
            size="sm"
            variant="ghost"
            iconLeft="today-outline"
            disabled={
              disabled ||
              isDateDisabled(startOfDay(new Date()), minDate, maxDate)
            }
            onClick={goToToday}
          >
            Hôm nay
          </Button>
        ) : null}
      </div>

      {open ? (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="false"
          aria-label={ariaLabel}
          className={cn(
            'absolute top-full z-50 mt-2',
            align === 'start' ? 'left-0' : 'right-0'
          )}
        >
          <CalendarPanel
            viewMonth={viewMonth}
            selectedDate={normalizedValue}
            onViewMonthChange={setViewMonth}
            onSelectDate={selectDate}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
          />
        </div>
      ) : null}
    </div>
  );
}
