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

import { gql } from 'graphql-tag';
import { SCORECARD_FRAGMENT } from '@/graphql/tournament/fragments';

export const MATCH_SCORE_UPDATED_SUB = gql`
  subscription MatchScoreUpdated($_matchId: ID!) {
    matchScoreUpdated(_matchId: $_matchId) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const TOURNAMENT_MATCHES_UPDATED_SUB = gql`
  subscription TournamentMatchesUpdated($_tournamentId: ID!) {
    tournamentMatchesUpdated(_tournamentId: $_tournamentId)
  }
`;

export const TOURNAMENT_STATUS_CHANGED_SUB = gql`
  subscription TournamentStatusChanged($_tournamentId: ID!) {
    tournamentStatusChanged(_tournamentId: $_tournamentId)
  }
`;
