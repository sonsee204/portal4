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

/**
 * Shared Vietnamese strings across all portal features.
 * Centralized for easy maintenance and future i18n support.
 */

export const COMMON = {
  CONFIRM: 'Xác nhận',
  CANCEL: 'Hủy',
  CLOSE: 'Đóng',
  SAVE: 'Lưu',
  DELETE: 'Xóa',
  RETRY: 'Thử lại',
  REFRESH: 'Làm mới',
  LOADING: 'Đang tải...',
  PROCESSING: 'Đang xử lý...',
  NO_DATA: 'Không có dữ liệu',
  SUBMIT: 'Gửi',
  CREATE: 'Tạo',
  SEARCH: 'Tìm kiếm',
  BACK: 'Quay lại',
  ALL: 'Tất cả',
  VIEW_DETAIL: 'Chi tiết',
} as const;

export const ERRORS = {
  GENERIC: 'Đã xảy ra lỗi. Vui lòng thử lại.',
  NETWORK: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
  SERVER_NETWORK: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.',
  SYSTEM: 'Lỗi hệ thống. Vui lòng thử lại sau.',
  PAGE_LOAD: 'Không thể tải trang này. Vui lòng thử lại.',
  UNAUTHORIZED: 'Tài khoản của bạn không có quyền truy cập Portal.',
  GLOBAL_ERROR_TITLE: 'Đã xảy ra lỗi nghiêm trọng',
  GLOBAL_ERROR_MESSAGE: 'Hệ thống gặp sự cố không mong muốn. Vui lòng thử lại.',
  ERROR_TITLE: 'Đã xảy ra lỗi',
  ERROR_CODE_LABEL: 'Mã lỗi:',
  BACK_TO_DASHBOARD: 'Về Dashboard',

  GQL_UNAUTHENTICATED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  GQL_FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  GQL_BAD_INPUT: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  GQL_INTERNAL: 'Lỗi hệ thống. Vui lòng thử lại sau.',
  GQL_NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  GQL_CONFLICT: 'Dữ liệu bị trùng. Vui lòng kiểm tra lại.',
} as const;

export const VALIDATION = {
  REQUIRED: 'Trường này là bắt buộc',
  EMAIL_REQUIRED: 'Email là bắt buộc',
  EMAIL_INVALID: 'Email không hợp lệ',
  PHONE_REQUIRED: 'Số điện thoại là bắt buộc',
  PHONE_INVALID: 'Số điện thoại không hợp lệ (VD: 0987654321 hoặc +84987654321)',
  PASSWORD_MIN: (min: number) => `Mật khẩu phải có ít nhất ${min} ký tự`,
  PASSWORD_UPPERCASE: 'Mật khẩu phải có ít nhất 1 chữ hoa',
  PASSWORD_LOWERCASE: 'Mật khẩu phải có ít nhất 1 chữ thường',
  PASSWORD_DIGIT: 'Mật khẩu phải có ít nhất 1 chữ số',
  FULLNAME_MIN: (min: number) => `Họ tên phải có ít nhất ${min} ký tự`,
  CONFIRM_PASSWORD: 'Vui lòng xác nhận mật khẩu',
  PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
  OTP_LENGTH: (len: number) => `Mã OTP phải có ${len} chữ số`,
  EMAIL_OR_PHONE_REQUIRED: 'Vui lòng nhập email hoặc số điện thoại',
  EMAIL_OR_PHONE_INVALID: 'Email hoặc số điện thoại không hợp lệ',
  FILL_ALL_REQUIRED: 'Vui lòng điền đầy đủ thông tin bắt buộc',
} as const;

export const PAGINATION = {
  PREVIOUS: 'Trang trước',
  NEXT: 'Trang sau',
} as const;

export const TIME = {
  JUST_NOW: 'Vừa xong',
  MINUTES: (n: number) => `${n} phút`,
  HOURS: (n: number) => `${n} giờ`,
  DAYS: (n: number) => `${n} ngày`,
} as const;
