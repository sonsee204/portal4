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
 * OTP test phone registry Vietnamese strings.
 */

export const OTP_TEST_PHONES = {
  TAB_LABEL: 'OTP test',
  SECTION_TITLE: 'SĐT test OTP',
  SECTION_DESCRIPTION:
    'Quản lý số điện thoại test với mã OTP cố định (Firebase-style). Chỉ SUPER_ADMIN.',

  BANNER_TITLE: 'Lưu ý vận hành',
  BANNER_BODY:
    'SĐT test dùng mã cố định, không gửi Zalo thật. Nếu QA test nhánh Firebase fallback, thêm cùng SĐT + mã trên Firebase Console → Authentication → Phone → Test numbers.',
  KILL_SWITCH_NOTICE:
    'Registry SĐT test đang bị tắt trên backend (FEATURE_OTP_TEST_PHONES_ENABLED=false).',

  CREATE: 'Thêm SĐT test',
  EDIT: 'Sửa',
  TOGGLE_HIDE: 'Đóng',
  SUBMIT_CREATE: 'Thêm',
  SUBMIT_UPDATE: 'Lưu',
  SUBMITTING: 'Đang lưu...',
  SUCCESS_CREATE: 'Đã thêm SĐT test',
  SUCCESS_UPDATE: 'Đã cập nhật SĐT test',
  SUCCESS_TOGGLE: 'Đã cập nhật trạng thái',
  COPIED_FIREBASE: 'Đã sao chép định dạng Firebase',
  CONFIRM_DISABLE: 'Vô hiệu hóa SĐT test này?',
  CONFIRM_ENABLE: 'Kích hoạt lại SĐT test này?',

  EMPTY_TITLE: 'Chưa có SĐT test',
  EMPTY_DESCRIPTION: 'Thêm SĐT test để QA dùng mã OTP cố định trên production.',

  COLUMNS: {
    PHONE: 'Số điện thoại',
    LABEL: 'Nhãn',
    CODE: 'Mã OTP',
    PURPOSES: 'Mục đích',
    STATUS: 'Trạng thái',
    EXPIRES: 'Hết hạn',
    ACTIONS: '',
  },

  STATUS_ENABLED: 'Bật',
  STATUS_DISABLED: 'Tắt',
  ALL_PURPOSES: 'Tất cả',
  NO_EXPIRY: 'Không',

  ACTION_EDIT: 'Sửa',
  ACTION_COPY_FIREBASE: 'Copy Firebase format',
  ACTION_DISABLE: 'Vô hiệu hóa',
  ACTION_ENABLE: 'Kích hoạt',

  FORM: {
    PHONE: 'Số điện thoại',
    PHONE_PLACEHOLDER: 'VD: 0901234567 hoặc +84901234567',
    PHONE_READONLY: 'Không thể đổi SĐT sau khi tạo',
    CODE: 'Mã OTP (6 số)',
    CODE_PLACEHOLDER: '123456',
    LABEL: 'Nhãn / mô tả QA',
    LABEL_PLACEHOLDER: 'VD: QA staging sign-in',
    PURPOSES: 'Mục đích (để trống = tất cả)',
    EXPIRES: 'Hết hạn (tùy chọn)',
  },
} as const;
