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

import { Input } from '@/components/atoms/Input';
import {
  formatTransferStockLabel,
  getMaxTransferQuantity,
  isUnlimitedStock,
  validateTransferQuantity,
  type TransferProductSnapshot,
} from '@/lib/inventory/product-transfer';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TransferProductLineItemProps {
  product: TransferProductSnapshot;
  quantity: number;
  onQuantityChange: (value: string) => void;
}

export function TransferProductLineItem({
  product,
  quantity,
  onQuantityChange,
}: TransferProductLineItemProps) {
  const validation = validateTransferQuantity(product, quantity);
  const maxQty = getMaxTransferQuantity(product);
  const unlimited = isUnlimitedStock(product.stockQuantity);

  return (
    <div
      className={cn(
        'border-surface-border flex flex-wrap items-center gap-3 border-b px-4 py-3 last:border-b-0',
        !validation.valid && 'bg-red-500/5'
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-body truncate text-sm font-semibold">
          {product.name}
        </p>
        <p className="text-muted mt-1 text-xs">
          Tồn: {formatTransferStockLabel(product.stockQuantity)}
          {product.category?.name ? ` · ${product.category.name}` : ''}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {product.price != null && (
          <span className="text-sm font-medium text-emerald-400">
            {formatCurrency(product.price)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={unlimited ? undefined : maxQty}
          value={String(quantity)}
          onChange={(event) => onQuantityChange(event.target.value)}
          className={cn(
            'w-24 text-center',
            !validation.valid && 'border-red-500/60'
          )}
          aria-label={`Số lượng lưu chuyển ${product.name}`}
        />
        {!unlimited && (
          <span className="text-muted text-xs whitespace-nowrap">
            / {maxQty}
          </span>
        )}
      </div>

      {!validation.valid && validation.error && (
        <p className="w-full text-right text-xs text-red-400">
          {validation.error}
        </p>
      )}
    </div>
  );
}
