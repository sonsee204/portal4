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
import { OrderDetailFooterActions } from './OrderDetailFooterActions';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';
import { useOrderDetail } from '@/hooks/owner/useOrderDetail';
import {
  ORDER_PAYMENT_STATUS_LABEL,
  ORDER_PAYMENT_STATUS_VARIANT,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
} from '@/lib/constants/order-status';
import {
  ORDER_ITEM_TYPE_LABEL,
  ORDER_ITEM_TYPE_VARIANT,
} from '@/lib/constants/order-item-type';
import { cn, formatCurrency, formatDateTime } from '@/lib/utils';
import { ORDER_TYPE_LABEL } from '../_hooks/owner-orders-page.constants';

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  MOMO: 'MoMo',
  VNPAY: 'VNPay',
  ZALOPAY: 'ZaloPay',
  CARD: 'Thẻ',
};

export interface OrderDetailModalProps {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
  actions: OwnerOrdersPageActions;
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

function OrderDetailContent({
  order,
}: {
  order: NonNullable<ReturnType<typeof useOrderDetail>['order']>;
}) {
  const customerName =
    order.customerName?.trim() || order.customerInfo?.name?.trim() || undefined;
  const customerPhone =
    order.customerPhone?.trim() ||
    order.customerInfo?.phone?.trim() ||
    undefined;
  const customerEmail = order.customerInfo?.email?.trim() || undefined;
  const discountAmount = order.discount ?? 0;
  const serviceFee = order.serviceFee ?? 0;
  const tax = order.tax ?? 0;
  const paidAmount = order.paidAmount ?? 0;
  const remainingAmount = Math.max(0, order.totalAmount - paidAmount);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={ORDER_STATUS_VARIANT[order.status] ?? 'neutral'}>
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </Badge>
        <Badge
          variant={
            ORDER_PAYMENT_STATUS_VARIANT[order.paymentStatus] ?? 'neutral'
          }
        >
          {ORDER_PAYMENT_STATUS_LABEL[order.paymentStatus] ??
            order.paymentStatus}
        </Badge>
        <span className="text-muted text-xs">
          {ORDER_TYPE_LABEL[order.orderType] ?? order.orderType}
        </span>
      </div>

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Khách hàng</h3>
        <dl className="space-y-2">
          <DetailRow label="Tên" value={customerName} />
          <DetailRow label="SĐT" value={customerPhone} />
          <DetailRow label="Email" value={customerEmail} />
          <DetailRow label="Bàn" value={order.tableNumber} />
          <DetailRow label="Sân" value={order.courtNumber} />
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Sản phẩm</h3>
        <div className="border-surface-border overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-surface-hover/50 text-muted text-left text-xs uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Loại</th>
                <th className="px-4 py-2 font-medium">Tên</th>
                <th className="px-4 py-2 text-center font-medium">SL</th>
                <th className="px-4 py-2 text-right font-medium">Đơn giá</th>
                <th className="px-4 py-2 text-right font-medium">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((item, index) => (
                <tr
                  key={`${item.productName}-${index}`}
                  className="border-surface-border border-t"
                >
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        ORDER_ITEM_TYPE_VARIANT[item.itemType] ?? 'neutral'
                      }
                    >
                      {ORDER_ITEM_TYPE_LABEL[item.itemType] ?? item.itemType}
                    </Badge>
                  </td>
                  <td className="text-body px-4 py-3">
                    <div>{item.productName ?? '—'}</div>
                    {item.note && (
                      <div className="text-muted mt-0.5 text-xs">
                        {item.note}
                      </div>
                    )}
                  </td>
                  <td className="text-body px-4 py-3 text-center">
                    {item.quantity}
                  </td>
                  <td className="text-primary px-4 py-3 text-right font-medium">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="text-primary px-4 py-3 text-right font-semibold">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Thanh toán</h3>
        <dl className="space-y-2">
          <DetailRow label="Tạm tính" value={formatCurrency(order.subtotal)} />
          {discountAmount > 0 && (
            <DetailRow
              label={
                order.discountCode
                  ? `Giảm giá (${order.discountCode})`
                  : 'Giảm giá'
              }
              value={`-${formatCurrency(discountAmount)}`}
              valueClassName="text-blue-600 dark:text-blue-400"
            />
          )}
          {serviceFee > 0 && (
            <DetailRow label="Phí dịch vụ" value={formatCurrency(serviceFee)} />
          )}
          {tax > 0 && <DetailRow label="Thuế" value={formatCurrency(tax)} />}
          <DetailRow
            label="Tổng cộng"
            value={formatCurrency(order.totalAmount)}
            valueClassName="text-primary font-semibold"
          />
          {paidAmount > 0 && (
            <DetailRow
              label="Đã thanh toán"
              value={formatCurrency(paidAmount)}
              valueClassName="text-emerald-400 font-medium"
            />
          )}
          {remainingAmount > 0 && paidAmount > 0 && (
            <DetailRow
              label="Còn lại"
              value={formatCurrency(remainingAmount)}
              valueClassName="text-amber-400 font-medium"
            />
          )}
          <DetailRow
            label="Phương thức"
            value={
              order.paymentMethod
                ? (PAYMENT_METHOD_LABEL[order.paymentMethod] ??
                  order.paymentMethod)
                : undefined
            }
          />
          {order.isManualPrice && order.manualPriceNote && (
            <DetailRow label="Ghi chú giá" value={order.manualPriceNote} />
          )}
        </dl>
      </section>

      {(order.note || order.internalNote) && (
        <section className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">Ghi chú</h3>
          <dl className="space-y-2">
            <DetailRow label="Khách hàng" value={order.note} />
            <DetailRow label="Nội bộ" value={order.internalNote} />
          </dl>
        </section>
      )}

      {order.refundInfo?.refundAmount != null &&
        order.refundInfo.refundAmount > 0 && (
          <section className="space-y-3">
            <h3 className="text-heading text-sm font-semibold">Hoàn tiền</h3>
            <dl className="space-y-2">
              <DetailRow
                label="Số tiền hoàn"
                value={formatCurrency(order.refundInfo.refundAmount)}
                valueClassName="text-amber-400 font-medium"
              />
              {order.refundInfo.refundPercent != null && (
                <DetailRow
                  label="Tỷ lệ"
                  value={`${order.refundInfo.refundPercent}%`}
                />
              )}
              <DetailRow label="Lý do" value={order.refundInfo.refundReason} />
              <DetailRow label="Ghi chú" value={order.refundInfo.refundNote} />
            </dl>
          </section>
        )}

      {order.cancellationReason && (
        <section className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">Hủy đơn</h3>
          <DetailRow
            label="Lý do"
            value={order.cancellationReason}
            valueClassName="text-red-400"
          />
          <DetailRow
            label="Thời gian"
            value={
              order.cancelledAt ? formatDateTime(order.cancelledAt) : undefined
            }
          />
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Thời gian</h3>
        <dl className="space-y-2">
          <DetailRow label="Tạo đơn" value={formatDateTime(order.createdAt)} />
          <DetailRow
            label="Xác nhận"
            value={
              order.confirmedAt ? formatDateTime(order.confirmedAt) : undefined
            }
          />
          <DetailRow
            label="Sẵn sàng"
            value={order.readyAt ? formatDateTime(order.readyAt) : undefined}
          />
          <DetailRow
            label="Hoàn thành"
            value={
              order.completedAt ? formatDateTime(order.completedAt) : undefined
            }
          />
          <DetailRow
            label="Thanh toán"
            value={order.paidAt ? formatDateTime(order.paidAt) : undefined}
          />
        </dl>
      </section>
    </div>
  );
}

export function OrderDetailModal({
  orderId,
  open,
  onClose,
  actions,
}: OrderDetailModalProps) {
  const { order, loading, error, refetch } = useOrderDetail(orderId, {
    skip: !open,
  });

  const {
    actionLoading,
    handleConfirm,
    handleMarkPreparing,
    handleMarkReady,
    handleComplete,
    openCancelModal,
  } = actions;

  const wasLoadingRef = useRef(actionLoading);

  useEffect(() => {
    if (wasLoadingRef.current && !actionLoading && open) {
      void refetch();
    }
    wasLoadingRef.current = actionLoading;
  }, [actionLoading, open, refetch]);

  const footerActions = useMemo(() => {
    if (!order) return null;

    const refetchDetail = () => void refetch();

    return (
      <OrderDetailFooterActions
        order={order}
        actions={{
          actionLoading,
          handleConfirm: async (id) => {
            await handleConfirm(id);
            refetchDetail();
          },
          handleMarkPreparing: async (id) => {
            await handleMarkPreparing(id);
            refetchDetail();
          },
          handleMarkReady: async (id) => {
            await handleMarkReady(id);
            refetchDetail();
          },
          handleComplete: async (id) => {
            await handleComplete(id);
            refetchDetail();
          },
          openCancelModal,
        }}
      />
    );
  }, [
    actionLoading,
    handleComplete,
    handleConfirm,
    handleMarkPreparing,
    handleMarkReady,
    openCancelModal,
    order,
    refetch,
  ]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={order ? `Đơn ${order.orderCode}` : 'Chi tiết đơn hàng'}
      size="lg"
      footer={footerActions}
    >
      <QueryState
        loading={loading}
        error={error}
        empty={!loading && !order}
        emptyMessage="Không tìm thấy đơn hàng."
        onRetry={() => void refetch()}
      >
        {order && <OrderDetailContent order={order} />}
      </QueryState>
    </Modal>
  );
}
