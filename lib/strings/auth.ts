/**
 * Authentication-related Vietnamese strings.
 */

export const AUTH = {
  LOGIN: {
    TITLE: 'Đăng nhập',
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
    BACK_TO_LOGIN: 'Quay lại đăng nhập',
    BACK: 'Quay lại',

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
  LOGOUT: {
    SUCCESS: 'Đã đăng xuất',
  },
} as const;
