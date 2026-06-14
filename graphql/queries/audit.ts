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

export const AUDIT_GET_LOGS = gql`
  query AuditGetLogs($filter: AuditFilterInput, $pagination: CursorPageInput) {
    auditLogsConnection(filter: $filter, pagination: $pagination) {
      edges {
        cursor
        node {
          _id
          actor
          actorName
          actorRole
          action
          category
          status
          target
          targetId
          ip
          userAgent
          correlationId
          metadata
          errorMessage
          createdAt
          updatedAt
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
`;

export const AUDIT_GET_LOG_DETAIL = gql`
  query AuditGetLogDetail($id: ID!) {
    auditLogDetail(id: $id) {
      _id
      actor
      actorName
      actorRole
      action
      category
      status
      target
      targetId
      ip
      userAgent
      correlationId
      metadata
      errorMessage
      createdAt
      updatedAt
    }
  }
`;

export const AUDIT_GET_STATS = gql`
  query AuditGetStats {
    auditStats {
      totalEvents
      failedLast24h
      securityLast7d
      authLast24h
      byCategory {
        category
        count
      }
    }
  }
`;
