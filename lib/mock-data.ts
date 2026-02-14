/**
 * Mock data for all portal pages.
 * Each page imports what it needs — single source of truth.
 */

import type {
  PortalUser, Transaction, Tournament, BracketMatch,
  SportModule, Booking, CalendarBooking, Report,
  SupportTicket, ChatMessage, MatchmakingLog, Banner,
  AuditLog, Permission, ApiKey, Notification,
} from '@/types/portal';

/* ------------------------------------------------------------------ */
/* Users (code1, code3)                                                */
/* ------------------------------------------------------------------ */

export const mockUsers: PortalUser[] = [
  { _id: 'u1', name: 'Alex Morgan', email: 'alex.m@hitritech.com', role: 'admin', status: 'active', lastLogin: 'Vừa xong', online: true },
  { _id: 'u2', name: 'Sarah Connor', email: 's.connor@partner.net', role: 'partner', status: 'active', lastLogin: '2 giờ trước', online: true },
  { _id: 'u3', name: 'Michael Chen', email: 'mike.c@hitritech.com', role: 'user', status: 'inactive', lastLogin: '5 ngày trước', online: false },
  { _id: 'u4', name: 'John Doe', email: 'j.doe@example.com', role: 'user', status: 'banned', lastLogin: '1 tháng trước', online: false },
  { _id: 'u5', name: 'Emily Davis', email: 'emily.d@analytics.io', role: 'partner', status: 'pending', lastLogin: 'Chưa đăng nhập', online: false },
  { _id: 'u6', name: 'Nguyen Van A', email: 'nguyen.a@hitri.vn', role: 'user', status: 'active', lastLogin: '1 giờ trước', online: true },
  { _id: 'u7', name: 'Tran Thi B', email: 'tran.b@hitri.vn', role: 'coach', status: 'active', lastLogin: '3 giờ trước', online: false },
  { _id: 'u8', name: 'Le Van C', email: 'le.c@hitri.vn', role: 'moderator', status: 'active', lastLogin: '30 phút trước', online: true },
];

/* ------------------------------------------------------------------ */
/* Transactions (code6)                                                */
/* ------------------------------------------------------------------ */

export const mockTransactions: Transaction[] = [
  { _id: 'TRX-9982', userId: 'u6', userName: 'Nguyễn Văn A', memberType: 'Premium Member', amount: 500000, type: 'deposit', status: 'success', date: '20 Th10, 2023', time: '14:30 PM' },
  { _id: 'TRX-9981', userId: 'u7', userName: 'Trần Thị B', memberType: 'Free Member', amount: -1200000, type: 'withdrawal', status: 'pending', date: '20 Th10, 2023', time: '10:15 AM' },
  { _id: 'TRX-9980', userId: 'u8', userName: 'Lê Văn C', memberType: 'Coach', amount: 2000000, type: 'deposit', status: 'failed', date: '19 Th10, 2023', time: '18:45 PM' },
  { _id: 'TRX-9979', userId: 'u6', userName: 'Hoàng Văn D', memberType: 'Premium Member', amount: 150000, type: 'deposit', status: 'success', date: '19 Th10, 2023', time: '09:10 AM' },
  { _id: 'TRX-9978', userId: 'u7', userName: 'Phạm Văn E', memberType: 'Guest', amount: 250000, type: 'deposit', status: 'success', date: '18 Th10, 2023', time: '11:00 AM' },
];

/* ------------------------------------------------------------------ */
/* Tournaments (code5, code15)                                         */
/* ------------------------------------------------------------------ */

export const mockTournaments: Tournament[] = [
  { _id: 't1', name: 'Cyber League Winter', sport: 'football', category: 'Esports • FPS', status: 'live', participants: 1204, maxParticipants: 2000, prizePool: '$50,000' },
  { _id: 't2', name: 'Global Soccer Qualifier', sport: 'football', category: 'Sports • Sim', status: 'registration', participants: 854, maxParticipants: 1000, prizePool: '$25,000' },
  { _id: 't3', name: 'Badminton Pro Open', sport: 'badminton', category: 'Badminton', status: 'upcoming', participants: 32, maxParticipants: 64, prizePool: '10,000,000 ₫' },
  { _id: 't4', name: 'Pickleball City Cup', sport: 'pickleball', category: 'Pickleball', status: 'completed', participants: 16, maxParticipants: 16, prizePool: '5,000,000 ₫' },
];

