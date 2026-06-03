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
 * OTP test user grant Vietnamese strings.
 */

export const OTP_TEST_USER_GRANTS = {
  SUB_TAB_LABEL: 'Grant login user',
  SECTION_TITLE: 'Grant OTP login cho user đã có',
  SECTION_DESCRIPTION:
    'Cấp mã OTP cố định tạm thời để user đã đăng ký đăng nhập QA mà không cần Zalo. Chỉ SIGN_IN_PHONE, TTL tối đa 7 ngày.',

  BANNER_TITLE: 'Cảnh báo bảo mật',
  BANNER_BODY:
    'Ai biết mã OTP có thể đăng nhập tài khoản user đến khi grant hết hạn hoặc bị revoke. Chỉ dùng cho QA nội bộ. Không chia sẻ mã công khai.',

  CREATE: 'Tạo grant',
  REVOKE: 'Revoke',
  SUBMIT_CREATE: 'Tạo grant',
  SUBMITTING: 'Đang tạo...',
  SUCCESS_CREATE: 'Đã tạo grant OTP login',
  SUCCESS_REVOKE: 'Đã revoke grant',
  CONFIRM_REVOKE: 'Revoke grant OTP login này?',
  COPIED_CODE: 'Đã sao chép mã OTP',

  CODE_REVEAL_TITLE: 'Mã OTP (chỉ hiển thị sau khi tạo)',
  CODE_REVEAL_BODY:
    'Lưu mã này ngay — dùng trên app để đăng nhập. Grant hết hạn theo thời gian đã chọn.',

  EMPTY_TITLE: 'Chưa có grant active',
  EMPTY_DESCRIPTION:
    'Tạo grant cho user đã có tài khoản để QA login bằng mã OTP cố định.',

  COLUMNS: {
    USER: 'User',
    PHONE: 'SĐT',
    REASON: 'Lý do',
    CODE: 'Mã OTP',
    EXPIRES: 'Hết hạn',
    STATUS: 'Trạng thái',
    ACTIONS: '',
  },

  STATUS_ENABLED: 'Active',
  STATUS_DISABLED: 'Revoked',

  FORM: {
    SEARCH_USER: 'Tìm user',
    SEARCH_PLACEHOLDER: 'Tên, email, SĐT...',
    SELECTED_USER: 'User được chọn',
    REASON: 'Lý do / ticket QA',
    REASON_PLACEHOLDER: 'VD: Regression login sprint 12 — staging QA',
    EXPIRES: 'Hết hạn',
    PURPOSE: 'Mục đích',
    PURPOSE_LOCKED: 'Đăng nhập (SIGN_IN_PHONE)',
  },

  USER_PICKER: {
    NO_RESULTS: 'Không tìm thấy user active',
    SELECT: 'Chọn',
    PHONE_MISSING: 'User không có SĐT — không thể tạo grant',
  },
} as const;
