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

import { CourtStatus, SportType } from '@/graphql/generated';

export const SPORT_TYPE_OPTIONS = [
  { label: 'Cầu lông', value: SportType.Badminton },
  { label: 'Bóng rổ', value: SportType.Basketball },
  { label: 'Bi-a', value: SportType.Billiards },
  { label: 'Bóng đá', value: SportType.Football },
  { label: 'Pickleball', value: SportType.Pickleball },
  { label: 'Bóng bàn', value: SportType.TableTennis },
  { label: 'Tennis', value: SportType.Tennis },
  { label: 'Bóng chuyền', value: SportType.Volleyball },
];

export const COURT_STATUS_OPTIONS = [
  { label: 'Hoạt động', value: CourtStatus.Active },
  { label: 'Ngừng', value: CourtStatus.Inactive },
  { label: 'Bảo trì', value: CourtStatus.Maintenance },
];

export const SPORT_TYPE_LABEL: Record<SportType, string> = {
  [SportType.Badminton]: 'Cầu lông',
  [SportType.Basketball]: 'Bóng rổ',
  [SportType.Billiards]: 'Bi-a',
  [SportType.Football]: 'Bóng đá',
  [SportType.Pickleball]: 'Pickleball',
  [SportType.TableTennis]: 'Bóng bàn',
  [SportType.Tennis]: 'Tennis',
  [SportType.Volleyball]: 'Bóng chuyền',
};

export const COURT_STATUS_LABEL: Record<CourtStatus, string> = {
  [CourtStatus.Active]: 'Hoạt động',
  [CourtStatus.Inactive]: 'Ngừng',
  [CourtStatus.Maintenance]: 'Bảo trì',
};

export const COURT_STATUS_VARIANT: Record<
  CourtStatus,
  'success' | 'neutral' | 'warning'
> = {
  [CourtStatus.Active]: 'success',
  [CourtStatus.Inactive]: 'neutral',
  [CourtStatus.Maintenance]: 'warning',
};
