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
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { FilterChips } from '@/components/molecules/FilterChips';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import type { StockMovementTypeFilterId } from '@/lib/inventory/stock-movement-display';
import { STOCK_HISTORY_TYPE_CHIPS } from '../_hooks/owner-stock-history.constants';
import type { OwnerStockHistoryPageData } from '../_hooks/useOwnerStockHistoryPageData';

interface OwnerStockHistoryFiltersSectionProps {
  data: OwnerStockHistoryPageData;
}

export function OwnerStockHistoryFiltersSection({
  data,
}: OwnerStockHistoryFiltersSectionProps) {
  const productSelectOptions = [
    { label: 'Tất cả sản phẩm', value: '' },
    ...data.productOptions,
  ];

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          className="max-w-xs"
          options={productSelectOptions}
          value={data.productIdFilter}
          onChange={(event) => data.setProductIdFilter(event.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-xs"
            placeholder="Tìm NCC, hóa đơn, ghi chú..."
            value={data.searchQuery}
            onChange={(event) => data.setSearchQuery(event.target.value)}
            leftIcon="search-outline"
          />
          <DateRangePicker
            compact
            label=""
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
      </div>

      <FilterChips
        chips={STOCK_HISTORY_TYPE_CHIPS}
        active={data.selectedType}
        onChange={(value) =>
          data.setSelectedType(value as StockMovementTypeFilterId)
        }
      />

      {data.hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">Đang lọc</Badge>
          <Button variant="ghost" size="sm" onClick={data.clearFilters}>
            Xóa bộ lọc
          </Button>
        </div>
      ) : null}
    </GlassPanel>
  );
}
