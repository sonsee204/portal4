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

import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { BookingDetailNode } from '@/hooks/owner/useBookingDetail';
import type { BookingDetailActions } from '@/hooks/owner/useBookingDetailActions';
import { getBookingActionAvailability } from '../types';
import { BOOKING_ACTION_BUTTONS } from './booking-action-config';

interface BookingDetailFooterActionsProps {
  booking: BookingDetailNode;
  actions: Pick<
    BookingDetailActions,
    'handleQuickAction' | 'processingId' | 'isMutating'
  >;
}

export function BookingDetailFooterActions({
  booking,
  actions,
}: BookingDetailFooterActionsProps) {
  const { handleQuickAction, processingId, isMutating } = actions;
  const customerName = booking.customer?.displayName ?? 'Khách';
  const isProcessing = processingId === booking._id || isMutating;
  const availability = getBookingActionAvailability(
    booking.status,
    booking.date,
    booking.slots
  );

  const statusActions = BOOKING_ACTION_BUTTONS.filter(
    ({ key }) => availability[key]
  );

  if (statusActions.length === 0) {
    return null;
  }

  return (
    <VenueActionGate action={VenueAction.ApproveBooking}>
      <div className="flex flex-wrap justify-end gap-2">
        {statusActions.map(({ action, label, icon, tone }) => (
          <Button
            key={action}
            variant={tone === 'danger' ? 'danger' : 'secondary'}
            size="sm"
            iconLeft={icon}
            disabled={isProcessing}
            onClick={() => handleQuickAction(action, booking._id, customerName)}
          >
            {label}
          </Button>
        ))}
      </div>
    </VenueActionGate>
  );
}
