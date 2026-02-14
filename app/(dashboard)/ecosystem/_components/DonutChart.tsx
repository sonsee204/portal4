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
      <h3 className="mb-6 text-lg font-semibold text-white">
        User Distribution
      </h3>
      <div className="mb-8 flex items-center justify-center">
        <div className="relative h-48 w-48">
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
            <span className="text-3xl font-bold text-white">20.6k</span>
            <span className="text-xs text-slate-400">Total Users</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="bg-background-dark flex items-center justify-between rounded-lg border border-white/5 p-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm font-medium text-slate-300">
                {seg.label}
              </span>
            </div>
            <span className="text-sm font-bold text-white">{seg.value}%</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
