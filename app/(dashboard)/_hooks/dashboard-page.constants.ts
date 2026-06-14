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

export const RECENT_LOGS_LIMIT = 5;

export const TOURNAMENTS_PLACEHOLDER = [
  {
    _id: 't1',
    name: 'Cyber League Winter',
    category: 'Esports • FPS',
    status: 'live',
    participants: 1204,
    maxParticipants: 2000,
  },
  {
    _id: 't2',
    name: 'Global Soccer Qualifier',
    category: 'Sports • Sim',
    status: 'registration',
    participants: 854,
    maxParticipants: 1000,
  },
  {
    _id: 't3',
    name: 'Badminton Pro Open',
    category: 'Badminton',
    status: 'upcoming',
    participants: 32,
    maxParticipants: 64,
  },
  {
    _id: 't4',
    name: 'Pickleball City Cup',
    category: 'Pickleball',
    status: 'completed',
    participants: 16,
    maxParticipants: 16,
  },
] as const;

export const PERIOD_TABS = [
  { label: 'Hàng ngày', value: 'daily' },
  { label: 'Hàng tuần', value: 'weekly' },
  { label: 'Hàng tháng', value: 'monthly' },
] as const;

export const TOURNAMENT_STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'info' | 'danger'
> = {
  live: 'success',
  registration: 'info',
  completed: 'danger',
  upcoming: 'warning',
};

export const REVENUE_CHART_HEIGHTS = [65, 40, 80, 55, 90, 70, 50] as const;

export const REVENUE_CHART_LABELS = [
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'CN',
] as const;

export const SYSTEM_STATUS_METRICS = [
  { label: 'CPU Usage', value: 45, variant: 'primary' as const },
  { label: 'RAM Usage', value: 68, variant: 'warning' as const },
  { label: 'SSD Storage', value: 32, variant: 'success' as const },
] as const;
