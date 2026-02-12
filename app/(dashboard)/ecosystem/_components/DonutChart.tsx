'use client';

import { GlassPanel } from '@/components/molecules/GlassPanel';

const segments = [
  { label: 'Bóng đá', value: 55, color: '#7c3aed' },
  { label: 'Cầu lông', value: 30, color: '#3b82f6' },
  { label: 'Pickleball', value: 15, color: '#10b981' },
];

const segmentOffsets = segments.reduce<number[]>((acc, seg, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + segments[i - 1].value);
  return acc;
}, []);

export function DonutChart() {
  return (
    <GlassPanel card>
      <h3 className="mb-4 text-sm font-bold text-white">Phân bố người dùng</h3>
      <div className="flex items-center justify-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {segments.map((seg, i) => (
              <circle
                key={seg.label}
                cx="18"
                cy="18"
                r="15.91549"
                fill="none"
                stroke={seg.color}
                strokeWidth="3"
                strokeDasharray={`${seg.value} ${100 - seg.value}`}
                strokeDashoffset={-segmentOffsets[i]}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white">20.6k</span>
            <span className="text-[10px] text-slate-500">Total</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-slate-400">{seg.label}</span>
            </div>
            <span className="font-medium text-white">{seg.value}%</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
