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
import { Modal } from '@/components/molecules/Modal';
import { QueryState } from '@/components/molecules/QueryState';
import { OrderPaymentProofSection } from '@/components/organisms/OrderPaymentProofSection';
import { useOrderDetail } from '@/hooks/owner/useOrderDetail';
import {
  ORDER_PAYMENT_STATUS_LABEL,
  ORDER_STATUS_LABEL,
} from '@/lib/constants/order-status';
import { canCompleteOrderWithPaymentProof } from '@/lib/owner/order-complete';
import { formatCurrency } from '@/lib/utils';
import { ORDER_TYPE_LABEL } from '../_hooks/owner-orders-page.constants';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  MOMO: 'MoMo',
  VNPAY: 'VNPay',
  ZALOPAY: 'ZaloPay',
  CARD: 'Thẻ',
};

interface CompleteOrderModalProps {
  actions: OwnerOrdersPageActions;
}

export function CompleteOrderModal({ actions }: CompleteOrderModalProps) {
  const {
    completeModal,
    closeCompleteModal,
    handleCompleteSubmit,
    completing,
  } = actions;

  const orderId = completeModal?.orderId ?? null;
  const { order, loading, error, refetch } = useOrderDetail(orderId, {
    skip: !completeModal,
  });

  if (!completeModal) return null;

  const handleClose = () => {
    closeCompleteModal();
  };

  const paymentCheck = order
    ? canCompleteOrderWithPaymentProof(
        order.paymentMethod,
        order.paymentProofImages
      )
    : { allowed: false };

  const customerName =
    order?.customerName?.trim() || order?.customerInfo?.name?.trim();

  return (
    <Modal
      open
      onClose={handleClose}
      title="Hoàn thành đơn hàng"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={completing}>
            Hủy
          </Button>
          <Button
            onClick={() => void handleCompleteSubmit()}
            disabled={completing || loading || !order || !paymentCheck.allowed}
          >
            {completing ? 'Đang xử lý...' : 'Xác nhận hoàn thành'}
          </Button>
        </>
      }
    >
      <QueryState
        loading={loading && !order}
        error={error}
        onRetry={() => void refetch()}
      >
        {order ? (
          <div className="space-y-4">
            <p className="text-muted text-sm">
              Xác nhận đơn{' '}
              <span className="text-body font-medium">{order.orderCode}</span>
              {customerName ? ` — ${customerName}` : ''} đã hoàn tất?
            </p>

            <dl className="border-surface-border bg-surface/40 space-y-2 rounded-xl border p-4 text-sm">
              <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                <dt className="text-muted">Trạng thái</dt>
                <dd className="text-body">
                  {ORDER_STATUS_LABEL[order.status] ?? order.status}
                </dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                <dt className="text-muted">Loại đơn</dt>
                <dd className="text-body">
                  {ORDER_TYPE_LABEL[order.orderType] ?? order.orderType}
                </dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                <dt className="text-muted">Thanh toán</dt>
                <dd className="text-body">
                  {ORDER_PAYMENT_STATUS_LABEL[order.paymentStatus] ??
                    order.paymentStatus}
                </dd>
              </div>
              {order.paymentMethod ? (
                <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                  <dt className="text-muted">Phương thức</dt>
                  <dd className="text-body">
                    {PAYMENT_METHOD_LABEL[order.paymentMethod] ??
                      order.paymentMethod}
                  </dd>
                </div>
              ) : null}
              <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                <dt className="text-muted">Tổng tiền</dt>
                <dd className="text-primary font-semibold">
                  {formatCurrency(order.totalAmount)}
                </dd>
              </div>
              {(order.paidAmount ?? 0) > 0 ? (
                <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
                  <dt className="text-muted">Đã thanh toán</dt>
                  <dd className="text-body">
                    {formatCurrency(order.paidAmount ?? 0)}
                  </dd>
                </div>
              ) : null}
            </dl>

            <OrderPaymentProofSection
              key={order._id}
              compact
              orderId={order._id}
              paymentMethod={order.paymentMethod}
              paymentProofImages={order.paymentProofImages}
              onImagesChange={() => void refetch()}
            />

            {!paymentCheck.allowed && paymentCheck.reason ? (
              <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                {paymentCheck.reason}
              </p>
            ) : null}
          </div>
        ) : null}
      </QueryState>
    </Modal>
  );
}
