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

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { CalendarPanel } from '@/components/molecules/CalendarPanel';
import { cn } from '@/lib/utils';
import {
  DEFAULT_DATE_LOCALE,
  formatDisplayDate,
  parseIsoDateString,
  startOfDay,
  startOfMonth,
  toIsoDateString,
} from '@/lib/date/calendar';
import type { DateRangePreset } from '@/lib/finance/stat-card-trend';
import { resolveDateRangePreset } from '@/lib/finance/stat-card-trend';

export type DateRangePickerPreset = DateRangePreset | 'all';

export interface DateRangeValue {
  from: string;
  to: string;
}

export interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  preset?: DateRangePickerPreset;
  onPresetChange?: (preset: DateRangePickerPreset) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
  /** Adds a "Tất cả" preset that clears the range (list filters without date). */
  includeAll?: boolean;
  /** Toolbar style: only the calendar trigger (no label). */
  compact?: boolean;
  /** Anchor popover to trigger start or end edge. */
  align?: 'start' | 'end';
}

const PRESET_OPTIONS: Array<{ id: DateRangePreset; label: string }> = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: '7 ngày' },
  { id: 'month', label: 'Tháng này' },
  { id: 'last3months', label: '3 tháng gần nhất' },
  { id: 'quarter', label: 'Quý này' },
  { id: 'year', label: 'Năm nay' },
  { id: 'custom', label: 'Tuỳ chỉnh' },
];

function buildPresetOptions(includeAll: boolean) {
  const allOption = includeAll ? [{ id: 'all' as const, label: 'Tất cả' }] : [];
  return [...allOption, ...PRESET_OPTIONS];
}

