/**
 * User management Vietnamese strings.
 */

export const USERS = {
  CREATE: {
    TITLE: 'Tạo tài khoản mới',
    DESCRIPTION: 'Tạo tài khoản cho nhân viên hoặc đối tác',
    SUCCESS: 'Tạo tài khoản thành công',
    SUBMIT: 'Tạo tài khoản',
    SUBMITTING: 'Đang tạo...',
    LABEL_FULLNAME: 'Họ tên',
    LABEL_EMAIL: 'Email',
    LABEL_PHONE: 'Số điện thoại',
    LABEL_PASSWORD: 'Mật khẩu',
    LABEL_ROLE: 'Vai trò',
  },
  ROLES: {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    FACILITY_OWNER: 'Chủ sân (Facility Owner)',
  },
  PROVISION: {
    TITLE: 'Đăng ký hộ Player',
    DESCRIPTION:
      'Tạo tài khoản người chơi khi họ không thể nhận OTP trên ứng dụng',
    CONFIRM_TITLE: 'Xác nhận tạo tài khoản',
    CONFIRM_DESCRIPTION:
      'Hành động này tạo tài khoản thật trên hệ thống và không thể hoàn tác dễ dàng.',
    SUCCESS: 'Tạo tài khoản Player thành công',
    SUBMIT: 'Tạo tài khoản Player',
    SUBMITTING: 'Đang tạo...',
    CONFIRM: 'Xác nhận tạo',
    LABEL_FULLNAME: 'Họ tên',
    LABEL_EMAIL: 'Email (tuỳ chọn)',
    LABEL_PHONE: 'Số điện thoại',
    LABEL_PASSWORD: 'Mật khẩu',
    LABEL_REFERRAL: 'Mã giới thiệu (tuỳ chọn)',
    AUTO_PASSWORD: 'Tự động tạo mật khẩu',
    CREDENTIALS_TITLE: 'Thông tin đăng nhập',
    CREDENTIALS_HINT:
      'Sao chép thông tin và gửi cho người dùng. Mật khẩu chỉ hiển thị một lần.',
    COPY_CREDENTIALS: 'Sao chép thông tin',
    COPIED: 'Đã sao chép',
    OTP_WARNING:
      'Người dùng cần đăng nhập qua tab Mật khẩu trên app. OTP / Quên mật khẩu có thể chưa khả dụng — liên hệ admin nếu cần.',
    ADMIN_CREATED_BADGE: 'Tạo bởi admin',
  },
  RESET_PASSWORD: {
    TITLE: 'Đặt lại mật khẩu',
    DESCRIPTION: 'Đặt mật khẩu mới cho tài khoản Player',
    CONFIRM: 'Xác nhận đặt lại',
    SUCCESS: 'Đặt lại mật khẩu thành công',
    SUBMITTING: 'Đang xử lý...',
    LABEL_NEW_PASSWORD: 'Mật khẩu mới',
    AUTO_PASSWORD: 'Tự động tạo mật khẩu',
    CREDENTIALS_TITLE: 'Mật khẩu mới',
  },
} as const;
