'use client';

export interface ChartDataPoint {
  organic: number;
  partner: number;
}

interface TrafficSourceChartProps {
  data: ChartDataPoint[];
  labels: string[];
  tooltip?: {
    label: string;
    partner: number;
    organic: number;
    /** 0-based index of the bar where the tooltip anchors */
    anchorIndex: number;
  };
}

export function TrafficSourceChart({
  data,
  labels,
  tooltip,
}: TrafficSourceChartProps) {
  const anchorPct = tooltip
    ? `${((tooltip.anchorIndex + 0.5) / data.length) * 100}%`
    : '60%';

  return (
    <div className="bg-surface border-surface-border rounded-xl border p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-heading text-lg font-semibold">
          Xu hướng nguồn truy cập
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-500" />
            <span className="text-faint">Hữu cơ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary h-3 w-3 rounded-full" />
            <span className="text-faint">Đối tác</span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="border-surface-border chart-grid relative h-64 w-full rounded-lg border-b border-l">
        {/* Tooltip (static mock) */}
        {tooltip && (
          <>
            <div
              className="pointer-events-none absolute top-[20%] z-10 rounded bg-slate-900 p-2 text-xs text-white shadow-xl"
              style={{ left: anchorPct, transform: 'translateX(-50%)' }}
            >
              <div className="mb-1 font-semibold">{tooltip.label}</div>
              <div className="mb-1 flex items-center gap-2">
                <span className="bg-primary h-2 w-2 rounded-full" />
                Đối tác: {tooltip.partner.toLocaleString('vi-VN')}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Hữu cơ: {tooltip.organic.toLocaleString('vi-VN')}
              </div>
            </div>
            {/* Vertical dashed line */}
            <div
              className="absolute top-0 bottom-0 z-0 w-px border-l border-dashed border-slate-400/50"
              style={{ left: anchorPct }}
            />
          </>
        )}

        {/* Organic bars */}
        <div className="absolute inset-0 flex items-end justify-between px-1 opacity-40">
          {data.map((d, i) => (
            <div
              key={`organic-${i}`}
              className="w-[3%] rounded-t bg-slate-300 dark:bg-slate-500"
              style={{ height: `${d.organic}%` }}
            />
          ))}
        </div>

        {/* Partner bars */}
        <div className="absolute inset-0 flex translate-x-1 items-end justify-between px-1 opacity-80 mix-blend-multiply dark:mix-blend-screen">
          {data.map((d, i) => (
            <div
              key={`partner-${i}`}
              className="bg-primary w-[3%] rounded-t"
              style={{ height: `${d.partner}%` }}
            />
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="text-faint mt-2 flex justify-between px-1 text-xs">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
