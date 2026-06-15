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

export const TOURNAMENT = {
  SUCCESS_CREATE: 'Tạo giải đấu thành công.',
  SUCCESS_UPDATE: 'Cập nhật giải đấu thành công.',
  SUCCESS_UPDATE_COURTS: 'Cập nhật sân thi đấu thành công.',
  COURTS_ONLY_MODE_BANNER_OPEN:
    'Giải đang nhận đăng ký — chỉ có thể chỉnh sửa sân thi đấu.',
  COURTS_ONLY_MODE_BANNER_CLOSED:
    'Giải đã đóng đăng ký — chỉ có thể chỉnh sửa sân thi đấu.',
  SAVE_COURTS_BUTTON: 'Lưu sân thi đấu',
  EDIT_BLOCKED_IN_PROGRESS:
    'Không thể chỉnh sửa giải đấu khi đang diễn ra hoặc đã kết thúc.',
  LABEL_MANAGE_COURTS: 'Quản lý sân',
  LABEL_ADD_COURTS_LINK: 'Thêm sân',
  SUCCESS_PUBLISH: 'Đăng giải đấu thành công.',
  SUCCESS_OPEN_REG: 'Mở đăng ký thành công.',
  SUCCESS_CLOSE_REG: 'Đóng đăng ký thành công.',
  SUCCESS_START: 'Bắt đầu giải đấu thành công.',
  SUCCESS_COMPLETE: 'Kết thúc giải đấu thành công.',
  SUCCESS_CANCEL: 'Huỷ giải đấu thành công.',
  SUCCESS_DELETE: 'Xoá giải đấu thành công.',
  SUCCESS_DUPLICATE: 'Nhân bản giải đấu thành công.',

  SUCCESS_CREATE_CATEGORY: 'Tạo nội dung thi đấu thành công.',
  SUCCESS_UPDATE_CATEGORY: 'Cập nhật nội dung thi đấu thành công.',
  SUCCESS_DELETE_CATEGORY: 'Xoá nội dung thi đấu thành công.',

  SUCCESS_APPROVE: 'Duyệt đăng ký thành công.',
  SUCCESS_REJECT: 'Từ chối đăng ký thành công.',
  SUCCESS_BULK_APPROVE: 'Duyệt hàng loạt thành công.',
  SUCCESS_BULK_REJECT: 'Từ chối hàng loạt thành công.',
  SUCCESS_PAYMENT_UPDATE: 'Cập nhật thanh toán thành công.',
  SUCCESS_DELETE_REGISTRATION: 'Xoá đăng ký thành công.',

  SUCCESS_GENERATE_BRACKET: 'Tạo nhánh đấu thành công.',
  SUCCESS_RESET_BRACKET: 'Xoá nhánh đấu thành công.',
  SUCCESS_SEED_PLAYERS: 'Xếp hạt giống thành công.',

  SUCCESS_SCHEDULE: 'Lên lịch trận đấu thành công.',
  SUCCESS_BULK_SCHEDULE: 'Lên lịch hàng loạt thành công.',
  SUCCESS_UNSCHEDULE: 'Huỷ lịch trận đấu thành công.',
  SUCCESS_ASSIGN_REFEREE: 'Phân công trọng tài thành công.',
  SUCCESS_UPDATE_RESULT: 'Cập nhật kết quả thành công.',

  STATUS_DRAFT: 'Bản nháp',
  STATUS_PUBLISHED: 'Đã đăng',
  STATUS_REGISTRATION_OPEN: 'Đang nhận đăng ký',
  STATUS_REGISTRATION_CLOSED: 'Hết hạn đăng ký',
  STATUS_IN_PROGRESS: 'Đang diễn ra',
  STATUS_COMPLETED: 'Đã kết thúc',
  STATUS_CANCELLED: 'Đã huỷ',

  FORMAT_SINGLE_ELIMINATION: 'Loại trực tiếp',
  FORMAT_DOUBLE_ELIMINATION: 'Loại trực tiếp kép',
  FORMAT_ROUND_ROBIN: 'Vòng tròn',
  FORMAT_GROUP_KNOCKOUT: 'Bảng đấu + Loại trực tiếp',

  MATCH_STATUS_NOT_STARTED: 'Chưa bắt đầu',
  MATCH_STATUS_LIVE: 'Đang diễn ra',
  MATCH_STATUS_FINISHED: 'Đã kết thúc',
  MATCH_STATUS_WALKOVER: 'Xử thua',
  MATCH_STATUS_BYE: 'Bye',
  MATCH_STATUS_CANCELLED: 'Đã huỷ',

  REG_STATUS_PENDING: 'Chờ duyệt',
  REG_STATUS_APPROVED: 'Đã duyệt',
  REG_STATUS_REJECTED: 'Bị từ chối',
  REG_STATUS_WAITLISTED: 'Danh sách chờ',

  PAYMENT_UNPAID: 'Chưa thanh toán',
  PAYMENT_VERIFYING: 'Đang xác minh',
  PAYMENT_PAID: 'Đã thanh toán',
  PAYMENT_REFUNDED: 'Đã hoàn tiền',

  GENDER_OPEN: 'Mở',
  GENDER_MALE: 'Nam',
  GENDER_FEMALE: 'Nữ',
  GENDER_MIXED: 'Hỗn hợp',

  MATCH_TYPE_SINGLES: 'Đơn',
  MATCH_TYPE_DOUBLES: 'Đôi',
  MATCH_TYPE_TEAM: 'Đồng đội',

  LABEL_TOURNAMENTS: 'Giải đấu',
  LABEL_CATEGORIES: 'Nội dung thi đấu',
  LABEL_REGISTRATIONS: 'Đăng ký',
  LABEL_BRACKET: 'Nhánh đấu',
  LABEL_SCHEDULE: 'Lịch thi đấu',
  LABEL_SCORING: 'Chấm điểm',
  LABEL_DRAW: 'Bốc thăm / Xếp hạt giống',
  LABEL_PRINT_DOCUMENTS: 'In tài liệu',
  LABEL_MASTER_SCHEDULE: 'Lịch thi đấu tổng hợp',
  LABEL_BRACKET_SHEET: 'Sơ đồ thi đấu',
  PRINT_UNSCHEDULED_WARNING: (n: number) =>
    `Còn ${n} trận chưa xếp lịch — lịch in có thể chưa đầy đủ.`,
  PRINT_UNDRAWN_CATEGORY:
    'Nội dung này chưa bốc thăm hoặc chưa sẵn sàng để in sơ đồ.',
  EXPORT_SCHEDULE_FILENAME: (slug: string, date: string) =>
    `${slug}-lich-thi-dau-${date}.xlsx`,

  EMPTY_TOURNAMENTS: 'Chưa có giải đấu nào.',
  EMPTY_CATEGORIES: 'Chưa có nội dung thi đấu nào.',
  EMPTY_REGISTRATIONS: 'Chưa có đăng ký nào.',
  EMPTY_MATCHES: 'Chưa có trận đấu nào.',

  CONFIRM_DELETE_CATEGORY: 'Bạn có chắc muốn xoá nội dung thi đấu này?',
  CONFIRM_RESET_BRACKET: 'Bạn có chắc muốn xoá nhánh đấu? Thao tác này không thể hoàn tác.',
  CONFIRM_PUBLISH: 'Bạn có chắc muốn đăng giải đấu? Giải đấu sẽ hiển thị công khai.',
  CONFIRM_OPEN_REGISTRATION: 'Bạn có chắc muốn mở đăng ký? Người chơi có thể đăng ký tham gia.',
  CONFIRM_CLOSE_REGISTRATION: 'Bạn có chắc muốn đóng đăng ký? Người chơi sẽ không thể đăng ký thêm.',
  CONFIRM_START_TOURNAMENT: 'Bạn có chắc muốn bắt đầu giải đấu? Thao tác này không thể hoàn tác.',
  CONFIRM_COMPLETE_TOURNAMENT: 'Bạn có chắc muốn kết thúc giải đấu? Thao tác này không thể hoàn tác.',
  CONFIRM_CANCEL_TOURNAMENT: 'Bạn có chắc muốn huỷ giải đấu? Thao tác này không thể hoàn tác.',
  CONFIRM_DELETE_TOURNAMENT: 'Bạn có chắc muốn xoá giải đấu này? Toàn bộ dữ liệu liên quan sẽ bị xoá vĩnh viễn và không thể khôi phục.',
  CONFIRM_DUPLICATE_TOURNAMENT:
    'Nhân bản giải đấu này? Một bản sao mới sẽ được tạo ở trạng thái Bản nháp. Bạn có thể chỉnh sửa thông tin trước khi đăng.',

  IMPORT_TITLE: 'Import VĐV từ file',
  IMPORT_STEP_UPLOAD: 'Tải file lên',
  IMPORT_STEP_PREVIEW: 'Xem trước & kiểm tra',
  IMPORT_STEP_RESULT: 'Kết quả',
  IMPORT_DROP_HINT: 'Kéo thả file vào đây hoặc nhấn để chọn',
  IMPORT_ACCEPT_FORMATS: 'Hỗ trợ: .xlsx, .xls, .csv',
  IMPORT_DOWNLOAD_TEMPLATE: 'Tải file mẫu',
  IMPORT_PARSE_ERROR: 'Không thể đọc file. Vui lòng kiểm tra định dạng.',
  IMPORT_SUCCESS: (n: number) => `Nhập thành công ${n} VĐV`,
  IMPORT_PARTIAL: (ok: number, fail: number) =>
    `Thành công ${ok} VĐV • Thất bại ${fail} dòng`,
  IMPORT_CONFIRM: (n: number) => `Xác nhận import ${n} VĐV`,
  IMPORT_DISABLED_REASON:
    'Không thể import VĐV khi đã đóng đăng ký hoặc đã bốc thăm',

  LATE_ENTRY_BUTTON: 'Thêm muộn (Super Admin)',
  LATE_ENTRY_TITLE: 'Thêm VĐV muộn vào slot BYE',
  LATE_ENTRY_STEP_CATEGORY: 'Chọn nội dung',
  LATE_ENTRY_STEP_FORM: 'Nhập thông tin',
  LATE_ENTRY_STEP_CONFIRM: 'Xác nhận',
  LATE_ENTRY_STEP_RESULT: 'Kết quả',
  LATE_ENTRY_SELECT_CATEGORY: 'Chọn hạng mục',
  LATE_ENTRY_NO_ELIGIBLE_CATEGORY:
    'Không có hạng mục loại trực tiếp đã bốc thăm phù hợp.',
  LATE_ENTRY_PREVIEW_COUNT: (n: number) =>
    `${n} trận BYE vòng 1 có thể lấp`,
  LATE_ENTRY_PREVIEW_OPPONENTS: 'Đối thủ tiềm năng',
  LATE_ENTRY_RANDOM_WARNING_LABEL: 'Lưu ý',
  LATE_ENTRY_RANDOM_TITLE: 'Phân bổ ngẫu nhiên',
  LATE_ENTRY_RANDOM_HINT: (n: number) =>
    `Hệ thống sẽ chọn ngẫu nhiên 1 trong ${n} trận BYE vòng 1.`,
  LATE_ENTRY_CONFIRM_SUMMARY: 'Thông tin thêm muộn',
  LATE_ENTRY_REASON_LABEL: 'Lý do thêm muộn',
  LATE_ENTRY_REASON_PLACEHOLDER: 'VD: Cặp đôi đăng ký trễ sau khi bốc thăm...',
  LATE_ENTRY_REASON_MIN: 'Lý do phải có ít nhất 5 ký tự',
  LATE_ENTRY_CONFIRM_TITLE: 'Xác nhận thêm muộn',
  LATE_ENTRY_CONFIRM_DESC: (category: string, n: number) =>
    `Thêm VĐV vào hạng mục "${category}". Hệ thống chọn ngẫu nhiên 1/${n} trận BYE vòng 1.`,
  LATE_ENTRY_SUCCESS: (opponent: string) =>
    `Đã lấp slot BYE — đối thủ: ${opponent}`,
  LATE_ENTRY_RESULT_FILLED: 'Đã lấp slot BYE thành công',
  LATE_ENTRY_RESULT_MATCH: (num: number, opponent: string) =>
    `Trận #${num} — đối thủ: ${opponent}`,
  LATE_ENTRY_RESULT_NO_SLOT: 'Không có slot BYE khả dụng',
  LATE_ENTRY_RESULT_BLOCKED: 'Không thể thêm muộn',
  LATE_ENTRY_SCHEDULE_NOTE:
    'Trận mới chưa có lịch — vui lòng cập nhật lịch thi đấu.',
  LATE_ENTRY_DISABLED_TOOLTIP: 'Không thể thêm muộn cho hạng mục này',
  LATE_ENTRY_MEMBER: (i: number) => `Thành viên ${i}`,
  LATE_ENTRY_TEAM_LABEL: 'Tên đội',

  EXPORT_BUTTON: 'Xuất Excel',
  EXPORT_FILENAME: (name: string, date: string) =>
    `${name}-dang-ky-${date}.xlsx`,
} as const;
