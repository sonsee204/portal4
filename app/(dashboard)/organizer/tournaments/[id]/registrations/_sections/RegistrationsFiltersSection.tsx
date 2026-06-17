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

import { Button } from '@/components/atoms/Button';
import { STATUS_FILTERS } from '../_hooks/registrations-page.constants';
import type { RegistrationsPageActions } from '../_hooks/useRegistrationsPageActions';
import type { RegistrationsPageData } from '../_hooks/useRegistrationsPageData';

interface RegistrationsFiltersSectionProps {
  data: RegistrationsPageData;
  actions: RegistrationsPageActions;
}

export function RegistrationsFiltersSection({
  data,
  actions,
}: RegistrationsFiltersSectionProps) {
  const { statusFilter, selectedIds } = data;
  const {
    isActionLoading,
    handleStatusFilterChange,
    bulkApprove,
    bulkReject,
  } = actions;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleStatusFilterChange(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-secondary hover:text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-secondary text-sm">
            {selectedIds.size} đã chọn
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isActionLoading}
            onClick={() => void bulkApprove([...selectedIds])}
          >
            Duyệt tất cả
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={isActionLoading}
            onClick={() => void bulkReject([...selectedIds])}
            className="text-red-400"
          >
            Từ chối tất cả
          </Button>
        </div>
      )}
    </div>
  );
}
