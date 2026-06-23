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
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

interface CreateOrderPromoFieldProps {
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  appliedPromotion: { code?: string | null; name: string } | null;
  promoError: string | null;
  promoLoading: boolean;
  disabled?: boolean;
  onApply: () => void;
  onRemove: () => void;
}

export function CreateOrderPromoField({
  promoCode,
  onPromoCodeChange,
  appliedPromotion,
  promoError,
  promoLoading,
  disabled,
  onApply,
  onRemove,
}: CreateOrderPromoFieldProps) {
  if (appliedPromotion) {
    return (
      <div className="bg-emerald-500/10 border-emerald-500/20 flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
        <div>
          <Badge variant="success">{appliedPromotion.code}</Badge>
          <p className="text-muted mt-1 text-xs">{appliedPromotion.name}</p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
          Gỡ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Nhập mã khuyến mãi"
          value={promoCode}
          onChange={(e) => onPromoCodeChange(e.target.value)}
          disabled={disabled || promoLoading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={onApply}
          disabled={disabled || promoLoading || !promoCode.trim()}
        >
          Áp dụng
        </Button>
      </div>
      {promoError ? (
        <p className="text-status-danger-text text-xs">{promoError}</p>
      ) : null}
    </div>
  );
}
