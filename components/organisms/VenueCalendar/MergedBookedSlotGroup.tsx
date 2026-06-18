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

import { IonIcon } from '@/components/atoms/IonIcon';
import { cn } from '@/lib/utils';
import {
  getBookingSlotColorScheme,
  resolveCalendarSegmentKind,
  type CalendarBookingSegment,
} from '@/lib/venue/calendar-booking-segments';

export interface MergedBookedSlotGroupProps {
  segment: CalendarBookingSegment;
  width: number;
  height: number;
  left?: number;
  className?: string;
  onClick?: () => void;
}

const KIND_ICON: Record<
  ReturnType<typeof resolveCalendarSegmentKind>,
  string
> = {
  recurring: 'repeat-outline',
  single: 'calendar-outline',
  pending: 'time-outline',
  no_show: 'close-circle-outline',
  rejected: 'ban-outline',
  inactive: 'help-circle-outline',
};

function BookingKindHeader({
  scheme,
  icon,
  label,
  variant,
}: {
  scheme: ReturnType<typeof getBookingSlotColorScheme>;
  icon: string;
  label: string;
  variant: ReturnType<typeof resolveCalendarSegmentKind>;
}) {
  const isRecurring = variant === 'recurring';

  return (
    <div
      className={cn(
        'absolute top-0 right-0 z-20 flex h-5 items-center justify-center gap-1 px-1.5',
        isRecurring
          ? cn('rounded-t-lg', scheme.headerBgClass)
          : 'rounded-tr-md',
        !isRecurring && scheme.headerBgClass
      )}
      style={{ left: isRecurring ? 0 : 4 }}
    >
      <IonIcon
        name={icon}
        size="sm"
        className={cn('h-3 w-3 shrink-0', scheme.headerTextClass)}
      />
      <span
        className={cn(
          'text-[9px] font-bold tracking-wide uppercase',
          scheme.headerTextClass
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function MergedBookedSlotGroup({
  segment,
  width,
  height,
  left = 0,
  className,
  onClick,
}: MergedBookedSlotGroupProps) {
  const scheme = getBookingSlotColorScheme(
    segment.bookingId,
    segment.status,
    segment.isRecurring
  );
  const segmentKind = resolveCalendarSegmentKind(segment);
  const kindLabel =
    segmentKind === 'recurring'
      ? 'Cố định'
      : segmentKind === 'single'
        ? 'Lẻ'
        : segmentKind === 'pending'
          ? 'Chờ'
          : segmentKind === 'no_show'
            ? 'Vắng'
            : segmentKind === 'rejected'
              ? 'Từ chối'
              : '';
  const showKindHeader = segmentKind !== 'inactive' && kindLabel.length > 0;
  const isRecurring = segmentKind === 'recurring';

  const name = segment.customerName?.trim();
  const phone = segment.customerPhone?.trim();
  const nameFontSize = segment.slotCount >= 3 ? 'text-[13px]' : 'text-xs';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'absolute z-10 overflow-hidden rounded-lg',
        scheme.bgClass,
        isRecurring
          ? 'border-0'
          : cn('border-[3px] border-solid', scheme.borderClass),
        onClick &&
          'focus-visible:ring-primary/50 cursor-pointer transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
      style={{ width, height, left }}
      title={`${kindLabel ? `${kindLabel} • ` : ''}${name ?? 'Khách'}${phone ? ` • ${phone}` : ''} • ${segment.startTime} – ${segment.endTime}`}
    >
      {isRecurring ? (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-lg border-2 border-dashed',
            scheme.borderClass
          )}
        />
      ) : null}

      <div
        className={cn(
          'pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-1 rounded-l-lg',
          scheme.barClass
        )}
      />

      {showKindHeader ? (
        <BookingKindHeader
          scheme={scheme}
          icon={KIND_ICON[segmentKind]}
          label={kindLabel}
          variant={segmentKind}
        />
      ) : null}

      <div
        className={cn(
          'pointer-events-none flex h-full w-full flex-col items-center justify-center px-2 text-center',
          showKindHeader ? 'pt-6' : 'pt-0'
        )}
        style={{ paddingLeft: 6 }}
      >
        {name ? (
          <p
            className={cn(
              'w-full truncate leading-tight font-semibold',
              nameFontSize,
              scheme.textClass,
              segment.slotCount >= 2 ? 'line-clamp-2 whitespace-normal' : ''
            )}
          >
            {name}
          </p>
        ) : null}
        {phone ? (
          <p
            className={cn(
              'w-full truncate text-[11px] font-medium opacity-90',
              scheme.textClass,
              name ? 'mt-0.5' : ''
            )}
          >
            {phone}
          </p>
        ) : null}
        {!name && !phone ? (
          <p className={cn('text-xs font-semibold', scheme.textClass)}>Khách</p>
        ) : null}
      </div>
    </div>
  );
}
