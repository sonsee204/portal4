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

import { CategoryStatus } from '@/graphql/generated';

/**
 * Nội dung ở các trạng thái này chưa có bảng đấu hoàn chỉnh để xếp lịch tự động có nghĩa.
 * (Vẫn cho phép xếp tay nếu BTC cần giữ chỗ — UI sẽ cảnh báo.)
 */
export function categoryNeedsDrawBeforeSchedule(
  status: CategoryStatus | undefined | null
): boolean {
  if (status == null) return false;
  return (
    status === CategoryStatus.Pending ||
    status === CategoryStatus.RegistrationOpen ||
    status === CategoryStatus.DrawPending
  );
}
