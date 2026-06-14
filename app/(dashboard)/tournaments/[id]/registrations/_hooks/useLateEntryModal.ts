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

'use client';

import { useState, useCallback, useMemo } from 'react';
import { TOURNAMENT } from '@/lib/strings';
import {
  usePreviewLateEntryPlacement,
  useAddLateEntryToByeSlot,
} from '@/hooks/tournament';
import {
  LateEntryAction,
  MatchType,
  type AddLateEntryResult,
  type TournamentCategory,
} from '@/graphql/generated';
import { isLateEntryEligibleCategory } from '../_components/late-entry/late-entry.helpers';

export const LATE_ENTRY_STEPS = [
  { label: TOURNAMENT.LATE_ENTRY_STEP_CATEGORY },
  { label: TOURNAMENT.LATE_ENTRY_STEP_FORM },
  { label: TOURNAMENT.LATE_ENTRY_STEP_CONFIRM },
  { label: TOURNAMENT.LATE_ENTRY_STEP_RESULT },
];

export type LateEntryStep = 0 | 1 | 2 | 3;

export interface MemberForm {
  name: string;
  phone: string;
  club: string;
}

export const EMPTY_MEMBER: MemberForm = { name: '', phone: '', club: '' };

interface UseLateEntryModalOptions {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  categories: TournamentCategory[];
  onSuccess?: () => void;
}

export function useLateEntryModal({
  open,
  onClose,
  tournamentId,
  categories,
  onSuccess,
}: UseLateEntryModalOptions) {
  const [step, setStep] = useState<LateEntryStep>(0);
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

  const effectiveCategoryId = useMemo(
    () =>
      categoryId ||
      (eligibleCategories.length === 1
        ? (eligibleCategories[0]?._id ?? '')
        : ''),
    [categoryId, eligibleCategories],
  );

  const selectedCategory = useMemo(
    () => eligibleCategories.find((c) => c._id === effectiveCategoryId),
    [eligibleCategories, effectiveCategoryId],
  );

  const { preview, loading: previewLoading } = usePreviewLateEntryPlacement(
    effectiveCategoryId || null,
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
      categoryId: effectiveCategoryId,
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
    effectiveCategoryId,
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

  const updateMember = useCallback(
    (index: number, field: keyof MemberForm, value: string) => {
      setMembers((prev) =>
        prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
      );
    },
    []
  );

  const addTeamMember = useCallback(() => {
    setMembers((prev) => [...prev, { ...EMPTY_MEMBER }]);
  }, []);

  const removeTeamMember = useCallback((index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const canProceedFromCategory =
    !!effectiveCategoryId && preview?.canProceed && !previewLoading;

  return {
    step,
    setStep,
    categoryId: effectiveCategoryId,
    setCategoryId,
    athleteName,
    setAthleteName,
    phone,
    setPhone,
    club,
    setClub,
    dateOfBirth,
    setDateOfBirth,
    email,
    setEmail,
    reason,
    setReason,
    members,
    confirmOpen,
    setConfirmOpen,
    result,
    formError,
    eligibleCategories,
    selectedCategory,
    preview,
    previewLoading,
    submitting,
    handleClose,
    validateForm,
    buildInput,
    handleSubmit,
    updateMember,
    addTeamMember,
    removeTeamMember,
    canProceedFromCategory,
  };
}

export type LateEntryModalState = ReturnType<typeof useLateEntryModal>;
