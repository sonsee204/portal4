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
import type { OwnerPromotionsPageActions } from '../_hooks/useOwnerPromotionsPageActions';

interface PromotionActionConfirmDialogProps {
  actions: Pick<
    OwnerPromotionsPageActions,
    | 'actionDialog'
    | 'actionDialogCopy'
    | 'closeActionDialog'
    | 'handleActionConfirm'
    | 'isMutating'
  >;
}

export function PromotionActionConfirmDialog({
  actions,
}: PromotionActionConfirmDialogProps) {
  const {
    actionDialog,
    actionDialogCopy,
    closeActionDialog,
    handleActionConfirm,
    isMutating,
  } = actions;

  if (!actionDialog || !actionDialogCopy) return null;

  return (
    <ConfirmDialog
      open
      onClose={closeActionDialog}
      onConfirm={() => void handleActionConfirm()}
      title={actionDialogCopy.title}
      description={actionDialogCopy.description}
      confirmLabel={actionDialogCopy.confirmLabel}
      variant={actionDialogCopy.destructive ? 'danger' : 'default'}
      loading={isMutating}
    />
  );
}
