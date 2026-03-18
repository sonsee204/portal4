/**
 * Script tạo file template Excel cho import VĐV.
 * Chạy: node scripts/generate-import-template.mjs
 *
 * Output: public/templates/tournament-registration-template.xlsx
 */

import * as XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'templates');
const OUT_FILE = join(OUT_DIR, 'tournament-registration-template.xlsx');

mkdirSync(OUT_DIR, { recursive: true });

// -------------------------------------------------------
// 20 VĐV mock data thực tế
// -------------------------------------------------------
const mockAthletes = [
  { name: 'Nguyễn Văn An', phone: '0901234567', email: 'an.nguyen@email.com', dob: '15/03/2005', club: 'CLB Thể Thao Hà Nội', school: 'THPT Chu Văn An', guardian: 'Nguyễn Văn Bình', guardianPhone: '0901234568', category: 'U19 Nam Đơn', fee: 150000, notes: '' },
  { name: 'Trần Thị Bình', phone: '0912345678', email: 'binh.tran@email.com', dob: '22/07/2006', club: 'CLB Cầu Lông Sài Gòn', school: 'THPT Lê Hồng Phong', guardian: 'Trần Văn Cường', guardianPhone: '0912345679', category: 'U17 Nữ Đơn', fee: 120000, notes: '' },
  { name: 'Lê Minh Cường', phone: '0923456789', email: '', dob: '10/11/2004', club: 'Trung tâm TDTT Đà Nẵng', school: 'THPT Phan Châu Trinh', guardian: '', guardianPhone: '', category: 'U19 Nam Đơn', fee: 150000, notes: 'VĐV tiêu biểu' },
  { name: 'Phạm Thị Dung', phone: '0934567890', email: 'dung.pham@gmail.com', dob: '05/01/2007', club: 'CLB Thiếu Niên Huế', school: 'THCS Nguyễn Tri Phương', guardian: 'Phạm Văn Đức', guardianPhone: '0934567891', category: 'U15 Nữ Đơn', fee: 100000, notes: '' },
  { name: 'Hoàng Văn Đức', phone: '0945678901', email: 'duc.hoang@email.com', dob: '18/06/2003', club: 'CLB Thể Thao Cần Thơ', school: '', guardian: '', guardianPhone: '', category: 'Open Nam Đơn', fee: 200000, notes: '' },
  { name: 'Ngô Thị Hà', phone: '0956789012', email: 'ha.ngo@email.com', dob: '30/09/2005', club: 'CLB Cầu Lông Hải Phòng', school: 'THPT Ngô Quyền', guardian: 'Ngô Văn Hải', guardianPhone: '0956789013', category: 'U19 Nữ Đơn', fee: 150000, notes: '' },
  { name: 'Đinh Văn Hùng', phone: '0967890123', email: '', dob: '12/02/2004', club: 'CLB TDTT Bình Dương', school: 'THPT Nguyễn Đình Chiểu', guardian: '', guardianPhone: '', category: 'U19 Nam Đơn', fee: 150000, notes: 'Đã đăng ký trước' },
  { name: 'Vũ Thị Lan', phone: '0978901234', email: 'lan.vu@gmail.com', dob: '25/04/2006', club: 'CLB Thể Thao Vinh', school: 'THPT Lê Viết Thuật', guardian: 'Vũ Văn Lâm', guardianPhone: '0978901235', category: 'U17 Nữ Đơn', fee: 120000, notes: '' },
  { name: 'Bùi Minh Lâm', phone: '0989012345', email: 'lam.bui@email.com', dob: '07/08/2005', club: 'CLB Cầu Lông Hà Nam', school: 'THPT Trần Hưng Đạo', guardian: '', guardianPhone: '', category: 'U19 Nam Đơn', fee: 150000, notes: '' },
  { name: 'Lý Thị Mai', phone: '0990123456', email: 'mai.ly@email.com', dob: '14/12/2007', club: 'Trung tâm Thể dục Thể thao Tây Nguyên', school: 'THCS Buôn Ma Thuột', guardian: 'Lý Văn Nam', guardianPhone: '0990123457', category: 'U15 Nữ Đơn', fee: 100000, notes: '' },
  { name: 'Đặng Văn Nam', phone: '0901357246', email: '', dob: '03/05/2003', club: 'CLB Thể Thao Quảng Ngãi', school: '', guardian: '', guardianPhone: '', category: 'Open Nam Đơn', fee: 200000, notes: 'Tài trợ phí' },
  { name: 'Phan Thị Ngọc', phone: '0912468135', email: 'ngoc.phan@gmail.com', dob: '28/10/2004', club: 'CLB Cầu Lông Khánh Hòa', school: 'THPT Lý Tự Trọng', guardian: '', guardianPhone: '', category: 'U19 Nữ Đơn', fee: 150000, notes: '' },
  { name: 'Trịnh Văn Phúc', phone: '0923579864', email: 'phuc.trinh@email.com', dob: '19/01/2006', club: 'CLB Thiếu Niên Bắc Ninh', school: 'THPT Lương Tài', guardian: 'Trịnh Văn Quang', guardianPhone: '0923579865', category: 'U17 Nam Đơn', fee: 120000, notes: '' },
  { name: 'Nguyễn Thị Quỳnh', phone: '0934681357', email: 'quynh.nguyen@email.com', dob: '11/07/2007', club: 'CLB Cầu Lông Hải Dương', school: 'THCS Gia Lộc', guardian: 'Nguyễn Văn Rạng', guardianPhone: '0934681358', category: 'U15 Nữ Đơn', fee: 100000, notes: '' },
  { name: 'Lê Anh Sơn', phone: '0945793246', email: 'son.le@email.com', dob: '02/03/2003', club: 'CLB Thể Thao Thanh Hóa', school: '', guardian: '', guardianPhone: '', category: 'Open Nam Đơn', fee: 200000, notes: '' },
  { name: 'Mai Thị Thu', phone: '0956904678', email: 'thu.mai@gmail.com', dob: '16/09/2005', club: 'CLB Cầu Lông Hải Phòng', school: 'THPT Thái Phiên', guardian: 'Mai Văn Tùng', guardianPhone: '0956904679', category: 'U19 Nữ Đơn', fee: 150000, notes: '' },
  { name: 'Hồ Văn Tùng', phone: '0967015789', email: '', dob: '23/11/2004', club: 'CLB TDTT Nghệ An', school: 'THPT Lê Viết Thuật', guardian: '', guardianPhone: '', category: 'U19 Nam Đơn', fee: 150000, notes: 'Đăng ký lần 2' },
  { name: 'Chu Thị Uyên', phone: '0978126890', email: 'uyen.chu@email.com', dob: '08/04/2006', club: 'Trung tâm TDTT Nam Định', school: 'THPT Trần Hưng Đạo', guardian: 'Chu Văn Vân', guardianPhone: '0978126891', category: 'U17 Nữ Đơn', fee: 120000, notes: '' },
  { name: 'Tô Văn Vĩ', phone: '0989237901', email: 'vi.to@email.com', dob: '30/06/2007', club: 'CLB Cầu Lông Thái Bình', school: 'THCS Đông Hưng', guardian: 'Tô Thị Xuyên', guardianPhone: '0989237902', category: 'U15 Nam Đơn', fee: 100000, notes: '' },
  { name: 'Đoàn Thị Xuân', phone: '0990348012', email: 'xuan.doan@gmail.com', dob: '17/08/2005', club: 'CLB Thể Thao Yên Bái', school: 'THPT Yên Bình', guardian: '', guardianPhone: '', category: 'U19 Nữ Đơn', fee: 150000, notes: '' },
];

