/**
 * Contact inquiry types for the portal.
 * Mirrors the backend ContactInquiry entity and DTO types.
 */

// ==================== Enums ====================

export enum ContactSubjectEnum {
  COOPERATION = 'COOPERATION',
  SUPPORT = 'SUPPORT',
  RECRUITMENT = 'RECRUITMENT',
  OTHER = 'OTHER',
}

export enum InquiryStatusEnum {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  REPLIED = 'REPLIED',
  CLOSED = 'CLOSED',
}

// ==================== Entity Types ====================

export interface ContactInquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: ContactSubjectEnum;
  message: string;
  status: InquiryStatusEnum;
  adminNote?: string;
  repliedBy?: string;
  repliedAt?: string;
  repliedByUser?: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ==================== List / Pagination ====================

export interface ContactInquiryList {
  items: ContactInquiry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ContactInquiryStats {
  total: number;
  newCount: number;
  inProgressCount: number;
  repliedCount: number;
  closedCount: number;
}

// ==================== Filter / Input Types ====================

export interface ContactInquiryFilterInput {
  status?: InquiryStatusEnum;
  subject?: ContactSubjectEnum;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface UpdateInquiryStatusInput {
  status: InquiryStatusEnum;
  adminNote?: string;
}
