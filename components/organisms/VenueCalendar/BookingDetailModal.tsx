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

import { useEffect, useMemo, useRef } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Modal } from '@/components/molecules/Modal';
import { QueryState } from '@/components/molecules/QueryState';
import { BookingDetailFooterActions } from '@/app/(dashboard)/owner/bookings/_components/BookingDetailFooterActions';
import { BookingActionConfirmDialog } from '@/app/(dashboard)/owner/bookings/_components/BookingActionConfirmDialog';
import type { OwnerBookingsPageActions } from '@/app/(dashboard)/owner/bookings/_hooks/useOwnerBookingsPageActions';
import {
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_VARIANT,
} from '@/lib/constants/booking-status';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { useBookingDetail } from '@/hooks/owner/useBookingDetail';
import { useBookingDetailActions } from '@/hooks/owner/useBookingDetailActions';
import { RECURRING_FREQUENCY_LABEL } from '@/app/(dashboard)/owner/bookings/_hooks/owner-bookings-page.constants';
import {
  formatGroupedBookingSlotsSummary,
  getUniqueCourtNames,
  groupBookingSlotsForDisplay,
} from '@/lib/venue/booking-slots-display';

const BOOKING_SOURCE_LABEL: Record<string, string> = {
  CUSTOMER: 'Khách đặt qua app',
  STAFF: 'Nhân viên đặt',
  WALK_IN: 'Khách vãng lai',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  MOMO: 'MoMo',
  VNPAY: 'VNPay',
  ZALOPAY: 'ZaloPay',
  CARD: 'Thẻ',
};

export interface BookingDetailModalProps {
  bookingId: string | null;
  open: boolean;
  onClose: () => void;
  /** Page-level actions (bookings list). When omitted, modal manages actions internally. */
  actions?: OwnerBookingsPageActions;
  /** Called after a booking mutation when using internal actions (e.g. calendar page). */
  onActionComplete?: () => void | Promise<void>;
}

const MONEY_VALUE_CLASS = 'text-primary font-medium';
const MONEY_TOTAL_CLASS = 'text-primary font-semibold';
const MONEY_DISCOUNT_CLASS = 'font-medium text-blue-600 dark:text-blue-400';

function resolveBookingPaymentBreakdown(booking: {
  totalPrice: number;
  serviceFee?: number | null;
  discount?: number | null;
  finalAmount: number;
  isManualPrice?: boolean | null;
  discountCode?: string | null;
}) {
  const subtotal = booking.totalPrice;
  const serviceFee = booking.serviceFee ?? 0;
  const storedDiscount = booking.discount ?? 0;
  const grossBeforeDiscount = subtotal + serviceFee;
  const computedDiscount = Math.max(
    0,
    grossBeforeDiscount - booking.finalAmount
  );
  const discountAmount = storedDiscount > 0 ? storedDiscount : computedDiscount;
  const hasDiscount = discountAmount > 0;
  const discountPercent =
    subtotal > 0 && hasDiscount
      ? Math.round((discountAmount / subtotal) * 100)
      : 0;

  const discountLabel = booking.isManualPrice
    ? 'Giảm giá thủ công'
    : booking.discountCode
      ? `Giảm giá (${booking.discountCode})`
      : 'Giảm giá';

  const discountValue =
    hasDiscount && discountPercent > 0
      ? `-${formatCurrency(discountAmount)} (−${discountPercent}%)`
      : hasDiscount
        ? `-${formatCurrency(discountAmount)}`
        : null;

  return {
    subtotal,
    serviceFee,
    hasDiscount,
    discountLabel,
    discountValue,
    showServiceFee: serviceFee > 0 && !booking.isManualPrice,
    subtotalLabel: booking.isManualPrice ? 'Tạm tính (giá gốc)' : 'Tạm tính',
    subtotalClassName: cn(
      MONEY_VALUE_CLASS,
      hasDiscount && 'text-muted font-normal line-through'
    ),
  };
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value?: string | null;
  valueClassName?: string;
}) {
  if (!value) return null;

  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-muted text-sm">{label}</dt>
      <dd className={cn('text-sm', valueClassName ?? 'text-body')}>{value}</dd>
    </div>
  );
}

