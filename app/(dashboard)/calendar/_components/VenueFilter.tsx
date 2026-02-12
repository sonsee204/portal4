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
          <p className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
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
        <p className="text-xs font-bold text-slate-500">Chú thích</p>
        {[
          { color: 'bg-primary/30', label: 'Đã thanh toán' },
          { color: 'bg-amber-500/20', label: 'Chờ thanh toán' },
          { color: 'bg-red-500/20', label: 'Bảo trì' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <span className={`h-3 w-5 rounded ${l.color}`} />
            <span className="text-xs text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
