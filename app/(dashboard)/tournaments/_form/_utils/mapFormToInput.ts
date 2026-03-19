import type { TournamentFormData, CategoryFormEntry } from '@/types/tournament-form';
import type {
  CreateTournamentInput,
  UpdateTournamentInput,
  Tournament,
  CreateCategoryInput,
  ScoringConfigInput,
} from '@/graphql/generated';
import {
  SportType,
  MatchType,
  TournamentFormat,
  TournamentGender,
  ScoringSystem,
} from '@/graphql/generated';

/* ------------------------------------------------------------------ */
/* Category helpers                                                    */
/* ------------------------------------------------------------------ */

const MATCH_TYPE_MAP: Record<CategoryFormEntry['matchType'], MatchType> = {
  single: MatchType.Singles,
  double: MatchType.Doubles,
  mixed: MatchType.Doubles,
};

const DEFAULT_SCORING_CONFIG: Record<string, ScoringConfigInput> = {
  badminton: {
    scoringSystem: ScoringSystem.SetsAndPoints,
    bestOf: 3, setsToWin: 2, pointsPerSet: 21,
    deuceEnabled: true, deuceAt: 20,
    tiebreakEnabled: true, tiebreakPoints: 30,
    winByMargin: 2, maxPoints: 30,
  },
  pickleball: {
    scoringSystem: ScoringSystem.SetsAndPoints,
    bestOf: 3, setsToWin: 2, pointsPerSet: 11,
    deuceEnabled: true, deuceAt: 10,
    tiebreakEnabled: true, tiebreakPoints: 15,
    winByMargin: 2, maxPoints: 15,
  },
  tennis: {
    scoringSystem: ScoringSystem.SetsAndPoints,
    bestOf: 3, setsToWin: 2, pointsPerSet: 6,
    deuceEnabled: true, deuceAt: 5,
    tiebreakEnabled: true, tiebreakPoints: 7,
    winByMargin: 2, maxPoints: 7,
  },
  football: {
    scoringSystem: ScoringSystem.TimedGoals,
    bestOf: 1, setsToWin: 1, pointsPerSet: 90,
    periodsCount: 2, periodDurationMinutes: 45,
    deuceEnabled: false, deuceAt: 0,
    tiebreakEnabled: false, tiebreakPoints: 0,
    winByMargin: 1, maxPoints: 99,
  },
};

export function mapCategoryEntryToInput(
  entry: CategoryFormEntry,
  tournamentId: string,
  sport: TournamentFormData['sport'],
): CreateCategoryInput {
  const format = entry.format ?? TournamentFormat.SingleElimination;
  const isRoundRobin = format === TournamentFormat.RoundRobin;
  const isGroupKnockout = format === TournamentFormat.GroupKnockout;
  return {
    tournamentId,
    title: entry.title,
    ageLabel: entry.ageLabel || undefined,
    description: entry.description || undefined,
    icon: entry.icon || undefined,
    matchType: MATCH_TYPE_MAP[entry.matchType] ?? MatchType.Singles,
    format,
    gender: TournamentGender.Open,
    scoringConfig: DEFAULT_SCORING_CONFIG[sport] ?? DEFAULT_SCORING_CONFIG.badminton,
    popular: entry.popular,
    maxRegistrations: entry.maxRegistrations > 0 ? entry.maxRegistrations : undefined,
    bracketSize: isRoundRobin || isGroupKnockout ? undefined : (entry.bracketSize > 0 ? entry.bracketSize : undefined),
    sharedThirdPlace: format === TournamentFormat.SingleElimination ? entry.sharedThirdPlace : undefined,
    prizes: (entry.prizes ?? [])
      .filter((p) => p.title)
      .map((p, i) => ({
        rank: p.rank || (i < 3 ? ['gold', 'silver', 'bronze'][i] : String(i + 1)),
        title: p.title,
        amount: p.amount || undefined,
        perks: p.perks.filter(Boolean).length > 0 ? p.perks.filter(Boolean) : undefined,
      })),
  };
}

const SPORT_MAP: Record<string, SportType> = {
  badminton: SportType.Badminton,
  pickleball: SportType.Pickleball,
  tennis: SportType.Tennis,
  football: SportType.Football,
};

const SPORT_MAP_REVERSE: Record<string, TournamentFormData['sport']> = {
  BADMINTON: 'badminton',
  PICKLEBALL: 'pickleball',
  TENNIS: 'tennis',
  FOOTBALL: 'football',
};

