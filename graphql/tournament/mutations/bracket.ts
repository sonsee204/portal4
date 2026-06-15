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

export const SEED_KNOCKOUT_BRACKET = gql`
  mutation SeedKnockoutBracket($categoryId: ID!) {
    seedKnockoutBracket(categoryId: $categoryId) {
      ...MatchCore
    }
  }
  ${MATCH_CORE_FRAGMENT}
`;
