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

import { useMemo } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { cn } from '@/lib/utils';
import type { HeatMapCell } from '@/graphql/generated';

const HEATMAP_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const HEATMAP_CELL_SIZE = '2.25rem';

function buildHeatmapGridTemplate(columnCount: number): string {
  return `2.25rem repeat(${columnCount}, ${HEATMAP_CELL_SIZE})`;
}

interface OwnerFinanceOperationsHeatmapSectionProps {
  heatMapData: HeatMapCell[] | undefined;
}

export function OwnerFinanceOperationsHeatmapSection({
  heatMapData,
}: OwnerFinanceOperationsHeatmapSectionProps) {
  const heatmapHours = useMemo(() => {
    const hours = [...new Set((heatMapData ?? []).map((cell) => cell.hour))];
    return hours.sort((left, right) => Number(left) - Number(right));
  }, [heatMapData]);

  const heatmapGrid = useMemo(() => {
    const cells = heatMapData ?? [];
    const lookup = new Map(
      cells.map((cell) => [`${cell.day}-${cell.hour}`, cell.intensity])
    );

    return HEATMAP_DAYS.map((dayLabel) => ({
      dayLabel,
      cells: heatmapHours.map((hour) => ({
        hour,
        intensity: lookup.get(`${dayLabel}-${hour}`) ?? 0,
      })),
    }));
  }, [heatmapHours, heatMapData]);

  const heatmapGridTemplate = buildHeatmapGridTemplate(heatmapHours.length);
  const hasData = heatmapGrid.some((row) =>
    row.cells.some((cell) => cell.intensity > 0)
  );

  return (
    <GlassPanel card>
      <div className="mb-4">
        <h3 className="text-heading text-sm font-bold">
          Biểu đồ nhiệt công suất
        </h3>
        <p className="text-muted mt-1 text-xs">
          Mật độ lịch đặt theo ngày trong tuần và khung giờ.
        </p>
      </div>

      {hasData ? (
        <div className="overflow-x-auto">
          <div className="mx-auto w-fit min-w-0">
            <div
              className="text-muted mb-2 grid gap-1.5 text-[11px]"
              style={{ gridTemplateColumns: heatmapGridTemplate }}
            >
              <span />
              {heatmapHours.map((hour) => (
                <span key={hour} className="text-center">
                  {hour}h
                </span>
              ))}
            </div>
            {heatmapGrid.map((row) => (
              <div
                key={row.dayLabel}
                className="mb-1.5 grid gap-1.5 last:mb-0"
                style={{ gridTemplateColumns: heatmapGridTemplate }}
              >
                <span className="text-muted flex items-center text-xs font-medium">
                  {row.dayLabel}
                </span>
                {row.cells.map((cell) => (
                  <div
                    key={`${row.dayLabel}-${cell.hour}`}
                    title={`${row.dayLabel} ${cell.hour}:00 — ${Math.round(cell.intensity * 100)}%`}
                    className={cn(
                      'size-9 rounded-md border border-white/5',
                      cell.intensity >= 0.75
                        ? 'bg-emerald-500/70'
                        : cell.intensity >= 0.5
                          ? 'bg-emerald-500/45'
                          : cell.intensity >= 0.25
                            ? 'bg-amber-500/35'
                            : cell.intensity > 0
                              ? 'bg-sky-500/25'
                              : 'bg-surface-hover/40'
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-muted flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm">
          Chưa có dữ liệu biểu đồ nhiệt trong kỳ đã chọn.
        </div>
      )}
    </GlassPanel>
  );
}
