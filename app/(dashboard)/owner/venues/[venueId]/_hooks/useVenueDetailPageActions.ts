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

import { useState } from 'react';
import type { VenueCourtNode } from '@/hooks/owner';

export type CourtModalMode = 'create' | 'edit';

export function useVenueDetailPageActions() {
  const [courtModalOpen, setCourtModalOpen] = useState(false);
  const [courtModalMode, setCourtModalMode] = useState<CourtModalMode>('create');
  const [editingCourt, setEditingCourt] = useState<VenueCourtNode | null>(null);
  const [deleteCourtId, setDeleteCourtId] = useState<string | null>(null);

  const openCreateCourt = () => {
    setEditingCourt(null);
    setCourtModalMode('create');
    setCourtModalOpen(true);
  };

  const openEditCourt = (court: VenueCourtNode) => {
    setEditingCourt(court);
    setCourtModalMode('edit');
    setCourtModalOpen(true);
  };

  const closeCourtModal = () => {
    setCourtModalOpen(false);
    setEditingCourt(null);
  };

  const openDeleteCourt = (courtId: string) => {
    setDeleteCourtId(courtId);
  };

  const closeDeleteCourt = () => {
    setDeleteCourtId(null);
  };

  return {
    courtModalOpen,
    courtModalMode,
    editingCourt,
    deleteCourtId,
    openCreateCourt,
    openEditCourt,
    closeCourtModal,
    openDeleteCourt,
    closeDeleteCourt,
  };
}

export type VenueDetailPageActions = ReturnType<typeof useVenueDetailPageActions>;
