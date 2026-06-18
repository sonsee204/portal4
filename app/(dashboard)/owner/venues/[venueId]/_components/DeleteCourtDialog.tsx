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
import { useDeleteCourt } from '@/hooks/owner';
import type { VenueDetailPageActions } from '../_hooks/useVenueDetailPageActions';

interface DeleteCourtDialogProps {
  venueId: string;
  actions: VenueDetailPageActions;
  onDeleted: () => void;
}

export function DeleteCourtDialog({
  venueId,
  actions,
  onDeleted,
}: DeleteCourtDialogProps) {
  const { deleteCourtId, closeDeleteCourt } = actions;
  const { deleteCourt, loading } = useDeleteCourt(venueId);

  const handleConfirm = async () => {
    if (!deleteCourtId) return;
    await deleteCourt(deleteCourtId);
    closeDeleteCourt();
    onDeleted();
  };

  return (
    <ConfirmDialog
      open={Boolean(deleteCourtId)}
      onClose={closeDeleteCourt}
      onConfirm={() => void handleConfirm()}
      title="Xóa sân con"
      description="Hành động này không thể hoàn tác. Sân con sẽ bị xóa khỏi cơ sở."
      confirmLabel="Xóa"
      variant="danger"
      loading={loading}
    />
  );
}
