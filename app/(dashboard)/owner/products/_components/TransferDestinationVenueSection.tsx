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
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { cn } from '@/lib/utils';

type TransferVenueOption = {
  _id: string;
  name: string;
  coverImageUrl?: string | null;
};

interface TransferDestinationVenueSectionProps {
  venues: TransferVenueOption[];
  loading: boolean;
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
}

export function TransferDestinationVenueSection({
  venues,
  loading,
  selectedVenueId,
  onSelectVenue,
}: TransferDestinationVenueSectionProps) {
  return (
    <GlassPanel card className="mt-4 p-4">
      <h3 className="text-heading mb-3 text-sm font-semibold">Cơ sở đích</h3>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      ) : venues.length === 0 ? (
        <p className="text-muted py-6 text-center text-sm">
          Bạn cần quyền quản lý sản phẩm ở ít nhất một cơ sở khác để lưu chuyển.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {venues.map((venue) => {
            const selected = selectedVenueId === venue._id;
            return (
              <button
                key={venue._id}
                type="button"
                onClick={() => onSelectVenue(venue._id)}
                className={cn(
                  'border-surface-border flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                  selected
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'bg-surface hover:border-primary/20 hover:bg-surface-hover text-body'
                )}
              >
                {venue.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={venue.coverImageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-surface-hover flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <IonIcon
                      name="business-outline"
                      size="md"
                      className="text-faint"
                    />
                  </div>
                )}
                <span className="min-w-0 flex-1 text-sm font-medium">
                  {venue.name}
                </span>
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                    selected
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-border bg-surface'
                  )}
                >
                  {selected && (
                    <IonIcon
                      name="checkmark"
                      size="xs"
                      className="text-white"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </GlassPanel>
  );
}
