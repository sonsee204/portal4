'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Stepper } from '@/components/molecules/Stepper';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { IonIcon } from '@/components/atoms/IonIcon';
import { TOURNAMENT } from '@/lib/strings';
import {
  usePreviewLateEntryPlacement,
  useAddLateEntryToByeSlot,
} from '@/hooks/tournament';
import {
  CategoryStatus,
  LateEntryAction,
  MatchType,
  TournamentFormat,
  type AddLateEntryResult,
  type TournamentCategory,
} from '@/graphql/generated';

interface LateEntryModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  categories: TournamentCategory[];
  onSuccess?: () => void;
}

const STEPS = [
  { label: TOURNAMENT.LATE_ENTRY_STEP_CATEGORY },
  { label: TOURNAMENT.LATE_ENTRY_STEP_FORM },
  { label: TOURNAMENT.LATE_ENTRY_STEP_CONFIRM },
  { label: TOURNAMENT.LATE_ENTRY_STEP_RESULT },
];

type Step = 0 | 1 | 2 | 3;

interface MemberForm {
  name: string;
  phone: string;
  club: string;
}

const EMPTY_MEMBER: MemberForm = { name: '', phone: '', club: '' };

function RandomAllocationBanner({ count }: { count: number }) {
  return (
    <div
      role="note"
      className="dark:bg-surface-elevated overflow-hidden rounded-xl border border-amber-500 bg-white shadow-sm"
    >
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0 bg-amber-500" aria-hidden="true" />
        <div className="flex flex-1 flex-wrap items-center gap-3 py-4 pr-4 pl-5 sm:gap-4 sm:pl-6">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                {TOURNAMENT.LATE_ENTRY_RANDOM_WARNING_LABEL}
              </span>
              <p className="text-heading text-sm font-semibold">
                {TOURNAMENT.LATE_ENTRY_RANDOM_TITLE}
              </p>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              {TOURNAMENT.LATE_ENTRY_RANDOM_HINT(count)}
            </p>
          </div>
          <div className="bg-primary flex min-w-[3.25rem] shrink-0 flex-col items-center rounded-xl px-3 py-2 text-white shadow-sm">
            <span className="text-xl leading-none font-bold tabular-nums">
              {count}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-widest uppercase opacity-90">
              BYE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3 text-sm">
      <span className="text-muted w-24 shrink-0">{label}</span>
      <span className="text-heading min-w-0 flex-1 font-medium">{value}</span>
    </div>
  );
}

function isLateEntryEligibleCategory(c: TournamentCategory): boolean {
  const drawn =
    c.status === CategoryStatus.DrawCompleted ||
    c.status === CategoryStatus.InProgress;
  const formatOk =
    c.format === TournamentFormat.SingleElimination ||
    c.format === TournamentFormat.DoubleElimination;
  return drawn && formatOk;
}

