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

import { cn } from '@/lib/utils';
import type { CalendarBooking } from '@/types/mock';

const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 07:00 - 18:00

const statusColor: Record<string, string> = {
  paid: 'bg-primary/30 border-primary/50 text-primary-light',
  pending: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  maintenance: 'bg-red-500/20 border-red-500/40 text-red-300',
};

interface CalendarGridProps {
  courts: string[];
  bookings: CalendarBooking[];
}

export function CalendarGrid({ courts, bookings }: CalendarGridProps) {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div
          className="border-surface-border grid border-b"
          style={{ gridTemplateColumns: `60px repeat(${courts.length}, 1fr)` }}
        >
          <div className="p-2 text-xs text-faint">Giờ</div>
          {courts.map((c) => (
            <div
              key={c}
              className="border-surface-border border-l p-2 text-center text-xs font-medium text-body"
            >
              {c}
            </div>
          ))}
        </div>

        {/* Rows */}
        {hours.map((h) => (
          <div
            key={h}
            className="border-surface-border grid border-b"
            style={{
              gridTemplateColumns: `60px repeat(${courts.length}, 1fr)`,
            }}
          >
            <div className="flex h-12 items-center p-2 text-xs text-faint">
              {String(h).padStart(2, '0')}:00
            </div>
            {courts.map((court) => {
              const booking = bookings.find(
                (b) => b.court === court && b.startHour <= h && b.endHour > h
              );
              const isStart = booking?.startHour === h;

              return (
                <div
                  key={court}
                  className="border-surface-border relative h-12 border-l"
                >
                  {booking && isStart && (
                    <div
                      className={cn(
                        'absolute inset-x-0.5 z-10 rounded-md border px-2 py-0.5 text-[10px] font-medium',
                        statusColor[booking.status] ??
                          'bg-surface-hover text-body'
                      )}
                      style={{
                        height: `${(booking.endHour - booking.startHour) * 48}px`,
                      }}
                    >
                      <p className="truncate">
                        {booking.userName ?? 'Bảo trì'}
                      </p>
                      <p className="opacity-60">
                        {String(booking.startHour).padStart(2, '0')}:00 -{' '}
                        {String(booking.endHour).padStart(2, '0')}:00
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
