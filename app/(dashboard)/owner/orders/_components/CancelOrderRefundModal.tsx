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

import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';

interface CancelOrderRefundModalProps {
  actions: OwnerOrdersPageActions;
}

const REFUND_PERCENT_OPTIONS = [
  { label: '100%', value: '100' },
  { label: '75%', value: '75' },
  { label: '50%', value: '50' },
  { label: '25%', value: '25' },
  { label: '0%', value: '0' },
];

export function CancelOrderRefundModal({
  actions,
}: CancelOrderRefundModalProps) {
  const {
    cancelModal,
    closeCancelModal,
    handleCancelSubmit,
    cancelling,
    cancellingWithRefund,
  } = actions;

  const [reason, setReason] = useState('');
  const [refundPercent, setRefundPercent] = useState('100');
  const [refundNote, setRefundNote] = useState('');

  if (!cancelModal) return null;

  const { order, useRefund } = cancelModal;
  const submitting = cancelling || cancellingWithRefund;

  const handleClose = () => {
    setReason('');
    setRefundPercent('100');
    setRefundNote('');
    closeCancelModal();
  };

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    await handleCancelSubmit({
      reason: reason.trim(),
      refundPercent: useRefund ? Number(refundPercent) : undefined,
      refundNote:
        useRefund && refundNote.trim() ? refundNote.trim() : undefined,
    });
    setReason('');
    setRefundPercent('100');
    setRefundNote('');
  };

  return (
    <Modal
      open
      onClose={handleClose}
      title={useRefund ? 'Hủy đơn và hoàn tiền' : 'Hủy đơn hàng'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Đóng
          </Button>
          <Button
            variant="danger"
            onClick={() => void handleSubmit()}
            disabled={submitting || !reason.trim()}
          >
            {submitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-muted text-sm">
          Đơn <span className="text-body font-medium">{order.orderCode}</span>
          {order.customerName ? ` — ${order.customerName}` : ''}
        </p>

        <Input
          label="Lý do hủy"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do hủy đơn..."
          required
        />

        {useRefund && (
          <>
            <Select
              label="Tỷ lệ hoàn tiền"
              options={REFUND_PERCENT_OPTIONS}
              value={refundPercent}
              onChange={(e) => setRefundPercent(e.target.value)}
            />
            <Input
              label="Ghi chú hoàn tiền (tuỳ chọn)"
              value={refundNote}
              onChange={(e) => setRefundNote(e.target.value)}
              placeholder="Ghi chú cho khách hoặc kế toán..."
            />
            {order.paymentStatus === 'PAID' && (
              <p className="text-xs text-amber-400">
                Đơn đã thanh toán — sau khi hủy sẽ chuyển sang trạng thái chờ
                hoàn tiền.
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
