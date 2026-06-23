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
import { PROMOTION_CORE_FRAGMENT } from './fragments';

export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($input: CreatePromotionInput!) {
    createPromotion(input: $input) {
      ...PromotionCore
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($input: UpdatePromotionInput!) {
    updatePromotion(input: $input) {
      ...PromotionCore
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const SUBMIT_PROMOTION_FOR_APPROVAL = gql`
  mutation SubmitPromotionForApproval($promotionId: ID!) {
    submitPromotionForApproval(promotionId: $promotionId) {
      ...PromotionCore
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const REVIEW_PROMOTION = gql`
  mutation ReviewPromotion($input: ReviewPromotionInput!) {
    reviewPromotion(input: $input) {
      ...PromotionCore
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const ACTIVATE_PROMOTION = gql`
  mutation ActivatePromotion($promotionId: ID!) {
    activatePromotion(promotionId: $promotionId) {
      ...PromotionCore
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const PAUSE_PROMOTION = gql`
  mutation PausePromotion($promotionId: ID!) {
    pausePromotion(promotionId: $promotionId) {
      ...PromotionCore
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const CANCEL_PROMOTION = gql`
  mutation CancelPromotion($promotionId: ID!) {
    cancelPromotion(promotionId: $promotionId) {
      ...PromotionCore
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($promotionId: ID!) {
    deletePromotion(promotionId: $promotionId)
  }
`;