function BookingDetailContent({
  booking,
}: {
  booking: NonNullable<ReturnType<typeof useBookingDetail>['booking']>;
}) {
  const customerName =
    booking.customer?.displayName?.trim() ||
    booking.customerInfo?.name?.trim() ||
    undefined;
  const customerPhone =
    booking.customer?.phone?.trim() ||
    booking.customerInfo?.phone?.trim() ||
    undefined;
  const customerEmail =
    booking.customer?.email?.trim() ||
    booking.customerInfo?.email?.trim() ||
    undefined;
  const isRecurring = booking.isRecurring || Boolean(booking.parentBookingId);
  const slotGroups = groupBookingSlotsForDisplay(booking.slots);
  const courtNames = getUniqueCourtNames(slotGroups);
  const slotSummary =
    courtNames.length === 1
      ? slotGroups
          .map((group) => {
            const slotNote =
              group.slotCount > 1 ? ` (${group.slotCount} slot)` : '';
            return `${group.startTime} – ${group.endTime}${slotNote}`;
          })
          .join(' • ')
      : formatGroupedBookingSlotsSummary(slotGroups);
  const payment = resolveBookingPaymentBreakdown(booking);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={BOOKING_STATUS_VARIANT[booking.status] ?? 'neutral'}>
          {BOOKING_STATUS_LABEL[booking.status] ?? booking.status}
        </Badge>
        {isRecurring ? (
          <Badge variant="info">Đặt cố định</Badge>
        ) : (
          <Badge variant="neutral">Đặt lẻ</Badge>
        )}
        {booking.sessionNumber ? (
          <Badge variant="neutral">Buổi {booking.sessionNumber}</Badge>
        ) : null}
      </div>

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Khách hàng</h3>
        <dl className="space-y-2">
          <DetailRow label="Tên" value={customerName} />
          <DetailRow label="Số điện thoại" value={customerPhone} />
          <DetailRow label="Email" value={customerEmail} />
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Lịch đặt sân</h3>
        <dl className="space-y-2">
          <DetailRow label="Ngày" value={formatDate(booking.date)} />
          <DetailRow label="Cơ sở" value={booking.venue?.name} />
          {courtNames.length === 1 ? (
            <DetailRow label="Sân" value={courtNames[0]} />
          ) : null}
          <DetailRow label="Khung giờ" value={slotSummary} />
        </dl>
        {slotGroups.length > 0 ? (
          <ul className="border-surface-border divide-surface-border divide-y rounded-lg border">
            {slotGroups.map((group) => (
              <li
                key={group.id}
                className="flex items-start justify-between gap-3 px-3 py-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {courtNames.length > 1 ? (
                      <span className="text-heading font-semibold">
                        {group.courtName}
                      </span>
                    ) : null}
                    <span className="text-body font-medium">
                      {group.startTime} – {group.endTime}
                    </span>
                    {group.slotCount > 1 ? (
                      <span className="bg-surface-hover text-muted ml-1 rounded px-2 py-0.5 text-xs font-medium">
                        {group.slotCount} slot
                      </span>
                    ) : null}
                    {group.hasPeakHour ? (
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                        Giờ vàng
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className={cn(MONEY_VALUE_CLASS, 'shrink-0')}>
                  {formatCurrency(group.totalPrice)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {isRecurring && booking.recurringConfig ? (
        <section className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">Đặt cố định</h3>
          <dl className="space-y-2">
            <DetailRow
              label="Tần suất"
              value={
                RECURRING_FREQUENCY_LABEL[booking.recurringConfig.frequency] ??
                booking.recurringConfig.frequency
              }
            />
            <DetailRow
              label="Số buổi"
              value={
                booking.recurringConfig.totalSessions != null
                  ? String(booking.recurringConfig.totalSessions)
                  : undefined
              }
            />
            <DetailRow
              label="Kết thúc"
              value={booking.recurringConfig.endDate}
            />
            {booking.parentBooking ? (
              <DetailRow
                label="Gói gốc"
                value={`${formatDate(booking.parentBooking.date)} (${booking.parentBooking._id})`}
              />
            ) : null}
          </dl>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Thanh toán</h3>
        {booking.isManualPrice ? (
          <Badge variant="info">Giá thủ công</Badge>
        ) : null}
        <dl className="space-y-2">
          <DetailRow
            label={payment.subtotalLabel}
            value={formatCurrency(payment.subtotal)}
            valueClassName={payment.subtotalClassName}
          />
          {payment.hasDiscount ? (
            <DetailRow
              label={payment.discountLabel}
              value={payment.discountValue}
              valueClassName={MONEY_DISCOUNT_CLASS}
            />
          ) : null}
          {payment.showServiceFee ? (
            <DetailRow
              label="Phí dịch vụ"
              value={formatCurrency(payment.serviceFee)}
              valueClassName={MONEY_VALUE_CLASS}
            />
          ) : null}
          <div className="border-surface-border border-t pt-2">
            <DetailRow
              label="Thành tiền"
              value={formatCurrency(booking.finalAmount)}
              valueClassName={MONEY_TOTAL_CLASS}
            />
          </div>
          <DetailRow
            label="Phương thức"
            value={
              booking.paymentMethod
                ? (PAYMENT_METHOD_LABEL[booking.paymentMethod] ??
                  booking.paymentMethod)
                : undefined
            }
          />
          {!payment.hasDiscount && booking.discountCode ? (
            <DetailRow label="Mã giảm giá" value={booking.discountCode} />
          ) : null}
          <DetailRow
            label="Nguồn đặt"
            value={BOOKING_SOURCE_LABEL[booking.source] ?? booking.source}
          />
        </dl>
        {booking.isManualPrice && booking.manualPriceNote ? (
          <p className="bg-primary/5 text-primary rounded-lg px-3 py-2 text-xs">
            Lý do: {booking.manualPriceNote}
          </p>
        ) : null}
      </section>

      {(booking.customerNote || booking.internalNote) && (
        <section className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">Ghi chú</h3>
          <dl className="space-y-2">
            <DetailRow label="Khách ghi chú" value={booking.customerNote} />
            <DetailRow label="Nội bộ" value={booking.internalNote} />
          </dl>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Thời gian</h3>
        <dl className="space-y-2">
          <DetailRow
            label="Tạo lúc"
            value={formatDateTime(booking.createdAt)}
          />
          <DetailRow
            label="Xác nhận lúc"
            value={
              booking.confirmedAt
                ? formatDateTime(booking.confirmedAt)
                : undefined
            }
          />
          <DetailRow
            label="Check-in"
            value={
              booking.checkedInAt
                ? formatDateTime(booking.checkedInAt)
                : undefined
            }
          />
          <DetailRow
            label="Check-out"
            value={
              booking.checkedOutAt
                ? formatDateTime(booking.checkedOutAt)
                : undefined
            }
          />
          <DetailRow
            label="Hết hạn giữ chỗ"
            value={
              booking.holdExpiresAt
                ? formatDateTime(booking.holdExpiresAt)
                : undefined
            }
          />
          <DetailRow
            label="Hủy lúc"
            value={
              booking.cancelledAt
                ? formatDateTime(booking.cancelledAt)
                : undefined
            }
          />
          <DetailRow label="Lý do hủy" value={booking.cancellationReason} />
        </dl>
      </section>
    </div>
  );
}

export function BookingDetailModal({
  bookingId,
  open,
  onClose,
  actions: externalActions,
  onActionComplete,
}: BookingDetailModalProps) {
  const { booking, loading, error, refetch } = useBookingDetail(bookingId, {
    skip: !open,
  });

  const internalActions = useBookingDetailActions(async () => {
    await onActionComplete?.();
    await refetch();
  });

  const actions = externalActions ?? internalActions;
  const usesInternalActions = externalActions == null;
  const wasMutatingRef = useRef(actions.isMutating);

  useEffect(() => {
    if (wasMutatingRef.current && !actions.isMutating && open) {
      void refetch();
    }
    wasMutatingRef.current = actions.isMutating;
  }, [actions.isMutating, open, refetch]);

  const footerActions = useMemo(() => {
    if (!booking) return null;

    return <BookingDetailFooterActions booking={booking} actions={actions} />;
  }, [actions, booking]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Chi tiết đặt sân"
        size="md"
        footer={footerActions}
      >
        <QueryState
          loading={loading && !booking}
          error={error}
          empty={!loading && !error && !booking}
          emptyMessage="Không tìm thấy thông tin đặt sân."
          onRetry={() => void refetch()}
          skeletonCount={4}
        >
          {booking ? <BookingDetailContent booking={booking} /> : null}
        </QueryState>
      </Modal>

      {usesInternalActions ? (
        <BookingActionConfirmDialog actions={internalActions} />
      ) : null}
    </>
  );
}
