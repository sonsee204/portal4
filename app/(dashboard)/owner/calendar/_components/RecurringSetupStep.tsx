/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import {
  DAY_OF_WEEK_CHIPS,
  RECURRING_DURATION_OPTIONS,
} from '@/lib/booking/recurring-booking.constants';
import { formatCompactBookingSlots } from '@/lib/venue/booking-slots-display';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { OwnerCalendarRecurringFlow } from '../_hooks/useOwnerCalendarRecurringFlow';
import type { OwnerCalendarPageData } from '../_hooks/useOwnerCalendarPageData';

interface RecurringSetupStepProps {
  data: OwnerCalendarPageData;
  flow: OwnerCalendarRecurringFlow;
}

export function RecurringSetupStep({ data, flow }: RecurringSetupStepProps) {
  const slotsLabel = formatCompactBookingSlots(
    data.selectedSlots.map((slot) => ({
      courtName: slot.courtName,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="bg-surface-faint rounded-xl p-4 text-sm">
        <p className="text-muted">
          Bắt đầu từ:{' '}
          <span className="text-heading font-medium">
            {formatDate(data.currentDate)}
          </span>
        </p>
        <p className="text-muted mt-1">
          Khung giờ:{' '}
          <span className="text-heading font-medium">{slotsLabel}</span>
        </p>
      </div>

      <div>
        <p className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
          Thời hạn
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {RECURRING_DURATION_OPTIONS.map((option) => {
            const selected = flow.durationMonths === option.months;
            return (
              <button
                key={option.months}
                type="button"
                onClick={() => flow.setDurationMonths(option.months)}
                className={cn(
                  'relative rounded-xl border p-4 text-left transition-colors',
                  selected
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-border hover:border-primary/40'
                )}
              >
                {option.recommended ? (
                  <span className="bg-primary absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
                    Đề xuất
                  </span>
                ) : null}
                <p className="text-heading font-semibold">{option.label}</p>
                <p className="text-muted mt-1 text-xs">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
          Ngày trong tuần
        </p>
        <div className="flex flex-wrap gap-2">
          {DAY_OF_WEEK_CHIPS.map((chip) => {
            const selected = flow.selectedDays.includes(chip.value);
            const isAnchor = chip.value === flow.primaryDayOfWeek;
            return (
              <button
                key={chip.value}
                type="button"
                disabled={isAnchor}
                onClick={() => flow.handleDayToggle(chip.value)}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  selected
                    ? 'bg-primary text-white'
                    : 'bg-surface border-surface-border hover:bg-surface-hover text-muted hover:text-heading border',
                  isAnchor && 'cursor-default opacity-90'
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {flow.availabilityError ? (
        <div className="border-status-warning/30 bg-status-warning/10 rounded-xl border p-4">
          <div className="flex gap-3">
            <IonIcon
              name="alert-circle-outline"
              className="text-status-warning-text mt-0.5 shrink-0"
            />
            <div className="min-w-0 text-sm">
              <p className="text-heading font-medium">
                {flow.availabilityError}
              </p>
              {flow.availabilityResult &&
              !flow.availabilityResult.allAvailable &&
              flow.availabilityResult.availableDates.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <p className="text-muted text-xs">
                    Ngày không khả dụng (
                    {flow.availabilityResult.unavailableDates.length}):
                  </p>
                  <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
                    {flow.availabilityResult.unavailableDates.map((date) => (
                      <span
                        key={date}
                        className="bg-status-danger/10 text-status-danger-text rounded-lg px-2 py-1 text-xs"
                      >
                        {formatDate(date)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {flow.availabilityResult ? (
        <div className="bg-surface-faint rounded-xl p-4 text-sm">
          <p>
            <span className="text-muted">Buổi dự kiến:</span>{' '}
            <span className="text-heading font-semibold">
              {flow.availabilityResult.totalSessions}
            </span>
          </p>
          <p className="mt-1">
            <span className="text-muted">Giá / buổi:</span>{' '}
            <span className="text-heading font-medium">
              {formatCurrency(flow.availabilityResult.pricePerSession)}
            </span>
          </p>
          {flow.availabilityResult.discountPercent > 0 ? (
            <p className="mt-1 text-emerald-400">
              Giảm {flow.availabilityResult.discountPercent}% lịch cố định
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
