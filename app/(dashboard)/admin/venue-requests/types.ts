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

export type VenueRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export const VENUE_REQUEST_STATUS_LABELS: Record<VenueRequestStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã huỷ',
};

export interface VenueRequestLocation {
  address: string;
  city?: string | null;
  district?: string | null;
  ward?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface VenueRequestCourt {
  name: string;
  sportType: string;
  pricePerHour: number;
  peakPricePerHour: number;
  isIndoor?: boolean | null;
}

export interface VenueRequestUser {
  _id: string;
  displayName?: string | null;
  userName?: string | null;
  photoURL?: string | null;
}

export interface VenueRequestItem {
  _id: string;
  requesterId: string;
  name: string;
  description?: string | null;
  sportTypes: string[];
  status: VenueRequestStatus;
  phoneNumber?: string | null;
  email?: string | null;
  coverImageUrl?: string | null;
  images?: string[] | null;
  rejectionReason?: string | null;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  location: VenueRequestLocation;
  courts: VenueRequestCourt[];
  requester?: VenueRequestUser | null;
  reviewedByAdmin?: { _id: string; displayName?: string | null } | null;
}
