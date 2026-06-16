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

import { useCallback, useState } from 'react';
import type {
  BookingActionDialogState,
  BookingConfirmAction,
} from '@/app/(dashboard)/owner/bookings/types';
import { useOwnerBookingMutations } from '@/hooks/owner';

const DIALOG_COPY: Record<
  BookingConfirmAction,
  {
    title: string;
    description: (name: string) => string;
    confirmLabel: string;
    variant: 'danger' | 'warning' | 'default';
  }
> = {
  confirm: {
    title: 'Xác nhận đặt sân',
    description: (name) => `Xác nhận đặt sân của ${name}?`,
    confirmLabel: 'Xác nhận',
    variant: 'default',
  },
  reject: {
    title: 'Từ chối đặt sân',
    description: (name) => `Từ chối yêu cầu đặt sân của ${name}?`,
    confirmLabel: 'Từ chối',
    variant: 'danger',
  },
  cancel: {
    title: 'Hủy đặt sân',
    description: (name) => `Hủy đặt sân của ${name}?`,
    confirmLabel: 'Hủy đặt sân',
    variant: 'danger',
  },
  complete: {
    title: 'Hoàn thành đặt sân',
    description: (name) => `Đánh dấu đặt sân của ${name} là hoàn thành?`,
    confirmLabel: 'Hoàn thành',
    variant: 'default',
  },
  checkIn: {
    title: 'Check-in',
    description: (name) => `Check-in cho ${name}?`,
    confirmLabel: 'Check-in',
    variant: 'default',
  },
  markNoShow: {
    title: 'Vắng mặt',
    description: (name) => `Đánh dấu ${name} vắng mặt?`,
    confirmLabel: 'Vắng mặt',
    variant: 'warning',
  },
  approveHold: {
    title: 'Duyệt giữ chỗ',
    description: (name) => `Duyệt yêu cầu giữ chỗ của ${name}?`,
    confirmLabel: 'Duyệt giữ chỗ',
    variant: 'default',
  },
  confirmHold: {
    title: 'Xác nhận giữ chỗ',
    description: (name) =>
      `Xác nhận giữ chỗ và chuyển thành đặt sân cho ${name}?`,
    confirmLabel: 'Xác nhận giữ chỗ',
    variant: 'default',
  },
  rejectHold: {
    title: 'Từ chối giữ chỗ',
    description: (name) => `Từ chối yêu cầu giữ chỗ của ${name}?`,
    confirmLabel: 'Từ chối giữ chỗ',
    variant: 'danger',
  },
};

export function useBookingDetailActions(
  onComplete?: () => void | Promise<void>,
) {
  const {
    confirmBooking,
    rejectBooking,
    cancelBooking,
    completeBooking,
    checkIn,
    markNoShow,
    approveHoldBooking,
    confirmHoldBooking,
    rejectHoldBooking,
    isMutating,
  } = useOwnerBookingMutations();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<BookingActionDialogState | null>(null);

  const openActionDialog = useCallback(
    (
      action: BookingConfirmAction,
      bookingId: string,
      customerName: string,
    ) => {
      setDialog({ action, bookingId, customerName });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    if (isMutating) return;
    setDialog(null);
  }, [isMutating]);

  const runAction = useCallback(
    async (action: BookingConfirmAction, bookingId: string) => {
      setProcessingId(bookingId);
      try {
        switch (action) {
          case 'confirm':
            await confirmBooking(bookingId);
            break;
          case 'reject':
            await rejectBooking(bookingId);
            break;
          case 'cancel':
            await cancelBooking(bookingId);
            break;
          case 'complete':
            await completeBooking(bookingId);
            break;
          case 'checkIn':
            await checkIn(bookingId);
            break;
          case 'markNoShow':
            await markNoShow(bookingId);
            break;
          case 'approveHold':
            await approveHoldBooking(bookingId);
            break;
          case 'confirmHold':
            await confirmHoldBooking(bookingId);
            break;
          case 'rejectHold':
            await rejectHoldBooking(bookingId);
            break;
        }
        await onComplete?.();
        setDialog(null);
      } finally {
        setProcessingId(null);
      }
    },
    [
      approveHoldBooking,
      cancelBooking,
      checkIn,
      completeBooking,
      confirmBooking,
      confirmHoldBooking,
      markNoShow,
      onComplete,
      rejectBooking,
      rejectHoldBooking,
    ],
  );

  const handleConfirmDialog = useCallback(() => {
    if (!dialog) return;
    void runAction(dialog.action, dialog.bookingId);
  }, [dialog, runAction]);

  const handleQuickAction = useCallback(
    (
      action: BookingConfirmAction,
      bookingId: string,
      customerName: string,
    ) => {
      if (
        action === 'confirm' ||
        action === 'checkIn' ||
        action === 'complete' ||
        action === 'approveHold' ||
        action === 'confirmHold'
      ) {
        void runAction(action, bookingId);
        return;
      }
      openActionDialog(action, bookingId, customerName);
    },
    [openActionDialog, runAction],
  );

  const dialogCopy = dialog ? DIALOG_COPY[dialog.action] : null;

  return {
    handleQuickAction,
    processingId,
    isMutating,
    dialog,
    dialogCopy,
    closeDialog,
    handleConfirmDialog,
  };
}

export type BookingDetailActions = ReturnType<typeof useBookingDetailActions>;
