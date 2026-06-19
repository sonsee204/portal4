/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Badge } from '@/components/atoms/Badge';
import type { VenueProductNode } from '@/hooks/owner';
import { canIncreaseCartQuantity } from '@/lib/order/create-order-cart';
import { formatCurrency } from '@/lib/utils';
import { CreateOrderQuantityControl } from './CreateOrderQuantityControl';
import type { CreateOrderPageActions } from '../_hooks/useCreateOrderPageActions';

interface CreateOrderProductRowProps {
  product: VenueProductNode;
  quantity: number;
  actions: CreateOrderPageActions;
}

export function CreateOrderProductRow({
  product,
  quantity,
  actions,
}: CreateOrderProductRowProps) {
  const outOfStock =
    product.trackInventory && (product.stockQuantity ?? 0) < 1;

  return (
    <div className="border-surface-border flex items-center justify-between gap-3 border-b py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-heading truncate text-sm font-medium">
          {product.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-primary text-sm font-semibold">
            {formatCurrency(product.price)}
          </span>
          {product.category?.name ? (
            <span className="text-faint text-xs">{product.category.name}</span>
          ) : null}
          {product.trackInventory ? (
            <Badge
              variant={
                outOfStock
                  ? 'danger'
                  : (product.stockQuantity ?? 0) <=
                      (product.lowStockThreshold ?? 5)
                    ? 'warning'
                    : 'neutral'
              }
            >
              Tồn: {product.stockQuantity ?? 0}
            </Badge>
          ) : null}
        </div>
      </div>
      <CreateOrderQuantityControl
        quantity={quantity}
        onIncrease={() => actions.handleAddProduct(product)}
        onDecrease={() => actions.handleRemoveProduct(product._id)}
        disabledIncrease={
          outOfStock ||
          !canIncreaseCartQuantity(
            {
              _id: product._id,
              name: product.name,
              price: product.price,
              trackInventory: product.trackInventory,
              stockQuantity: product.stockQuantity,
            },
            quantity,
          )
        }
        compact
      />
    </div>
  );
}