// -------------------------------------------------------
// Sheet 1: Danh sách đăng ký
// -------------------------------------------------------
const registrationRows = mockAthletes.map((a) => ({
  'Tên VĐV': a.name,
  'Hạng mục': a.category,
  'Số điện thoại': a.phone,
  'Email': a.email,
  'Ngày sinh': a.dob,
  'CLB / Đội': a.club,
  'Trường': a.school,
  'Tên phụ huynh': a.guardian,
  'SĐT phụ huynh': a.guardianPhone,
  'Phí đăng ký': a.fee,
  'Ghi chú': a.notes,
}));

const ws1 = XLSX.utils.json_to_sheet(registrationRows);

// Freeze header row
ws1['!freeze'] = { xSplit: 0, ySplit: 1 };

// Column widths (tối ưu cho đọc)
ws1['!cols'] = [
  { wch: 22 }, // Tên VĐV
  { wch: 20 }, // Hạng mục
  { wch: 14 }, // SĐT
  { wch: 24 }, // Email
  { wch: 14 }, // Ngày sinh
  { wch: 30 }, // CLB
  { wch: 26 }, // Trường
  { wch: 20 }, // Tên PH
  { wch: 14 }, // SĐT PH
  { wch: 12 }, // Phí
  { wch: 20 }, // Ghi chú
];

