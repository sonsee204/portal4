/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import { CreateOrderPromoField } from '@/app/(dashboard)/owner/orders/create/_components/CreateOrderPromoField';
import { formatCurrency } from '@/lib/utils';

interface AppliedPromotionLike {
  code?: string | null;
  name: string;
}

interface BookingPromoSectionProps {
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  appliedPromotion: AppliedPromotionLike | null;
  promoError: string | null;
  promoLoading: boolean;
  disabled?: boolean;
  onApply: () => void;
  onRemove: () => void;
  autoDiscountAmount?: number;
  autoPromotionNames?: string[];
}

export function BookingPromoSection({
  promoCode,
  onPromoCodeChange,
  appliedPromotion,
  promoError,
  promoLoading,
  disabled,
  onApply,
  onRemove,
  autoDiscountAmount = 0,
  autoPromotionNames = [],
}: BookingPromoSectionProps) {
  const showAutoPromo =
    !appliedPromotion &&
    autoDiscountAmount > 0 &&
    autoPromotionNames.length > 0;

  return (
    <div className="space-y-3">
      {showAutoPromo ? (
        <div className="bg-primary/5 border-primary/15 flex gap-3 rounded-xl border p-3">
          <IonIcon
            name="pricetag-outline"
            className="text-primary mt-0.5 shrink-0"
          />
          <div className="min-w-0 text-sm">
            <p className="text-heading font-medium">Khuyến mãi tự áp dụng</p>
            <p className="text-muted mt-0.5 text-xs">
              {autoPromotionNames.join(', ')}
            </p>
            <p className="mt-1 font-medium text-emerald-400">
              Giảm {formatCurrency(autoDiscountAmount)}
            </p>
          </div>
        </div>
      ) : null}
      <CreateOrderPromoField
        promoCode={promoCode}
        onPromoCodeChange={onPromoCodeChange}
        appliedPromotion={appliedPromotion}
        promoError={promoError}
        promoLoading={promoLoading}
        disabled={disabled}
        onApply={onApply}
        onRemove={onRemove}
      />
    </div>
  );
}
