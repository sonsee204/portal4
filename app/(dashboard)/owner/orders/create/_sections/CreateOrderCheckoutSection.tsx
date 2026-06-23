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
import { Input } from '@/components/atoms/Input';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { VenueAction } from '@/graphql/generated';
import { CreateOrderCartLine } from '../_components/CreateOrderCartLine';
import { CreateOrderManualPricePanel } from '../_components/CreateOrderManualPricePanel';
import { CreateOrderPromoField } from '../_components/CreateOrderPromoField';
import { CreateOrderSummary } from '../_components/CreateOrderSummary';
import { PAYMENT_METHOD_OPTIONS } from '../_hooks/create-order-page.constants';
import type { CreateOrderPageActions } from '../_hooks/useCreateOrderPageActions';
import type { CreateOrderPageData } from '../_hooks/useCreateOrderPageData';

interface CreateOrderCheckoutSectionProps {
  data: CreateOrderPageData;
  actions: CreateOrderPageActions;
}

export function CreateOrderCheckoutSection({
  data,
  actions,
}: CreateOrderCheckoutSectionProps) {
  const {
    formValues,
    setValue,
    subtotal,
    total,
    promoDiscount,
    promoCode,
    setPromoCode,
    appliedPromotion,
    promoError,
    promoLoading,
  } = data;

  const paymentChips = PAYMENT_METHOD_OPTIONS.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  return (
    <GlassPanel
      card
      className="xl:sticky xl:top-4 xl:max-h-[calc(100dvh-6rem)] xl:overflow-y-auto"
    >
      <h2 className="text-heading mb-4 text-base font-semibold">Thanh toán</h2>

      <div className="mb-4">
        <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
          Giỏ hàng ({formValues.cartItems.length})
        </p>
        {formValues.cartItems.length === 0 ? (
          <p className="text-faint py-6 text-center text-sm">
            Chưa có sản phẩm trong giỏ
          </p>
        ) : (
          <div className="max-h-56 overflow-y-auto">
            {formValues.cartItems.map((item) => (
              <CreateOrderCartLine key={item.productId} item={item} actions={actions} />
            ))}
          </div>
        )}
      </div>

      <CreateOrderSummary
        subtotal={subtotal}
        promoDiscount={promoDiscount}
        total={total}
      />

      <div className="mt-4 space-y-2">
        <span className="text-muted text-xs font-medium tracking-wide uppercase">
          Phương thức
        </span>
        <FilterChips
          chips={paymentChips}
          active={formValues.paymentMethod}
          onChange={(value) =>
            setValue('paymentMethod', value, { shouldValidate: true })
          }
        />
      </div>

      {!formValues.isManualPrice ? (
        <div className="mt-4">
          <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
            Khuyến mãi
          </p>
          <CreateOrderPromoField
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            appliedPromotion={appliedPromotion}
            promoError={promoError}
            promoLoading={promoLoading}
            onApply={() => void actions.handleApplyPromoCode()}
            onRemove={actions.handleRemovePromotion}
          />
        </div>
      ) : null}

      <div className="mt-4">
        <CreateOrderManualPricePanel
          enabled={formValues.isManualPrice}
          note={formValues.manualPriceNote}
          onToggle={actions.handleManualPriceToggle}
          onNoteChange={(value) => setValue('manualPriceNote', value)}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Ghi chú đơn"
          placeholder="Ghi chú cho khách / bếp..."
          value={formValues.note}
          onChange={(e) => setValue('note', e.target.value)}
        />
      </div>

      <VenueActionGate action={VenueAction.CreateOrder}>
        <Button
          type="button"
          className="mt-6 w-full"
          onClick={actions.handleCreateOrder}
          disabled={
            actions.isCreating ||
            formValues.cartItems.length === 0 ||
            !formValues.selectedOrderType
          }
        >
          {actions.isCreating ? 'Đang tạo đơn...' : 'Tạo đơn hàng'}
        </Button>
      </VenueActionGate>
    </GlassPanel>
  );
}
