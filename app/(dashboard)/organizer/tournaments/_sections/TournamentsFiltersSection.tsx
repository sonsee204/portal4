/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Input } from '@/components/atoms/Input';
import { FilterChips } from '@/components/molecules/FilterChips';
import { STATUS_TABS } from '../_hooks/tournaments-page.constants';
import type { TournamentsPageData } from '../_hooks/useTournamentsPageData';

interface TournamentsFiltersSectionProps {
  data: TournamentsPageData;
}

export function TournamentsFiltersSection({
  data,
}: TournamentsFiltersSectionProps) {
  const chips = STATUS_TABS.map((tab) => ({
    label: tab.label,
    value: tab.value,
  }));

  return (
    <div className="mt-6 space-y-4">
      <FilterChips
        chips={chips}
        active={data.activeTab}
        onChange={(value) => data.setActiveTab(value as typeof data.activeTab)}
      />

      {data.isPlatformOwner ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Tìm kiếm giải"
            placeholder="Tên giải đấu..."
            value={data.searchQuery}
            onChange={(event) => data.setSearchQuery(event.target.value)}
          />
          <Input
            label="Lọc theo BTC (User ID)"
            placeholder="Nhập user ID ban tổ chức..."
            value={data.organizerId}
            onChange={(event) => data.setOrganizerId(event.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}
