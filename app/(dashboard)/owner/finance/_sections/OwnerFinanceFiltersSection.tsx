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
import { Select } from '@/components/atoms/Select';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { TabGroup } from '@/components/molecules/TabGroup';
import { FinanceCompareMode } from '@/graphql/generated';
import {
  COMPARE_MODE_OPTIONS,
  FINANCE_PAGE_TABS,
  ORDER_TYPE_FILTER_OPTIONS,
  type OrderTypeCategoryFilter,
  PAYMENT_METHOD_FILTER_OPTIONS,
  SCHEDULE_TYPE_FILTER_OPTIONS,
} from '../_hooks/owner-finance-page.constants';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceFiltersSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceFiltersSection({
  data,
}: OwnerFinanceFiltersSectionProps) {
  const showFinanceScope = data.pageTab === 'finance';
  const showScheduleFilter =
    data.pageTab === 'operations' || data.pageTab === 'finance';
  const showPromotionFilter =
    (data.pageTab === 'operations' || data.pageTab === 'finance') &&
    !data.allVenues &&
    Boolean(data.selectedVenueId);

  return (
    <GlassPanel card className="space-y-4">
      <TabGroup
        tabs={[...FINANCE_PAGE_TABS]}
        active={data.pageTab}
        onChange={(tabId) =>
          data.setPageTab(tabId as OwnerFinancePageData['pageTab'])
        }
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        {showFinanceScope ? (
          <TabGroup
            tabs={[
              { value: 'single', label: 'Theo sân' },
              { value: 'all', label: 'Tất cả sân' },
            ]}
            active={data.allVenues ? 'all' : 'single'}
            onChange={(tabId) => data.setAllVenues(tabId === 'all')}
          />
        ) : (
          <p className="text-muted text-sm">
            {data.pageTab === 'portfolio'
              ? 'Tổng quan tất cả cơ sở trong danh mục.'
              : 'Vận hành theo sân đang chọn trên thanh chọn sân.'}
          </p>
        )}

        <DateRangePicker
          value={data.dateRange}
          onChange={data.setDateRange}
          preset={data.datePreset}
          onPresetChange={data.setDatePreset}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Select
          label="So sánh kỳ"
          options={COMPARE_MODE_OPTIONS}
          value={data.compareMode}
          onChange={(event) =>
            data.setCompareMode(event.target.value as FinanceCompareMode)
          }
        />
        {showScheduleFilter ? (
          <Select
            label="Loại lịch đặt sân"
            options={SCHEDULE_TYPE_FILTER_OPTIONS}
            value={data.scheduleTypeFilter}
            onChange={(event) => data.setScheduleTypeFilter(event.target.value)}
          />
        ) : null}
        {showPromotionFilter ? (
          <Select
            label="Khuyến mãi"
            options={data.promotionFilterOptions}
            value={data.promotionIdFilter}
            onChange={(event) => data.setPromotionIdFilter(event.target.value)}
          />
        ) : null}
        {showFinanceScope ? (
          <>
            <Select
              label="Loại đơn"
              options={ORDER_TYPE_FILTER_OPTIONS}
              value={data.orderTypeFilter}
              onChange={(event) =>
                data.setOrderTypeFilter(
                  event.target.value as OrderTypeCategoryFilter
                )
              }
            />
            <Select
              label="Phương thức thanh toán"
              options={PAYMENT_METHOD_FILTER_OPTIONS}
              value={data.paymentMethodFilter}
              onChange={(event) =>
                data.setPaymentMethodFilter(event.target.value)
              }
            />
          </>
        ) : null}
      </div>
    </GlassPanel>
  );
}
