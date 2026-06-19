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

import { useCallback } from 'react';
import {
  useApproveRegistration,
  useBulkRegistrationActions,
  useDeleteRegistration,
  useRejectRegistration,
  useUpdateBibNumber,
  useUpdatePaymentStatus,
} from '@/hooks/tournament';
import { TournamentPaymentStatus, type TournamentRegistration } from '@/graphql/generated';
import {
  parseBibNumberInput,
  toggleSelectAllIds,
  toggleSelectionSet,
} from './registrations-page.derived';
import type { StatusFilterValue } from './registrations-page.constants';
import type { RegistrationsPageData } from './useRegistrationsPageData';

export function useRegistrationsPageActions(data: RegistrationsPageData) {
  const {
    tournamentId,
    registrations,
    refetch,
    setStatusFilter,
    setSelectedIds,
    selectedIds,
    setRejectingReg,
    rejectingReg,
    deletingReg,
    approvingReg,
    setApprovingReg,
    setDeletingReg,
    setEditingBibId,
    bibInputValue,
    setBibInputValue,
  } = data;

  const onSuccess = useCallback(() => {
    setSelectedIds(new Set());
    void refetch();
  }, [refetch, setSelectedIds]);

  const { approve, loading: approving } = useApproveRegistration(tournamentId, {
    onSuccess: () => {
      setApprovingReg(null);
      onSuccess();
    },
  });
  const { reject, loading: rejecting } = useRejectRegistration(tournamentId, {
    onSuccess: () => {
      setRejectingReg(null);
      onSuccess();
    },
  });
  const { deleteRegistration, loading: deleting } = useDeleteRegistration(
    tournamentId,
    {
      onSuccess: () => {
        setDeletingReg(null);
        onSuccess();
      },
    },
  );
  const {
    bulkApprove,
    bulkReject,
    loading: bulkLoading,
  } = useBulkRegistrationActions(tournamentId, { onSuccess });
  const { updatePayment, loading: paymentUpdating } = useUpdatePaymentStatus(
    tournamentId,
    { onSuccess },
  );
  const { updateBibNumber, loading: bibUpdating } =
    useUpdateBibNumber(tournamentId);

  const isActionLoading =
    approving ||
    rejecting ||
    deleting ||
    bulkLoading ||
    paymentUpdating ||
    bibUpdating;

  const handleStatusFilterChange = useCallback(
    (value: StatusFilterValue) => {
      setStatusFilter(value);
      setSelectedIds(new Set());
    },
    [setSelectedIds, setStatusFilter],
  );

  const handleBibEdit = useCallback(
    (reg: TournamentRegistration) => {
      setEditingBibId(reg._id);
      setBibInputValue(reg.bibNumber != null ? String(reg.bibNumber) : '');
    },
    [setBibInputValue, setEditingBibId],
  );

  const handleBibSave = useCallback(
    async (registrationId: string) => {
      const num = parseBibNumberInput(bibInputValue);
      if (bibInputValue.trim() !== '' && num === undefined) return;
      await updateBibNumber(registrationId, num);
      setEditingBibId(null);
    },
    [bibInputValue, setEditingBibId, updateBibNumber],
  );

  const handleBibCancel = useCallback(() => {
    setEditingBibId(null);
    setBibInputValue('');
  }, [setBibInputValue, setEditingBibId]);

  const toggleSelect = useCallback(
    (id: string) => {
      setSelectedIds((prev) => toggleSelectionSet(prev, id));
    },
    [setSelectedIds],
  );

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      toggleSelectAllIds(
        prev,
        registrations.map((r) => r._id),
      ),
    );
  }, [registrations, setSelectedIds]);

  const handleReject = useCallback(
    (reg: TournamentRegistration) => {
      setRejectingReg(reg);
    },
    [setRejectingReg],
  );

  const handleApprove = useCallback(
    (reg: TournamentRegistration) => {
      setApprovingReg(reg);
    },
    [setApprovingReg],
  );

  const handleApproveConfirm = useCallback(() => {
    if (approvingReg) {
      void approve(approvingReg._id);
    }
  }, [approve, approvingReg]);

  const handleRejectConfirm = useCallback(
    (reason?: string) => {
      if (rejectingReg) {
        void reject(rejectingReg._id, reason);
      }
    },
    [reject, rejectingReg],
  );

  const handleDelete = useCallback(
    (reg: TournamentRegistration) => {
      setDeletingReg(reg);
    },
    [setDeletingReg],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deletingReg) {
      void deleteRegistration(deletingReg._id);
    }
  }, [deleteRegistration, deletingReg]);

  const handlePaymentUpdate = useCallback(
    (regId: string, status: TournamentPaymentStatus) => {
      void updatePayment(regId, status);
    },
    [updatePayment],
  );

  return {
    isActionLoading,
    approving,
    rejecting,
    deleting,
    bibUpdating,
    onSuccess,
    handleStatusFilterChange,
    handleBibEdit,
    handleBibSave,
    handleBibCancel,
    toggleSelect,
    toggleSelectAll,
    handleReject,
    handleApprove,
    handleApproveConfirm,
    handleRejectConfirm,
    handleDelete,
    handleDeleteConfirm,
    handlePaymentUpdate,
    approve,
    bulkApprove,
    bulkReject,
  };
}

export type RegistrationsPageActions = ReturnType<
  typeof useRegistrationsPageActions
>;
