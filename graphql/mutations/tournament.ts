import { gql } from 'graphql-tag';
import {
  TOURNAMENT_DETAIL_FRAGMENT,
  TOURNAMENT_CORE_FRAGMENT,
  TOURNAMENT_CATEGORY_FRAGMENT,
  MATCH_CORE_FRAGMENT,
  REGISTRATION_CORE_FRAGMENT,
  SCORECARD_FRAGMENT,
} from '@/graphql/fragments/tournament';

// ==================== TOURNAMENT LIFECYCLE ====================

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

// ==================== CATEGORY ====================

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...TournamentCategoryCore
    }
  }
  ${TOURNAMENT_CATEGORY_FRAGMENT}
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      ...TournamentCategoryCore
    }
  }
  ${TOURNAMENT_CATEGORY_FRAGMENT}
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`;

// ==================== REGISTRATION MANAGEMENT ====================

export const APPROVE_REGISTRATION = gql`
  mutation ApproveRegistration($input: ApproveRegistrationInput!) {
    approveRegistration(input: $input) {
      ...RegistrationCore
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

export const REJECT_REGISTRATION = gql`
  mutation RejectRegistration($input: RejectRegistrationInput!) {
    rejectRegistration(input: $input) {
      ...RegistrationCore
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

export const BULK_APPROVE_REGISTRATIONS = gql`
  mutation BulkApproveRegistrations($input: BulkRegistrationActionInput!) {
    bulkApproveRegistrations(input: $input)
  }
`;

export const BULK_REJECT_REGISTRATIONS = gql`
  mutation BulkRejectRegistrations($input: BulkRegistrationActionInput!) {
    bulkRejectRegistrations(input: $input)
  }
`;

export const UPDATE_PAYMENT_STATUS = gql`
  mutation UpdatePaymentStatus($input: UpdatePaymentStatusInput!) {
    updatePaymentStatus(input: $input) {
      ...RegistrationCore
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

// ==================== BRACKET & DRAW ====================

export const GENERATE_BRACKET = gql`
  mutation GenerateBracket($input: GenerateBracketInput!) {
    generateBracket(input: $input) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

export const RESET_BRACKET = gql`
  mutation ResetBracket($categoryId: ID!) {
    resetBracket(categoryId: $categoryId) {
      success
      message
    }
  }
`;

export const SEED_PLAYERS = gql`
  mutation SeedPlayers($input: SeedPlayersInput!) {
    seedPlayers(input: $input) {
      success
      message
    }
  }
`;

// ==================== MATCH SCHEDULING ====================

export const SCHEDULE_MATCH = gql`
  mutation ScheduleMatch($input: ScheduleMatchInput!) {
    scheduleMatch(input: $input) {
      ...MatchCore
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

export const ASSIGN_REFEREE = gql`
  mutation AssignReferee($input: AssignRefereeInput!) {
    assignReferee(input: $input) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;

// ==================== SCORING ====================

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

// ==================== SUBSCRIPTIONS ====================

export const MATCH_SCORE_UPDATED_SUB = gql`
  subscription MatchScoreUpdated($matchId: ID!) {
    matchScoreUpdated(matchId: $matchId) {
      ...ScorecardCore
    }
  }
  ${SCORECARD_FRAGMENT}
`;

export const TOURNAMENT_MATCHES_UPDATED_SUB = gql`
  subscription TournamentMatchesUpdated($tournamentId: ID!) {
    tournamentMatchesUpdated(tournamentId: $tournamentId)
  }
`;

export const TOURNAMENT_STATUS_CHANGED_SUB = gql`
  subscription TournamentStatusChanged($tournamentId: ID!) {
    tournamentStatusChanged(tournamentId: $tournamentId)
  }
`;
