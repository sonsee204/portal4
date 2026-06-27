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

export const TOURNAMENT_CORE_FRAGMENT = gql`
  fragment TournamentCore on Tournament {
    _id
    title
    sportType
    status
    coverImage
    description
    introduction
    totalCategories
    totalRegistrations
    totalMatches
    dates {
      startDate
      endDate
      registrationOpenDate
      registrationCloseDate
    }
    location {
      name
      address
      latitude
      longitude
    }
    organizer
    organizerName
    createdAt
    updatedAt
  }
`;

export const TOURNAMENT_DETAIL_FRAGMENT = gql`
  fragment TournamentDetail on Tournament {
    ...TournamentCore
    highlights
    prizes {
      rank
      title
      amount
      perks
    }
    contacts {
      label
      value
      icon
    }
    courts {
      name
      notes
      status
    }
    rules {
      title
      content
    }
    paymentInfo {
      bank
      accountNumber
      accountName
      qrImage
      fees {
        label
        amount
      }
    }
    facilities {
      label
      icon
    }
    schedule {
      label
      date
      startTime
      endTime
      status
    }
    scheduleConfig {
      minRestMinutes
      courtBufferMinutes
      restBreakWindows {
        startTime
        endTime
      }
    }
  }
  ${TOURNAMENT_CORE_FRAGMENT}
`;

export const TOURNAMENT_CATEGORY_FRAGMENT = gql`
  fragment TournamentCategoryCore on TournamentCategory {
    _id
    tournamentId
    title
    format
    matchType
    gender
    ageLabel
    description
    icon
    popular
    maxRegistrations
    registeredCount
    matchCount
    completedMatchCount
    status
    displayOrder
    seedCount
    groupCount
    advancingPerGroup
    bracketSize
    defaultMatchDurationMinutes
    sharedThirdPlace
    prizes {
      rank
      title
      amount
      perks
    }
    scoringConfig {
      scoringSystem
      bestOf
      setsToWin
      pointsPerSet
      deuceEnabled
      deuceAt
      tiebreakEnabled
      tiebreakPoints
      winByMargin
      maxPoints
      periodsCount
      periodDurationMinutes
      framesToWin
      midGameIntervalAt
    }
    createdAt
    updatedAt
  }
`;

export const MATCH_CORE_FRAGMENT = gql`
  fragment MatchCore on TournamentMatch {
    _id
    tournamentId
    categoryId
    round
    roundLabel
    matchNumber
    bracketPosition
    groupId
    status
    isBye
    player1 {
      registrationId
      userId
      name
      club
      avatarUrl
      seed
      dateOfBirth
      bibNumber
      members {
        userId
        name
        avatarUrl
        club
      }
    }
    player2 {
      registrationId
      userId
      name
      club
      avatarUrl
      seed
      dateOfBirth
      bibNumber
      members {
        userId
        name
        avatarUrl
        club
      }
    }
    scoreSummary {
      sets {
        player1
        player2
      }
      finalScore
    }
    winner
    court {
      courtId
      name
    }
    scheduledAt
    durationSeconds
    estimatedDurationMinutes
    refereeId
    refereeName
    refereeInviteStatus
    hasConflictWarning
    matchStartedAt
    nextMatchId
    nextMatchSlot
    losersNextMatchId
    losersNextMatchSlot
    createdAt
    updatedAt
  }
`;

export const REGISTRATION_CORE_FRAGMENT = gql`
  fragment RegistrationCore on TournamentRegistration {
    _id
    tournamentId
    categoryId
    userId
    registeredByUserId
    athleteName
    avatarUrl
    dateOfBirth
    school
    club
    guardianName
    guardianPhone
    email
    phone
    notes
    seed
    bibNumber
    members {
      userId
      name
      avatarUrl
      phone
      email
      dateOfBirth
      club
      school
    }
    paymentAmount
    paymentProofUrl
    identityProofUrl
    registrationStatus
    paymentStatus
    rejectionReason
    reviewedBy
    reviewedAt
    createdAt
    updatedAt
  }
`;

export const SCORECARD_FRAGMENT = gql`
  fragment ScorecardCore on MatchScorecard {
    _id
    matchId
    tournamentId
    categoryId
    status
    bestOf
    currentSetIndex
    servingPlayer
    leftSidePlayer
    elapsedSeconds
    matchSetup {
      setupMethod
      coinTossWinner
      coinTossChoice
      decidedAt
    }
    sets {
      setNumber
      player1Score
      player2Score
      isComplete
      winner
    }
    pointHistory {
      id
      scoringPlayer
      servingPlayer
      setNumber
      scoreAfter
      timestamp
    }
    correctionHistory {
      id
      actorId
      reason
      action
      timestamp
    }
    scoringConfig {
      scoringSystem
      bestOf
      setsToWin
      pointsPerSet
      deuceEnabled
      deuceAt
      tiebreakEnabled
      tiebreakPoints
      winByMargin
      maxPoints
      periodsCount
      periodDurationMinutes
      framesToWin
      midGameIntervalAt
    }
    createdAt
    updatedAt
  }
`;