export const mockBracketMatches: BracketMatch[][] = [
  // Round of 16
  [
    {
      _id: 'm1', matchNumber: 12, status: 'live', players: [
        { name: 'D. Medvedev', avatar: 'https://i.pravatar.cc/48?u=medvedev', score: 1 },
        { name: 'C. Alcaraz', avatar: 'https://i.pravatar.cc/48?u=alcaraz', score: 2, winner: true },
      ]
    },
    {
      _id: 'm2', matchNumber: 13, status: 'finished', players: [
        { name: 'S. Tsitsipas', avatar: 'https://i.pravatar.cc/48?u=tsitsipas', score: 0 },
        { name: 'N. Djokovic', avatar: 'https://i.pravatar.cc/48?u=djokovic', score: 3, winner: true },
      ]
    },
    {
      _id: 'm3', matchNumber: 14, status: 'scheduled', players: [
        { name: 'TBD' },
        { name: 'J. Sinner', avatar: 'https://i.pravatar.cc/48?u=sinner' },
      ], time: 'Scheduled'
    },
    {
      _id: 'm4', matchNumber: 15, status: 'finished', players: [
        { name: 'A. Zverev', avatar: 'https://i.pravatar.cc/48?u=zverev', score: 2, winner: true },
        { name: 'H. Rune', avatar: 'https://i.pravatar.cc/48?u=rune', score: 1 },
      ]
    },
  ],
  // Quarter-finals
  [
    {
      _id: 'm5', matchNumber: 24, status: 'scheduled', players: [
        { name: 'C. Alcaraz', avatar: 'https://i.pravatar.cc/48?u=alcaraz' },
        { name: 'N. Djokovic', avatar: 'https://i.pravatar.cc/48?u=djokovic' },
      ], time: 'TODAY 18:00'
    },
    {
      _id: 'm6', matchNumber: 25, status: 'upcoming', players: [
        { name: 'TBD' },
        { name: 'A. Zverev', avatar: 'https://i.pravatar.cc/48?u=zverev' },
      ]
    },
  ],
  // Semi-finals
  [{
    _id: 'm7', matchNumber: 30, status: 'upcoming', players: [
      { name: 'Winner QF1' },
      { name: 'Winner QF2' },
    ], time: 'DEC 14'
  }],
  // Final
  [{
    _id: 'm8', matchNumber: 32, status: 'upcoming', players: [
      { name: 'TBD' },
      { name: 'TBD' },
    ], time: 'Dec 16, 2023 • 20:00'
  }],
];

/* ------------------------------------------------------------------ */
/* Ecosystem (code2)                                                   */
/* ------------------------------------------------------------------ */

export const mockSportModules: SportModule[] = [
  { sport: 'football', label: 'Bóng đá', activeUsers: '12.4k', status: 'online', enabled: true, icon: 'football-outline' },
  { sport: 'badminton', label: 'Cầu lông', activeUsers: '8.2k', status: 'online', enabled: true, icon: 'tennisball-outline' },
  { sport: 'pickleball', label: 'Pickleball', activeUsers: '0', status: 'maintenance', enabled: false, icon: 'baseball-outline' },
];

/* ------------------------------------------------------------------ */
/* Bookings (code3)                                                    */
/* ------------------------------------------------------------------ */

export const mockBookings: Booking[] = [
  { _id: 'b1', sport: 'badminton', venue: 'HITRI Center A', location: 'Quận 7, TP.HCM', date: '20/10/2023', time: '18:00 - 19:30', status: 'completed' },
  { _id: 'b2', sport: 'football', venue: 'Sân Thống Nhất', location: 'Quận 10, TP.HCM', date: '18/10/2023', time: '07:00 - 08:30', status: 'completed' },
  { _id: 'b3', sport: 'tennis', venue: 'Tân Bình Tennis', location: 'Quận Tân Bình', date: '22/10/2023', time: '16:00 - 17:30', status: 'cancelled' },
  { _id: 'b4', sport: 'badminton', venue: 'HITRI Center B', location: 'Hà Nội', date: '25/10/2023', time: '19:00 - 20:30', status: 'pending' },
];

