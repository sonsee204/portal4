import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { TournamentCategory } from '@/graphql/generated';

// -------------------------------------------------------
// Column mapping: tiếng Việt trong file → field nội bộ
// -------------------------------------------------------
export const COLUMN_MAP: Record<string, string> = {
  'Tên VĐV': 'athleteName',
  'Hạng mục': 'categoryName',
  'Số điện thoại': 'phone',
  'SĐT': 'phone',
  Email: 'email',
  'Ngày sinh': 'dateOfBirth',
  'CLB / Đội': 'club',
  CLB: 'club',
  Đội: 'club',
  Trường: 'school',
  'Đơn vị': 'school',
  'Tên phụ huynh': 'guardianName',
  'SĐT phụ huynh': 'guardianPhone',
  'Phí đăng ký': 'paymentAmount',
  'Ghi chú': 'notes',
};

// -------------------------------------------------------
// Types
// -------------------------------------------------------
export interface ParsedRow {
  athleteName?: string;
  categoryName?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  club?: string;
  school?: string;
  guardianName?: string;
  guardianPhone?: string;
  paymentAmount?: number;
  notes?: string;
  /** original row index 1-based */
  _rowIndex: number;
}

export interface ValidatedRow extends ParsedRow {
  isValid: boolean;
  errors: string[];
  resolvedCategoryId?: string;
  resolvedCategoryTitle?: string;
}

export interface BulkImportItem {
  athleteName: string;
  categoryId: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  club?: string;
  school?: string;
  guardianName?: string;
  guardianPhone?: string;
  paymentAmount?: number;
  notes?: string;
}

// -------------------------------------------------------
// Date normaliser: DD/MM/YYYY or DD-MM-YYYY → YYYY-MM-DD
// -------------------------------------------------------
function normalizeDateOfBirth(raw?: string): string | undefined {
  if (!raw) return undefined;
  const str = String(raw).trim();
  const ddmmyyyy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // Already YYYY-MM-DD or numeric Excel serial
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // Excel date serial
  const serial = Number(raw);
  if (!isNaN(serial) && serial > 1000) {
    const date = XLSX.SSF.parse_date_code(serial);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
  }
  return str;
}

// -------------------------------------------------------
// Map raw object keys using COLUMN_MAP
// -------------------------------------------------------
function mapRow(raw: Record<string, unknown>, rowIndex: number): ParsedRow {
  const mapped: Record<string, unknown> = { _rowIndex: rowIndex };

  for (const [key, value] of Object.entries(raw)) {
    const trimmedKey = String(key).trim();
    const fieldName = COLUMN_MAP[trimmedKey];
    if (fieldName && value !== undefined && value !== null && value !== '') {
      mapped[fieldName] = String(value).trim();
    }
  }

  const row = mapped as unknown as ParsedRow;
  row._rowIndex = rowIndex;

  if (row.paymentAmount !== undefined) {
    const num = Number(row.paymentAmount);
    row.paymentAmount = isNaN(num) ? undefined : num;
  }

  if (row.dateOfBirth) {
    row.dateOfBirth = normalizeDateOfBirth(row.dateOfBirth);
  }

  return row;
}

// -------------------------------------------------------
// Parse CSV string
// -------------------------------------------------------
export function parseCSV(text: string): ParsedRow[] {
  const { data, errors } = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (errors.length > 0 && data.length === 0) {
    throw new Error(`Lỗi đọc CSV: ${errors[0]?.message}`);
  }

  return data.map((row, i) => mapRow(row, i + 2)); // row 1 = header
}

// -------------------------------------------------------
// Parse Excel (ArrayBuffer)
// -------------------------------------------------------
export function parseExcel(buffer: ArrayBuffer): ParsedRow[] {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('File Excel không có sheet nào');
  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true,
  });

  return rawData.map((row, i) => mapRow(row, i + 2)); // row 1 = header
}

// -------------------------------------------------------
// Validate rows against category list
// -------------------------------------------------------
export function validateRows(
  rows: ParsedRow[],
  categories: Pick<TournamentCategory, '_id' | 'title'>[],
): ValidatedRow[] {
  const categoryByTitle = new Map<string, Pick<TournamentCategory, '_id' | 'title'>>();
  for (const cat of categories) {
    categoryByTitle.set(cat.title.trim().toLowerCase(), cat);
  }

  return rows.map((row) => {
    const errors: string[] = [];

    if (!row.athleteName?.trim()) {
      errors.push('Tên VĐV không được để trống');
    }

    let resolvedCategoryId: string | undefined;
    let resolvedCategoryTitle: string | undefined;

    if (!row.categoryName?.trim()) {
      errors.push('Hạng mục không được để trống');
    } else {
      const cat = categoryByTitle.get(row.categoryName.trim().toLowerCase());
      if (!cat) {
        errors.push(`Không tìm thấy hạng mục "${row.categoryName}"`);
      } else {
        resolvedCategoryId = cat._id;
        resolvedCategoryTitle = cat.title;
      }
    }

    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push(`Email không đúng định dạng: ${row.email}`);
    }

    return {
      ...row,
      isValid: errors.length === 0,
      errors,
      resolvedCategoryId,
      resolvedCategoryTitle,
    };
  });
}

// -------------------------------------------------------
// Convert validated rows to mutation input items
// -------------------------------------------------------
export function toImportItems(validatedRows: ValidatedRow[]): BulkImportItem[] {
  return validatedRows
    .filter((r) => r.isValid && r.resolvedCategoryId)
    .map((r) => ({
      athleteName: r.athleteName!.trim(),
      categoryId: r.resolvedCategoryId!,
      phone: r.phone || undefined,
      email: r.email?.toLowerCase() || undefined,
      dateOfBirth: r.dateOfBirth || undefined,
      club: r.club || undefined,
      school: r.school || undefined,
      guardianName: r.guardianName || undefined,
      guardianPhone: r.guardianPhone || undefined,
      paymentAmount: r.paymentAmount,
      notes: r.notes || undefined,
    }));
}