export function mapFormToCreateInput(data: TournamentFormData): CreateTournamentInput {
  return {
    title: data.name,
    sportType: SPORT_MAP[data.sport] ?? SportType.Badminton,
    organizerName: data.organizerName?.trim() || undefined,
    description: data.description || undefined,
    introduction: data.introduction?.trim() || undefined,
    coverImage: data.coverImageUrl || undefined,
    highlights: data.highlights.filter(Boolean).length > 0
      ? data.highlights.filter(Boolean)
      : undefined,
    dates: {
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      registrationCloseDate: data.registrationDeadline || undefined,
    },
    location: {
      name: data.locationName || undefined,
      address: data.locationAddress || undefined,
    },
    rules: data.rules
      .filter((r) => r.title)
      .map((r) => ({ title: r.title, content: r.content || undefined })),
    contacts: data.contacts
      .filter((c) => c.value)
      .map((c) => ({ icon: c.icon || undefined, label: c.label, value: c.value })),
    courts: data.courts
      .filter((c) => c.name)
      .map((c) => ({ name: c.name, status: c.status || undefined })),
    facilities: data.facilities
      .filter((f) => f.label)
      .map((f) => ({ label: f.label, icon: f.icon || undefined })),
    schedule: data.schedule
      .filter((s) => s.label)
      .map((s) => ({
        label: s.label,
        date: s.date || undefined,
        startTime: s.startTime?.trim() || undefined,
        endTime: s.endTime?.trim() || undefined,
        status: s.status || undefined,
      })),
    paymentInfo: (data.paymentBank || data.paymentAccountNumber || data.fees.some((f) => f.label && f.amount))
      ? {
        bank: data.paymentBank || undefined,
        accountNumber: data.paymentAccountNumber || undefined,
        accountName: data.paymentAccountName || undefined,
        qrImage: data.paymentQrImage || undefined,
        fees: data.fees
          .filter((f) => f.label && f.amount)
          .map((f) => ({ label: f.label, amount: f.amount })),
      }
      : undefined,
  };
}

export function mapFormToUpdateInput(
  id: string,
  data: TournamentFormData,
): UpdateTournamentInput {
  // sportType is not part of UpdateTournamentInput — sport cannot be changed after creation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sportType: _omit, ...rest } = mapFormToCreateInput(data);
  return { id, ...rest };
}

export function mapTournamentToFormData(tournament: Tournament): TournamentFormData {
  return {
    name: tournament.title,
    organizerName: tournament.organizerName ?? '',
    sport: SPORT_MAP_REVERSE[tournament.sportType] ?? 'badminton',
    startDate: tournament.dates?.startDate
      ? new Date(tournament.dates.startDate).toISOString().split('T')[0]
      : '',
    endDate: tournament.dates?.endDate
      ? new Date(tournament.dates.endDate).toISOString().split('T')[0]
      : '',
    locationName: tournament.location?.name ?? '',
    locationAddress: tournament.location?.address ?? '',
    description: tournament.description ?? '',
    introduction: (tournament as { introduction?: string }).introduction ?? '',
    coverImageUrl: tournament.coverImage ?? '',
    highlights: tournament.highlights?.length ? tournament.highlights : [''],

    // Categories are separate entities — loaded via useTournamentCategories in StepCategories
    categories: [],

    schedule: (tournament.schedule?.length
      ? tournament.schedule.map((s) => ({
        label: s.label,
        date: s.date ?? '',
        startTime: (s as { startTime?: string }).startTime ?? '',
        endTime: (s as { endTime?: string }).endTime ?? '',
        status: (s.status as 'upcoming' | 'active' | 'completed') ?? 'upcoming',
      }))
      : [{ label: 'Đăng ký', date: '', startTime: '', endTime: '', status: 'upcoming' as const }]),
    facilities: tournament.facilities?.map((f) => ({ icon: f.icon ?? '', label: f.label })) ?? [],
    courts: tournament.courts?.map((c) => ({
      name: c.name,
      status: (c.status as 'available' | 'maintenance' | 'reserved') ?? 'available',
    })) ?? [{ name: 'Sân 1', status: 'available' as const }],

    rules: tournament.rules?.map((r) => ({
      title: r.title,
      content: r.content ?? '',
    })) ?? [{ title: '', content: '' }],

    prizes: tournament.prizes?.length
      ? tournament.prizes.map((p, i) => ({
        rank: p.rank ?? (i < 3 ? ['gold', 'silver', 'bronze'][i] : String(i + 1)),
        title: p.title,
        amount: p.amount ?? '',
        perks: p.perks?.length ? p.perks : [''],
      }))
      : [
        { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
        { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
        { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
      ],

    registrationDeadline: tournament.dates?.registrationCloseDate
      ? new Date(tournament.dates.registrationCloseDate).toISOString().split('T')[0]
      : '',
    fees: tournament.paymentInfo?.fees?.map((f) => ({
      label: f.label,
      amount: f.amount,
    })) ?? [{ label: '', amount: '' }],
    contacts: tournament.contacts?.map((c) => ({
      icon: c.icon ?? 'call-outline',
      label: c.label,
      value: c.value,
    })) ?? [{ icon: 'call-outline', label: 'Hotline', value: '' }],
    paymentBank: tournament.paymentInfo?.bank ?? '',
    paymentAccountNumber: tournament.paymentInfo?.accountNumber ?? '',
    paymentAccountName: tournament.paymentInfo?.accountName ?? '',
    paymentQrImage: tournament.paymentInfo?.qrImage ?? '',
  };
}
