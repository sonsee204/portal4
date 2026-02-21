/**
 * Support/Contact inquiry Vietnamese strings.
 */

export const SUPPORT = {
  PAGE: {
    TITLE: 'Hỗ trợ khách hàng',
    DESCRIPTION: 'Quản lý yêu cầu liên hệ từ khách hàng.',
    SEARCH_PLACEHOLDER: 'Tìm theo tên, email, SĐT...',
    EMPTY: 'Không có yêu cầu liên hệ nào',
    SELECT_PROMPT: 'Chọn một yêu cầu để xem chi tiết.',
  },
  STATUS: {
    NEW: 'Mới',
    IN_PROGRESS: 'Đang xử lý',
    REPLIED: 'Đã trả lời',
    CLOSED: 'Đã đóng',
  },
  SUBJECT: {
    COOPERATION: 'Hợp tác',
    SUPPORT: 'Hỗ trợ',
    RECRUITMENT: 'Tuyển dụng',
    OTHER: 'Khác',
  },
  DETAIL: {
    MESSAGE_LABEL: 'Nội dung tin nhắn',
    REPLIED_BY: 'Đã trả lời bởi',
    ADMIN_NOTE_LABEL: 'Ghi chú nội bộ',
    ADMIN_NOTE_PLACEHOLDER: 'Thêm ghi chú cho admin...',
    SAVE_NOTE: 'Lưu ghi chú',
    NOTE_SAVED: 'Đã lưu ghi chú',
    UPDATE_STATUS_LABEL: 'Cập nhật trạng thái:',
    STATUS_UPDATED: (label: string) => `Đã cập nhật trạng thái thành "${label}"`,
  },
} as const;
