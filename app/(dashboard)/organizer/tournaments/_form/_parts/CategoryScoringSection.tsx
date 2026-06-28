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

import { Controller, type Control } from 'react-hook-form';
import type { TournamentFormData } from '@/types/tournament-form';
import { ScoringConfigEditor } from './ScoringConfigEditor';

interface CategoryScoringSectionProps {
  index: number;
  sport: TournamentFormData['sport'];
  control: Control<TournamentFormData>;
}

export function CategoryScoringSection({
  index,
  sport,
  control,
}: CategoryScoringSectionProps) {
  return (
    <Controller
      control={control}
      name={`categories.${index}.scoringTemplateId`}
      render={({ field: templateField }) => (
        <Controller
          control={control}
          name={`categories.${index}.scoringConfig`}
          render={({ field: configField }) => (
            <ScoringConfigEditor
              sport={sport}
              templateId={templateField.value}
              config={configField.value}
              onTemplateIdChange={templateField.onChange}
              onConfigChange={configField.onChange}
            />
          )}
        />
      )}
    />
  );
}
