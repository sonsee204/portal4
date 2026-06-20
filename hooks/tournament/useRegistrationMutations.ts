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
import { useMutation } from '@apollo/client/react';
import { GET_TOURNAMENT_REGISTRATIONS, GET_TOURNAMENT_CATEGORIES } from '@/graphql/tournament/queries';
import {
  APPROVE_REGISTRATION,
  REJECT_REGISTRATION,
  BULK_APPROVE_REGISTRATIONS,
  BULK_REJECT_REGISTRATIONS,
  BULK_DELETE_REGISTRATIONS,
  UPDATE_PAYMENT_STATUS,
  DELETE_REGISTRATION,
  BULK_IMPORT_REGISTRATIONS,
  UPDATE_REGISTRATION_BIB_NUMBER,
} from '@/graphql/tournament/mutations/registration';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type {
  TournamentRegistration,
  TournamentPaymentStatus,
  BulkImportResult,
  BulkImportRegistrationsInput,
  BracketSizeAdjustmentInput,
} from '@/graphql/generated';
import type { BulkImportItem } from '@/lib/utils/registration-import';

export function useApproveRegistration(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    approveRegistration: TournamentRegistration;
  }>(APPROVE_REGISTRATION, {
    refetchQueries: [{ query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } }],
    ...createMutationOptions('ApproveRegistration', TOURNAMENT.SUCCESS_APPROVE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const approve = useCallback(
    (registrationId: string, seed?: number) =>
      mutation({ variables: { input: { registrationId, seed } } }),
    [mutation],
  );

  return { approve, loading };
}

export function useRejectRegistration(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    rejectRegistration: TournamentRegistration;
  }>(REJECT_REGISTRATION, {
    refetchQueries: [{ query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } }],
    ...createMutationOptions('RejectRegistration', TOURNAMENT.SUCCESS_REJECT),
    onCompleted: () => options?.onSuccess?.(),
  });

  const reject = useCallback(
    (registrationId: string, reason?: string) =>
      mutation({ variables: { input: { registrationId, reason } } }),
    [mutation],
  );

  return { reject, loading };
}

export function useDeleteRegistration(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    deleteRegistration: { success: boolean; message: string };
  }>(DELETE_REGISTRATION, {
    refetchQueries: [{ query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } }],
    ...createMutationOptions('DeleteRegistration', TOURNAMENT.SUCCESS_DELETE_REGISTRATION),
    onCompleted: () => options?.onSuccess?.(),
  });

  const deleteRegistration = useCallback(
    (registrationId: string) =>
      mutation({ variables: { input: { registrationId } } }),
    [mutation],
  );

  return { deleteRegistration, loading };
}

export function useBulkRegistrationActions(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [approveMutation, { loading: approving }] = useMutation<{
    bulkApproveRegistrations: number;
  }>(BULK_APPROVE_REGISTRATIONS, {
    refetchQueries: [{ query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } }],
    ...createMutationOptions('BulkApprove', TOURNAMENT.SUCCESS_BULK_APPROVE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const [rejectMutation, { loading: rejecting }] = useMutation<{
    bulkRejectRegistrations: number;
  }>(BULK_REJECT_REGISTRATIONS, {
    refetchQueries: [{ query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } }],
    ...createMutationOptions('BulkReject', TOURNAMENT.SUCCESS_BULK_REJECT),
    onCompleted: () => options?.onSuccess?.(),
  });

  const [deleteMutation, { loading: deleting }] = useMutation<{
    bulkDeleteRegistrations: number;
  }>(BULK_DELETE_REGISTRATIONS, {
    refetchQueries: [{ query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } }],
    ...createMutationOptions('BulkDelete', TOURNAMENT.SUCCESS_BULK_DELETE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const bulkApprove = useCallback(
    (registrationIds: string[]) =>
      approveMutation({ variables: { input: { registrationIds } } }),
    [approveMutation],
  );

  const bulkReject = useCallback(
    (registrationIds: string[]) =>
      rejectMutation({ variables: { input: { registrationIds } } }),
    [rejectMutation],
  );

  const bulkDelete = useCallback(
    (registrationIds: string[]) =>
      deleteMutation({ variables: { input: { registrationIds } } }),
    [deleteMutation],
  );

  return { bulkApprove, bulkReject, bulkDelete, loading: approving || rejecting || deleting };
}

export function useUpdatePaymentStatus(tournamentId: string, options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    updatePaymentStatus: TournamentRegistration;
  }>(UPDATE_PAYMENT_STATUS, {
    refetchQueries: [{ query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } }],
    ...createMutationOptions('UpdatePaymentStatus', TOURNAMENT.SUCCESS_PAYMENT_UPDATE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const updatePayment = useCallback(
    (registrationId: string, paymentStatus: TournamentPaymentStatus, paymentAmount?: number) =>
      mutation({ variables: { input: { registrationId, paymentStatus, paymentAmount } } }),
    [mutation],
  );

  return { updatePayment, loading };
}

export function useBulkImportRegistrations(
  tournamentId: string,
  options?: { onSuccess?: (result: BulkImportResult) => void },
) {
  const [mutation, { loading }] = useMutation<{
    bulkImportRegistrations: BulkImportResult;
  }>(BULK_IMPORT_REGISTRATIONS, {
    refetchQueries: [
      { query: GET_TOURNAMENT_CATEGORIES, variables: { tournamentId } },
    ],
  });

  const bulkImport = useCallback(
    (
      registrations: BulkImportItem[],
      bracketSizeAdjustments?: BracketSizeAdjustmentInput[],
    ) => {
      const input: BulkImportRegistrationsInput = {
        tournamentId,
        registrations: registrations.map((r) => ({
          ...r,
          categoryId: r.categoryId,
        })),
        bracketSizeAdjustments,
      };
      return mutation({ variables: { input } }).then((res) => {
        const result = res.data?.bulkImportRegistrations;
        if (result) options?.onSuccess?.(result);
        return result;
      });
    },
    [mutation, tournamentId, options],
  );

  return { bulkImport, loading };
}

export function useUpdateBibNumber(tournamentId: string) {
  const [mutation, { loading }] = useMutation<{
    updateRegistrationBibNumber: TournamentRegistration;
  }>(UPDATE_REGISTRATION_BIB_NUMBER, {
    refetchQueries: [
      { query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } },
    ],
    ...createMutationOptions('UpdateRegistrationBibNumber', 'Cập nhật SBD thành công.'),
  });

  const updateBibNumber = useCallback(
    (registrationId: string, bibNumber?: number) =>
      mutation({ variables: { input: { registrationId, bibNumber } } }),
    [mutation],
  );

  return { updateBibNumber, loading };
}
