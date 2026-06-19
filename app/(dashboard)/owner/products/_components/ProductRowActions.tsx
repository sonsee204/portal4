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
import { ProductStatus, VenueAction } from '@/graphql/generated';
import type { VenueProductNode } from '@/hooks/owner';
import { productNeedsRestock } from '@/lib/inventory/product-stock';
import { cn } from '@/lib/utils';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';

interface ProductRowActionsProps {
  product: VenueProductNode;
  actions: OwnerProductsPageActions;
}

const toneClassName = {
  primary: 'text-primary hover:text-primary hover:bg-primary/10',
  danger: 'text-red-500 hover:text-red-600 hover:bg-red-500/10',
} as const;

export function ProductRowActions({
  product,
  actions,
}: ProductRowActionsProps) {
  const {
    openEditProduct,
    openImportStock,
    setDeleteProductId,
    openStatusToggleDialog,
    mutationLoading,
  } = actions;

  const isActive = product.status === ProductStatus.Active;
  const showImportStock = productNeedsRestock(product);

  return (
    <VenueActionGate action={VenueAction.ManageProducts}>
      <div className="flex flex-wrap justify-end gap-0.5">
        <IconButton
          icon="create-outline"
          size="sm"
          tooltip="Sửa"
          aria-label="Sửa"
          disabled={mutationLoading}
          onClick={() => openEditProduct(product)}
        />
        {showImportStock && (
          <IconButton
            icon="archive-outline"
            size="sm"
            tooltip="Nhập kho"
            aria-label="Nhập kho"
            disabled={mutationLoading}
            className="text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
            onClick={() => openImportStock(product)}
          />
        )}
        {isActive ? (
          <IconButton
            icon="pause-circle-outline"
            size="sm"
            tooltip="Ngừng bán"
            aria-label="Ngừng bán"
            disabled={mutationLoading}
            className={toneClassName.primary}
            onClick={() => openStatusToggleDialog(product)}
          />
        ) : (
          <IconButton
            icon="checkmark-circle-outline"
            size="sm"
            tooltip="Đăng bán"
            aria-label="Đăng bán"
            disabled={mutationLoading}
            className={toneClassName.primary}
            onClick={() => openStatusToggleDialog(product)}
          />
        )}
        <IconButton
          icon="trash-outline"
          size="sm"
          tooltip="Xóa"
          aria-label="Xóa"
          disabled={mutationLoading}
          className={cn(toneClassName.danger)}
          onClick={() => setDeleteProductId(product._id)}
        />
      </div>
    </VenueActionGate>
  );
}
