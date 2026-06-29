/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { gql } from 'graphql-tag';
import {
  TOURNAMENT_CORE_FRAGMENT,
  TOURNAMENT_DETAIL_FRAGMENT,
  TOURNAMENT_CATEGORY_FRAGMENT,
  MATCH_CORE_FRAGMENT,
  REGISTRATION_CORE_FRAGMENT,
  SCORECARD_FRAGMENT,
  TOURNAMENT_MEDIA_FRAGMENT,
} from './fragments';

export const GET_MY_TOURNAMENTS = gql`
  query GetMyTournaments(
    $filter: TournamentFilterInput
    $pagination: CursorPageInput
  ) {
    myTournamentsConnection(filter: $filter, pagination: $pagination) {
      edges {
        cursor
        node {
          ...TournamentCore
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const GET_PLATFORM_TOURNAMENTS = gql`
  query GetPlatformTournaments(
    $filter: TournamentFilterInput
    $pagination: CursorPageInput
  ) {
    platformTournamentsConnection(filter: $filter, pagination: $pagination) {
      edges {
        cursor
        node {
          ...TournamentCore
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
      ...TournamentDetail
      ...TournamentMedia
    }
  }
  ${TOURNAMENT_DETAIL_FRAGMENT}
  ${TOURNAMENT_MEDIA_FRAGMENT}
`;

export const GET_TOURNAMENT_CATEGORIES = gql`
  query GetTournamentCategories($tournamentId: ID!) {
    tournamentCategories(tournamentId: $tournamentId) {
      ...TournamentCategoryCore
    }
  }
  ${TOURNAMENT_CATEGORY_FRAGMENT}
`;

export const PREVIEW_BULK_IMPORT = gql`
  query PreviewBulkImport($input: PreviewBulkImportInput!) {
    previewBulkImport(input: $input) {
      adjustmentsNeeded {
        categoryId
        categoryTitle
        currentBracketSize
        newRegistrationCount
        suggestedBracketSize
      }
    }
  }
`;

export const PREVIEW_LATE_ENTRY_PLACEMENT = gql`
  query PreviewLateEntryPlacement($categoryId: ID!) {
    previewLateEntryPlacement(categoryId: $categoryId) {
      canProceed
      eligibleByeMatchCount
      blockReason
      isFormatSupported
      eligibleMatches {
        matchId
        matchNumber
        roundLabel
        opponentName
      }
    }
  }
`;

export const GET_TOURNAMENT_REGISTRATIONS = gql`
  query GetTournamentRegistrations(
    $tournamentId: ID!
    $filter: RegistrationFilterInput
    $pagination: CursorPageInput
  ) {
    tournamentRegistrationsConnection(
      tournamentId: $tournamentId
      filter: $filter
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          ...RegistrationCore
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

export const GET_TOURNAMENT_BRACKET = gql`
  query GetTournamentBracket($categoryId: ID!) {
    tournamentBracket(categoryId: $categoryId) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const GET_TOURNAMENT_MATCHES = gql`
  query GetTournamentMatches(
    $tournamentId: ID!
    $filter: MatchFilterInput
    $pagination: CursorPageInput
  ) {
    tournamentMatchesConnection(
      tournamentId: $tournamentId
      filter: $filter
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          ...MatchCore
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const GET_MATCH_SCORECARD = gql`
  query GetMatchScorecard($matchId: ID!) {
    matchScorecard(matchId: $matchId) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const GET_REFEREE_MATCHES = gql`
  query GetRefereeMatches($tournamentId: ID!) {
    refereeMatches(tournamentId: $tournamentId) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const GET_TOURNAMENT_RANKINGS = gql`
  query GetTournamentRankings($categoryId: ID!) {
    tournamentRankings(categoryId: $categoryId) {
      rank
      registrationId
      playerName
      matchesPlayed
      matchesWon
      matchesLost
      setsWon
      setsLost
      pointsWon
      pointsLost
      winRate
      groupPoints
    }
  }
`;

export const GET_TOURNAMENT_GROUP_RANKINGS = gql`
  query GetTournamentGroupRankings($categoryId: ID!, $groupId: String!) {
    tournamentGroupRankings(categoryId: $categoryId, groupId: $groupId) {
      registrationId
      playerName
      avatarUrl
      club
      seed
      rank
      matchesPlayed
      matchesWon
      matchesLost
      setsWon
      setsLost
      pointsWon
      pointsLost
      winRate
      groupPoints
    }
  }
`;

export const EXPORT_TOURNAMENT_REGISTRATIONS = gql`
  query ExportTournamentRegistrations(
    $tournamentId: ID!
    $filter: RegistrationFilterInput
  ) {
    exportTournamentRegistrations(
      tournamentId: $tournamentId
      filter: $filter
    ) {
      ...RegistrationCore
      category {
        _id
        title
        ageLabel
        gender
        matchType
        format
      }
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

export const PREVIEW_REPACK_COURT_SCHEDULE = gql`
  query PreviewRepackCourtSchedule($input: RepackCourtScheduleInput!) {
    previewRepackCourtSchedule(input: $input) {
      anchorMatchId
      courtName
      calendarDate
      totalAffected
      overdueCount
      backlogCount
      preview {
        matchId
        matchNumber
        oldScheduledAt
        newScheduledAt
      }
      warnings
    }
  }
`;

export const UPLOAD_TOURNAMENT_IMAGE = gql`
  mutation UploadTournamentImage($input: UploadTournamentImageInput!) {
    uploadTournamentImage(input: $input) {
      url
    }
  }
`;
