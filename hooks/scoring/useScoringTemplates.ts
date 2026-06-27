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

import { useQuery } from '@apollo/client/react';
import { SportType } from '@/graphql/generated';
import { SCORING_TEMPLATES_QUERY } from '@/graphql/scoring/queries';
import type { SportType as FormSportType } from '@/types/tournament-form';

const FORM_SPORT_TO_GRAPHQL: Record<FormSportType, SportType> = {
  badminton: SportType.Badminton,
  pickleball: SportType.Pickleball,
  tennis: SportType.Tennis,
  football: SportType.Football,
};

export interface ScoringTemplateOption {
  id: string;
  label: string;
  description: string;
  config: import('@/graphql/generated').ScoringConfigInput;
}

export function useScoringTemplates(sport: FormSportType) {
  const sportType = FORM_SPORT_TO_GRAPHQL[sport];
  const { data, loading, error } = useQuery<{
    scoringTemplates: ScoringTemplateOption[];
  }>(SCORING_TEMPLATES_QUERY, {
    variables: { sportType },
    fetchPolicy: 'cache-first',
  });

  return {
    templates: data?.scoringTemplates ?? [],
    loading,
    error,
  };
}
