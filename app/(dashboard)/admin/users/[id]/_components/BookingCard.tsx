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
import { Badge } from '@/components/atoms/Badge';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import {
  BOOKING_STATUS_VARIANT,
  BOOKING_STATUS_LABEL,
} from '@/lib/constants/booking-status';

interface BookingCardProps {
  booking: {
    _id: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    status: string;
    courtName?: string;
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <GlassPanel
      card
      className="hover:bg-surface-hover flex gap-4 transition-colors"
    >
      <div className="bg-primary/20 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
        <IonIcon name="calendar-outline" size="md" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-heading text-sm font-medium">{booking.venue}</p>
            <p className="text-faint text-xs">{booking.location}</p>
          </div>
          <Badge variant={BOOKING_STATUS_VARIANT[booking.status] ?? 'neutral'}>
            {BOOKING_STATUS_LABEL[booking.status] ?? booking.status}
          </Badge>
        </div>
        <div className="text-muted mt-2 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <IonIcon name="calendar-outline" size="xs" />
            {booking.date}
          </span>
          {booking.time && (
            <span className="flex items-center gap-1">
              <IonIcon name="time-outline" size="xs" />
              {booking.time}
            </span>
          )}
          {booking.courtName && (
            <span className="flex items-center gap-1">
              <IonIcon name="location-outline" size="xs" />
              {booking.courtName}
            </span>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}
