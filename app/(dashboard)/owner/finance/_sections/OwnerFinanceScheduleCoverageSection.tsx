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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import {
  ScheduleCoverageComboChart,
  type ScheduleCoveragePoint,
} from '@/components/molecules/charts';

interface OwnerFinanceScheduleCoverageSectionProps {
  data: ScheduleCoveragePoint[];
}

export function OwnerFinanceScheduleCoverageSection({
  data,
}: OwnerFinanceScheduleCoverageSectionProps) {
  return (
    <GlassPanel card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-heading text-sm font-bold">
            Doanh thu & phủ sân theo ngày lịch
          </h3>
          <p className="text-muted mt-1 text-xs">
            Theo ngày diễn ra buổi đặt sân — khác tab Tài chính (ngày thu tiền).
          </p>
        </div>
        <div className="text-muted flex flex-wrap gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-sm"
              style={{ background: '#7c3aed' }}
            />
            Doanh thu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
            Công suất %
          </span>
        </div>
      </div>

      {data.length > 0 ? (
        <ScheduleCoverageComboChart data={data} />
      ) : (
        <div className="text-muted flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm">
          Chưa có dữ liệu phủ sân trong kỳ đã chọn.
        </div>
      )}
    </GlassPanel>
  );
}