/* ------------------------------------------------------------------ */
/* Calendar (code8)                                                    */
/* ------------------------------------------------------------------ */

export const mockCalendarBookings: CalendarBooking[] = [
  { _id: 'cb1', venue: 'HITRI A', court: 'Sân 1', startHour: 7, endHour: 9, status: 'paid', userName: 'Nguyễn A' },
  { _id: 'cb2', venue: 'HITRI A', court: 'Sân 1', startHour: 10, endHour: 12, status: 'pending', userName: 'Trần B' },
  { _id: 'cb3', venue: 'HITRI A', court: 'Sân 2', startHour: 8, endHour: 10, status: 'paid', userName: 'Lê C' },
  { _id: 'cb4', venue: 'HITRI A', court: 'Sân 2', startHour: 14, endHour: 16, status: 'maintenance' },
  { _id: 'cb5', venue: 'HITRI B', court: 'Sân 1', startHour: 9, endHour: 11, status: 'paid', userName: 'Phạm D' },
  { _id: 'cb6', venue: 'HITRI B', court: 'Sân 2', startHour: 7, endHour: 9, status: 'pending', userName: 'Hoàng E' },
];

export const mockVenues = [
  { group: 'HITRI Center A (QN)', courts: ['Sân 1', 'Sân 2'] },
  { group: 'HITRI Center B (HN)', courts: ['Sân 1', 'Sân 2'] },
];

/* ------------------------------------------------------------------ */
/* Moderation (code9)                                                  */
/* ------------------------------------------------------------------ */

export const mockReports: Report[] = [
  { _id: 'r1', ticketId: 'RPT-4821', category: 'hate_speech', reporterCount: 5, createdAt: '12 phút trước', content: 'Bài viết chứa ngôn ngữ kích động và xúc phạm đối thủ sau trận đấu.', authorName: 'darkplayer99', status: 'pending' },
  { _id: 'r2', ticketId: 'RPT-4820', category: 'spam', reporterCount: 12, createdAt: '45 phút trước', content: 'Liên tục đăng link quảng cáo cá cược bóng đá trái phép.', authorName: 'betking2024', status: 'pending' },
  { _id: 'r3', ticketId: 'RPT-4819', category: 'scam', reporterCount: 3, createdAt: '2 giờ trước', content: 'Giả mạo admin hệ thống để yêu cầu chuyển tiền cọc sân.', authorName: 'hitri_support_fake', status: 'pending' },
];

/* ------------------------------------------------------------------ */
/* Support Tickets (code11)                                            */
/* ------------------------------------------------------------------ */

export const mockTickets: SupportTicket[] = [
  { _id: 'tk1', subject: 'Không thể đặt sân badminton', userName: 'Nguyễn Minh', status: 'new', lastMessage: 'Em đặt sân nhưng bị lỗi thanh toán...', updatedAt: '5 phút trước', unread: true },
  { _id: 'tk2', subject: 'Hoàn tiền trận bị hủy', userName: 'Trần Hùng', status: 'open', lastMessage: 'Trận đấu bị hủy nhưng tiền chưa được hoàn...', updatedAt: '1 giờ trước', unread: true },
  { _id: 'tk3', subject: 'Lỗi hiển thị lịch thi đấu', userName: 'Lê Thảo', status: 'replied', lastMessage: 'Cảm ơn bạn, vấn đề đã được xử lý.', updatedAt: '3 giờ trước' },
  { _id: 'tk4', subject: 'Cập nhật thông tin cá nhân', userName: 'Phạm Đức', status: 'closed', lastMessage: 'Đã xác nhận thay đổi email thành công.', updatedAt: '1 ngày trước' },
];

