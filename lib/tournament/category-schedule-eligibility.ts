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
