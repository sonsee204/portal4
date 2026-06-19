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
import { ImportModal } from '../_components/ImportModal';
import { LateEntryModal } from '../_components/LateEntryModal';
import { RegistrationDetailModal } from '../_components/RegistrationDetailModal';
import { RejectModal } from '../_components/RejectModal';
import type { RegistrationsPageActions } from '../_hooks/useRegistrationsPageActions';
import type { RegistrationsPageData } from '../_hooks/useRegistrationsPageData';

interface RegistrationsDialogsSectionProps {
  data: RegistrationsPageData;
  actions: RegistrationsPageActions;
}

export function RegistrationsDialogsSection({
  data,
  actions,
}: RegistrationsDialogsSectionProps) {
  const {
    tournamentId,
    categories,
    importOpen,
    setImportOpen,
    lateEntryOpen,
    setLateEntryOpen,
    isSuperAdmin,
    detailReg,
    setDetailReg,
    categoryMap,
    categoryMatchTypeMap,
    rejectingReg,
    setRejectingReg,
    approvingReg,
    setApprovingReg,
    deletingReg,
    setDeletingReg,
  } = data;
  const {
    onSuccess,
    handleApproveConfirm,
    handleRejectConfirm,
    handleDeleteConfirm,
    rejecting,
    approving,
    deleting,
  } = actions;

  return (
    <>
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        tournamentId={tournamentId}
        categories={categories}
        onSuccess={onSuccess}
      />

      {isSuperAdmin && (
        <LateEntryModal
          open={lateEntryOpen}
          onClose={() => setLateEntryOpen(false)}
          tournamentId={tournamentId}
          categories={categories}
          onSuccess={onSuccess}
        />
      )}

      <RegistrationDetailModal
        registration={detailReg}
        categoryTitle={
          detailReg ? categoryMap.get(detailReg.categoryId) : undefined
        }
        categoryMatchType={
          detailReg ? categoryMatchTypeMap.get(detailReg.categoryId) : undefined
        }
        actions={actions}
        onClose={() => setDetailReg(null)}
      />

      <RejectModal
        open={!!rejectingReg}
        onClose={() => setRejectingReg(null)}
        onConfirm={handleRejectConfirm}
        athleteName={rejectingReg?.athleteName}
        loading={rejecting}
      />

      <ConfirmDialog
        open={!!approvingReg}
        onClose={() => setApprovingReg(null)}
        onConfirm={handleApproveConfirm}
        title="Duyệt đăng ký"
        description={
          approvingReg ? `Duyệt đăng ký của ${approvingReg.athleteName}?` : ''
        }
        confirmLabel="Duyệt"
        cancelLabel="Huỷ"
        variant="default"
        loading={approving}
      />

      <ConfirmDialog
        open={!!deletingReg}
        onClose={() => setDeletingReg(null)}
        onConfirm={handleDeleteConfirm}
        title="Xoá đăng ký"
        description={
          deletingReg
            ? `Bạn có chắc muốn xoá đăng ký của ${deletingReg.athleteName}? Hành động này không thể hoàn tác.`
            : ''
        }
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
