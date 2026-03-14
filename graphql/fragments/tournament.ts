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
      avatarUrl
      seed
    }
    player2 {
      registrationId
      userId
      name
      avatarUrl
      seed
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
    }
    createdAt
    updatedAt
  }
`;
