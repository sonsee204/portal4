/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useOwnerCalendarPageData } from './_hooks/useOwnerCalendarPageData';
import { useOwnerCalendarStaffBookingActions } from './_hooks/useOwnerCalendarStaffBookingActions';
import { RecurringBookingWizardHost } from './_components/RecurringBookingWizardHost';
import { OwnerCalendarGridSection } from './_sections/OwnerCalendarGridSection';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { DatePicker } from '@/components/molecules/DatePicker';
import { PageHeader } from '@/components/organisms/PageHeader';
import {
  BookingDetailModal,
  StaffBookingFormModal,
} from '@/components/organisms/VenueCalendar';
import { VenueAction } from '@/graphql/generated';

export default function OwnerCalendarPage() {
  const data = useOwnerCalendarPageData();
  const staffActions = useOwnerCalendarStaffBookingActions(data);

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Lịch sân" description={data.scheduleDescription} />
        <DatePicker
          value={data.currentDate}
          onChange={data.handleDateChange}
          withNavigation
          showTodayButton
        />
      </div>

      <GlassPanel card className="mt-6 w-full min-w-0 overflow-hidden p-0">
        <OwnerCalendarGridSection
          data={data}
          onBook={() => data.setShowStaffBookingForm(true)}
          onRecurring={() => data.setShowRecurringWizard(true)}
        />
      </GlassPanel>

      <VenueActionGate action={VenueAction.CreateBooking}>
        <StaffBookingFormModal
          open={data.showStaffBookingForm}
          onClose={() => data.setShowStaffBookingForm(false)}
          venueId={data.selectedVenueId ?? ''}
          bookingDate={data.currentDate}
          selectedSlots={data.selectedSlots}
          slotDurationMinutes={data.venue?.slotDurationMinutes ?? 60}
          loading={staffActions.creatingStaffBooking}
          onConfirm={staffActions.handleStaffBookingConfirm}
        />
      </VenueActionGate>

      <VenueActionGate action={VenueAction.CreateBooking}>
        <RecurringBookingWizardHost
          open={data.showRecurringWizard}
          onClose={() => data.setShowRecurringWizard(false)}
          data={data}
        />
      </VenueActionGate>

      <BookingDetailModal
        bookingId={data.selectedBookingId}
        open={data.selectedBookingId != null}
        onClose={() => data.setSelectedBookingId(null)}
        onActionComplete={async () => {
          await data.refetchAvailability();
        }}
      />
    </div>
  );
}