export function LateEntryModal({
  open,
  onClose,
  tournamentId,
  categories,
  onSuccess,
}: LateEntryModalProps) {
  const [step, setStep] = useState<Step>(0);
  const [categoryId, setCategoryId] = useState<string>('');
  const [athleteName, setAthleteName] = useState('');
  const [phone, setPhone] = useState('');
  const [club, setClub] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [members, setMembers] = useState<MemberForm[]>([
    { ...EMPTY_MEMBER },
    { ...EMPTY_MEMBER },
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<AddLateEntryResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const eligibleCategories = useMemo(
    () => categories.filter(isLateEntryEligibleCategory),
    [categories]
  );

  const selectedCategory = useMemo(
    () => eligibleCategories.find((c) => c._id === categoryId),
    [eligibleCategories, categoryId]
  );

  const { preview, loading: previewLoading } = usePreviewLateEntryPlacement(
    categoryId || null
  );

  const { addLateEntry, loading: submitting } = useAddLateEntryToByeSlot({
    tournamentId,
    onSuccess,
  });

  const resetState = useCallback(() => {
    setStep(0);
    setCategoryId('');
    setAthleteName('');
    setPhone('');
    setClub('');
    setDateOfBirth('');
    setSchool('');
    setEmail('');
    setNotes('');
    setReason('');
    setMembers([{ ...EMPTY_MEMBER }, { ...EMPTY_MEMBER }]);
    setConfirmOpen(false);
    setResult(null);
    setFormError(null);
  }, []);

  const handleClose = useCallback(() => {
    if (step === 3 && result?.action === LateEntryAction.FilledBye) {
      onSuccess?.();
    }
    resetState();
    onClose();
  }, [step, result, onSuccess, resetState, onClose]);

  useEffect(() => {
    if (!open) return;
    if (eligibleCategories.length === 1 && !categoryId) {
      setCategoryId(eligibleCategories[0]._id);
    }
  }, [open, eligibleCategories, categoryId]);

  const validateForm = useCallback((): boolean => {
    if (!selectedCategory) return false;
    if (reason.trim().length < 5) {
      setFormError(TOURNAMENT.LATE_ENTRY_REASON_MIN);
      return false;
    }

    const matchType = selectedCategory.matchType;
    if (matchType === MatchType.Singles) {
      if (!athleteName.trim()) {
        setFormError('Vui lòng nhập tên VĐV');
        return false;
      }
    } else if (matchType === MatchType.Doubles) {
      if (members.some((m) => !m.name.trim())) {
        setFormError('Nội dung đôi yêu cầu đủ tên 2 thành viên');
        return false;
      }
    } else if (matchType === MatchType.Team) {
      if (!athleteName.trim()) {
        setFormError(TOURNAMENT.LATE_ENTRY_TEAM_LABEL);
        return false;
      }
      const filled = members.filter((m) => m.name.trim());
      if (filled.length < 2) {
        setFormError('Nội dung đội yêu cầu ít nhất 2 thành viên');
        return false;
      }
    }

    setFormError(null);
    return true;
  }, [selectedCategory, reason, athleteName, members]);

  const buildInput = useCallback(() => {
    const matchType = selectedCategory?.matchType;
    const base = {
      categoryId,
      reason: reason.trim(),
      athleteName:
        matchType === MatchType.Doubles
          ? members.map((m) => m.name.trim()).join(' / ')
          : athleteName.trim(),
      phone: phone.trim() || undefined,
      club: club.trim() || undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      school: school.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (matchType === MatchType.Doubles) {
      return {
        ...base,
        members: members.map((m) => ({
          name: m.name.trim(),
          phone: m.phone.trim() || undefined,
          club: m.club.trim() || undefined,
        })),
      };
    }

    if (matchType === MatchType.Team) {
      const filled = members.filter((m) => m.name.trim());
      return {
        ...base,
        members: filled.map((m) => ({
          name: m.name.trim(),
          phone: m.phone.trim() || undefined,
          club: m.club.trim() || undefined,
        })),
      };
    }

    return base;
  }, [
    selectedCategory,
    categoryId,
    reason,
    athleteName,
    phone,
    club,
    dateOfBirth,
    school,
    email,
    notes,
    members,
  ]);

  const handleSubmit = useCallback(async () => {
    const input = buildInput();
    const res = await addLateEntry(input);
    setConfirmOpen(false);
    if (res) {
      setResult(res);
      setStep(3);
    }
  }, [buildInput, addLateEntry]);

  const updateMember = (
    index: number,
    field: keyof MemberForm,
    value: string
  ) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const addTeamMember = () => {
    setMembers((prev) => [...prev, { ...EMPTY_MEMBER }]);
  };

  const removeTeamMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceedFromCategory =
    !!categoryId && preview?.canProceed && !previewLoading;

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={TOURNAMENT.LATE_ENTRY_TITLE}
        size="xl"
      >
        <div className="space-y-6">
          <Stepper steps={STEPS} currentStep={step} />

          {step === 0 && (
            <div className="space-y-4">
              {eligibleCategories.length === 0 ? (
                <p className="text-muted text-sm">
                  {TOURNAMENT.LATE_ENTRY_NO_ELIGIBLE_CATEGORY}
                </p>
              ) : (
                <>
                  <label className="text-heading block text-sm font-medium">
                    {TOURNAMENT.LATE_ENTRY_SELECT_CATEGORY}
                  </label>
                  <select
                    className="border-border bg-surface text-heading w-full rounded-lg border px-3 py-2 text-sm"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">— Chọn —</option>
                    {eligibleCategories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>

                  {categoryId && (
                    <GlassPanel card className="!p-4">
                      {previewLoading ? (
                        <p className="text-muted text-sm">Đang tải...</p>
                      ) : preview ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                preview.canProceed
                                  ? 'bg-green-500/15'
                                  : 'bg-amber-500/15'
                              }`}
                            >
                              <IonIcon
                                name={
                                  preview.canProceed
                                    ? 'checkmark-circle-outline'
                                    : 'alert-circle-outline'
                                }
                                size="sm"
                                className={
                                  preview.canProceed
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-amber-600 dark:text-amber-400'
                                }
                              />
                            </div>
                            <p className="text-heading pt-1.5 text-sm font-medium">
                              {preview.blockReason
                                ? preview.blockReason
                                : TOURNAMENT.LATE_ENTRY_PREVIEW_COUNT(
                                    preview.eligibleByeMatchCount
                                  )}
                            </p>
                          </div>
                          {preview.eligibleMatches.length > 0 && (
                            <div className="border-border divide-border divide-y rounded-lg border">
                              <p className="text-muted bg-surface-elevated/50 px-3 py-2 text-xs font-medium tracking-wide uppercase">
                                {TOURNAMENT.LATE_ENTRY_PREVIEW_OPPONENTS}
                              </p>
                              <ul className="max-h-40 overflow-y-auto">
                                {preview.eligibleMatches.map((m) => (
                                  <li
                                    key={m.matchId}
                                    className="hover:bg-surface-elevated/40 flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors"
                                  >
                                    <span className="text-heading">
                                      Trận #{m.matchNumber}
                                      <span className="text-muted ml-1 text-xs">
                                        ({m.roundLabel})
                                      </span>
                                    </span>
                                    <span className="text-secondary truncate text-right">
                                      {m.opponentName}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </GlassPanel>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  Huỷ
                </Button>
                <Button
                  size="sm"
                  disabled={!canProceedFromCategory}
                  onClick={() => setStep(1)}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {step === 1 && selectedCategory && (
            <div className="space-y-4">
              {selectedCategory.matchType === MatchType.Singles && (
                <Input
                  label="Tên VĐV"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  placeholder="Họ và tên"
                  required
                />
              )}

              {selectedCategory.matchType === MatchType.Doubles &&
                members.map((m, i) => (
                  <div
                    key={i}
                    className="border-border space-y-3 rounded-lg border p-3"
                  >
                    <p className="text-heading text-sm font-medium">
                      {TOURNAMENT.LATE_ENTRY_MEMBER(i + 1)}
                    </p>
                    <Input
                      label="Họ tên"
                      value={m.name}
                      onChange={(e) => updateMember(i, 'name', e.target.value)}
                      required
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="SĐT"
                        value={m.phone}
                        onChange={(e) =>
                          updateMember(i, 'phone', e.target.value)
                        }
                      />
                      <Input
                        label="CLB"
                        value={m.club}
                        onChange={(e) =>
                          updateMember(i, 'club', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

              {selectedCategory.matchType === MatchType.Team && (
                <>
                  <Input
                    label={TOURNAMENT.LATE_ENTRY_TEAM_LABEL}
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    required
                  />
                  {members.map((m, i) => (
                    <div
                      key={i}
                      className="border-border space-y-3 rounded-lg border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-heading text-sm font-medium">
                          {TOURNAMENT.LATE_ENTRY_MEMBER(i + 1)}
                        </p>
                        {members.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTeamMember(i)}
                          >
                            Xoá
                          </Button>
                        )}
                      </div>
                      <Input
                        label="Họ tên"
                        value={m.name}
                        onChange={(e) =>
                          updateMember(i, 'name', e.target.value)
                        }
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          label="SĐT"
                          value={m.phone}
                          onChange={(e) =>
                            updateMember(i, 'phone', e.target.value)
                          }
                        />
                        <Input
                          label="CLB"
                          value={m.club}
                          onChange={(e) =>
                            updateMember(i, 'club', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    iconLeft="add-outline"
                    onClick={addTeamMember}
                  >
                    Thêm thành viên
                  </Button>
                </>
              )}

              {selectedCategory.matchType === MatchType.Singles && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="SĐT"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    label="CLB"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                  />
                  <Input
                    label="Ngày sinh"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                  <Input
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              <Input
                label={TOURNAMENT.LATE_ENTRY_REASON_LABEL}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={TOURNAMENT.LATE_ENTRY_REASON_PLACEHOLDER}
                required
              />

              {formError && <p className="text-sm text-red-400">{formError}</p>}

              <div className="flex justify-between gap-2">
                <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
                  Quay lại
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (validateForm()) setStep(2);
                  }}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {step === 2 && preview && selectedCategory && (
            <div className="space-y-4">
              <RandomAllocationBanner count={preview.eligibleByeMatchCount} />

              <GlassPanel card className="overflow-hidden !p-0">
                <div className="border-border border-b px-4 py-3">
                  <p className="text-heading text-sm font-semibold">
                    {TOURNAMENT.LATE_ENTRY_CONFIRM_SUMMARY}
                  </p>
                </div>
                <div className="divide-border divide-y px-4">
                  <SummaryRow label="Hạng mục" value={selectedCategory.title} />
                  <SummaryRow
                    label="VĐV / đội"
                    value={buildInput().athleteName}
                  />
                  <SummaryRow label="Lý do" value={reason.trim()} />
                </div>
              </GlassPanel>

              <div className="flex justify-between gap-2">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Quay lại
                </Button>
                <Button size="sm" onClick={() => setConfirmOpen(true)}>
                  Xác nhận thêm muộn
                </Button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-4">
              {result.action === LateEntryAction.FilledBye && (
                <GlassPanel card className="overflow-hidden !p-0">
                  <div className="flex items-start gap-3 bg-green-500/10 px-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                      <IonIcon
                        name="checkmark-circle-outline"
                        size="md"
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-heading font-semibold">
                        {TOURNAMENT.LATE_ENTRY_RESULT_FILLED}
                      </p>
                      {result.match && (
                        <p className="text-secondary mt-1 text-sm">
                          {TOURNAMENT.LATE_ENTRY_RESULT_MATCH(
                            result.match.matchNumber,
                            result.opponentName ?? '—'
                          )}
                        </p>
                      )}
                      {result.scheduleNeedsUpdate && (
                        <p className="text-secondary mt-2 flex items-start gap-1.5 text-sm">
                          <IonIcon
                            name="calendar-outline"
                            size="sm"
                            className="text-primary mt-0.5 shrink-0"
                          />
                          {TOURNAMENT.LATE_ENTRY_SCHEDULE_NOTE}
                        </p>
                      )}
                      {result.registration && (
                        <p className="text-muted mt-2 text-xs">
                          Mã đăng ký: {result.registration._id}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassPanel>
              )}

              {result.action === LateEntryAction.NoByeSlot && (
                <div className="border-border rounded-lg border p-4">
                  <p className="text-heading font-medium">
                    {TOURNAMENT.LATE_ENTRY_RESULT_NO_SLOT}
                  </p>
                  <p className="text-muted mt-1 text-sm">{result.message}</p>
                </div>
              )}

              {result.action === LateEntryAction.Blocked && (
                <div className="border-border rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="font-medium text-red-400">
                    {TOURNAMENT.LATE_ENTRY_RESULT_BLOCKED}
                  </p>
                  <p className="text-muted mt-1 text-sm">{result.message}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button size="sm" onClick={handleClose}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void handleSubmit()}
        title={TOURNAMENT.LATE_ENTRY_CONFIRM_TITLE}
        description={
          selectedCategory && preview
            ? TOURNAMENT.LATE_ENTRY_CONFIRM_DESC(
                selectedCategory.title,
                preview.eligibleByeMatchCount
              )
            : ''
        }
        confirmLabel="Thêm muộn"
        loading={submitting}
        variant="warning"
      />
    </>
  );
}
