/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { QueryState } from '@/components/molecules/QueryState';
import {
  CalendarGrid,
  StaffSelectedSlotsBar,
} from '@/components/organisms/VenueCalendar';
import { VenueAction } from '@/graphql/generated';
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

      <CalendarGrid
        courts={data.courts}
        segments={data.calendarSegments}
        hours={data.hourRange.hours}
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
