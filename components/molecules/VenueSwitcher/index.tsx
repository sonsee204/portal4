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

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  ALL_VENUES_SELECTION_ID,
  ALL_VENUES_SELECTION_LABEL,
  isStatsAllVenuesPath,
} from '@/lib/venue/venue-selection';

export function VenueSwitcher() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const {
    venues,
    selectedVenueId,
    setSelectedVenueId,
    financeAllVenues,
    setFinanceAllVenues,
    loading,
    selectedVenue,
  } = useVenueContext();

  const showAllVenuesOption =
    isStatsAllVenuesPath(pathname) && venues.length > 1;
  const showDropdown = venues.length > 1;

  const selectedValue =
    financeAllVenues && showAllVenuesOption
      ? ALL_VENUES_SELECTION_ID
      : (selectedVenueId ?? '');

  const triggerLabel = useMemo(() => {
    if (financeAllVenues && showAllVenuesOption) {
      return ALL_VENUES_SELECTION_LABEL;
    }
    return selectedVenue?.name ?? 'Chọn sân';
  }, [financeAllVenues, selectedVenue?.name, showAllVenuesOption]);

  const options = useMemo(
    () => [
      ...(showAllVenuesOption
        ? [
            {
              label: ALL_VENUES_SELECTION_LABEL,
              value: ALL_VENUES_SELECTION_ID,
            },
          ]
        : []),
      ...venues.map((venue) => ({
        label: venue.name,
        value: venue._id,
      })),
    ],
    [showAllVenuesOption, venues]
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleSelect = (value: string) => {
    if (value === ALL_VENUES_SELECTION_ID) {
      setFinanceAllVenues(true);
    } else {
      setFinanceAllVenues(false);
      setSelectedVenueId(value);
    }
    setOpen(false);
  };

  if (loading && venues.length === 0) {
    return null;
  }

  if (!showDropdown) {
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
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'border-surface-border bg-surface/80 hover:bg-surface-hover flex min-w-[180px] items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors',
          open && 'ring-primary/40 ring-2'
        )}
      >
        <IonIcon
          name="business-outline"
          size="sm"
          className="text-primary shrink-0"
        />
        <span className="text-heading min-w-0 flex-1 truncate text-left font-medium">
          {triggerLabel}
        </span>
        <IonIcon
          name="chevron-down-outline"
          size="sm"
          className={cn(
            'text-faint shrink-0 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="border-surface-border bg-surface absolute top-full left-0 z-50 mt-2 max-h-72 min-w-full overflow-y-auto rounded-xl border p-1 shadow-2xl"
        >
          {options.map((option) => {
            const isActive = option.value === selectedValue;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-body hover:bg-surface-hover'
                )}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isActive ? (
                  <IonIcon
                    name="checkmark-outline"
                    size="sm"
                    className="shrink-0"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
