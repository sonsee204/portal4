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

export const PREVIEW_MANUAL_KNOCKOUT_DRAW = gql`
  query PreviewManualKnockoutDraw($input: PreviewManualKnockoutDrawInput!) {
    previewManualKnockoutDraw(input: $input) {
      valid
      bracketSize
      totalByes
      r1TvTCount
      maxR1TvT
      layoutHints {
        approvedCount
        r1PairCount
        minR1TvT
        structuralEmptyPairs
        r1WalkoverCount
        r1TvTCount
        r2TvTCount
        r2WalkoverCount
      }
      errors {
        code
        message
        pairIndex
        slotIndex
      }
      matchupRows {
        player1Name
        player2Name
        isR1ByeWalkover
        meetingRound
        meetingRoundLabel
        r1PairIndex
      }
    }
  }
`;
