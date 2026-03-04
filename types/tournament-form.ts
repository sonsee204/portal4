import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Sport type                                                          */
/* ------------------------------------------------------------------ */

export const SPORT_OPTIONS = [
  { value: 'badminton', label: 'Cầu lông', icon: 'tennisball-outline' },
  { value: 'pickleball', label: 'Pickleball', icon: 'baseball-outline' },
  { value: 'tennis', label: 'Tennis', icon: 'tennisball-outline' },
  { value: 'football', label: 'Bóng đá', icon: 'football-outline' },
] as const;

export type SportType = (typeof SPORT_OPTIONS)[number]['value'];

/* ------------------------------------------------------------------ */
/* Sub-entry types                                                     */
/* ------------------------------------------------------------------ */

export interface CategoryFormEntry {
  title: string;
  ageLabel: string;
  matchType: 'single' | 'double' | 'mixed';
  icon: string;
  description: string;
  popular: boolean;
  maxRegistrations: number;
  prizes: PrizeEntry[];
}

export interface SchedulePhaseEntry {
  label: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface FacilityEntry {
  icon: string;
  label: string;
}

export interface CourtEntry {
  name: string;
  status: 'available' | 'maintenance' | 'reserved';
}

export interface RuleEntry {
  title: string;
  content: string;
}

/** rank: gold|silver|bronze for top 3, "4"|"5"|... for position 4+ */
export interface PrizeEntry {
  rank: 'gold' | 'silver' | 'bronze' | string;
  title: string;
  amount: string;
  perks: string[];
}

export interface FeeEntry {
  label: string;
  amount: string;
}

export interface ContactEntry {
  icon: string;
  label: string;
  value: string;
}

/* ------------------------------------------------------------------ */
/* Main form data                                                      */
/* ------------------------------------------------------------------ */

export interface TournamentFormData {
  name: string;
  organizerName: string;
  sport: SportType;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  description: string;
  introduction: string;
  coverImageUrl: string;
  highlights: string[];

  categories: CategoryFormEntry[];

  format: string;
  totalSlots: number;
  schedule: SchedulePhaseEntry[];
  venueName: string;
  venueAddress: string;
  facilities: FacilityEntry[];
  courts: CourtEntry[];

  rules: RuleEntry[];
  prizes: PrizeEntry[];

  registrationDeadline: string;
  fees: FeeEntry[];
  contacts: ContactEntry[];
  paymentBank: string;
  paymentAccountNumber: string;
  paymentAccountName: string;
  paymentQrImage: string;
}

/* ------------------------------------------------------------------ */
/* Zod schemas                                                         */
/* ------------------------------------------------------------------ */

// amount optional — prize rows without amounts are still valid
const prizeSchema = z.object({
  rank: z.string(),
  title: z.string().min(1),
  amount: z.string(),
  perks: z.array(z.string()),
});

const categorySchema = z.object({
  title: z.string().min(1, 'Tên nội dung là bắt buộc'),
  ageLabel: z.string().min(1, 'Nhóm tuổi là bắt buộc'),
  matchType: z.enum(['single', 'double', 'mixed']),
  icon: z.string().min(1),
  description: z.string(),
  popular: z.boolean(),
  maxRegistrations: z.number().min(0),
  prizes: z.array(prizeSchema),
});

const schedulePhaseSchema = z.object({
  label: z.string().min(1, 'Tên giai đoạn là bắt buộc'),
  date: z.string(),
  startTime: z.string().max(50),
  endTime: z.string().max(50),
  status: z.enum(['upcoming', 'active', 'completed']),
});

const facilitySchema = z.object({
  icon: z.string(),
  label: z.string().min(1, 'Tên tiện ích là bắt buộc'),
});

const courtSchema = z.object({
  name: z.string().min(1, 'Tên sân là bắt buộc'),
  status: z.enum(['available', 'maintenance', 'reserved']),
});

// title/content optional — empty rows are filtered in mapFormToInput
const ruleSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// Both fields optional — empty fee rows are placeholder-only and filtered in mapFormToInput
const feeSchema = z.object({
  label: z.string(),
  amount: z.string(),
});

// value optional — empty contact rows are filtered in mapFormToInput
const contactSchema = z.object({
  icon: z.string(),
  label: z.string().min(1),
  value: z.string(),
});

export const tournamentFormSchema = z
  .object({
    name: z.string().min(1, 'Tên giải đấu là bắt buộc'),
    organizerName: z.string().max(200),
    sport: z.enum(['badminton', 'pickleball', 'tennis', 'football']),
    startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
    endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
    locationName: z.string().min(1, 'Tên địa điểm là bắt buộc'),
    locationAddress: z.string().min(1, 'Địa chỉ là bắt buộc'),
    description: z.string(),
    introduction: z.string().max(10000),
    coverImageUrl: z.string(),
    highlights: z.array(z.string()),

    categories: z.array(categorySchema).min(1, 'Cần ít nhất 1 nội dung thi đấu'),

    format: z.string().min(1, 'Thể thức là bắt buộc'),
    totalSlots: z.number().min(2, 'Cần ít nhất 2 slot'),
    schedule: z.array(schedulePhaseSchema),
    venueName: z.string(),
    venueAddress: z.string(),
    facilities: z.array(facilitySchema),
    courts: z.array(courtSchema),

    rules: z.array(ruleSchema),
    prizes: z.array(prizeSchema),

    registrationDeadline: z.string(),
    fees: z.array(feeSchema),
    contacts: z.array(contactSchema),
    paymentBank: z.string(),
    paymentAccountNumber: z.string(),
    paymentAccountName: z.string(),
    paymentQrImage: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
        path: ['endDate'],
      });
    }
    if (data.registrationDeadline && data.startDate && data.registrationDeadline > data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hạn đăng ký phải trước hoặc bằng ngày bắt đầu giải',
        path: ['registrationDeadline'],
      });
    }
  });

