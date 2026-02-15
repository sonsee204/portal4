'use client';

import { useState, useCallback } from 'react';
import { FilterChips } from '@/components/molecules/FilterChips';
import { Button } from '@/components/atoms/Button';
import type { AuditCategory, AuditStatus } from '@/types';

interface AuditFiltersProps {
  category: AuditCategory | undefined;
  status: AuditStatus | undefined;
  search: string;
  onCategoryChange: (category: AuditCategory | undefined) => void;
  onStatusChange: (status: AuditStatus | undefined) => void;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
  loading: boolean;
  totalByCategory?: Record<string, number>;
}

const categoryChips = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Xác thực', value: 'AUTH' },
  { label: 'Quản trị', value: 'ADMIN' },
  { label: 'Bảo mật', value: 'SECURITY' },
  { label: 'Hệ thống', value: 'SYSTEM' },
];

const statusChips = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Thành công', value: 'SUCCESS' },
  { label: 'Thất bại', value: 'FAILED' },
];

export function AuditFilters({
  category,
  status,
  search,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
  onRefresh,
  loading,
  totalByCategory,
}: AuditFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);

  const handleCategoryChange = useCallback(
    (value: string) => {
      onCategoryChange(value === 'all' ? undefined : (value as AuditCategory));
    },
    [onCategoryChange]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onStatusChange(value === 'all' ? undefined : (value as AuditStatus));
    },
    [onStatusChange]
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearchChange(searchInput);
      }
    },
    [onSearchChange, searchInput]
  );

  const handleSearchBlur = useCallback(() => {
    onSearchChange(searchInput);
  }, [onSearchChange, searchInput]);

  // Add counts to category chips if available
  const categoryChipsWithCounts = categoryChips.map((chip) => ({
    ...chip,
    count: chip.value === 'all' ? undefined : totalByCategory?.[chip.value],
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <FilterChips
          chips={categoryChipsWithCounts}
          active={category ?? 'all'}
          onChange={handleCategoryChange}
        />

        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onBlur={handleSearchBlur}
              className="bg-surface border-surface-border text-body placeholder:text-faint focus:border-primary focus:ring-primary h-9 rounded-lg border px-3 pr-8 text-sm focus:ring-1 focus:outline-none"
            />
          </div>

          <FilterChips
            chips={statusChips}
            active={status ?? 'all'}
            onChange={handleStatusChange}
          />

          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            onClick={onRefresh}
            disabled={loading}
          >
            Làm mới
          </Button>
        </div>
      </div>
    </div>
  );
}
