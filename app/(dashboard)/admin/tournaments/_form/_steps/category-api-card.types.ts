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

import type {
  TournamentCategory,
  UpdateCategoryInput,
} from '@/graphql/generated';
import { MatchType, TournamentFormat } from '@/graphql/generated';

import { DEFAULT_PRIZE_DRAFTS } from './step-categories.constants';

export interface PrizeDraft {
  rank: string;
  title: string;
  amount: string;
  perks: string[];
}

export interface EditState {
  title: string;
  ageLabel: string;
  matchType: MatchType;
  format: TournamentFormat;
  icon: string;
  description: string;
  popular: boolean;
  maxRegistrations: number;
  bracketSize: number;
  sharedThirdPlace: boolean;
  groupCount: number;
  advancingPerGroup: number;
  defaultMatchDurationMinutes: number;
  prizes: PrizeDraft[];
}

export function categoryToEditState(category: TournamentCategory): EditState {
  return {
    title: category.title,
    ageLabel: category.ageLabel ?? '',
    matchType: category.matchType,
    format: category.format ?? TournamentFormat.SingleElimination,
    icon: category.icon ?? 'trophy-outline',
    description: category.description ?? '',
    popular: category.popular ?? false,
    maxRegistrations: category.maxRegistrations ?? 0,
    bracketSize: category.bracketSize ?? 0,
    sharedThirdPlace:
      (category as { sharedThirdPlace?: boolean }).sharedThirdPlace ?? false,
    groupCount: (category as { groupCount?: number }).groupCount ?? 4,
    advancingPerGroup:
      (category as { advancingPerGroup?: number }).advancingPerGroup ?? 2,
    defaultMatchDurationMinutes:
      (category as { defaultMatchDurationMinutes?: number })
        .defaultMatchDurationMinutes ?? 30,
    prizes:
      (category.prizes ?? []).length > 0
        ? (category.prizes ?? []).map((p) => ({
            rank: p.rank ?? 'gold',
            title: p.title ?? '',
            amount: p.amount ?? '',
            perks: p.perks?.length ? p.perks : [''],
          }))
        : DEFAULT_PRIZE_DRAFTS.map((p) => ({ ...p, perks: [...p.perks] })),
  };
}

export function buildCategoryUpdateInput(
  draft: EditState,
  categoryId: string
): UpdateCategoryInput {
  const isRoundRobinDraft = draft.format === TournamentFormat.RoundRobin;
  const isGroupKnockoutDraft = draft.format === TournamentFormat.GroupKnockout;

  return {
    id: categoryId,
    title: draft.title,
    ageLabel: draft.ageLabel || undefined,
    matchType: draft.matchType,
    format: draft.format,
    icon: draft.icon || undefined,
    description: draft.description || undefined,
    popular: draft.popular,
    maxRegistrations: draft.maxRegistrations,
    bracketSize:
      isRoundRobinDraft || isGroupKnockoutDraft
        ? undefined
        : draft.bracketSize > 0
          ? draft.bracketSize
          : undefined,
    sharedThirdPlace:
      draft.format === TournamentFormat.SingleElimination
        ? draft.sharedThirdPlace
        : undefined,
    groupCount: isGroupKnockoutDraft
      ? draft.groupCount > 0
        ? draft.groupCount
        : 4
      : undefined,
    advancingPerGroup: isGroupKnockoutDraft
      ? draft.advancingPerGroup > 0
        ? draft.advancingPerGroup
        : 2
      : undefined,
    defaultMatchDurationMinutes:
      draft.defaultMatchDurationMinutes > 0
        ? draft.defaultMatchDurationMinutes
        : 30,
    prizes: draft.prizes
      .filter((p) => p.title)
      .map((p, i) => ({
        rank:
          p.rank || (i < 3 ? ['gold', 'silver', 'bronze'][i] : String(i + 1)),
        title: p.title,
        amount: p.amount || undefined,
        perks:
          p.perks.filter(Boolean).length > 0
            ? p.perks.filter(Boolean)
            : undefined,
      })),
  };
}
