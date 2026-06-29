/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';

interface OrderActionConfirmDialogProps {
  actions: Pick<
    OwnerOrdersPageActions,
    | 'quickActionDialog'
    | 'quickActionDialogCopy'
    | 'closeQuickActionDialog'
    | 'handleQuickActionConfirm'
    | 'actionLoading'
  >;
}

export function OrderActionConfirmDialog({
  actions,
}: OrderActionConfirmDialogProps) {
  const {
    quickActionDialog,
    quickActionDialogCopy,
    closeQuickActionDialog,
    handleQuickActionConfirm,
    actionLoading,
  } = actions;

  if (!quickActionDialog || !quickActionDialogCopy) return null;

  return (
    <ConfirmDialog
      open
      onClose={closeQuickActionDialog}
      onConfirm={handleQuickActionConfirm}
      title={quickActionDialogCopy.title}
      description={quickActionDialogCopy.description}
      confirmLabel={quickActionDialogCopy.confirmLabel}
      variant={quickActionDialogCopy.variant}
      loading={actionLoading}
    />
  );
}
