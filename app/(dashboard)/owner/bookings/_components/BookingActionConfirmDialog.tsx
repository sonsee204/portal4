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

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import type { BookingDetailActions } from '@/hooks/owner/useBookingDetailActions';

interface BookingActionConfirmDialogProps {
  actions: Pick<
    BookingDetailActions,
    | 'dialog'
    | 'dialogCopy'
    | 'closeDialog'
    | 'handleConfirmDialog'
    | 'isMutating'
  >;
}

export function BookingActionConfirmDialog({
  actions,
}: BookingActionConfirmDialogProps) {
  const { dialog, dialogCopy, closeDialog, handleConfirmDialog, isMutating } =
    actions;

  if (!dialog || !dialogCopy) return null;

  return (
    <ConfirmDialog
      open
      onClose={closeDialog}
      onConfirm={handleConfirmDialog}
      title={dialogCopy.title}
      description={dialogCopy.description(dialog.customerName)}
      confirmLabel={dialogCopy.confirmLabel}
      variant={dialogCopy.variant}
      loading={isMutating}
    />
  );
}
