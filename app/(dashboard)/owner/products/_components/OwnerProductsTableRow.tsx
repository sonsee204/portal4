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

import { Badge } from '@/components/atoms/Badge';
import { formatCurrency } from '@/lib/utils';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_VARIANT,
} from '@/lib/constants/product-status';
import { isProductTransferable } from '@/lib/inventory/product-transfer';
import type { VenueProductNode } from '@/hooks/owner';
import { cn } from '@/lib/utils';
import { ProductRowActions } from './ProductRowActions';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';

interface OwnerProductsTableRowProps {
  product: VenueProductNode;
  actions: OwnerProductsPageActions;
  selectionMode: boolean;
  selected: boolean;
}

export function OwnerProductsTableRow({
  product,
  actions,
  selectionMode,
  selected,
}: OwnerProductsTableRowProps) {
  const isLowStock =
    product.stockQuantity != null &&
    product.lowStockThreshold != null &&
    product.stockQuantity <= product.lowStockThreshold;
  const transferable = isProductTransferable(product);

  return (
    <tr
      className={cn(
        'border-surface-border hover:bg-surface-hover border-b transition-colors',
        selected && 'bg-primary/5'
      )}
    >
      {selectionMode && (
        <td className="w-10 px-4 py-3">
          <input
            type="checkbox"
            checked={selected}
            disabled={!transferable}
            title={
              transferable ? 'Chọn sản phẩm' : 'Không còn tồn để lưu chuyển'
            }
            aria-label={`Chọn ${product.name}`}
            onChange={() => actions.toggleProductSelection(product)}
            className="accent-primary disabled:cursor-not-allowed disabled:opacity-40"
          />
        </td>
      )}
      <td className="text-body px-4 py-3 text-sm font-medium">
        {product.name}
      </td>
      <td className="text-faint px-4 py-3 font-mono text-xs">
        {product.sku ?? '—'}
      </td>
      <td className="text-muted px-4 py-3 text-sm">
        {product.category?.name ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={isLowStock ? 'text-amber-400' : 'text-body'}>
          {product.stockQuantity ?? 0}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <Badge variant={PRODUCT_STATUS_VARIANT[product.status] ?? 'neutral'}>
          {PRODUCT_STATUS_LABEL[product.status] ?? product.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right text-sm font-medium text-emerald-400">
        {formatCurrency(product.price)}
      </td>
      {!selectionMode && (
        <td className="px-4 py-3 text-right">
          <ProductRowActions product={product} actions={actions} />
        </td>
      )}
    </tr>
  );
}