export function DateRangePicker({
  value,
  onChange,
  preset = 'month',
  onPresetChange,
  className,
  label = 'Khoảng thời gian',
  disabled = false,
  includeAll = false,
  compact = false,
  align = 'end',
}: DateRangePickerProps) {
  const presetOptions = buildPresetOptions(includeAll);
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [draftFrom, setDraftFrom] = useState<Date>(
    () => parseIsoDateString(value.from) ?? startOfDay(new Date())
  );
  const [draftTo, setDraftTo] = useState<Date>(
    () => parseIsoDateString(value.to) ?? startOfDay(new Date())
  );
  const [selecting, setSelecting] = useState<'from' | 'to'>('from');
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(parseIsoDateString(value.from) ?? new Date())
  );

  const hasRange = Boolean(value.from) && Boolean(value.to);
  const displayLabel =
    !hasRange || preset === 'all'
      ? 'Chọn khoảng ngày'
      : `${formatDisplayDate(parseIsoDateString(value.from) ?? new Date(), DEFAULT_DATE_LOCALE)} – ${formatDisplayDate(parseIsoDateString(value.to) ?? new Date(), DEFAULT_DATE_LOCALE)}`;

  const close = () => {
    setOpen(false);
    setPopoverStyle(null);
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
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
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const popover = popoverRef.current;
      if (!trigger || !popover) return;

      const gap = 8;
      const viewportPadding = 8;
      const triggerRect = trigger.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();

      let top = triggerRect.bottom + gap;
      let left =
        align === 'start'
          ? triggerRect.left
          : triggerRect.right - popoverRect.width;

      if (top + popoverRect.height > window.innerHeight - viewportPadding) {
        top = triggerRect.top - popoverRect.height - gap;
      }

      left = Math.max(
        viewportPadding,
        Math.min(left, window.innerWidth - popoverRect.width - viewportPadding)
      );
      top = Math.max(
        viewportPadding,
        Math.min(top, window.innerHeight - popoverRect.height - viewportPadding)
      );

      setPopoverStyle({ top, left });
    };

    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [align, open, viewMonth]);

  const applyPreset = (nextPreset: DateRangePickerPreset) => {
    onPresetChange?.(nextPreset);
    if (nextPreset === 'custom') return;
    if (nextPreset === 'all') {
      onChange({ from: '', to: '' });
      close();
      return;
    }
    const range = resolveDateRangePreset(nextPreset);
    onChange(range);
    close();
  };

  const renderPresetChip = (option: {
    id: DateRangePickerPreset;
    label: string;
  }) => (
    <button
      key={option.id}
      type="button"
      disabled={disabled}
      onClick={() => applyPreset(option.id)}
      className={cn(
        'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        preset === option.id
          ? 'bg-primary/15 text-primary border-primary/30'
          : 'text-muted hover:bg-surface-hover hover:text-heading border-transparent bg-white/80 dark:bg-[var(--surface)]'
      )}
    >
      {option.label}
    </button>
  );

  const handleSelectDate = (date: Date) => {
    if (selecting === 'from') {
      setDraftFrom(date);
      setDraftTo(date);
      setSelecting('to');
      return;
    }

    const from = draftFrom <= date ? draftFrom : date;
    const to = draftFrom <= date ? date : draftFrom;
    setDraftFrom(from);
    setDraftTo(to);
    onChange({ from: toIsoDateString(from), to: toIsoDateString(to) });
    onPresetChange?.('custom');
    close();
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative',
        compact ? 'inline-flex' : 'flex flex-col gap-2',
        className
      )}
    >
      {!compact && label ? (
        <span className="text-body text-sm font-medium">{label}</span>
      ) : null}

      <div className={cn(compact ? 'inline-flex' : 'flex')}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-label="Chọn khoảng ngày"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          onClick={() => {
            if (disabled) return;
            setDraftFrom(
              parseIsoDateString(value.from) ?? startOfDay(new Date())
            );
            setDraftTo(parseIsoDateString(value.to) ?? startOfDay(new Date()));
            setSelecting('from');
            setViewMonth(
              startOfMonth(parseIsoDateString(value.from) ?? new Date())
            );
            setOpen((current) => !current);
          }}
          className={cn(
            'border-surface-border bg-surface hover:bg-surface-hover inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
            compact && 'shrink-0 justify-center whitespace-nowrap',
            'focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <IonIcon
            name="calendar-outline"
            size="sm"
            className="text-primary shrink-0"
          />
          <span className="text-heading font-medium">{displayLabel}</span>
        </button>
      </div>

      {open
        ? createPortal(
            <div
              ref={popoverRef}
              id={popoverId}
              role="dialog"
              aria-label="Chọn khoảng ngày"
              style={
                popoverStyle
                  ? {
                      position: 'fixed',
                      top: popoverStyle.top,
                      left: popoverStyle.left,
                      zIndex: 70,
                    }
                  : {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      visibility: 'hidden',
                      zIndex: 70,
                    }
              }
              className="border-surface-border bg-surface w-[min(100vw-1rem,400px)] overflow-hidden rounded-xl border shadow-xl"
            >
              <div className="border-surface-border bg-overlay-faint/60 border-b px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {presetOptions.map((option) => renderPresetChip(option))}
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-muted shrink-0 text-xs font-medium">
                    {selecting === 'from'
                      ? 'Chọn ngày bắt đầu'
                      : 'Chọn ngày kết thúc'}
                  </p>
                  <div className="text-heading flex items-center gap-2 text-sm font-semibold tabular-nums">
                    <span>
                      {formatDisplayDate(draftFrom, DEFAULT_DATE_LOCALE)}
                    </span>
                    <span className="text-muted font-normal">–</span>
                    <span>
                      {formatDisplayDate(draftTo, DEFAULT_DATE_LOCALE)}
                    </span>
                  </div>
                </div>
                <CalendarPanel
                  viewMonth={viewMonth}
                  selectedDate={selecting === 'from' ? draftFrom : draftTo}
                  selectedRange={{ from: draftFrom, to: draftTo }}
                  onViewMonthChange={setViewMonth}
                  onSelectDate={handleSelectDate}
                  locale={DEFAULT_DATE_LOCALE}
                  variant="embedded"
                />
              </div>
              <div className="border-surface-border flex justify-end border-t px-4 py-2">
                <Button size="sm" variant="ghost" onClick={close}>
                  Đóng
                </Button>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
