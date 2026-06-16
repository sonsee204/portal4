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

import { Checkbox } from '@/components/atoms/Checkbox';
import { SearchInput } from '@/components/molecules/SearchInput';
import { GlassPanel } from '@/components/molecules/GlassPanel';

interface VenueGroup {
  group: string;
  courts: string[];
}

export function VenueFilter({
  venues,
  selected,
  onToggle,
}: {
  venues: VenueGroup[];
  selected: Set<string>;
  onToggle: (court: string) => void;
}) {
  return (
    <GlassPanel card className="space-y-4">
      <SearchInput placeholder="Tìm sân..." />
      {venues.map((v) => (
        <div key={v.group}>
          <p className="mb-2 text-xs font-bold tracking-wider text-faint uppercase">
            {v.group}
          </p>
          <div className="space-y-2">
            {v.courts.map((c) => (
              <Checkbox
                key={c}
                label={c}
                checked={selected.has(c)}
                onChange={() => onToggle(c)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="border-surface-border space-y-2 border-t pt-3">
        <p className="text-xs font-bold text-faint">Chú thích</p>
        {[
          { color: 'bg-primary/30', label: 'Đã thanh toán' },
          { color: 'bg-amber-500/20', label: 'Chờ thanh toán' },
          { color: 'bg-red-500/20', label: 'Bảo trì' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <span className={`h-3 w-5 rounded ${l.color}`} />
            <span className="text-xs text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
