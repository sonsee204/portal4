export const BOOKING_STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'danger' | 'info' | 'neutral'
> = {
  CONFIRMED: 'info',
  COMPLETED: 'success',
  PENDING: 'warning',
  HOLD: 'warning',
  CANCELLED: 'danger',
  NO_SHOW: 'danger',
};

export const BOOKING_STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  PENDING: 'Chờ xử lý',
  HOLD: 'Giữ chỗ',
  CANCELLED: 'Đã hủy',
  NO_SHOW: 'Vắng mặt',
};
