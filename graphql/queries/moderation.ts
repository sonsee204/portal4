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

export const GET_POST_REPORTS_FOR_ADMIN = gql`
  query GetPostReportsForAdmin(
    $filter: PostReportFilterInput
    $pagination: PaginationInput
  ) {
    getPostReportsForAdmin(filter: $filter, pagination: $pagination) {
      reports {
        _id
        postId
        reason
        status
        description
        notes
        createdAt
        updatedAt
        reporterId
        reporter {
          _id
          displayName
          userName
          photoURL
        }
        post {
          _id
          content
          author {
            _id
            displayName
            userName
            photoURL
          }
        }
        reviewedAt
        reviewedBy
        reviewer {
          _id
          displayName
        }
      }
      total
      page
      limit
      hasMore
    }
  }
`;

export const GET_POST_REPORT_STATS = gql`
  query GetPostReportStats {
    getPostReportStats {
      totalReports
      pendingReports
      reviewedReports
      resolvedReports
      dismissedReports
    }
  }
`;

export const GET_USER_REPORTS_FOR_ADMIN = gql`
  query GetUserReportsForAdmin(
    $filter: UserReportFilterInput
    $pagination: PaginationInput
  ) {
    getUserReportsForAdmin(filter: $filter, pagination: $pagination) {
      reports {
        _id
        reportedUserId
        reporterId
        reason
        status
        description
        notes
        createdAt
        updatedAt
        reviewer {
          _id
          displayName
        }
        reporter {
          _id
          displayName
          userName
          photoURL
        }
        reportedUser {
          _id
          displayName
          userName
          photoURL
        }
        reviewedAt
        reviewedBy
      }
      total
      page
      limit
      hasMore
    }
  }
`;

export const GET_USER_REPORT_STATS = gql`
  query GetUserReportStats {
    getUserReportStats {
      totalReports
      pendingReports
      reviewedReports
      resolvedReports
      dismissedReports
    }
  }
`;

export const GET_MESSAGE_REPORTS_FOR_ADMIN = gql`
  query GetMessageReportsForAdmin(
    $filter: MessageReportFilterInput
    $pagination: PaginationInput
  ) {
    getMessageReportsForAdmin(filter: $filter, pagination: $pagination) {
      reports {
        _id
        messageId
        reporterId
        reason
        status
        notes
        createdAt
        updatedAt
        reviewedAt
        reviewedBy
      }
      total
      page
      limit
      hasMore
    }
  }
`;

export const GET_MESSAGE_REPORT_STATS = gql`
  query GetMessageReportStats {
    getMessageReportStats {
      totalReports
      pendingReports
      reviewedReports
      resolvedReports
      dismissedReports
    }
  }
`;
