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
import {
  SCORECARD_FRAGMENT,
  MATCH_CORE_FRAGMENT,
} from '@/graphql/tournament/fragments';

export const START_MATCH = gql`
  mutation StartMatch($input: StartMatchInput!) {
    startMatch(input: $input) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const SCORE_POINT = gql`
  mutation ScorePoint($input: ScorePointInput!) {
    scorePoint(input: $input) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const UNDO_LAST_POINT = gql`
  mutation UndoLastPoint($matchId: ID!) {
    undoLastPoint(matchId: $matchId) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const UPDATE_MATCH_RESULT = gql`
  mutation UpdateMatchResult($input: ManualMatchResultInput!) {
    updateMatchResult(input: $input) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const ORGANIZER_CORRECT_LIVE_SCORE = gql`
  mutation OrganizerCorrectLiveScore(
    $input: OrganizerCorrectLiveScoreInput!
  ) {
    organizerCorrectLiveScore(input: $input) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const ORGANIZER_ABORT_LIVE_MATCH = gql`
  mutation OrganizerAbortLiveMatch($input: OrganizerAbortLiveMatchInput!) {
    organizerAbortLiveMatch(input: $input) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const SET_MATCH_WALKOVER = gql`
  mutation SetMatchWalkover($input: SetMatchWalkoverInput!) {
    setMatchWalkover(input: $input) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const CORRECT_FINISHED_MATCH_RESULT = gql`
  mutation CorrectFinishedMatchResult(
    $input: CorrectFinishedMatchResultInput!
  ) {
    correctFinishedMatchResult(input: $input) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;
