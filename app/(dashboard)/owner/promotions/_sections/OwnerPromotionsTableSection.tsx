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
import { FilterChips } from '@/components/molecules/FilterChips';
import { QueryState } from '@/components/molecules/QueryState';
import {
  DataTable,
  DATA_TABLE_ACTIONS_CELL_CLASS,
  DATA_TABLE_ACTIONS_COLUMN,
} from '@/components/organisms/DataTable';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import type { PromotionType } from '@/graphql/generated';
import type { VenuePromotionNode } from '@/hooks/owner';
import {
  PROMOTION_CATEGORY_META,
  PROMOTION_DISCOUNT_TYPE_CONFIG,
} from '@/lib/promotion/promotion-constants';
import { formatDate } from '@/lib/utils';
import { PROMOTION_STATUS_CHIPS } from '../_hooks/owner-promotions-page.constants';
import type { OwnerPromotionsPageActions } from '../_hooks/useOwnerPromotionsPageActions';
import type { OwnerPromotionsPageData } from '../_hooks/useOwnerPromotionsPageData';
import { PromotionRowActions } from '../_components/PromotionRowActions';
import { PromotionStatusBadge } from '../_components/PromotionStatusBadge';

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

interface OwnerPromotionsTableSectionProps {
  data: OwnerPromotionsPageData;
  actions: OwnerPromotionsPageActions;
}

export function OwnerPromotionsTableSection({
  data,
  actions,
}: OwnerPromotionsTableSectionProps) {
  const {
    venueId,
    statusFilter,
    searchQuery,
    setSearchQuery,
    promotions,
    totalCount,
    hasNextPage,
    loading,
    error,
    refetch,
    sortField,
    sortDir,
    handleSort,
    sortLoading,
    statusChips,
    isLoadingMore,
  } = data;

  const { handleStatusFilterChange, handleLoadMore } = actions;

  const chips = statusChips ?? PROMOTION_STATUS_CHIPS;
  const trimmedSearch = searchQuery.trim();
  const hasSearch = trimmedSearch.length > 0;

  return (
    <GlassPanel card className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          chips={chips}
          active={statusFilter}
          onChange={handleStatusFilterChange}
        />
        <Input
          className="max-w-xs shrink-0"
          placeholder="Tìm tên hoặc mã..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          leftIcon="search-outline"
          disabled={!venueId}
        />
      </div>

      <QueryState
        loading={loading && promotions.length === 0 && !!venueId}
        error={error}
        empty={!venueId}
        emptyMessage="Chọn cơ sở để xem danh sách khuyến mãi."
        onRetry={() => void refetch()}
      >
        <DataTable
          columns={[
            { key: 'name', label: 'Tên', sortable: true, sortField: 'name' },
            { key: 'code', label: 'Mã' },
            {
              key: 'category',
              label: 'Loại',
              sortable: true,
              sortField: 'category',
            },
            { key: 'period', label: 'Thời gian' },
            {
              key: 'usage',
              label: 'Đã dùng',
              align: 'center',
              sortable: true,
              sortField: 'usageCount',
            },
            {
              key: 'status',
              label: 'Trạng thái',
              align: 'center',
              sortable: true,
              sortField: 'status',
            },
            {
              key: 'discount',
              label: 'Giảm',
              align: 'right',
              sortable: true,
              sortField: 'value',
            },
            DATA_TABLE_ACTIONS_COLUMN,
          ]}
          stickyHeader
          className={TABLE_SCROLL_CLASS_NAME}
          data={promotions}
          sortKey={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          sortLoading={sortLoading}
          emptyTitle={
            hasSearch ? 'Không tìm thấy khuyến mãi' : 'Chưa có khuyến mãi'
          }
          emptyDescription={
            hasSearch
              ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.'
              : 'Tạo khuyến mãi đầu tiên cho cơ sở của bạn.'
          }
          infiniteScroll={{
            loadedCount: promotions.length,
            totalCount,
            hasNextPage,
            onLoadMore: handleLoadMore,
            loading: loading && promotions.length === 0,
            loadingMore: isLoadingMore,
          }}
          renderRow={(promotion: VenuePromotionNode) => {
            const categoryMeta = PROMOTION_CATEGORY_META.find(
              (item) => item.id === promotion.category
            );
            const discountLabel = PROMOTION_DISCOUNT_TYPE_CONFIG[
              promotion.type as PromotionType
            ].format(promotion.value);

            return (
              <tr
                key={promotion._id}
                className="border-surface-border hover:bg-surface-hover cursor-pointer border-b transition-colors"
                onClick={() => actions.openPromotionDetail(promotion._id)}
              >
                <td className="text-body px-4 py-3 text-sm font-medium">
                  {promotion.name}
                </td>
                <td className="text-muted px-4 py-3 font-mono text-xs">
                  {promotion.code ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {categoryMeta ? (
                    <Badge variant="neutral">{categoryMeta.label}</Badge>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="text-muted px-4 py-3 text-xs">
                  {formatDate(promotion.startDate)} –{' '}
                  {formatDate(promotion.endDate)}
                </td>
                <td className="text-body px-4 py-3 text-center text-sm">
                  {promotion.usageCount ?? 0}
                  {promotion.totalUsageLimit != null
                    ? `/${promotion.totalUsageLimit}`
                    : ''}
                </td>
                <td className="px-4 py-3 text-center">
                  <PromotionStatusBadge status={promotion.status} />
                </td>
                <td className="text-primary px-4 py-3 text-right text-sm font-semibold">
                  {discountLabel}
                </td>
                <td
                  className={DATA_TABLE_ACTIONS_CELL_CLASS}
                  onClick={(event) => event.stopPropagation()}
                >
                  <PromotionRowActions
                    promotion={promotion}
                    actions={actions}
                  />
                </td>
              </tr>
            );
          }}
        />
      </QueryState>
    </GlassPanel>
  );
}
