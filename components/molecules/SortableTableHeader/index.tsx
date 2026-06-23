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

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { DataTableSortDir } from '@/hooks/shared/useDataTableSort';

export interface SortableTableHeaderProps {
  label: string;
  columnKey: string;
  sortKey?: string;
  sortDir?: DataTableSortDir;
  onSort?: (key: string) => void;
  sortField?: string;
  align?: 'left' | 'center' | 'right';
  loading?: boolean;
  className?: string;
}

export function SortableTableHeader({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort,
  sortField,
  align = 'left',
  loading = false,
  className,
}: SortableTableHeaderProps) {
  const activeKey = sortField ?? columnKey;
  const isActive = sortKey === activeKey;
  const sortStateLabel = isActive
    ? sortDir === 'asc'
      ? ', tăng dần'
      : ', giảm dần'
    : '';

  return (
    <button
      type="button"
      aria-label={`Sắp xếp theo ${label}${sortStateLabel}`}
      disabled={loading}
      aria-busy={loading}
      className={cn(
        'flex w-full items-center gap-1 px-4 py-3 transition-colors',
        'hover:text-heading focus-visible:ring-primary/30 focus-visible:ring-2 focus-visible:outline-none',
        isActive ? 'text-heading' : 'text-faint',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        loading && 'cursor-wait opacity-60',
        className
      )}
      onClick={() => onSort?.(activeKey)}
    >
      <span>{label}</span>
      <IonIcon
        name={
          isActive
            ? sortDir === 'asc'
              ? 'caret-up-outline'
              : 'caret-down-outline'
            : 'swap-vertical-outline'
        }
        size="xs"
        className={cn(isActive ? 'text-primary' : 'opacity-50')}
      />
    </button>
  );
}