/* ------------------------------------------------------------------ */
/* Per-step field keys for partial validation                          */
/* ------------------------------------------------------------------ */

export const STEP_FIELDS: Record<number, (keyof TournamentFormData)[]> = {
  0: ['name', 'organizerName', 'sport', 'startDate', 'endDate', 'locationName', 'locationAddress', 'description', 'introduction', 'coverImageUrl', 'highlights'],
  1: ['categories'],
  2: ['format', 'totalSlots', 'schedule', 'venueName', 'venueAddress', 'facilities', 'courts'],
  3: ['rules'],
  4: ['registrationDeadline', 'fees', 'contacts', 'paymentBank', 'paymentAccountNumber', 'paymentAccountName', 'paymentQrImage'],
  5: [],
};

/* ------------------------------------------------------------------ */
/* Step metadata                                                       */
/* ------------------------------------------------------------------ */

export const FORM_STEPS = [
  { label: 'Thông tin chung', icon: 'information-circle-outline' },
  { label: 'Nội dung', icon: 'list-outline' },
  { label: 'Lịch trình', icon: 'calendar-outline' },
  { label: 'Thể lệ', icon: 'book-outline' },
  { label: 'Đăng ký', icon: 'person-add-outline' },
  { label: 'Xem lại', icon: 'checkmark-circle-outline' },
] as const;

/* ------------------------------------------------------------------ */
/* Default values                                                      */
/* ------------------------------------------------------------------ */

export const DEFAULT_TOURNAMENT_FORM: TournamentFormData = {
  name: '',
  organizerName: '',
  sport: 'badminton',
  startDate: '',
  endDate: '',
  locationName: '',
  locationAddress: '',
  description: '',
  introduction: '',
  coverImageUrl: '',
  highlights: [''],

  categories: [
    {
      title: '',
      ageLabel: '',
      matchType: 'single',
      icon: 'person-outline',
      description: '',
      popular: false,
      maxRegistrations: 0,
      prizes: [
        { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
        { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
        { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
      ],
    },
  ],

  format: 'single_elim',
  totalSlots: 32,
  schedule: [
    { label: 'Đăng ký', date: '', startTime: '', endTime: '', status: 'upcoming' },
  ],
  venueName: '',
  venueAddress: '',
  facilities: [],
  courts: [{ name: 'Sân 1', status: 'available' }],

  rules: [{ title: '', content: '' }],
  prizes: [
    { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
    { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
    { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
  ],

  registrationDeadline: '',
  fees: [{ label: '', amount: '' }],
  contacts: [{ icon: 'call-outline', label: 'Hotline', value: '' }],
  paymentBank: '',
  paymentAccountNumber: '',
  paymentAccountName: '',
  paymentQrImage: '',
};
