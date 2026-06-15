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

export const PAGE_SIZE = 20;

export type ReportTab = 'posts' | 'users' | 'messages';

export const REPORT_TABS: { id: ReportTab; label: string }[] = [
  { id: 'posts', label: 'Báo cáo bài viết' },
  { id: 'users', label: 'Báo cáo người dùng' },
  { id: 'messages', label: 'Báo cáo tin nhắn' },
];

export const POST_FILTER_CHIPS = [
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đang xem xét', value: 'REVIEWED' },
  { label: 'Đã xử lý', value: 'RESOLVED' },
  { label: 'Bỏ qua', value: 'DISMISSED' },
  { label: 'Tất cả', value: 'ALL' },
];

export const USER_FILTER_CHIPS = [
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đang xem xét', value: 'REVIEWED' },
  { label: 'Đã xử lý', value: 'RESOLVED' },
  { label: 'Bỏ qua', value: 'DISMISSED' },
  { label: 'Tất cả', value: 'ALL' },
];

export const MESSAGE_FILTER_CHIPS = [
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đang xem xét', value: 'REVIEWED' },
  { label: 'Đã xử lý', value: 'RESOLVED' },
  { label: 'Bỏ qua', value: 'DISMISSED' },
  { label: 'Tất cả', value: 'ALL' },
];