// Tô vàng header cột bắt buộc (A1, B1 = Tên VĐV, Hạng mục)
const requiredCols = ['A1', 'B1'];
const headerStyle = {
  fill: { fgColor: { rgb: 'FFF9C4' } },
  font: { bold: true },
  alignment: { horizontal: 'center' },
};
for (const cell of requiredCols) {
  if (ws1[cell]) ws1[cell].s = headerStyle;
}

// Style tất cả header
const range = XLSX.utils.decode_range(ws1['!ref']);
for (let col = range.s.c; col <= range.e.c; col++) {
  const cellAddr = XLSX.utils.encode_cell({ r: 0, c: col });
  if (!ws1[cellAddr]) continue;
  if (!requiredCols.includes(cellAddr)) {
    ws1[cellAddr].s = { font: { bold: true }, alignment: { horizontal: 'center' } };
  }
}

// -------------------------------------------------------
// Sheet 2: Hướng dẫn
// -------------------------------------------------------
const guideRows = [
  ['Cột', 'Bắt buộc', 'Mô tả', 'Ví dụ'],
  ['Tên VĐV', 'CÓ', 'Họ và tên đầy đủ của vận động viên (tối đa 100 ký tự)', 'Nguyễn Văn An'],
  ['Hạng mục', 'CÓ', 'Tên hạng mục thi đấu — phải khớp chính xác với tên trong hệ thống', 'U19 Nam Đơn'],
  ['Số điện thoại', 'Không', 'Số điện thoại liên hệ của VĐV (tối đa 20 ký tự)', '0901234567'],
  ['Email', 'Không', 'Địa chỉ email hợp lệ của VĐV', 'an.nguyen@email.com'],
  ['Ngày sinh', 'Không', 'Định dạng: DD/MM/YYYY hoặc YYYY-MM-DD', '15/03/2005'],
  ['CLB / Đội', 'Không', 'Tên câu lạc bộ hoặc đội thi đấu (tối đa 100 ký tự)', 'CLB Thể Thao Hà Nội'],
  ['Trường', 'Không', 'Tên trường / đơn vị đang theo học (tối đa 100 ký tự)', 'THPT Chu Văn An'],
  ['Tên phụ huynh', 'Không', 'Họ tên phụ huynh / người giám hộ (dành cho VĐV nhỏ tuổi)', 'Nguyễn Văn Bình'],
  ['SĐT phụ huynh', 'Không', 'Số điện thoại phụ huynh / người giám hộ', '0901234568'],
  ['Phí đăng ký', 'Không', 'Số tiền phí đăng ký (đơn vị VND, chỉ nhập số)', '150000'],
  ['Ghi chú', 'Không', 'Thông tin bổ sung (tối đa 500 ký tự)', 'VĐV tiêu biểu'],
  [''],
  ['LƯU Ý:'],
  ['• Dòng đầu tiên là tiêu đề cột — không xóa hoặc thay đổi tên cột'],
  ['• Tên hạng mục phải trùng khớp chính xác (kể cả chữ hoa/thường) với tên trong hệ thống'],
  ['• Tối đa 500 VĐV mỗi lần import'],
  ['• Nếu một dòng có lỗi, chỉ dòng đó bị bỏ qua — các dòng hợp lệ vẫn được import'],
  ['• Số điện thoại phải là duy nhất trong cùng một hạng mục (nếu có)'],
];

const ws2 = XLSX.utils.aoa_to_sheet(guideRows);
ws2['!cols'] = [{ wch: 16 }, { wch: 10 }, { wch: 60 }, { wch: 30 }];

// Bold header row in guide
for (let col = 0; col < 4; col++) {
  const cell = XLSX.utils.encode_cell({ r: 0, c: col });
  if (ws2[cell]) ws2[cell].s = { font: { bold: true }, fill: { fgColor: { rgb: 'E3F2FD' } } };
}

// -------------------------------------------------------
// Build workbook
// -------------------------------------------------------
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws1, 'Danh sách đăng ký');
XLSX.utils.book_append_sheet(wb, ws2, 'Hướng dẫn');

XLSX.writeFile(wb, OUT_FILE);
console.log(`✅  Template đã được tạo tại: ${OUT_FILE}`);
