/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useMemo } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Modal } from '@/components/molecules/Modal';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { UserPhoneLookupField } from '@/components/molecules/UserPhoneLookupField';
import {
  BookingManualPricePanel,
  BookingPaymentMethodChips,
  BookingPriceSummary,
  BookingPromoSection,
} from '@/components/molecules/booking';
import { formatDate } from '@/lib/utils';
import { formatCompactBookingSlots } from '@/lib/venue/booking-slots-display';
import type { StaffSelectedSlot } from '@/lib/venue/calendar-staff-booking';
import {
  useStaffBookingFormModal,
  type StaffBookingFormSubmitPayload,
} from './useStaffBookingFormModal';

export type { StaffBookingFormSubmitPayload };

export interface StaffBookingFormModalProps {
  open: boolean;
  onClose: () => void;
  venueId: string;
  bookingDate: Date;
  selectedSlots: StaffSelectedSlot[];
  slotDurationMinutes?: number;
  loading?: boolean;
  onConfirm: (payload: StaffBookingFormSubmitPayload) => void | Promise<void>;
}

interface StaffBookingFormContentProps extends StaffBookingFormModalProps {
  slotDurationMinutes: number;
}

function StaffBookingFormContent({
  onClose,
  venueId,
  bookingDate,
  selectedSlots,
  slotDurationMinutes,
  loading = false,
  onConfirm,
}: StaffBookingFormContentProps) {
  const form = useStaffBookingFormModal({
    open: true,
    venueId,
    bookingDate,
    selectedSlots,
    slotDurationMinutes,
    onConfirm,
  });

  const slotsLabel = useMemo(
    () =>
      formatCompactBookingSlots(
        selectedSlots.map((slot) => ({
          courtName: slot.courtName,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }))
      ),
    [selectedSlots]
  );

  return (
    <Modal
      open
      onClose={onClose}
      title="Đặt lịch cho khách"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            disabled={!form.canSubmit || loading}
            onClick={() => void onConfirm(form.buildSubmitPayload())}
          >
            {loading ? 'Đang đặt…' : 'Xác nhận đặt lịch'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="bg-surface-faint rounded-xl p-4 text-sm">
          <p className="text-muted">
            Ngày:{' '}
            <span className="text-heading font-medium">
              {formatDate(bookingDate)}
            </span>
          </p>
          <p className="text-muted mt-1">
            Khung giờ:{' '}
            <span className="text-heading font-medium">{slotsLabel}</span>
          </p>
        </div>

        <UserPhoneLookupField
          phone={form.customerPhone}
          onPhoneChange={(value) => {
            form.setCustomerPhone(value);
            form.setSelectedUser(null);
          }}
          selectedUser={form.selectedUser}
          onUserChange={form.setSelectedUser}
          customerName={form.customerName}
          onCustomerNameChange={form.setCustomerName}
          showNameInput
          showWalkInHint
          autoApply
          autoFillName
        />

        <GlassPanel card className="space-y-4 p-4">
          <BookingPaymentMethodChips
            value={form.paymentMethod}
            onChange={form.setPaymentMethod}
          />

          {!form.isManualPrice ? (
            <div>
              <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
                Khuyến mãi
              </p>
              <BookingPromoSection
                promoCode={form.promoCodeInput}
                onPromoCodeChange={(value) => {
                  form.setPromoCodeInput(value);
                  form.setPromoError(null);
                }}
                appliedPromotion={form.appliedPromotion}
                promoError={form.promoError}
                promoLoading={form.promoLoading}
                onApply={() => void form.handleApplyPromoCode()}
                onRemove={form.handleRemovePromotion}
                autoDiscountAmount={form.autoDiscountAmount}
                autoPromotionNames={form.autoPromotionNames}
              />
            </div>
          ) : null}

          <BookingManualPricePanel
            enabled={form.isManualPrice}
            manualAmount={form.manualAmount}
            note={form.manualPriceNote}
            onToggle={form.handleManualPriceToggle}
            onManualAmountChange={form.setManualAmount}
            onNoteChange={form.setManualPriceNote}
            error={form.pricing.manualParseError ?? null}
          />

          <BookingPriceSummary
            subtotal={form.subtotal}
            discountAmount={form.pricing.discountAmount}
            finalAmount={form.pricing.finalAmount}
            isManualPrice={form.isManualPrice}
          />
        </GlassPanel>

        <Input
          label="Ghi chú nội bộ"
          value={form.internalNote}
          onChange={(event) => form.setInternalNote(event.target.value)}
          placeholder="Tuỳ chọn"
        />
      </div>
    </Modal>
  );
}

export function StaffBookingFormModal({
  open,
  onClose,
  venueId,
  bookingDate,
  selectedSlots,
  slotDurationMinutes = 60,
  loading = false,
  onConfirm,
}: StaffBookingFormModalProps) {
  const formKey = useMemo(
    () =>
      [
        venueId,
        formatDate(bookingDate),
        ...selectedSlots.map(
          (slot) => `${slot.courtId}:${slot.startTime}-${slot.endTime}`
        ),
      ].join('|'),
    [venueId, bookingDate, selectedSlots]
  );

  if (!open) {
    return null;
  }

  return (
    <StaffBookingFormContent
      key={formKey}
      open={open}
      onClose={onClose}
      venueId={venueId}
      bookingDate={bookingDate}
      selectedSlots={selectedSlots}
      slotDurationMinutes={slotDurationMinutes}
      loading={loading}
      onConfirm={onConfirm}
    />
  );
}
