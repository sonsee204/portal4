/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { FinanceCompareMode } from '@/graphql/generated';
import {
  PRODUCT_STATS_COMPARE_MODE_OPTIONS,
  PRODUCT_STATUS_FILTER_OPTIONS,
} from '../_hooks/owner-product-stats.constants';
import type { OwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';

interface OwnerProductStatsFiltersSectionProps {
  data: OwnerProductStatsPageData;
}

export function OwnerProductStatsFiltersSection({
  data,
}: OwnerProductStatsFiltersSectionProps) {
  const categoryOptions = [
    { label: 'Tất cả danh mục', value: '' },
    ...data.categoryOptions,
  ];

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Select
          label="So sánh kỳ"
          className="w-full sm:max-w-xs"
          options={[...PRODUCT_STATS_COMPARE_MODE_OPTIONS]}
          value={data.compareMode}
          onChange={(event) =>
            data.setCompareMode(event.target.value as FinanceCompareMode)
          }
        />
        <DateRangePicker
          className="w-full sm:w-auto sm:shrink-0"
          value={data.dateRange}
          onChange={data.setDateRange}
          preset={data.datePreset}
          onPresetChange={(preset) => {
            if (preset !== 'all') {
              data.setDatePreset(preset);
            }
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Tìm kiếm"
          placeholder="Tên hoặc SKU..."
          value={data.searchQuery}
          onChange={(event) => data.setSearchQuery(event.target.value)}
        />
        <Select
          label="Danh mục"
          options={categoryOptions}
          value={data.categoryIdFilter}
          onChange={(event) => data.setCategoryIdFilter(event.target.value)}
        />
        <Select
          label="Trạng thái"
          options={PRODUCT_STATUS_FILTER_OPTIONS}
          value={data.statusFilter}
          onChange={(event) => data.setStatusFilter(event.target.value)}
        />
        <Select
          label="Lọc nhanh"
          options={[
            { label: 'Tất cả sản phẩm', value: '' },
            { label: 'Có bán trong kỳ', value: 'sold' },
            { label: 'Tồn thấp / hết hàng', value: 'lowStock' },
          ]}
          value={
            data.soldInPeriodOnly ? 'sold' : data.lowStockOnly ? 'lowStock' : ''
          }
          onChange={(event) => {
            const value = event.target.value;
            data.setSoldInPeriodOnly(value === 'sold');
            data.setLowStockOnly(value === 'lowStock');
          }}
        />
      </div>
    </GlassPanel>
  );
}
