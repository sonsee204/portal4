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

import { useMemo, useState } from 'react';
import { useRegistrations, useTournament, useTournamentCategories } from '@/hooks/tournament';
import { useAuthStore, selectIsSuperAdmin } from '@/stores/auth';
import type { TournamentRegistration } from '@/graphql/generated';
import {
  ALL_STATUS,
  PAGE_SIZE,
  type StatusFilterValue,
} from './registrations-page.constants';
import {
  buildCategoryMatchTypeMap,
  buildCategoryTitleMap,
  canImportRegistrations,
} from './registrations-page.derived';

export function useRegistrationsPageData(tournamentId: string) {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilterValue>(ALL_STATUS);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);
  const [lateEntryOpen, setLateEntryOpen] = useState(false);
  const [detailReg, setDetailReg] = useState<TournamentRegistration | null>(
    null,
  );
  const [rejectingReg, setRejectingReg] =
    useState<TournamentRegistration | null>(null);
  const [deletingReg, setDeletingReg] = useState<TournamentRegistration | null>(
    null,
  );
  const [editingBibId, setEditingBibId] = useState<string | null>(null);
  const [bibInputValue, setBibInputValue] = useState('');

  const isSuperAdmin = useAuthStore(selectIsSuperAdmin);
  const { tournament } = useTournament(tournamentId);
  const { categories } = useTournamentCategories(tournamentId);

  const canImport = useMemo(
    () => canImportRegistrations(tournament, categories),
    [tournament, categories],
  );
  const categoryMap = useMemo(
    () => buildCategoryTitleMap(categories),
    [categories],
  );
  const categoryMatchTypeMap = useMemo(
    () => buildCategoryMatchTypeMap(categories),
    [categories],
  );

  const registrationQuery = useRegistrations({
    tournamentId,
    filter:
      statusFilter === ALL_STATUS
        ? undefined
        : { registrationStatus: statusFilter },
    pagination: { page, limit: PAGE_SIZE },
  });

  return {
    tournamentId,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    selectedIds,
    setSelectedIds,
    importOpen,
    setImportOpen,
    lateEntryOpen,
    setLateEntryOpen,
    isSuperAdmin,
    detailReg,
    setDetailReg,
    rejectingReg,
    setRejectingReg,
    deletingReg,
    setDeletingReg,
    editingBibId,
    setEditingBibId,
    bibInputValue,
    setBibInputValue,
    tournament,
    categories,
    canImport,
    categoryMap,
    categoryMatchTypeMap,
    registrations: registrationQuery.registrations,
    total: registrationQuery.total,
    currentPage: registrationQuery.page,
    totalPages: registrationQuery.totalPages,
    loading: registrationQuery.loading,
    refetch: registrationQuery.refetch,
  };
}

export type RegistrationsPageData = ReturnType<typeof useRegistrationsPageData>;
