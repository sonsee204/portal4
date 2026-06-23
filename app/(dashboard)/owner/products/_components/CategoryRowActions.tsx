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

import { IconButton } from '@/components/atoms/IconButton';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { VenueCategoryNode } from '@/hooks/owner';
import { cn } from '@/lib/utils';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';

interface CategoryRowActionsProps {
  category: VenueCategoryNode;
  actions: OwnerProductsPageActions;
}

const toneClassName = {
  danger: 'text-red-500 hover:text-red-600 hover:bg-red-500/10',
} as const;

export function CategoryRowActions({
  category,
  actions,
}: CategoryRowActionsProps) {
  const { openEditCategory, setDeleteCategoryId, mutationLoading } = actions;

  return (
    <VenueActionGate action={VenueAction.ManageProducts}>
      <div className="flex flex-wrap justify-end gap-0.5">
        <IconButton
          icon="create-outline"
          size="sm"
          tooltip="Sửa"
          aria-label="Sửa"
          disabled={mutationLoading}
          onClick={() => openEditCategory(category)}
        />
        <IconButton
          icon="trash-outline"
          size="sm"
          tooltip="Xóa"
          aria-label="Xóa"
          disabled={mutationLoading}
          className={cn(toneClassName.danger)}
          onClick={() => setDeleteCategoryId(category._id)}
        />
      </div>
    </VenueActionGate>
  );
}
