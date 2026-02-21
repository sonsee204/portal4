/**
 * Growth & Referral Vietnamese strings.
 */

export const GROWTH = {
  REFERRAL: {
    SECTION_TITLE: 'Quản lý mã giới thiệu',
    CREATE_TITLE: 'Tạo mã giới thiệu mới',
    TOGGLE_SHOW: 'Tạo mã mới',
    TOGGLE_HIDE: 'Đóng',
    SUBMIT: 'Tạo mã',
    SUBMITTING: 'Đang tạo...',
    SUCCESS_CREATE: 'Tạo mã giới thiệu thành công',
    SUCCESS_TOGGLE: 'Cập nhật trạng thái thành công',
    COPIED_CODE: (code: string) => `Đã sao chép mã: ${code}`,
    COPIED_LINK: 'Đã sao chép link giới thiệu',
    EMPTY_TITLE: 'Chưa có mã giới thiệu nào',
    EMPTY_DESCRIPTION: 'Tạo mã giới thiệu đầu tiên để bắt đầu theo dõi đối tác',
    TOTAL_CODES: (count: number) => `Tổng cộng ${count} mã giới thiệu`,

    COLUMNS: {
      CODE: 'Mã giới thiệu',
      OWNER: 'Chủ sở hữu',
      STATUS: 'Trạng thái',
      USAGE: 'Sử dụng',
      SIGNUPS: 'Đăng ký',
      REVENUE: 'Doanh thu',
    },
    STATUS_ACTIVE: 'Hoạt động',
    STATUS_INACTIVE: 'Tắt',
    ACTION_COPY_CODE: 'Sao chép mã',
    ACTION_COPY_LINK: 'Sao chép link',
    ACTION_DEACTIVATE: 'Vô hiệu hóa',
    ACTION_ACTIVATE: 'Kích hoạt',

    FORM: {
      CODE: 'Mã giới thiệu',
      CODE_PLACEHOLDER: 'VD: CEOVIP',
      OWNER_ID: 'ID chủ sở hữu',
      OWNER_ID_PLACEHOLDER: 'ObjectId của user',
      OWNER_NAME: 'Tên chủ sở hữu',
      OWNER_NAME_PLACEHOLDER: 'Nguyen Van A',
      ROLE: 'Vai trò',
      ROLE_PLACEHOLDER: 'VD: Đối tác, CEO',
      MAX_USES: 'Giới hạn sử dụng',
      MAX_USES_PLACEHOLDER: 'Không giới hạn',
    },
  },
} as const;
