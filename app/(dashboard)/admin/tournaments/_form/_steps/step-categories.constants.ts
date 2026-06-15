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

import { MatchType, TournamentFormat } from '@/graphql/generated';
import type { TournamentFormData } from '@/types/tournament-form';

export const MATCH_LABEL: Record<MatchType, string> = {
  [MatchType.Singles]: 'Đơn',
  [MatchType.Doubles]: 'Đôi',
  [MatchType.Team]: 'Đội',
};

export const FORMAT_LABEL: Record<TournamentFormat, string> = {
  [TournamentFormat.SingleElimination]: 'Loại trực tiếp',
  [TournamentFormat.DoubleElimination]: 'Loại kép',
  [TournamentFormat.RoundRobin]: 'Vòng tròn',
  [TournamentFormat.GroupKnockout]: 'Bảng + Loại trực tiếp',
};

export const MATCH_TYPE_OPTIONS = [
  { label: 'Đơn', value: MatchType.Singles },
  { label: 'Đôi', value: MatchType.Doubles },
  { label: 'Đội', value: MatchType.Team },
];

export const ICON_OPTIONS = [
  { label: 'Người', value: 'person-outline' },
  { label: 'Nhóm', value: 'people-outline' },
  { label: 'Trường học', value: 'school-outline' },
  { label: 'Thể lực', value: 'fitness-outline' },
  { label: 'Ngôi sao', value: 'star-outline' },
  { label: 'Cúp', value: 'trophy-outline' },
];

export const FORMAT_OPTIONS = [
  { label: 'Loại trực tiếp', value: TournamentFormat.SingleElimination },
  { label: 'Loại kép', value: TournamentFormat.DoubleElimination },
  { label: 'Vòng tròn', value: TournamentFormat.RoundRobin },
  { label: 'Bảng + Loại trực tiếp', value: TournamentFormat.GroupKnockout },
];

export const BRACKET_SIZE_OPTIONS = [
  { label: 'Tự động', value: '0' },
  { label: '4', value: '4' },
  { label: '8', value: '8' },
  { label: '16', value: '16' },
  { label: '32', value: '32' },
  { label: '64', value: '64' },
  { label: '128', value: '128' },
];

export const DEFAULT_PRIZE_DRAFTS = [
  { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
  { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
  { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
];

export function createDefaultCategoryEntry(): TournamentFormData['categories'][number] {
  return {
    title: '',
    ageLabel: '',
    matchType: 'single',
    format: TournamentFormat.SingleElimination,
    icon: 'person-outline',
    description: '',
    popular: false,
    maxRegistrations: 0,
    bracketSize: 0,
    sharedThirdPlace: false,
    groupCount: 4,
    advancingPerGroup: 2,
    defaultMatchDurationMinutes: 30,
    prizes: DEFAULT_PRIZE_DRAFTS.map((p) => ({
      ...p,
      perks: [...p.perks],
    })),
  };
}
