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

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { TOURNAMENT } from '@/lib/strings';
import { MatchType } from '@/graphql/generated';
import type { LateEntryModalState } from '../../_hooks/useLateEntryModal';

interface LateEntryFormStepProps {
  modal: LateEntryModalState;
}

export function LateEntryFormStep({ modal }: LateEntryFormStepProps) {
  const {
    selectedCategory,
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
    formError,
    setStep,
    validateForm,
    updateMember,
    addTeamMember,
    removeTeamMember,
  } = modal;

  if (!selectedCategory) return null;

  return (
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
                onChange={(e) => updateMember(i, 'phone', e.target.value)}
              />
              <Input
                label="CLB"
                value={m.club}
                onChange={(e) => updateMember(i, 'club', e.target.value)}
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
                onChange={(e) => updateMember(i, 'name', e.target.value)}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="SĐT"
                  value={m.phone}
                  onChange={(e) => updateMember(i, 'phone', e.target.value)}
                />
                <Input
                  label="CLB"
                  value={m.club}
                  onChange={(e) => updateMember(i, 'club', e.target.value)}
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
  );
}
