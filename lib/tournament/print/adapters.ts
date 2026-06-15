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
  Tournament,
  TournamentCategory,
  TournamentMatch,
  TournamentFormat,
} from '@/graphql/generated';
import type { ScheduleMatch } from '@/types/tournament-schedule';
import type {
  PrintCategoryInput,
  PrintMatchInput,
  PrintScheduleMatchInput,
  PrintTournamentFormat,
  PrintTournamentInput,
} from '@/lib/tournament/print/types';

const FORMAT_MAP: Record<TournamentFormat, PrintTournamentFormat> = {
  SINGLE_ELIMINATION: 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION: 'DOUBLE_ELIMINATION',
  ROUND_ROBIN: 'ROUND_ROBIN',
  GROUP_KNOCKOUT: 'GROUP_KNOCKOUT',
};

export function mapTournamentToPrintInput(
  tournament: Tournament,
): PrintTournamentInput {
  return {
    id: tournament._id,
    title: tournament.title,
    status: tournament.status,
    locationName: tournament.location?.name ?? undefined,
    startDate: tournament.dates?.startDate ?? undefined,
    endDate: tournament.dates?.endDate ?? undefined,
    courtCount: tournament.courts?.length ?? 0,
  };
}

export function mapCategoryToPrintInput(
  category: TournamentCategory,
): PrintCategoryInput {
  return {
    id: category._id,
    title: category.title,
    format: FORMAT_MAP[category.format],
    ageLabel: category.ageLabel,
    displayOrder: category.displayOrder,
    bracketSize: category.bracketSize,
    status: category.status,
  };
}

export function mapGqlMatchToPrintInput(m: TournamentMatch): PrintMatchInput {
  return {
    id: m._id,
    matchNumber: m.matchNumber,
    categoryId: m.categoryId ?? '',
    round: m.round,
    roundLabel: m.roundLabel,
    bracketPosition: m.bracketPosition,
    groupId: m.groupId,
    status: m.status,
    isBye: m.isBye,
    scheduledAt: m.scheduledAt,
    courtName: m.court?.name ?? undefined,
    player1: m.player1,
    player2: m.player2,
    player1SlotLabel: m.player1SlotLabel,
    player2SlotLabel: m.player2SlotLabel,
    nextMatchId: m.nextMatchId,
    losersNextMatchId: m.losersNextMatchId,
  };
}

export function mapScheduleMatchToPrintScheduleInput(
  m: ScheduleMatch,
): PrintScheduleMatchInput {
  return {
    id: m.id,
    matchNumber: m.matchNumber,
    categoryId: m.categoryId,
    categoryTitle: m.categoryTitle,
    round: m.round,
    roundLabel: m.roundLabel,
    scheduledDate: m.scheduledDate,
    startTime: m.startTime,
  };
}
