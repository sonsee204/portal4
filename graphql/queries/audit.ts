import { gql } from 'graphql-tag';

export const AUDIT_GET_LOGS = gql`
  query AuditGetLogs($filter: AuditFilterInput, $pagination: PaginationInput) {
    auditLogs(filter: $filter, pagination: $pagination) {
      logs {
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
      }
      total
      page
      limit
      hasMore
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
