/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

interface CreateOrderQuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabledIncrease?: boolean;
  compact?: boolean;
}

export function CreateOrderQuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  disabledIncrease = false,
  compact = false,
}: CreateOrderQuantityControlProps) {
  if (quantity <= 0 && compact) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onIncrease}
        disabled={disabledIncrease}
      >
        Thêm
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-surface-border',
        compact ? 'h-8' : 'h-9',
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 0}
        className="text-muted hover:text-heading hover:bg-surface-hover flex h-full w-8 items-center justify-center rounded-l-lg transition-colors disabled:opacity-40"
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <span className="text-heading min-w-[2rem] text-center text-sm font-semibold">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabledIncrease}
        className="text-muted hover:text-heading hover:bg-surface-hover flex h-full w-8 items-center justify-center rounded-r-lg transition-colors disabled:opacity-40"
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
}
