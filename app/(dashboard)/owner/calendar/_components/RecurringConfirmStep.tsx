/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Input } from '@/components/atoms/Input';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { UserPhoneLookupField } from '@/components/molecules/UserPhoneLookupField';
import {
  BookingManualPricePanel,
  BookingPaymentMethodChips,
  BookingPriceSummary,
  BookingPromoBreakdownList,
  BookingPromoSection,
  BookingRecurringPromoCallout,
} from '@/components/molecules/booking';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OwnerCalendarRecurringFlow } from '../_hooks/useOwnerCalendarRecurringFlow';

interface RecurringConfirmStepProps {
  flow: OwnerCalendarRecurringFlow;
}

export function RecurringConfirmStep({ flow }: RecurringConfirmStepProps) {
  const result = flow.availabilityResult;
  const effective = flow.effectivePricing;
  const packageDiscountAmount =
    effective?.hasExcludedDates && effective
      ? effective.packageDiscountAmount
      : (result?.discountAmount ?? 0);
  const packageFinalAmount =
    effective?.packageFinalAmount ?? result?.finalAmount ?? 0;

  return (
    <div className="space-y-5">
      {result ? (
        <div className="bg-surface-faint space-y-2 rounded-xl p-4 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <span className="text-muted">Tổng buổi</span>
            <span className="text-heading font-semibold">
              {flow.effectiveSessions}
              {flow.excludeDates.length > 0
                ? ` (${flow.excludeDates.length} đã loại)`
                : ''}
            </span>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <span className="text-muted">Giá / buổi</span>
            <span className="text-heading font-medium">
              {formatCurrency(result.pricePerSession)}
            </span>
          </div>
          {result.discountPercent > 0 ? (
            <div className="flex flex-wrap justify-between gap-2">
              <span className="text-muted">Giảm lịch cố định</span>
              <span className="font-medium text-emerald-400">
                {result.discountPercent}% (
                {formatCurrency(packageDiscountAmount)})
              </span>
            </div>
          ) : null}
          <div className="border-surface-border flex flex-wrap justify-between gap-2 border-t pt-2">
            <span className="text-muted">Thành tiền gói</span>
            <span className="text-primary font-semibold">
              {formatCurrency(
                flow.isManualPrice
                  ? flow.pricing.finalAmount
                  : packageFinalAmount
              )}
            </span>
          </div>
        </div>
      ) : null}

      {result && result.availableDates.length > 0 ? (
        <div>
          <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
            Loại trừ ngày (tuỳ chọn)
          </p>
          <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
            {result.availableDates.map((date) => {
              const excluded = flow.excludeDates.includes(date);
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => flow.toggleExcludeDate(date)}
                  className={
                    excluded
                      ? 'bg-surface border-surface-border text-muted relative rounded-lg border px-3 py-1.5 text-xs line-through transition-opacity'
                      : 'bg-primary/10 text-primary rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity'
                  }
                >
                  {formatDate(date)}
                </button>
              );
            })}
          </div>
          {flow.excludeDates.length > 0 ? (
            <p className="text-muted mt-2 text-xs">
              Đã loại{' '}
              <span className="text-heading font-medium">
                {flow.excludeDates.length}
              </span>{' '}
              buổi
            </p>
          ) : null}
        </div>
      ) : null}

      <UserPhoneLookupField
        phone={flow.customerPhone}
        onPhoneChange={(value) => {
          flow.setCustomerPhone(value);
          flow.setSelectedUser(null);
        }}
        selectedUser={flow.selectedUser}
        onUserChange={flow.setSelectedUser}
        customerName={flow.customerName}
        onCustomerNameChange={flow.setCustomerName}
        showNameInput
        showWalkInHint
        autoApply
        autoFillName
      />

      <GlassPanel card className="space-y-4 p-4">
        <BookingPaymentMethodChips
          value={flow.paymentMethod}
          onChange={flow.setPaymentMethod}
        />

        {!flow.isManualPrice ? (
          <div>
            <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
              Khuyến mãi
            </p>
            <BookingPromoSection
              promoCode={flow.promoCodeInput}
              onPromoCodeChange={(value) => {
                flow.setPromoCodeInput(value);
                flow.setPromoError(null);
              }}
              appliedPromotion={flow.appliedPromotion}
              promoError={flow.promoError}
              promoLoading={flow.promoLoading}
              onApply={() => void flow.handleApplyPromoCode()}
              onRemove={flow.handleRemovePromotion}
              autoDiscountAmount={flow.autoDiscountAmount}
              autoPromotionNames={flow.autoPromotionNames}
            />
            <BookingRecurringPromoCallout
              recurringPromoEligible={flow.recurringPromoEligible}
              effectiveSessionCount={flow.effectiveSessionCount}
              minRecurringPromoSessions={flow.minRecurringPromoSessions}
              hasExcludedDates={flow.excludeDates.length > 0}
            />
            {flow.appliedPromotionsPreview &&
            flow.appliedPromotionsPreview.length > 0 &&
            !flow.isManualPrice ? (
              <BookingPromoBreakdownList
                promotions={flow.appliedPromotionsPreview}
              />
            ) : null}
          </div>
        ) : null}

        <BookingManualPricePanel
          enabled={flow.isManualPrice}
          manualAmount={flow.manualAmount}
          note={flow.manualPriceNote}
          onToggle={flow.handleManualPriceToggle}
          onManualAmountChange={flow.setManualAmount}
          onNoteChange={flow.setManualPriceNote}
          error={flow.pricing.manualParseError ?? null}
        />

        <BookingPriceSummary
          subtotal={flow.checkoutSubtotal}
          discountAmount={flow.pricing.discountAmount}
          finalAmount={flow.pricing.finalAmount}
          isManualPrice={flow.isManualPrice}
        />
      </GlassPanel>

      <Input
        label="Ghi chú nội bộ"
        value={flow.internalNote}
        onChange={(event) => flow.setInternalNote(event.target.value)}
        placeholder="Tuỳ chọn"
      />
    </div>
  );
}
