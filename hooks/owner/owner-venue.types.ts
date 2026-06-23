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

import type {
  MyVenuesConnectionQuery,
  SportType,
  CourtStatus,
  VenueBookingsConnectionQuery,
} from '@/graphql/generated';

export type MyVenueNode = NonNullable<
  NonNullable<
    MyVenuesConnectionQuery['myVenuesConnection']
  >['edges'][number]['node']
>;

export type VenueBookingNode = NonNullable<
  NonNullable<
    VenueBookingsConnectionQuery['venueBookingsConnection']
  >['edges'][number]['node']
>;

export type VenueDetailNode = {
  __typename?: 'Venue';
  _id: string;
  name: string;
  description?: string | null;
  status: string;
  phoneNumber?: string | null;
  email?: string | null;
  courtCount: number;
  coverImageUrl?: string | null;
  images?: string[] | null;
  isOwner: boolean;
  isStaff: boolean;
  myPermissions: string[];
  recurringBookingEnabled: boolean;
  slotDurationMinutes: number;
  marginThresholds?: {
    warningMargin: number;
    dangerMargin: number;
  } | null;
  operatingHours?: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
    is24Hours?: boolean | null;
  }>;
  location: {
    __typename?: 'VenueLocation';
    address: string;
    city?: string | null;
    district?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
};

export type VenueCourtNode = {
  __typename?: 'Court';
  _id: string;
  name: string;
  sportType: SportType;
  status: CourtStatus;
  defaultPricePerHour: number;
  peakPricePerHour: number;
  displayOrder?: number | null;
};

export type LowStockProductNode = {
  __typename?: 'Product';
  _id: string;
  name: string;
  stockQuantity: number;
  lowStockThreshold: number;
};

export type BookingStatsResult = {
  __typename?: 'BookingStats';
  totalBookings: number;
  pendingBookings?: number;
  confirmedBookings: number;
  cancelledBookings: number;
  todayBookings: number;
};
