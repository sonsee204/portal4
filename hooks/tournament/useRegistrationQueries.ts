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
import { useQuery, useLazyQuery } from '@apollo/client/react';
import {
  GET_TOURNAMENT_REGISTRATIONS,
  EXPORT_TOURNAMENT_REGISTRATIONS,
  PREVIEW_BULK_IMPORT,
} from '@/graphql/tournament/queries';
import type {
  RegistrationFilterInput,
  TournamentRegistration,
  ExportTournamentRegistrationsQuery,
  GetTournamentRegistrationsQuery,
} from '@/graphql/generated';
import type { BulkImportItem } from '@/lib/utils/registration-import';
import {
  resolveConnectionFirst,
  totalPagesFromCount,
} from '@/hooks/shared/useCursorConnection';
import { usePagedConnectionQuery } from '@/hooks/shared/usePagedConnectionQuery';
import type { LegacyPagePagination } from '@/hooks/shared/useCursorConnection';

interface UseRegistrationsOptions {
  tournamentId: string;
  filter?: RegistrationFilterInput;
  pagination?: LegacyPagePagination;
  skip?: boolean;
}

export function useRegistrations(options: UseRegistrationsOptions) {
  const { tournamentId, filter, pagination, skip } = options;
  const first = resolveConnectionFirst(pagination);

  const result = usePagedConnectionQuery<
    { tournamentRegistrationsConnection: GetTournamentRegistrationsQuery['tournamentRegistrationsConnection'] },
    TournamentRegistration,
    { tournamentId: string; filter?: RegistrationFilterInput }
  >({
    query: GET_TOURNAMENT_REGISTRATIONS,
    pagination,
    resetKey: JSON.stringify({ tournamentId, filter }),
    variables: { tournamentId, filter },
    getConnection: (data) => data?.tournamentRegistrationsConnection,
    skip: skip || !tournamentId,
  });

  return {
    registrations: result.items,
    total: result.total,
    page: pagination?.page ?? 1,
    totalPages: totalPagesFromCount(result.total, first),
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function usePreviewBulkImport(tournamentId: string) {
  const [runQuery, { loading }] = useLazyQuery<{
    previewBulkImport: { adjustmentsNeeded: Array<{
      categoryId: string;
      categoryTitle: string;
      currentBracketSize: number;
      newRegistrationCount: number;
      suggestedBracketSize: number;
    }> };
  }>(PREVIEW_BULK_IMPORT);

  const preview = useCallback(
    (registrations: BulkImportItem[]) => {
      const input = {
        tournamentId,
        registrations: registrations.map((r) => ({
          ...r,
          categoryId: r.categoryId,
        })),
      };
      return runQuery({ variables: { input } }).then((res) => {
        const data = res.data?.previewBulkImport;
        return data?.adjustmentsNeeded ?? [];
      });
    },
    [runQuery, tournamentId],
  );

  return { preview, loading };
}

export function useExportRegistrations(tournamentId: string) {
  const { data, loading, refetch } = useQuery<ExportTournamentRegistrationsQuery>(
    EXPORT_TOURNAMENT_REGISTRATIONS,
    {
      variables: { tournamentId },
      skip: true,
      fetchPolicy: 'network-only',
    },
  );

  const fetchForExport = useCallback(
    (filter?: RegistrationFilterInput) =>
      refetch({ tournamentId, filter }),
    [refetch, tournamentId],
  );

  return {
    registrations: data?.exportTournamentRegistrations ?? [],
    loading,
    fetchForExport,
  };
}
