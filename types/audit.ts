/**
 * Audit log types for the portal.
 * Mirrors the backend AuditLog entity and related enums.
 */

// ==================== Enums ====================

export enum AuditActionEnum {
  LOGIN = 'LOGIN',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  LOGOUT_ALL = 'LOGOUT_ALL',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_REGISTER = 'ACCOUNT_REGISTER',
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',
  USER_CREATE = 'USER_CREATE',
  USER_SUSPEND = 'USER_SUSPEND',
  USER_UNSUSPEND = 'USER_UNSUSPEND',
  USER_ROLE_CHANGE = 'USER_ROLE_CHANGE',
  USER_DELETE = 'USER_DELETE',
  VENUE_APPROVE = 'VENUE_APPROVE',
  VENUE_REJECT = 'VENUE_REJECT',
  VENUE_SUSPEND = 'VENUE_SUSPEND',
  RATE_LIMIT_HIT = 'RATE_LIMIT_HIT',
  CONFIG_CHANGE = 'CONFIG_CHANGE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
}

export enum AuditCategoryEnum {
  AUTH = 'AUTH',
  ADMIN = 'ADMIN',
  SECURITY = 'SECURITY',
  SYSTEM = 'SYSTEM',
}

export enum AuditStatusEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

// ==================== Types ====================

export type AuditAction = `${AuditActionEnum}`;
export type AuditCategory = `${AuditCategoryEnum}`;
export type AuditStatus = `${AuditStatusEnum}`;

export interface AuditLog {
  _id: string;
  actor?: string;
  actorName?: string;
  actorRole?: string;
  action: AuditAction;
  category: AuditCategory;
  status: AuditStatus;
  target?: string;
  targetId?: string;
  ip?: string;
  userAgent?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogList {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AuditCategoryCount {
  category: string;
  count: number;
}

export interface AuditStats {
  totalEvents: number;
  failedLast24h: number;
  securityLast7d: number;
  authLast24h: number;
  byCategory: AuditCategoryCount[];
}

// ==================== Filter input ====================

export interface AuditFilterInput {
  category?: AuditCategory;
  action?: AuditAction;
  status?: AuditStatus;
  actorId?: string;
  from?: string;
  to?: string;
  search?: string;
}