export const mockChatMessages: ChatMessage[] = [
  { _id: 'msg1', sender: 'system', content: 'Ticket được tạo bởi Nguyễn Minh', time: '10:00', date: 'Hôm nay' },
  { _id: 'msg2', sender: 'user', content: 'Xin chào, em đặt sân cầu lông HITRI Center A vào chiều nay nhưng khi thanh toán qua ví thì bị lỗi "Transaction failed". Mong admin hỗ trợ ạ.', time: '10:02' },
  { _id: 'msg3', sender: 'admin', content: 'Chào bạn, mình đã kiểm tra và thấy giao dịch bị reject do ví không đủ số dư. Bạn vui lòng nạp thêm và thử lại nhé.', time: '10:15' },
  { _id: 'msg4', sender: 'user', content: 'Em vừa nạp thêm 500k rồi ạ, nhờ admin kiểm tra lại giúp em.', time: '10:32' },
];

/* ------------------------------------------------------------------ */
/* CMS / Ops (code10)                                                  */
/* ------------------------------------------------------------------ */

export const mockMatchmakingLogs: MatchmakingLog[] = [
  { _id: 'ml1', hostName: 'Nguyễn Văn Sơn', hostId: 'UID-8923', sport: 'badminton', level: 'Bán chuyên', time: '14:30, 20/10', status: 'searching', reputationScore: 92 },
  { _id: 'ml2', hostName: 'Trần Đức Minh', hostId: 'UID-7741', sport: 'football', level: 'Phong trào', time: '09:00, 20/10', status: 'matched', reputationScore: 88 },
  { _id: 'ml3', hostName: 'Lê Thị Hoa', hostId: 'UID-6532', sport: 'pickleball', level: 'Chuyên nghiệp', time: '16:00, 19/10', status: 'cancelled', reputationScore: 76 },
];

export const mockBanners: Banner[] = [
  { _id: 'bn1', title: 'Giải Cầu Lông Mở Rộng 2024', status: 'active', deepLink: '/tournaments/t3' },
  { _id: 'bn2', title: 'Khuyến mãi nạp ví 50%', status: 'active', deepLink: '/promotions/promo1' },
  { _id: 'bn3', title: 'Ra mắt Pickleball Module', status: 'scheduled', deepLink: '/ecosystem' },
];

/* ------------------------------------------------------------------ */
/* Audit Logs (code13)                                                 */
/* ------------------------------------------------------------------ */

export const mockAuditLogs: AuditLog[] = [
  { _id: 'al1', adminName: 'Alex Morgan', adminInitials: 'AM', action: 'lock_account', actionLabel: 'Lock Account', target: 'user:john_doe_42', ip: '192.168.1.101', timestamp: '2023-10-20 14:32:10', status: 'success' },
  { _id: 'al2', adminName: 'System', adminInitials: 'SY', action: 'auto_scale', actionLabel: 'Auto-scale', target: 'infra:ap-southeast-1', ip: '10.0.0.1', timestamp: '2023-10-20 14:28:05', status: 'success' },
  { _id: 'al3', adminName: 'Sarah Connor', adminInitials: 'SC', action: 'delete_group', actionLabel: 'Delete Group', target: 'group:beta_testers', ip: '203.113.152.40', timestamp: '2023-10-20 13:15:22', status: 'failed' },
  { _id: 'al4', adminName: 'Michael Chen', adminInitials: 'MC', action: 'update_profile', actionLabel: 'Update Profile', target: 'user:emily_davis', ip: '172.16.0.55', timestamp: '2023-10-20 12:00:00', status: 'success' },
  { _id: 'al5', adminName: 'Alex Morgan', adminInitials: 'AM', action: 'api_key_gen', actionLabel: 'API Key Gen', target: 'api:mobile_app_v2', ip: '192.168.1.101', timestamp: '2023-10-20 10:45:33', status: 'success' },
];

/* ------------------------------------------------------------------ */
/* RBAC / Settings (code12)                                            */
/* ------------------------------------------------------------------ */

