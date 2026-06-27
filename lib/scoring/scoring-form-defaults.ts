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

import {
  ScoringSystem,
  ServeRule,
  type ScoringConfigInput,
} from '@/graphql/generated';
import type { SportType } from '@/types/tournament-form';

export const CUSTOM_SCORING_TEMPLATE_ID = 'custom';

export const FALLBACK_SCORING_BY_SPORT: Record<
  SportType,
  { templateId: string; config: ScoringConfigInput }
> = {
  badminton: {
    templateId: 'bwf_21',
    config: {
      scoringSystem: ScoringSystem.SetsAndPoints,
      bestOf: 3,
      setsToWin: 2,
      pointsPerSet: 21,
      deuceEnabled: true,
      deuceAt: 20,
      maxPoints: 30,
      winByMargin: 2,
      tiebreakEnabled: false,
      tiebreakPoints: 0,
      periodDurationMinutes: 0,
      periodsCount: 0,
      serveRule: ServeRule.RallyPoint,
      midGameIntervalAt: 11,
    },
  },
  pickleball: {
    templateId: 'pickleball_11',
    config: {
      scoringSystem: ScoringSystem.SetsAndPoints,
      bestOf: 3,
      setsToWin: 2,
      pointsPerSet: 11,
      deuceEnabled: true,
      deuceAt: 10,
      maxPoints: 0,
      winByMargin: 2,
      tiebreakEnabled: false,
      tiebreakPoints: 0,
      periodDurationMinutes: 0,
      periodsCount: 0,
      serveRule: ServeRule.SideOut,
      midGameIntervalAt: 0,
    },
  },
  tennis: {
    templateId: 'tennis_6_tiebreak',
    config: {
      scoringSystem: ScoringSystem.SetsAndPoints,
      bestOf: 3,
      setsToWin: 2,
      pointsPerSet: 6,
      deuceEnabled: true,
      deuceAt: 6,
      maxPoints: 0,
      winByMargin: 2,
      tiebreakEnabled: true,
      tiebreakPoints: 7,
      periodDurationMinutes: 0,
      periodsCount: 0,
      serveRule: ServeRule.RallyPoint,
      midGameIntervalAt: 0,
    },
  },
  football: {
    templateId: 'football_90',
    config: {
      scoringSystem: ScoringSystem.TimedGoals,
      bestOf: 1,
      setsToWin: 1,
      pointsPerSet: 0,
      deuceEnabled: false,
      deuceAt: 0,
      maxPoints: 0,
      winByMargin: 0,
      tiebreakEnabled: false,
      tiebreakPoints: 0,
      periodDurationMinutes: 45,
      periodsCount: 2,
      serveRule: ServeRule.NoServe,
    },
  },
};

export function createDefaultScoringForSport(sport: SportType): {
  scoringTemplateId: string;
  scoringConfig: ScoringConfigInput;
} {
  const fallback = FALLBACK_SCORING_BY_SPORT[sport];
  return {
    scoringTemplateId: fallback.templateId,
    scoringConfig: { ...fallback.config },
  };
}

export function scoringConfigFromGraphql(
  config: ScoringConfigInput,
): ScoringConfigInput {
  return {
    scoringSystem: config.scoringSystem,
    bestOf: config.bestOf,
    setsToWin: config.setsToWin,
    pointsPerSet: config.pointsPerSet,
    deuceEnabled: config.deuceEnabled,
    deuceAt: config.deuceAt,
    maxPoints: config.maxPoints,
    winByMargin: config.winByMargin,
    tiebreakEnabled: config.tiebreakEnabled,
    tiebreakPoints: config.tiebreakPoints,
    periodDurationMinutes: config.periodDurationMinutes,
    periodsCount: config.periodsCount,
    serveRule: config.serveRule,
    serveRotationInterval: config.serveRotationInterval,
    framesToWin: config.framesToWin,
    midGameIntervalAt: config.midGameIntervalAt,
  };
}

export function formatScoringSummary(config: ScoringConfigInput): string {
  if (config.scoringSystem === ScoringSystem.TimedGoals) {
    return `${config.periodsCount} hiệp × ${config.periodDurationMinutes} phút, ghi bàn tính điểm`;
  }
  if (config.scoringSystem === ScoringSystem.TimedPoints) {
    return `${config.periodsCount} hiệp × ${config.periodDurationMinutes} phút`;
  }
  if (config.scoringSystem === ScoringSystem.Frames) {
    return `Race to ${config.framesToWin ?? 5} frames`;
  }

  const cap =
    (config.maxPoints ?? 0) > 0 ? `, trần ${config.maxPoints}` : ', không trần';
  const deuce = config.deuceEnabled
    ? `, deuce ${config.deuceAt}, thắng cách ${config.winByMargin}`
    : '';
  return `BO${config.bestOf}, chạm ${config.pointsPerSet}${deuce}${cap}`;
}
