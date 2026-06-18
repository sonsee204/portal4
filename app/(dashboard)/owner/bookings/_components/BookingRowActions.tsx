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

import { IconButton } from '@/components/atoms/IconButton';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import { cn } from '@/lib/utils';
import { getBookingActionAvailability } from '../types';
import type { OwnerBookingsPageActions } from '../_hooks/useOwnerBookingsPageActions';
import { BOOKING_ACTION_BUTTONS } from './booking-action-config';

export interface BookingRowActionsBooking {
  _id: string;
  status: string;
  date: string;
  customer?: { displayName?: string | null } | null;
  slots?: Array<{ endTime?: string }>;
}

interface BookingRowActionsProps {
  booking: BookingRowActionsBooking;
  actions: OwnerBookingsPageActions;
}

const toneClassName = {
  primary: 'text-primary hover:text-primary hover:bg-primary/10',
  danger: 'text-red-500 hover:text-red-600 hover:bg-red-500/10',
} as const;

export function BookingRowActions({
  booking,
  actions,
}: BookingRowActionsProps) {
  const { handleQuickAction, handleViewDetail, processingId, isMutating } =
    actions;
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

  return (
    <div className="flex flex-wrap justify-end gap-0.5">
      <IconButton
        icon="eye-outline"
        size="sm"
        tooltip="Chi tiết"
        aria-label="Chi tiết"
        onClick={() => handleViewDetail(booking._id)}
      />
      {statusActions.length > 0 ? (
        <VenueActionGate action={VenueAction.ApproveBooking}>
          <div className="flex flex-wrap justify-end gap-0.5">
            {statusActions.map(({ action, label, icon, tone }) => (
              <IconButton
                key={action}
                icon={icon}
                size="sm"
                tooltip={label}
                aria-label={label}
                disabled={isProcessing}
                className={cn(tone ? toneClassName[tone] : undefined)}
                onClick={() =>
                  handleQuickAction(action, booking._id, customerName)
                }
              />
            ))}
          </div>
        </VenueActionGate>
      ) : null}
    </div>
  );
}