export const mockPermissions: Permission[] = [
  { key: 'user.create_edit', label: 'Tạo/Sửa người dùng', category: 'User Management' },
  { key: 'user.delete', label: 'Xoá người dùng', category: 'User Management' },
  { key: 'finance.view', label: 'Xem Dashboard tài chính', category: 'Finance' },
  { key: 'finance.refund', label: 'Xử lý hoàn tiền', category: 'Finance' },
  { key: 'ops.tournaments', label: 'Quản lý giải đấu', category: 'Operations' },
  { key: 'ops.scores', label: 'Sửa điểm trận đấu', category: 'Operations' },
];

export const mockRolePermissions: Record<string, Record<string, boolean>> = {
  super_admin: { 'user.create_edit': true, 'user.delete': true, 'finance.view': true, 'finance.refund': true, 'ops.tournaments': true, 'ops.scores': true },
  staff: { 'user.create_edit': true, 'user.delete': false, 'finance.view': true, 'finance.refund': false, 'ops.tournaments': true, 'ops.scores': true },
  moderator: { 'user.create_edit': false, 'user.delete': false, 'finance.view': false, 'finance.refund': false, 'ops.tournaments': false, 'ops.scores': false },
};

export const mockApiKeys: ApiKey[] = [
  { _id: 'ak1', name: 'Mobile App (Production)', clientId: 'cli_prod_8f3a2b1c', secret: 'sk_live_••••••••••••••••', status: 'active', createdAt: '15/08/2023' },
  { _id: 'ak2', name: 'Web Dashboard (Staging)', clientId: 'cli_stg_4d7e9f0a', secret: 'sk_test_••••••••••••••••', status: 'test', createdAt: '01/10/2023' },
];

/* ------------------------------------------------------------------ */
/* Dashboard Stats (code15)                                            */
/* ------------------------------------------------------------------ */

export const mockDashboardStats = [
  { icon: 'people-outline', iconColor: 'text-primary', label: 'Total Users', value: '24,593', trend: { value: '+12%', direction: 'up' as const } },
  { icon: 'trophy-outline', iconColor: 'text-blue-400', label: 'Active Tournaments', value: '8', badge: { text: 'Live', variant: 'live' as const } },
  { icon: 'cash-outline', iconColor: 'text-emerald-400', label: 'Revenue (Mo)', value: '$142.5k', trend: { value: '+5.2%', direction: 'up' as const } },
  { icon: 'server-outline', iconColor: 'text-amber-400', label: 'Server Health', value: '98.9%', badge: { text: 'Stable', variant: 'neutral' as const } },
];

export const mockRecentActivity = [
  { icon: 'person-add-outline', iconColor: 'text-primary bg-primary/20 border-primary/30', title: 'New User registered via Web', time: '2 phút trước' },
  { icon: 'trophy-outline', iconColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', title: 'Alpha Cup tournament started', time: '15 phút trước' },
  { icon: 'warning-outline', iconColor: 'text-red-400 bg-red-500/20 border-red-500/30', title: 'Server Load alert (Region EU)', time: '1 giờ trước' },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const mockNotifications: Notification[] = [
  { _id: 'n1', type: 'success', title: 'Giải đấu bắt đầu', message: 'Giải Cầu Lông HITRI Open 2024 đã chính thức khởi tranh', icon: 'trophy-outline', timestamp: '2 phút trước', read: false, actionUrl: '/tournaments/t3' },
  { _id: 'n2', type: 'info', title: 'Cập nhật lịch thi đấu', message: 'Trận đấu của bạn đã được chuyển sang sân số 3', icon: 'calendar-outline', timestamp: '15 phút trước', read: false },
  { _id: 'n3', type: 'success', title: 'Thanh toán thành công', message: 'Bạn đã đặt sân thành công. Mã đặt sân: #BK-1234', icon: 'checkmark-circle-outline', timestamp: '1 giờ trước', read: false },
  { _id: 'n4', type: 'warning', title: 'Sắp đến hạn thanh toán', message: 'Đơn đặt sân #BK-5678 sẽ hết hạn trong 2 giờ nữa', icon: 'time-outline', timestamp: '3 giờ trước', read: true },
  { _id: 'n5', type: 'info', title: 'Kết quả trận đấu', message: 'Trận đấu vòng bảng của bạn đã kết thúc với tỷ số 21-19', icon: 'tennisball-outline', timestamp: '1 ngày trước', read: true },
];
