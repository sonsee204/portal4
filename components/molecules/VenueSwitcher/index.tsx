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
import { Select } from '@/components/atoms/Select';
import { useVenueContext } from '@/components/providers/VenueContextProvider';

export function VenueSwitcher() {
  const {
    venues,
    selectedVenueId,
    setSelectedVenueId,
    loading,
    selectedVenue,
  } = useVenueContext();

  if (loading && venues.length === 0) {
    return null;
  }

  if (venues.length <= 1) {
    if (!selectedVenue) return null;
    return (
      <div className="border-surface-border bg-surface/80 hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-sm sm:flex">
        <IonIcon name="business-outline" size="sm" className="text-primary" />
        <span className="text-heading max-w-[180px] truncate font-medium">
          {selectedVenue.name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-[200px] items-center gap-2">
      <IonIcon
        name="business-outline"
        size="sm"
        className="text-primary shrink-0"
      />
      <Select
        options={venues.map((v) => ({ label: v.name, value: v._id }))}
        value={selectedVenueId ?? ''}
        onChange={(e) => setSelectedVenueId(e.target.value)}
        className="min-w-[160px]"
      />
    </div>
  );
}
