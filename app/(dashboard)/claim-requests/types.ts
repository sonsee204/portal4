export type ClaimRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export const CLAIM_REQUEST_STATUS_LABELS: Record<ClaimRequestStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã huỷ',
  EXPIRED: 'Hết hạn',
};

export interface ClaimRequestUser {
  _id: string;
  displayName?: string | null;
  userName?: string | null;
  photoURL?: string | null;
}

export interface ClaimRequestItem {
  _id: string;
  venueId: string;
  userId: string;
  venueName: string;
  venueAddress?: string | null;
  phoneNumber: string;
  email?: string | null;
  notes?: string | null;
  proofDocuments?: string[] | null;
  status: ClaimRequestStatus;
  rejectionReason?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string | null;
  reviewedById?: string | null;
  user?: ClaimRequestUser | null;
  venue?: { _id: string; name: string } | null;
  reviewer?: { _id: string; displayName?: string | null } | null;
}
