'use client';

import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TOURNAMENT_REGISTRATIONS } from '@/graphql/queries/tournament';
import {
  APPROVE_REGISTRATION,
  REJECT_REGISTRATION,
  BULK_APPROVE_REGISTRATIONS,
  BULK_REJECT_REGISTRATIONS,
  UPDATE_PAYMENT_STATUS,
} from '@/graphql/mutations/tournament';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type {
  RegistrationList,
  RegistrationFilterInput,
  PaginationInput,
  TournamentRegistration,
  TournamentPaymentStatus,
} from '@/graphql/generated';

interface UseRegistrationsOptions {
  tournamentId: string;
  filter?: RegistrationFilterInput;
  pagination?: PaginationInput;
  skip?: boolean;
}

export function useRegistrations(options: UseRegistrationsOptions) {
  const { tournamentId, filter, pagination, skip } = options;

  const { data, loading, error, refetch } = useQuery<{
    tournamentRegistrations: RegistrationList;
  }>(GET_TOURNAMENT_REGISTRATIONS, {
    variables: { tournamentId, filter, pagination },
    fetchPolicy: 'cache-and-network',
    skip: skip || !tournamentId,
  });

  const result = data?.tournamentRegistrations;

  return {
    registrations: result?.registrations ?? [],
    total: result?.total ?? 0,
    page: result?.page ?? 1,
    totalPages: result?.totalPages ?? 1,
    loading,
    error,
    refetch,
  };
}

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

  return { bulkApprove, bulkReject, loading: approving || rejecting };
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
