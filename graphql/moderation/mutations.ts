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

export const UPDATE_REPORT_STATUS = gql`
  mutation UpdateReportStatus($input: UpdateReportStatusInput!) {
    updateReportStatus(input: $input) {
      _id
      status
      notes
      reviewedAt
      reviewedBy
    }
  }
`;

export const UPDATE_USER_REPORT_STATUS = gql`
  mutation UpdateUserReportStatus($input: UpdateUserReportStatusInput!) {
    updateUserReportStatus(input: $input) {
      _id
      status
      notes
      reviewedAt
      reviewedBy
    }
  }
`;

export const DELETE_POST_BY_ADMIN = gql`
  mutation DeletePostByAdmin($postId: ID!) {
    deletePostByAdmin(postId: $postId)
  }
`;

export const UPDATE_MESSAGE_REPORT_STATUS = gql`
  mutation UpdateMessageReportStatus(
    $input: UpdateMessageReportStatusInput!
  ) {
    updateMessageReportStatus(input: $input) {
      _id
      status
      notes
      reviewedAt
      reviewedBy
    }
  }
`;

export const DELETE_MESSAGE_BY_ADMIN = gql`
  mutation DeleteMessageByAdmin($messageId: ID!) {
    deleteMessageByAdmin(messageId: $messageId)
  }
`;
