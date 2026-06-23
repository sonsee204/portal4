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

import { TournamentFormat } from '@/graphql/generated';

export const matchTypeOptions = [
  { label: 'Đơn', value: 'single' },
  { label: 'Đôi', value: 'double' },
  { label: 'Đôi nam nữ', value: 'mixed' },
];

export const iconOptions = [
  { label: 'Người', value: 'person-outline' },
  { label: 'Nhóm', value: 'people-outline' },
  { label: 'Trường học', value: 'school-outline' },
  { label: 'Thể lực', value: 'fitness-outline' },
  { label: 'Ngôi sao', value: 'star-outline' },
  { label: 'Cúp', value: 'trophy-outline' },
];

export const bracketSizeOptions = [
  { label: 'Tự động', value: '0' },
  { label: '4', value: '4' },
  { label: '8', value: '8' },
  { label: '16', value: '16' },
  { label: '32', value: '32' },
  { label: '64', value: '64' },
  { label: '128', value: '128' },
];

export const formatOptions = [
  { label: 'Loại trực tiếp', value: TournamentFormat.SingleElimination },
  { label: 'Loại kép', value: TournamentFormat.DoubleElimination },
  { label: 'Vòng tròn', value: TournamentFormat.RoundRobin },
  { label: 'Bảng + Loại trực tiếp', value: TournamentFormat.GroupKnockout },
];

export const accentColors = [
  'from-orange-400/20 to-amber-500/10 border-orange-300/30 dark:border-orange-500/20',
  'from-violet-400/20 to-purple-500/10 border-violet-300/30 dark:border-violet-500/20',
  'from-blue-400/20 to-cyan-500/10 border-blue-300/30 dark:border-blue-500/20',
  'from-emerald-400/20 to-green-500/10 border-emerald-300/30 dark:border-emerald-500/20',
  'from-pink-400/20 to-rose-500/10 border-pink-300/30 dark:border-pink-500/20',
  'from-indigo-400/20 to-blue-500/10 border-indigo-300/30 dark:border-indigo-500/20',
];
