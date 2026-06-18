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

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Modal } from '@/components/molecules/Modal';
import { PaymentMethod } from '@/graphql/generated';
import { useLookupCustomerByPhone } from '@/hooks/owner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { formatCompactBookingSlots } from '@/lib/venue/booking-slots-display';
import type { StaffSelectedSlot } from '@/lib/venue/calendar-staff-booking';

const PAYMENT_OPTIONS: Array<{ value: PaymentMethod; label: string }> = [
  { value: PaymentMethod.Cash, label: 'Tiền mặt' },
  { value: PaymentMethod.BankTransfer, label: 'Chuyển khoản' },
];

export interface StaffBookingFormModalProps {
  open: boolean;
  onClose: () => void;
  bookingDate: Date;
  selectedSlots: StaffSelectedSlot[];
  loading?: boolean;
  onConfirm: (payload: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    internalNote?: string;
    paymentMethod: PaymentMethod;
  }) => void | Promise<void>;
}

interface StaffBookingFormContentProps {
  bookingDate: Date;
  selectedSlots: StaffSelectedSlot[];
  loading: boolean;
  onClose: () => void;
  onConfirm: StaffBookingFormModalProps['onConfirm'];
}

function StaffBookingFormContent({
  bookingDate,
  selectedSlots,
  loading,
  onClose,
  onConfirm,
}: StaffBookingFormContentProps) {
  const { lookupCustomerByPhone, loading: lookingUp } =
    useLookupCustomerByPhone();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Cash
  );
  const [lookupForPhone, setLookupForPhone] = useState<string | null>(null);
  const [lookupCustomer, setLookupCustomer] = useState<{
    _id: string;
    displayName?: string | null;
    phone?: string | null;
  } | null>(null);

  const normalizedPhone = customerPhone.trim();
  const phoneDigits = normalizedPhone.replace(/\D/g, '');

  const totalPrice = useMemo(
    () => selectedSlots.reduce((sum, slot) => sum + slot.price, 0),
    [selectedSlots]
  );

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

  useEffect(() => {
    if (phoneDigits.length < 10) {
      return;
    }

    const timer = window.setTimeout(() => {
      void lookupCustomerByPhone(normalizedPhone).then((user) => {
        setLookupForPhone(normalizedPhone);
        setLookupCustomer(user);
        if (user) {
          setCustomerName((current) =>
            current.trim() ? current : (user.displayName ?? '')
          );
        }
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [phoneDigits, normalizedPhone, lookupCustomerByPhone]);

  const lookupIsCurrent = lookupForPhone === normalizedPhone;
  const foundCustomer =
    phoneDigits.length >= 10 && lookupIsCurrent ? lookupCustomer : null;
  const customerId = foundCustomer?._id;
  const foundCustomerLabel = foundCustomer
    ? (foundCustomer.displayName ?? foundCustomer.phone ?? foundCustomer._id)
    : null;

  const isValid =
    customerName.trim().length > 0 &&
    phoneDigits.length >= 10 &&
    selectedSlots.length > 0;

  return (
    <Modal
      open
      onClose={onClose}
      title="Đặt lịch cho khách"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            disabled={!isValid || loading}
            onClick={() =>
              void onConfirm({
                ...(customerId ? { customerId } : {}),
                customerName: customerName.trim(),
                customerPhone: normalizedPhone,
                ...(internalNote.trim()
                  ? { internalNote: internalNote.trim() }
                  : {}),
                paymentMethod,
              })
            }
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
          <p className="text-primary mt-2 text-base font-semibold">
            Tổng: {formatCurrency(totalPrice)}
          </p>
        </div>

        <Input
          label="Số điện thoại"
          value={customerPhone}
          onChange={(event) => setCustomerPhone(event.target.value)}
          placeholder="0901234567"
          inputMode="tel"
        />
        {lookingUp ? (
          <p className="text-faint text-xs">Đang tra cứu khách hàng…</p>
        ) : foundCustomerLabel ? (
          <p className="text-xs text-emerald-600">
            Đã tìm thấy tài khoản: {foundCustomerLabel}
          </p>
        ) : phoneDigits.length >= 10 ? (
          <p className="text-faint text-xs">
            Khách walk-in (chưa có tài khoản)
          </p>
        ) : null}

        <Input
          label="Tên khách"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder="Nguyễn Văn A"
        />

        <Select
          label="Phương thức thanh toán"
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(event.target.value as PaymentMethod)
          }
          options={PAYMENT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />

        <Input
          label="Ghi chú nội bộ"
          value={internalNote}
          onChange={(event) => setInternalNote(event.target.value)}
          placeholder="Tuỳ chọn"
        />
      </div>
    </Modal>
  );
}

export function StaffBookingFormModal({
  open,
  onClose,
  bookingDate,
  selectedSlots,
  loading = false,
  onConfirm,
}: StaffBookingFormModalProps) {
  const formKey = useMemo(
    () =>
      [
        formatDate(bookingDate),
        ...selectedSlots.map(
          (slot) => `${slot.courtId}:${slot.startTime}-${slot.endTime}`
        ),
      ].join('|'),
    [bookingDate, selectedSlots]
  );

  if (!open) {
    return null;
  }

  return (
    <StaffBookingFormContent
      key={formKey}
      bookingDate={bookingDate}
      selectedSlots={selectedSlots}
      loading={loading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
