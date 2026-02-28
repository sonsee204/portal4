/**
 * Authentication-related Vietnamese strings.
 */

export const AUTH = {
  LOGIN: {
    TITLE: 'Đăng nhập',
    SUBTITLE: 'Hệ thống quản trị thể thao',
    BUTTON: 'Đăng nhập',
    LOADING: 'Đang đăng nhập...',
    FAILED: 'Đăng nhập thất bại. Vui lòng thử lại.',
    LABEL_EMAIL_OR_PHONE: 'Email hoặc số điện thoại',
    LABEL_PASSWORD: 'Mật khẩu',
    SHOW_PASSWORD: 'Hiện mật khẩu',
    HIDE_PASSWORD: 'Ẩn mật khẩu',
    REMEMBER_ME: 'Ghi nhớ tôi',
    FORGOT_PASSWORD_LINK: 'Quên mật khẩu?',
    PASSWORD_RESET_SUCCESS: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.',
    INPUT_REQUIRED: 'Vui lòng nhập email/số điện thoại và mật khẩu',
    MISSING_CREDENTIALS: 'Thiếu thông tin xác thực hoặc mật khẩu mới',
  },
  FORGOT_PASSWORD: {
    TITLE: 'Quên mật khẩu',
    SUBTITLE: 'Khôi phục quyền truy cập tài khoản',
    BACK_TO_LOGIN: 'Quay lại đăng nhập',
    BACK: 'Quay lại',

    STEP_PHONE: 'Số điện thoại',
    STEP_OTP: 'Xác thực OTP',
    STEP_PASSWORD: 'Mật khẩu mới',

    PHONE_DESCRIPTION: 'Nhập số điện thoại đã đăng ký để nhận mã xác thực',
    PHONE_LABEL: 'Số điện thoại',
    PHONE_REQUIRED: 'Vui lòng nhập số điện thoại',
    PHONE_CONTINUE: 'Tiếp tục',

    OTP_SENT_TO: 'Mã xác thực đã được gửi đến',
    OTP_LABEL: 'Mã xác thực',
    OTP_VERIFY: 'Xác thực',
    OTP_VERIFYING: 'Đang xác thực...',
    OTP_RESEND_TIMER: (seconds: number) => `Gửi lại sau ${seconds}s`,
    OTP_RESEND: 'Gửi lại mã xác thực',

    NEW_PASSWORD_DESCRIPTION: 'Đặt mật khẩu mới cho tài khoản',
    NEW_PASSWORD_LABEL: 'Mật khẩu mới',
    CONFIRM_PASSWORD_LABEL: 'Xác nhận mật khẩu',
    RESET_BUTTON: 'Đặt lại mật khẩu',

    ERROR_VERIFY_ACCOUNT: 'Không thể xác thực tài khoản',
    ERROR_SEND_OTP: 'Lỗi gửi mã xác thực',
    ERROR_SESSION_EXPIRED: 'Phiên xác thực hết hạn. Vui lòng thử lại.',
    ERROR_INVALID_OTP: 'Mã xác thực không đúng. Vui lòng thử lại.',
    ERROR_RESEND_OTP: 'Không thể gửi lại mã. Vui lòng thử lại.',
    ERROR_RESET_FAILED: 'Đặt lại mật khẩu thất bại',
  },
  BRAND: {
    TAGLINE: 'Nền tảng quản trị thể thao toàn diện',
    FEATURES: [
      { icon: 'trophy-outline', title: 'Quản lý giải đấu', description: 'Tổ chức và điều phối giải đấu chuyên nghiệp' },
      { icon: 'people-outline', title: 'Quản lý người dùng', description: 'Theo dõi và phân quyền hệ thống hiệu quả' },
      { icon: 'analytics-outline', title: 'Phân tích dữ liệu', description: 'Báo cáo và thống kê thời gian thực' },
      { icon: 'shield-checkmark-outline', title: 'Bảo mật cao', description: 'Xác thực đa lớp và mã hóa dữ liệu' },
    ],
  },
  PASSWORD_STRENGTH: {
    WEAK: 'Yếu',
    FAIR: 'Trung bình',
    GOOD: 'Tốt',
    STRONG: 'Mạnh',
    MIN_LENGTH: (min: number) => `Ít nhất ${min} ký tự`,
    HAS_UPPERCASE: 'Có chữ hoa (A-Z)',
    HAS_LOWERCASE: 'Có chữ thường (a-z)',
    HAS_DIGIT: 'Có chữ số (0-9)',
  },
  FOOTER: {
    SYSTEM_ONLINE: 'System Online',
    VERSION: 'Version 2.0.1',
    SSL_SECURED: 'SSL Secured',
  },
  LOGOUT: {
    SUCCESS: 'Đã đăng xuất',
  },
} as const;
