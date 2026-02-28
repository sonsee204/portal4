import type { TournamentFormData } from '@/types/tournament-form';

export const mockTournamentFormData: TournamentFormData = {
  name: 'Giải Cầu Lông Học Sinh THCS Nhị Khê Mở Rộng Lần I - 2026',
  sport: 'badminton',
  startDate: '2026-09-05',
  endDate: '2026-09-07',
  locationName: 'Nhà thi đấu Đa năng Thanh Trì',
  locationAddress: 'Xã Nhị Khê, Huyện Thường Tín, TP. Hà Nội',
  description:
    'Giải Cầu Lông Học Sinh THCS Nhị Khê Mở Rộng là sân chơi thể thao chuyên nghiệp dành cho các em học sinh trên địa bàn huyện Thường Tín và các trường khách mời. Giải đấu được tổ chức bài bản với sự hỗ trợ của hệ thống quản lý giải đấu Ao Trình.',
  coverImageUrl: '',
  highlights: [
    'Hệ thống quản lý và bốc thăm tự động bởi Ao Trình',
    'Trọng tài chuyên nghiệp từ Liên đoàn Cầu Lông Hà Nội',
    'Livestream trực tiếp trên nền tảng',
    'Cúp, huy chương và giải thưởng hấp dẫn cho mọi nội dung',
  ],

  categories: [
    {
      title: 'Đơn Nam U11',
      ageLabel: 'U11',
      matchType: 'single',
      icon: 'person-outline',
      description: 'Dành cho học sinh khối tiểu học, mới bắt đầu làm quen với thi đấu.',
    },
    {
      title: 'Đơn Nữ U11',
      ageLabel: 'U11',
      matchType: 'single',
      icon: 'person-outline',
      description: 'Dành cho học sinh nữ khối tiểu học.',
    },
    {
      title: 'Đơn Nam 12-13',
      ageLabel: '12-13',
      matchType: 'single',
      icon: 'school-outline',
      description: 'Dành cho học sinh khối 6, 7. Cạnh tranh cao và kỹ thuật cơ bản tốt.',
    },
    {
      title: 'Đôi Nam Nữ 12-13',
      ageLabel: '12-13',
      matchType: 'mixed',
      icon: 'people-outline',
      description: 'Nội dung đôi nam nữ cho học sinh khối 6, 7.',
    },
    {
      title: 'Đơn Nam 14-15',
      ageLabel: '14-15',
      matchType: 'single',
      icon: 'fitness-outline',
      description: 'Dành cho học sinh khối 8, 9. Trình độ chuyên môn và thể lực cao.',
    },
    {
      title: 'Đơn Nữ 14-15',
      ageLabel: '14-15',
      matchType: 'single',
      icon: 'fitness-outline',
      description: 'Dành cho học sinh nữ khối 8, 9.',
    },
  ],

  format: 'single_elim',
  totalSlots: 128,
  schedule: [
    { label: 'Đăng ký', date: '01/08 - 30/08', status: 'completed' },
    { label: 'Bốc thăm', date: '02/09', status: 'active' },
    { label: 'Vòng bảng', date: '05/09', status: 'upcoming' },
    { label: 'Tứ kết', date: '06/09', status: 'upcoming' },
    { label: 'Bán kết', date: '07/09 (sáng)', status: 'upcoming' },
    { label: 'Chung kết', date: '07/09 (chiều)', status: 'upcoming' },
  ],
  venueName: 'Nhà thi đấu Đa năng Thanh Trì',
  venueAddress: 'Xã Nhị Khê, Huyện Thường Tín, TP. Hà Nội',
  facilities: [
    { icon: 'car-outline', label: 'Bãi đỗ xe miễn phí' },
    { icon: 'wifi-outline', label: 'Wi-Fi miễn phí' },
    { icon: 'water-outline', label: 'Nước uống miễn phí' },
    { icon: 'medkit-outline', label: 'Y tế tại chỗ' },
    { icon: 'videocam-outline', label: 'Camera trực tiếp' },
    { icon: 'megaphone-outline', label: 'Hệ thống âm thanh' },
  ],
  courts: [
    { name: 'Sân 1', status: 'available' },
    { name: 'Sân 2', status: 'available' },
    { name: 'Sân 3', status: 'available' },
    { name: 'Sân 4', status: 'maintenance' },
  ],

  rules: [
    {
      title: '1. Đối tượng tham gia',
      content:
        'Học sinh đang theo học tại trường THCS Nhị Khê và các trường khách mời trên địa bàn. Có đủ sức khỏe để tham gia thi đấu thể thao.',
    },
    {
      title: '2. Trang phục thi đấu',
      content:
        'Vận động viên phải mặc trang phục thể thao phù hợp, giày cầu lông hoặc giày thể thao đế bằng.',
    },
    {
      title: '3. Thời gian & Địa điểm',
      content: 'Giải đấu diễn ra từ ngày 05/09/2026 đến 07/09/2026 tại Nhà thi đấu Đa năng Thanh Trì.',
    },
  ],
  prizes: [
    {
      rank: 'gold',
      title: 'Giải Nhất',
      amount: '600.000đ',
      perks: ['Huy chương Vàng', 'Cúp lưu niệm', 'Quà từ nhà tài trợ'],
    },
    {
      rank: 'silver',
      title: 'Giải Nhì',
      amount: '400.000đ',
      perks: ['Huy chương Bạc', 'Giấy chứng nhận'],
    },
    {
      rank: 'bronze',
      title: 'Giải Ba',
      amount: '200.000đ',
      perks: ['Huy chương Đồng', 'Giấy chứng nhận'],
    },
  ],

  registrationDeadline: '2026-08-30',
  fees: [
    { label: 'Đơn nam/nữ', amount: '50.000đ' },
    { label: 'Đôi nam nữ', amount: '80.000đ' },
  ],
  contacts: [
    { icon: 'call-outline', label: 'Hotline', value: '0987 654 321 (Thầy Hùng)' },
    { icon: 'mail-outline', label: 'Email', value: 'aotrinh.sports@gmail.com' },
  ],
  paymentBank: 'Ngân hàng MB Bank',
  paymentAccountNumber: '0333 444 555',
  paymentAccountName: 'NGUYEN VAN A',
};
