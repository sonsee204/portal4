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
import type { VenueProductNode } from '@/hooks/owner';
import { isProductOutOfStock } from '@/lib/inventory/product-stock';
import { formatCurrency } from '@/lib/utils';

interface ImportStockProductSummaryProps {
  product: VenueProductNode;
  compact?: boolean;
}

export function ImportStockProductSummary({
  product,
  compact = false,
}: ImportStockProductSummaryProps) {
  const outOfStock = isProductOutOfStock(product);

  return (
    <div
      className={
        compact
          ? 'border-surface-border bg-surface-hover/30 rounded-xl border px-4 py-3'
          : 'border-surface-border bg-surface-hover/40 rounded-xl border px-4 py-4'
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-body text-sm font-semibold">{product.name}</p>
          <p className="text-muted mt-1 text-xs">
            Tồn hiện tại: {product.stockQuantity ?? 0}
            {product.category?.name ? ` · ${product.category.name}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {outOfStock && <Badge variant="danger">Hết hàng</Badge>}
          <span className="text-sm font-medium text-emerald-400">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
