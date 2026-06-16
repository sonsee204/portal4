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
import {
  ORDER_TYPE_FILTER_OPTIONS,
  PAYMENT_METHOD_FILTER_OPTIONS,
} from '../_hooks/owner-finance-page.constants';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceFiltersSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceFiltersSection({
  data,
}: OwnerFinanceFiltersSectionProps) {
  return (
    <GlassPanel card className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <TabGroup
          tabs={[
            { value: 'single', label: 'Theo sân' },
            { value: 'all', label: 'Tất cả sân' },
          ]}
          active={data.allVenues ? 'all' : 'single'}
          onChange={(tabId) => data.setAllVenues(tabId === 'all')}
        />

        <DateRangePicker
          value={data.dateRange}
          onChange={data.setDateRange}
          preset={data.datePreset}
          onPresetChange={data.setDatePreset}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Select
          label="Loại đơn"
          options={ORDER_TYPE_FILTER_OPTIONS}
          value={data.orderTypeFilter}
          onChange={(event) => data.setOrderTypeFilter(event.target.value)}
        />
        <Select
          label="Phương thức thanh toán"
          options={PAYMENT_METHOD_FILTER_OPTIONS}
          value={data.paymentMethodFilter}
          onChange={(event) =>
            data.setPaymentMethodFilter(event.target.value)
          }
        />
      </div>
    </GlassPanel>
  );
}
