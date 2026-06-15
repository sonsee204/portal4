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

export function formatConnectionRange(
  loadedCount: number,
  totalCount?: number | null,
): string {
  if (loadedCount <= 0) return 'Không có mục nào';
  if (totalCount == null || totalCount <= 0) {
    return `Đã tải ${loadedCount} mục`;
  }
  return `Hiển thị 1–${Math.min(loadedCount, totalCount)} / ${totalCount}`;
}
