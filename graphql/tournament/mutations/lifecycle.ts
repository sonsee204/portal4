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
  TOURNAMENT_DETAIL_FRAGMENT,
  TOURNAMENT_CORE_FRAGMENT,
} from '@/graphql/tournament/fragments';

export const CREATE_TOURNAMENT = gql`
  mutation CreateTournament($input: CreateTournamentInput!) {
    createTournament(input: $input) {
      ...TournamentDetail
    }
  }
  ${TOURNAMENT_DETAIL_FRAGMENT}
`;

export const UPDATE_TOURNAMENT = gql`
  mutation UpdateTournament($input: UpdateTournamentInput!) {
    updateTournament(input: $input) {
      ...TournamentDetail
    }
  }
  ${TOURNAMENT_DETAIL_FRAGMENT}
`;

export const PUBLISH_TOURNAMENT = gql`
  mutation PublishTournament($id: ID!) {
    publishTournament(id: $id) {
      ...TournamentCore
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const OPEN_REGISTRATION = gql`
  mutation OpenRegistration($id: ID!) {
    openRegistration(id: $id) {
      ...TournamentCore
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const CLOSE_REGISTRATION = gql`
  mutation CloseRegistration($id: ID!) {
    closeRegistration(id: $id) {
      ...TournamentCore
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const START_TOURNAMENT = gql`
  mutation StartTournament($id: ID!) {
    startTournament(id: $id) {
      ...TournamentCore
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const COMPLETE_TOURNAMENT = gql`
  mutation CompleteTournament($id: ID!) {
    completeTournament(id: $id) {
      ...TournamentCore
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const CANCEL_TOURNAMENT = gql`
  mutation CancelTournament($id: ID!) {
    cancelTournament(id: $id) {
      ...TournamentCore
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const DELETE_TOURNAMENT = gql`
  mutation DeleteTournament($id: ID!) {
    deleteTournament(id: $id) {
      success
      message
    }
  }
`;

export const DUPLICATE_TOURNAMENT = gql`
  mutation DuplicateTournament($id: ID!) {
    duplicateTournament(id: $id) {
      ...TournamentDetail
    }
  }
  ${TOURNAMENT_DETAIL_FRAGMENT}
`;
