/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import type { StockMovementNode } from '@/hooks/owner';

interface StockMovementProductCellProps {
  product: StockMovementNode['product'];
  onClick?: () => void;
}

function getProductImageUrl(
  product: StockMovementNode['product']
): string | null {
  if (!product?.images?.length) return null;
  const primary = product.images.find((image) => image.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? null;
}

export function StockMovementProductCell({
  product,
  onClick,
}: StockMovementProductCellProps) {
  const imageUrl = getProductImageUrl(product);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="flex min-w-0 items-center gap-3 text-left disabled:cursor-default"
    >
      <div className="bg-surface-hover flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-muted text-xs">SP</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-body truncate text-sm font-medium">
          {product?.name ?? '—'}
        </p>
        {product?.sku ? (
          <p className="text-faint truncate font-mono text-xs">{product.sku}</p>
        ) : null}
      </div>
    </button>
  );
}
