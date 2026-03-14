import { PostReportReason, PostReportStatus } from '@/graphql/generated';

// ==================== POST REPORT LABELS ====================

export const POST_REPORT_REASON_LABELS: Record<PostReportReason, string> = {
  [PostReportReason.HateSpeech]: 'Ngôn từ thù địch',
  [PostReportReason.Spam]: 'Spam',
  [PostReportReason.Harassment]: 'Quấy rối',
  [PostReportReason.FalseInformation]: 'Thông tin sai',
  [PostReportReason.IntellectualProperty]: 'Vi phạm bản quyền',
  [PostReportReason.Nudity]: 'Nội dung khiêu dâm',
  [PostReportReason.Violence]: 'Bạo lực',
  [PostReportReason.Other]: 'Khác',
};

export const POST_REPORT_REASON_VARIANTS: Record<
  PostReportReason,
  'danger' | 'warning' | 'info' | 'neutral'
> = {
  [PostReportReason.HateSpeech]: 'danger',
  [PostReportReason.Spam]: 'warning',
  [PostReportReason.Harassment]: 'danger',
  [PostReportReason.FalseInformation]: 'info',
  [PostReportReason.IntellectualProperty]: 'info',
  [PostReportReason.Nudity]: 'danger',
  [PostReportReason.Violence]: 'danger',
  [PostReportReason.Other]: 'neutral',
};

export const POST_REPORT_STATUS_LABELS: Record<PostReportStatus, string> = {
  [PostReportStatus.Pending]: 'Chờ xử lý',
  [PostReportStatus.Reviewed]: 'Đang xem xét',
  [PostReportStatus.Resolved]: 'Đã xử lý',
  [PostReportStatus.Dismissed]: 'Đã bỏ qua',
};

// ==================== POST REPORT TYPES ====================

export interface ModerationReportUser {
  _id: string;
  displayName?: string | null;
  userName?: string | null;
  photoURL?: string | null;
}

export interface ModerationReportPost {
  _id: string;
  content: string;
  author: ModerationReportUser;
}

export interface ModerationReport {
  _id: string;
  postId: string;
  reason: PostReportReason;
  status: PostReportStatus;
  description?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  reporterId: string;
  reporter?: ModerationReportUser | null;
  post?: ModerationReportPost | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewer?: { _id: string; displayName?: string | null } | null;
}

// ==================== USER REPORTS ====================

export type UserReportReason =
  | 'HARASSMENT'
  | 'HATE_SPEECH'
  | 'SPAM'
  | 'IMPERSONATION'
  | 'INAPPROPRIATE_CONTENT'
  | 'OTHER';

export type UserReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export const USER_REPORT_STATUS_LABELS: Record<UserReportStatus, string> = {
  PENDING: 'Chờ xử lý',
  REVIEWED: 'Đang xem xét',
  RESOLVED: 'Đã xử lý',
  DISMISSED: 'Đã bỏ qua',
};

export const USER_REPORT_REASON_LABELS: Record<UserReportReason, string> = {
  HARASSMENT: 'Quấy rối',
  HATE_SPEECH: 'Ngôn từ thù địch',
  SPAM: 'Spam',
  IMPERSONATION: 'Mạo danh',
  INAPPROPRIATE_CONTENT: 'Nội dung không phù hợp',
  OTHER: 'Khác',
};

export const USER_REPORT_REASON_VARIANTS: Record<
  UserReportReason,
  'danger' | 'warning' | 'info' | 'neutral'
> = {
  HARASSMENT: 'danger',
  HATE_SPEECH: 'danger',
  SPAM: 'warning',
  IMPERSONATION: 'warning',
  INAPPROPRIATE_CONTENT: 'danger',
  OTHER: 'neutral',
};

export interface UserModerationReport {
  _id: string;
  reportedUserId: string;
  reporterId: string;
  reason: UserReportReason;
  status: UserReportStatus;
  description?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  reporter?: ModerationReportUser | null;
  reportedUser?: ModerationReportUser | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewer?: { _id: string; displayName?: string | null } | null;
}

// ==================== MESSAGE REPORTS ====================

export type MessageReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export const MESSAGE_REPORT_STATUS_LABELS: Record<MessageReportStatus, string> = {
  PENDING: 'Chờ xử lý',
  REVIEWED: 'Đang xem xét',
  RESOLVED: 'Đã xử lý',
  DISMISSED: 'Đã bỏ qua',
};

export interface MessageModerationReport {
  _id: string;
  messageId: string;
  reporterId: string;
  reason: string;
  status: MessageReportStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
}
