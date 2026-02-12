'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import { Badge } from '@/components/atoms/Badge';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { Booking, BookingStatus } from '@/types/portal';

const statusVariant: Record<
  BookingStatus,
  'success' | 'danger' | 'warning' | 'info'
> = {
  completed: 'success',
  cancelled: 'danger',
  pending: 'warning',
  paid: 'info',
};

const sportIcon: Record<string, string> = {
  badminton: 'tennisball-outline',
  football: 'football-outline',
  tennis: 'tennisball-outline',
  pickleball: 'baseball-outline',
};

export function BookingCard({ booking }: { booking: Booking }) {
  return (
    <GlassPanel
      card
      className="hover:bg-surface-hover flex gap-4 transition-colors"
    >
      <div className="bg-primary/20 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
        <IonIcon
          name={sportIcon[booking.sport] ?? 'fitness-outline'}
          size="md"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-white">{booking.venue}</p>
            <p className="text-xs text-slate-500">{booking.location}</p>
          </div>
          <Badge variant={statusVariant[booking.status]}>
            {booking.status}
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <IonIcon name="calendar-outline" size="xs" />
            {booking.date}
          </span>
          <span className="flex items-center gap-1">
            <IonIcon name="time-outline" size="xs" />
            {booking.time}
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}
