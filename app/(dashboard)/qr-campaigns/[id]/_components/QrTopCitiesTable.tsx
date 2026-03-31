'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import type { QrTopCity } from '@/types';

interface QrTopCitiesTableProps {
  cities?: QrTopCity[];
  loading: boolean;
}

export function QrTopCitiesTable({ cities, loading }: QrTopCitiesTableProps) {
  const maxScans = Math.max(...(cities?.map((c) => c.scans) ?? [1]), 1);

  return (
    <div className="bg-surface border-surface-border rounded-xl border p-6">
      <h3 className="text-heading mb-4 text-sm font-semibold">Top thành phố</h3>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-surface-hover h-4 w-24 animate-pulse rounded" />
              <div className="bg-surface-hover h-2 flex-1 animate-pulse rounded-full" />
              <div className="bg-surface-hover h-4 w-8 animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : !cities || cities.length === 0 ? (
        <div className="text-faint flex h-32 items-center justify-center text-sm">
          <div className="flex flex-col items-center gap-2">
            <IonIcon name="location-outline" className="text-2xl opacity-30" />
            <p>Chưa có dữ liệu địa lý</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {cities.map((city, idx) => (
            <div
              key={`${city.city}-${idx}`}
              className="flex items-center gap-3"
            >
              <div className="w-28 flex-shrink-0">
                <p className="text-body truncate text-sm font-medium">
                  {city.city}
                </p>
                {city.country && (
                  <p className="text-faint text-xs">{city.country}</p>
                )}
              </div>
              <div className="bg-overlay-subtle h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${(city.scans / maxScans) * 100}%` }}
                />
              </div>
              <span className="text-heading w-10 flex-shrink-0 text-right text-sm font-semibold">
                {city.scans}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
