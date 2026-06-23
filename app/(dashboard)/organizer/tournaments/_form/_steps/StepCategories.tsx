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

import type { UseFormReturn } from 'react-hook-form';
import type { TournamentFormData } from '@/types/tournament-form';
import { StepCategoriesCreateMode } from './StepCategoriesCreateMode';
import { StepCategoriesEditMode } from './StepCategoriesEditMode';

interface StepCategoriesProps {
  form: UseFormReturn<TournamentFormData>;
  tournamentId?: string;
}

export function StepCategories({ form, tournamentId }: StepCategoriesProps) {
  const sport = form.watch('sport');

  if (tournamentId) {
    return (
      <StepCategoriesEditMode
        tournamentId={tournamentId}
        sport={sport}
        form={form}
      />
    );
  }
  return <StepCategoriesCreateMode form={form} />;
}
