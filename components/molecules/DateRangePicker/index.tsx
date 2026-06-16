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

import { useCallback, useEffect, useId, useRef, useState } from 'react';
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

export interface DateRangeValue {
  from: string;
  to: string;
}

export interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  preset?: DateRangePreset;
  onPresetChange?: (preset: DateRangePreset) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const PRESET_OPTIONS: Array<{ id: DateRangePreset; label: string }> = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: '7 ngày' },
  { id: 'month', label: 'Tháng này' },
  { id: 'quarter', label: 'Quý này' },
  { id: 'year', label: 'Năm nay' },
  { id: 'custom', label: 'Tuỳ chỉnh' },
];

export function DateRangePicker({
  value,
  onChange,
  preset = 'month',
  onPresetChange,
  className,
  label = 'Khoảng thời gian',
  disabled = false,
}: DateRangePickerProps) {
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState<Date>(
    () => parseIsoDateString(value.from) ?? startOfDay(new Date()),
  );
  const [draftTo, setDraftTo] = useState<Date>(
    () => parseIsoDateString(value.to) ?? startOfDay(new Date()),
  );
  const [selecting, setSelecting] = useState<'from' | 'to'>('from');
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(parseIsoDateString(value.from) ?? new Date()),
  );

  const displayLabel = `${formatDisplayDate(parseIsoDateString(value.from) ?? new Date(), DEFAULT_DATE_LOCALE)} – ${formatDisplayDate(parseIsoDateString(value.to) ?? new Date(), DEFAULT_DATE_LOCALE)}`;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      close();
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [close, open]);

  const applyPreset = (nextPreset: DateRangePreset) => {
    onPresetChange?.(nextPreset);
    if (nextPreset === 'custom') return;
    const range = resolveDateRangePreset(nextPreset);
    onChange(range);
    close();
  };

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
    <div ref={rootRef} className={cn('relative flex flex-col gap-2', className)}>
      {label ? (
        <span className="text-body text-sm font-medium">{label}</span>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {PRESET_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => applyPreset(option.id)}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
                preset === option.id
                  ? 'bg-primary/15 text-primary border-primary/30 border'
                  : 'text-muted hover:bg-surface-hover hover:text-heading border-surface-border border',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          onClick={() => {
            if (disabled) return;
            setDraftFrom(parseIsoDateString(value.from) ?? startOfDay(new Date()));
            setDraftTo(parseIsoDateString(value.to) ?? startOfDay(new Date()));
            setSelecting('from');
            setViewMonth(
              startOfMonth(parseIsoDateString(value.from) ?? new Date()),
            );
            setOpen((current) => !current);
          }}
          className={cn(
            'border-surface-border bg-surface hover:bg-surface-hover inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <IonIcon name="calendar-outline" size="sm" className="text-primary" />
          <span className="text-heading font-medium">{displayLabel}</span>
        </button>
      </div>

      {open ? (
        <div
          id={popoverId}
          role="dialog"
          className="border-surface-border bg-surface absolute top-full z-50 mt-2 rounded-xl border p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-muted text-xs font-medium">
              {selecting === 'from' ? 'Chọn ngày bắt đầu' : 'Chọn ngày kết thúc'}
            </p>
            <div className="flex gap-2 text-xs">
              <span className="text-heading font-semibold">
                {toIsoDateString(draftFrom)}
              </span>
              <span className="text-muted">→</span>
              <span className="text-heading font-semibold">
                {toIsoDateString(draftTo)}
              </span>
            </div>
          </div>
          <CalendarPanel
            viewMonth={viewMonth}
            selectedDate={selecting === 'from' ? draftFrom : draftTo}
            onViewMonthChange={setViewMonth}
            onSelectDate={handleSelectDate}
            locale={DEFAULT_DATE_LOCALE}
          />
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="ghost" onClick={close}>
              Đóng
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
