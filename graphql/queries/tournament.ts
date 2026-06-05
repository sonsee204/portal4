import { gql } from 'graphql-tag';
import {
  TOURNAMENT_CORE_FRAGMENT,
  TOURNAMENT_DETAIL_FRAGMENT,
  TOURNAMENT_CATEGORY_FRAGMENT,
  MATCH_CORE_FRAGMENT,
  REGISTRATION_CORE_FRAGMENT,
  SCORECARD_FRAGMENT,
} from '@/graphql/fragments/tournament';

export const GET_MY_TOURNAMENTS = gql`
  query GetMyTournaments($filter: TournamentFilterInput, $pagination: PaginationInput) {
    myTournaments(filter: $filter, pagination: $pagination) {
      tournaments {
        ...TournamentCore
      }
      total
      page
      totalPages
      limit
      hasNextPage
      hasPrevPage
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
      ...TournamentDetail
    }
  }
  ${TOURNAMENT_DETAIL_FRAGMENT}
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
    $pagination: PaginationInput
  ) {
    tournamentRegistrations(tournamentId: $tournamentId, filter: $filter, pagination: $pagination) {
      registrations {
        ...RegistrationCore
      }
      total
      page
      totalPages
      limit
      hasNextPage
      hasPrevPage
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
    $pagination: PaginationInput
  ) {
    tournamentMatches(tournamentId: $tournamentId, filter: $filter, pagination: $pagination) {
      matches {
        ...MatchCore
      }
      total
      page
      totalPages
      limit
      hasNextPage
      hasPrevPage
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const GET_LIVE_MATCHES = gql`
  query GetLiveMatches($tournamentId: ID!) {
    liveMatches(tournamentId: $tournamentId) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const GET_MATCH_DETAIL = gql`
  query GetMatchDetail($matchId: ID!) {
    matchDetail(matchId: $matchId) {
      ...MatchCore
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

export const GET_TOURNAMENT_RESULTS = gql`
  query GetTournamentResults($tournamentId: ID!) {
    tournamentResults(tournamentId: $tournamentId) {
      categoryId
      categoryTitle
      goldName
      silverName
      bronzeNames
    }
  }
`;

export const GET_TOURNAMENT_STATS = gql`
  query GetTournamentStats($tournamentId: ID!) {
    tournamentStats(tournamentId: $tournamentId) {
      totalCategories
      totalRegistrations
      totalMatches
      completedMatches
    }
  }
`;

export const EXPORT_TOURNAMENT_REGISTRATIONS = gql`
  query ExportTournamentRegistrations($tournamentId: ID!, $filter: RegistrationFilterInput) {
    exportTournamentRegistrations(tournamentId: $tournamentId, filter: $filter) {
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
