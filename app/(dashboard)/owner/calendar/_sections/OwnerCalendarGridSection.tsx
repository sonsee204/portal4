/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useMemo } from 'react';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { IonIcon } from '@/components/atoms/IonIcon';
import { QueryState } from '@/components/molecules/QueryState';
import {
  CalendarGrid,
  StaffSelectedSlotsBar,
} from '@/components/organisms/VenueCalendar';
import { VenueAction } from '@/graphql/generated';
import {
  buildAvailabilityPriceTiers,
  getCalendarPriceTierLegendBg,
  type CalendarPriceTier,
} from '@/lib/venue/calendar-price-tiers';
import type { OwnerCalendarPageData } from '../_hooks/useOwnerCalendarPageData';

interface OwnerCalendarGridSectionProps {
  data: OwnerCalendarPageData;
  onBook: () => void;
  onRecurring: () => void;
}

export function OwnerCalendarGridSection({
  data,
  onBook,
  onRecurring,
}: OwnerCalendarGridSectionProps) {
  const priceTiers = useMemo(
    () => buildAvailabilityPriceTiers(data.availabilityCourts),
    [data.availabilityCourts]
  );

  const priceLegendItems: Array<{ tier: CalendarPriceTier; label: string }> =
    priceTiers.uniquePrices.length === 2
      ? [
          { tier: 'low', label: 'Giá thấp' },
          { tier: 'high', label: 'Giá cao' },
        ]
      : priceTiers.uniquePrices.length >= 3
        ? [
            { tier: 'low', label: 'Giá thấp' },
            { tier: 'medium', label: 'Giá TB' },
            { tier: 'high', label: 'Giá cao' },
          ]
        : priceTiers.uniquePrices.length === 1
          ? [{ tier: 'low', label: 'Khả dụng' }]
          : [];

  return (
    <QueryState
      loading={data.pageLoading && !data.selectedVenueId}
      error={data.availabilityError}
      empty={!data.selectedVenueId}
      emptyMessage="Chọn cơ sở ở thanh trên để xem lịch."
      onRetry={() => void data.refetchAvailability()}
    >
      <VenueActionGate action={VenueAction.CreateBooking}>
        <StaffSelectedSlotsBar
          selectedSlots={data.selectedSlots}
          totalPrice={data.selectedTotal}
          recurringEnabled={data.venue?.recurringBookingEnabled ?? false}
          onRemoveSlot={data.handleRemoveSelectedSlot}
          onClear={() => data.setSelectedSlots([])}
          onBook={onBook}
          onRecurring={onRecurring}
        />
      </VenueActionGate>

      <div className="border-surface-border flex flex-wrap gap-4 border-b px-4 py-2">
        {[
          { swatch: 'bg-primary/30 border-primary', label: 'Lẻ' },
          {
            swatch: 'bg-green-500/15 border-green-600 border-dashed',
            label: 'Cố định',
          },
          { swatch: 'bg-red-500/15 border-red-500', label: 'Chưa thanh toán' },
          {
            swatch: 'bg-amber-500',
            label: 'Khuyến mãi',
            icon: 'pricetag',
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            {'icon' in item && item.icon ? (
              <span
                className={`flex h-3 w-3 items-center justify-center rounded-full ${item.swatch}`}
                aria-hidden
              >
                <IonIcon
                  name={item.icon}
                  size="xs"
                  className="h-2 w-2 text-white"
                />
              </span>
            ) : (
              <span
                className={`h-3 w-5 rounded border ${item.swatch}`}
                aria-hidden
              />
            )}
            <span className="text-muted text-xs">{item.label}</span>
          </div>
        ))}
        {priceLegendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded"
              style={{
                backgroundColor: getCalendarPriceTierLegendBg(item.tier),
              }}
              aria-hidden
            />
            <span className="text-muted text-xs">{item.label}</span>
          </div>
        ))}
        {data.canCreateStaffBooking ? (
          <div className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded"
              style={{ backgroundColor: '#8B5CF6' }}
              aria-hidden
            />
            <span className="text-muted text-xs">Đã chọn</span>
          </div>
        ) : null}
      </div>

      <CalendarGrid
        courts={data.courts}
        segments={data.calendarSegments}
        hours={data.hourRange.hours}
        viewDate={data.currentDate}
        onSegmentClick={(segment) =>
          data.setSelectedBookingId(segment.bookingId)
        }
        staffBookingEnabled={data.canCreateStaffBooking}
        availabilityCourts={data.availabilityCourts}
        selectedSlotKeys={data.selectedSlotKeys}
        onStaffSlotToggle={
          data.canCreateStaffBooking ? data.handleStaffSlotToggle : undefined
        }
      />
    </QueryState>
  );
}
