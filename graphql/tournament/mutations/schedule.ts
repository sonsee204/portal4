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
import { MATCH_CORE_FRAGMENT } from '@/graphql/tournament/fragments';

export const SCHEDULE_MATCH = gql`
  mutation ScheduleMatch($input: ScheduleMatchInput!) {
    scheduleMatch(input: $input) {
      match {
        ...MatchCore
      }
      warnings
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const BULK_SCHEDULE_MATCHES = gql`
  mutation BulkScheduleMatches($input: BulkScheduleMatchInput!) {
    bulkScheduleMatches(input: $input) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const UNSCHEDULE_MATCH = gql`
  mutation UnscheduleMatch($matchId: ID!) {
    unscheduleMatch(matchId: $matchId) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const CASCADE_RESCHEDULE = gql`
  mutation CascadeReschedule($input: CascadeRescheduleInput!) {
    cascadeReschedule(input: $input) {
      affectedMatches {
        ...MatchCore
      }
      totalAffected
      warnings
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const REPACK_COURT_SCHEDULE = gql`
  mutation RepackCourtSchedule($input: RepackCourtScheduleInput!) {
    repackCourtSchedule(input: $input) {
      affectedMatches {
        ...MatchCore
      }
      totalAffected
      preview {
        matchId
        matchNumber
        oldScheduledAt
        newScheduledAt
      }
      warnings
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const ASSIGN_REFEREE = gql`
  mutation AssignReferee($input: AssignRefereeInput!) {
    assignReferee(input: $input) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;
