/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { formatConnectionRange } from '@/components/molecules/ConnectionPager/connection-pager.utils';

export function getInfiniteScrollStatusMessage(
  loadedCount: number,
  totalCount?: number | null,
  hasNextPage?: boolean,
): string {
  if (loadedCount <= 0) return '';
  if (hasNextPage) {
    return formatConnectionRange(loadedCount, totalCount);
  }
  if (totalCount != null && totalCount > 0) {
    return `Đã hiển thị tất cả (${totalCount} mục)`;
  }
  return `Đã hiển thị tất cả (${loadedCount} mục)`;
}

export function shouldShowInfiniteScrollFooter(
  loadedCount: number,
  hasNextPage: boolean,
  loading?: boolean,
  loadingMore?: boolean,
): boolean {
  return loadedCount > 0 || Boolean(hasNextPage) || Boolean(loading) || Boolean(loadingMore);
}
